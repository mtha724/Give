const { db, admin } = require("../firebase/firebase");

/**
 * Convert a Firestore comment document into a plain JSON-friendly object.
 * Ensures timestamps are serialized to ISO strings for the client.
 *
 * @param {FirebaseFirestore.DocumentSnapshot} doc
 */
function serializeComment(doc) {
  const data = doc.data() || {};
  const created = data.createdAt?.toDate?.();
  const updated = data.updatedAt?.toDate?.();

  return {
    id: doc.id,
    postId: data.postId || null,
    authorId: data.authorId || null,
    authorDisplayName: data.authorDisplayName || null,
    authorPhotoURL: data.authorPhotoURL || null,
    content: data.content || "",
    createdAt: created ? created.toISOString() : null,
    updatedAt: updated ? updated.toISOString() : null,
  };
}

/**
 * Fetch all comments for a post ordered by creation time (oldest first).
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.listForPost = async (req, res) => {
  const { postId } = req.params;
  if (!postId) {
    return res.status(400).json({ error: "postId is required" });
  }

  try {
    const postRef = db.collection("posts").doc(postId);
    const postSnap = await postRef.get();
    if (!postSnap.exists) {
      return res.status(404).json({ error: "Post not found" });
    }

    const postData = postSnap.data() || {};
    const commentIds = Array.isArray(postData.commentRefs)
      ? postData.commentRefs
      : [];

    const commentsCollection = db
      .collection("comments")
      .where("postId", "==", postId);

    let docs = [];

    try {
      const orderedSnap = await commentsCollection
        .orderBy("createdAt", "asc")
        .get();
      docs = orderedSnap.docs;
    } catch (queryError) {
      // Firestore requires a composite index for this query shape.
      // If the index is missing, fall back to fetching via references.
      const needsIndex =
        queryError?.code === 9 ||
        /requires an index/i.test(queryError?.message || "");

      if (!needsIndex) {
        throw queryError;
      }

      if (commentIds.length > 0) {
        const snapshots = await Promise.all(
          commentIds.map((id) => db.collection("comments").doc(id).get())
        );
        docs = snapshots.filter((snap) => snap.exists);
      } else {
        const fallbackSnap = await commentsCollection.get();
        docs = fallbackSnap.docs;
      }
    }

    const comments = docs
      .map((doc) => ({
        doc,
        sortKey: doc.data()?.createdAt?.toMillis?.() ?? 0,
      }))
      .sort((a, b) => a.sortKey - b.sortKey)
      .map(({ doc }) => serializeComment(doc));

    return res.json(comments);
  } catch (error) {
    console.error("[comments] listForPost failed", error);
    return res.status(500).json({ error: "Failed to fetch comments" });
  }
};

/**
 * Create a new comment for a post and store a reference on the post document.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.createForPost = async (req, res) => {
  const { postId } = req.params;
  const {
    content,
    authorId,
    authorDisplayName = null,
    authorPhotoURL = null,
  } = req.body || {};

  if (!postId) {
    return res.status(400).json({ error: "postId is required" });
  }

  if (!authorId) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const trimmed = typeof content === "string" ? content.trim() : "";
  if (!trimmed) {
    return res.status(400).json({ error: "Content is required" });
  }

  try {
    const postRef = db.collection("posts").doc(postId);
    const postSnap = await postRef.get();
    if (!postSnap.exists) {
      return res.status(404).json({ error: "Post not found" });
    }

    const timestamps = {
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const commentPayload = {
      postId,
      authorId,
      authorDisplayName,
      authorPhotoURL,
      content: trimmed,
      ...timestamps,
    };

    const commentRef = await db.collection("comments").add(commentPayload);
    await postRef.update({
      commentRefs: admin.firestore.FieldValue.arrayUnion(commentRef.id),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const snapshot = await commentRef.get();
    return res.status(201).json(serializeComment(snapshot));
  } catch (error) {
    console.error("[comments] createForPost failed", error);
    return res.status(500).json({ error: "Failed to create comment" });
  }
};

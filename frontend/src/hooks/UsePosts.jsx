import { useEffect, useState } from "react";
import { getDoc, doc, getFirestore } from "firebase/firestore";


export async function getPostData({
  limitCount = 10,
  orderByField = "createdAt",
    orderDirection = "desc",
    groupId = "default",
} = {}) {
  const params = new URLSearchParams({ limitCount, orderByField, orderDirection, groupId });
  const res = await fetch(`/api/posts?${params.toString()}`);
  if (!res.ok) throw new Error((await res.json()).error || "Failed to fetch");
  return res.json();
}

export function usePosts(groupId = "default") {
  const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const obj = {
        limitCount: 10,
        orderByField: "createdAt",
        orderDirection: "desc",
        groupId: groupId
    };

  const fetchPosts = async () => {
    try {
      const data = await getPostData(obj);
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  };

  const refreshPosts = async () => {
    await fetchPosts();
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await getPostData(obj);
        if (alive) setPosts(data);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  return { posts, loading, refreshPosts };
}

export function usePost(postId) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPost = async () => {
        try {
            const db = getFirestore();
            const docRef = doc(db, "posts", postId);
            const docSnap = await getDoc(docRef);
            const post = {
                id: postId,
                authorId: docSnap.data().authorId,
                authorDisplayName: docSnap.data().authorDisplayName,
                authorPhotoURL: docSnap.data().authorPhotoURL,
                content: docSnap.data().content,
                mediaUrls: docSnap.data().mediaUrls,
                tags: docSnap.data().tags,
                polls: docSnap.data().polls,
                group: docSnap.data().group,
                voters: docSnap.data().voters,
                commentRefs: docSnap.data().commentRefs,
                expiryOption: docSnap.data().expiryOption,
                expiresAt: docSnap.data().expiresAt,
                createdAt: docSnap.data().createdAt,
                updatedAt: docSnap.data().updatedAt,
            }
            let postArr = [post];
            setPosts(postArr);
            setPosts(postArr);
        } catch (error) {
            console.error("Failed to fetch post:", error);
        }
    };

    const refreshPosts = async () => {
        await fetchPost();
    };

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                const db = getFirestore();
                const docRef = doc(db, "posts", postId);
                const docSnap = await getDoc(docRef);
                const post = {
                    id: postId,
                    authorId: docSnap.data().authorId,
                    authorDisplayName: docSnap.data().authorDisplayName,
                    authorPhotoURL: docSnap.data().authorPhotoURL,
                    content: docSnap.data().content,
                    mediaUrls: docSnap.data().mediaUrls,
                    tags: docSnap.data().tags,
                    polls: docSnap.data().polls,
                    group: docSnap.data().group,
                    voters: docSnap.data().voters,
                    commentRefs: docSnap.data().commentRefs,
                    expiryOption: docSnap.data().expiryOption,
                    expiresAt: docSnap.data().expiresAt,
                    createdAt: docSnap.data().createdAt,
                    updatedAt: docSnap.data().updatedAt,
                }
                let postArr = [post];
                setPosts(postArr);
                if (alive) setPosts(postArr);
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => { alive = false; };
    });

    return { posts, loading, refreshPosts };
}
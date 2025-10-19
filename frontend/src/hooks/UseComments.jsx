import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchComments, createComment } from "../services/comments";

/**
 * useComments hook wraps comment fetching/creation for a post.
 *
 * @param {string} postId - Firestore post document id.
 */
export function useComments(postId) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const hasPostId = useMemo(() => Boolean(postId), [postId]);

  const loadComments = useCallback(async () => {
    if (!hasPostId) return;
    setLoading(true);
    try {
      const data = await fetchComments(postId);
      setComments(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error("[useComments] fetch failed", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [hasPostId, postId]);

  useEffect(() => {
    setComments([]);
    setError(null);
    if (!hasPostId) {
      setLoading(false);
      return;
    }
    loadComments();
  }, [hasPostId, loadComments]);

  const submitComment = useCallback(
    async (payload) => {
      if (!hasPostId) {
        throw new Error("postId is required");
      }
      setSubmitting(true);
      try {
        const created = await createComment(postId, payload);
        setComments((prev) => [...prev, created]);
        setError(null);
        return created;
      } catch (err) {
        console.error("[useComments] create failed", err);
        setError(err);
        throw err;
      } finally {
        setSubmitting(false);
      }
    },
    [hasPostId, postId]
  );

  return {
    comments,
    loading,
    submitting,
    error,
    refresh: loadComments,
    submitComment,
  };
}

export default useComments;

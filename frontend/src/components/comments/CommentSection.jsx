import React, { useMemo } from "react";
import { useAuth } from "../../contexts/AuthContext";
import useComments from "../../hooks/UseComments";
import CommentList from "./CommentList";
import CommentForm from "./CommentForm";

/**
 * CommentSection composes list + form for a post.
 *
 * @param {Object} props
 * @param {Object} props.post
 */
export default function CommentSection({ post }) {
  const postId = post?.id;
  const { user } = useAuth();
  const {
    comments,
    loading,
    submitting,
    error,
    submitComment,
  } = useComments(postId);

  const initialCount = useMemo(() => {
    const refs = Array.isArray(post?.commentRefs) ? post.commentRefs : [];
    return refs.length;
  }, [post?.commentRefs]);

  const commentCount = comments.length || initialCount;

  const handleSubmit = async (content) => {
    if (!user) return;
    const payload = {
      content,
      authorId: user.uid,
      authorDisplayName:
        user.displayName ||
        (user.email ? user.email.split("@")[0] : "Anonymous"),
      authorPhotoURL: user.photoURL || null,
    };
    await submitComment(payload);
  };

  return (
    <div className="w-full pt-4 border-t border-darkGrey/60 mt-2">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-gray-700">
          Comments {commentCount ? `(${commentCount})` : ""}
        </span>
        {error && !loading && (
          <span className="text-xs text-red-500">
            {error.message || "Unable to load comments."}
          </span>
        )}
      </div>
      <CommentList comments={comments} loading={loading} />
      {user ? (
        <CommentForm
          currentUser={user}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      ) : (
        <p className="text-xs text-gray-500 mt-3">
          Sign in to share your thoughts.
        </p>
      )}
    </div>
  );
}

import React from "react";
import Comment from "./Comment";

/**
 * Render comments or supporting states.
 *
 * @param {Object} props
 * @param {Array} props.comments
 * @param {boolean} props.loading
 */
export default function CommentList({ comments, loading }) {
  if (loading) {
    return (
      <div className="text-xs text-gray-500 px-1">Loading comments…</div>
    );
  }

  if (!comments || comments.length === 0) {
    return (
      <div className="text-xs text-gray-500 px-1">
        Be the first to leave a comment.
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </ul>
  );
}

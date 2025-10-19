import React, { useState } from "react";

/**
 * Comment form for adding a new comment.
 *
 * @param {Object} props
 * @param {import("firebase/auth").User|null} props.currentUser
 * @param {(content: string) => Promise<void>} props.onSubmit
 * @param {boolean} props.submitting
 */
export default function CommentForm({ currentUser, onSubmit, submitting }) {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const avatar = currentUser?.photoURL || "/images/noPfp.jpg";
  const placeholder =
    currentUser?.displayName
      ? `Comment as ${currentUser.displayName}`
      : "Write a comment…";

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) {
      setError("Comment cannot be empty.");
      return;
    }
    setError("");
    try {
      await onSubmit(trimmed);
      setContent("");
    } catch (e) {
      setError(e?.message || "Failed to add comment.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-start gap-3 mt-4"
    >
      <div className="w-10 h-10 rounded-full overflow-hidden bg-darkGrey flex-shrink-0">
        <img
          src={avatar}
          alt="Your avatar"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 flex flex-col">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          rows={2}
          maxLength={500}
          className="w-full resize-none bg-backgroundGrey rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-defaultYellow/60"
          disabled={submitting}
        />
        <div className="flex items-center justify-between mt-2">
          {error && (
            <span className="text-xs text-red-500">{error}</span>
          )}
          <button
            type="submit"
            disabled={submitting}
                      className="px-4 py-1.5 rounded-full bg-defaultYellow hover:bg-yellow-400 text-black text-sm font-semibold disabled:opacity-60 hover:bg-yellow-400 "
          >
            {submitting ? "Posting…" : "Post"}
          </button>
        </div>
      </div>
    </form>
  );
}

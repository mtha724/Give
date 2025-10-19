import React from "react";

/**
 * Format ISO string into human readable date/time.
 * Falls back to "just now" when missing.
 *
 * @param {string|null} iso
 */
function formatTimestamp(iso) {
  if (!iso) return "just now";
  try {
    const date = new Date(iso);
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  } catch {
    return "just now";
  }
}

/**
 * Single comment item.
 *
 * @param {Object} props
 * @param {Object} props.comment
 */
export default function Comment({ comment }) {
  const {
    authorDisplayName,
    authorPhotoURL,
    content,
    createdAt,
  } = comment || {};

  const displayName =
    authorDisplayName || "Anonymous";

  const avatar = authorPhotoURL || "/images/noPfp.jpg";

  return (
    <li className="flex gap-3">
      <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden bg-darkGrey">
        <img
          src={avatar}
          alt={`${displayName} avatar`}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col items-start bg-white/70 rounded-2xl px-4 py-2 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-800">
            {displayName}
          </span>
          <span className="text-[0.65rem] text-gray-500">
            {formatTimestamp(createdAt)}
          </span>
        </div>
        <p className="text-sm text-gray-700 whitespace-pre-wrap mt-1">
          {content}
        </p>
      </div>
    </li>
  );
}

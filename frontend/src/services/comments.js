/**
 * Comment API helpers for interacting with the backend.
 */

const JSON_HEADERS = { "Content-Type": "application/json" };

/**
 * Build the API URL for comment routes.
 * @param {string} postId
 * @param {string} [suffix=""]
 */
function buildUrl(postId, suffix = "") {
  if (!postId) throw new Error("postId is required");
  return `/api/posts/${postId}/comments${suffix}`;
}

/**
 * Fetch all comments for a given post.
 * @param {string} postId
 */
export async function fetchComments(postId) {
  const res = await fetch(buildUrl(postId));
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to fetch comments");
  }
  return res.json();
}

/**
 * Create a new comment on the given post.
 * @param {string} postId
 * @param {Object} payload
 */
export async function createComment(postId, payload) {
  const res = await fetch(buildUrl(postId), {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to create comment");
  }
  return res.json();
}

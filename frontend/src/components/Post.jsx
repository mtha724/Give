import React from "react";
import PropTypes from "prop-types";
import UserCard from "./UserCard";
import PostData from "./PostData";
import CommentSection from "./comments/CommentSection";

/**
 * Post Component
 *
 * Main container component for displaying a complete social media post.
 * Combines user information, group context, and post content in a unified layout.
 *
 * @param {Object} user - User object containing author information
 * @param {Object} group - Group object containing community context
 * @param {Object} post - Post object containing the main content data
 */
const Post = ({ user, group, post }) => {
  return (
    // Main post container with rounded corners and background
    <div className="w-full rounded-3xl p-4 bg-backgroundGrey flex flex-col items-center">
      {/* User information section - displays author and group context */}
      <UserCard user={user} group={group} />

      {/* Post content section - displays text, images, polls, and tags */}
      <PostData post={post} />

      <CommentSection post={post} />
    </div>
  );
};

/**
 * PropTypes validation for type safety and development assistance
 * Defines the expected structure and requirements for component props
 */
Post.propTypes = {
  // User object containing author information
  user: PropTypes.shape({
    name: PropTypes.string.isRequired, // Author's display name (required)
    profilePic: PropTypes.string, // Author's profile picture URL (optional)
  }).isRequired,

  // Group object containing community context
  group: PropTypes.shape({
    name: PropTypes.string.isRequired, // Group/community name (required)
  }).isRequired,

  // Post object containing the main content
  post: PropTypes.shape({
    question: PropTypes.string, // Optional question text
    content: PropTypes.array, // Post content (could be text, images, etc.)
  }).isRequired,
};

export default Post;

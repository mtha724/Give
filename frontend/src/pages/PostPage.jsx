import React from "react";
import { useParams } from "react-router-dom";

export default function PostPage() {
  const { postId } = useParams();
  // TODO: fetch post data by postId and render
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Post {postId}</h1>
      {/* Render post content here */}
    </div>
  );
}

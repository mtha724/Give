import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import AppLayout from "../layouts/AppLayout";
import LeftSideBar from "../components/LeftSideBar";
import GroupSearch from "../components/GroupSearch";
import { homeTabConfig } from "../config/tabConfig";
import Post from "../components/Post";
import { PostsRefreshProvider } from "../components/PostsContainer";

export default function PostPage() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoading(true);
        const ref = doc(db, "posts", postId);
        const snap = await getDoc(ref);
        if (!snap.exists()) throw new Error("Post not found");
        if (!active) return;
        setPost({ id: snap.id, ...snap.data() });
      } catch (e) {
        if (!active) return;
        setError(e.message || "Failed to load post");
      } finally {
        if (active) setLoading(false);
      }
    }
    if (postId) load();
    return () => {
      active = false;
    };
  }, [postId]);

  let centerContent;
  if (loading) {
    centerContent = <div className="p-8">Loading</div>;
  } else if (error) {
    centerContent = <div className="p-8 text-red-600">{error}</div>;
  } else if (!post) {
    centerContent = null;
  } else {
    // Provide a dummy refreshPosts function for context
    centerContent = (
      <PostsRefreshProvider value={{ refreshPosts: () => {} }}>
        <Post
          user={{
            id: post.authorId ?? undefined,
            name: post.authorDisplayName || "unknown",
            profilePic: post.authorPhotoURL || undefined,
          }}
          group={post.group || undefined}
          post={post}
        />
      </PostsRefreshProvider>
    );
  }

  return (
    <AppLayout
      left={<LeftSideBar screenTabProps={{ tabConfig: homeTabConfig, onTabChange: () => {}, onCurrentTab: "home" }} extra={null} />}
      center={centerContent}
      right={<GroupSearch />}
    />
  );
}

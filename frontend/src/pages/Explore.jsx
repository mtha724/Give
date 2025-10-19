import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchPostsByTag } from "../services/Search";
import AppLayout from "../layouts/AppLayout";
import LeftSidebar from "../components/LeftSideBar";
import PostsList from "../components/PostsList";
import { PostsRefreshProvider } from "../components/PostsContainer";
import { SuggestedBox, GroupSearch } from "../";
import { homeTabConfig } from "../config/tabConfig";

/**
 * Explore page - displays posts filtered by tag
 */
export default function Explore() {
  const [searchParams] = useSearchParams();
  const tag = searchParams.get("tag");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const currentTab = "explore";
  const handleTabChange = () => {};

  useEffect(() => {
    let active = true;
    async function loadPostsByTag() {
      if (!tag) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError("");
        const postData = await fetchPostsByTag(tag);
        if (!active) return;
        setPosts(postData);
      } catch (err) {
        if (!active) return;
        console.error("[Explore] Failed to load posts:", err);
        setError(err.message || "Failed to load posts");
      } finally {
        if (active) setLoading(false);
      }
    }
    loadPostsByTag();
    return () => {
      active = false;
    };
  }, [tag]);

  // Expose a simple refresh function for poll updates
  const refreshPosts = async () => {
    if (!tag) return;
    try {
      const postData = await fetchPostsByTag(tag);
      setPosts(postData);
    } catch (e) {
      console.warn("[Explore] refreshPosts failed", e);
    }
  };

  return (
    <AppLayout
      left={
        <LeftSidebar
          screenTabProps={{
            tabConfig: homeTabConfig,
            onTabChange: handleTabChange,
            onCurrentTab: currentTab,
          }}
          extra={<SuggestedBox />}
        />
      }
      center={
        <div className="w-full">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {tag ? `#${tag}` : "Explore"}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {tag ? `Posts tagged with #${tag}` : "Browse trending topics"}
            </p>
          </div>
          
          {loading && (
            <div className="p-6 text-center text-gray-600">
              Loading posts...
            </div>
          )}
          
          {error && (
            <div className="p-6 text-center text-red-600">
              {error}
            </div>
          )}
          
          {!loading && !error && posts.length === 0 && (
            <div className="p-6 text-center text-gray-600">
              No posts found {tag ? `with #${tag}` : ""}
            </div>
          )}
          
          {!loading && !error && posts.length > 0 && (
            <PostsRefreshProvider value={{ refreshPosts }}>
              <div className="flex flex-col gap-4">
                <PostsList posts={posts} />
              </div>
            </PostsRefreshProvider>
          )}
        </div>
      }
      right={<GroupSearch />}
    />
  );
}

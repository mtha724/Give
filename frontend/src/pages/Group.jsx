/**
 * Group page displays information about a specific group.
 * Handles group access, member list, and restricted view logic.
 * Uses GroupTab, JoinGroup, and other components for layout and functionality.
 */
import React, { useState, useEffect } from "react";
import AppLayout from "../layouts/AppLayout";
import LeftSidebar from "../components/LeftSideBar";
import PostsContainer from "../components/PostsContainer";
import { GroupTab, GroupSearch, JoinGroup } from "../";
import { useAuth } from "../contexts/AuthContext";
import { Navigate, useParams } from "react-router-dom";
import { usePosts } from "../hooks/UsePosts";
import { groupTabConfig } from "../config/tabConfig";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const Group = () => {
  const { groupId: id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const { posts, loading: postsLoading } = usePosts(id);

  // State hooks
  const [accessible, setAccessible] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [loadingGroup, setLoadingGroup] = useState(true);

  const currentTab = "group"; // Define the current tab for the sidebar

  // Handle tab changes (though this might not be fully implemented)
  const handleTabChange = () => {};

  /**
   * Fetch the group details and check if the user is a member.
   */
  const fetchGroupDetails = async () => {
    if (!id || !user) return;

    try {
      const groupRef = doc(db, "groups", id);
      const groupSnap = await getDoc(groupRef);
      
      if (groupSnap.exists()) {
        const groupData = groupSnap.data();
        const isMember = groupData.members && Array.isArray(groupData.members)
          ? groupData.members.includes(user.uid)
          : false;

        setAccessible(isMember);
        setGroupName(groupData.name || "");
      } else {
        setAccessible(false);
        setGroupName("");
      }
    } catch (error) {
      console.error("Error fetching group:", error);
      setAccessible(false);
      setGroupName("");
    } finally {
      setLoadingGroup(false);
    }
  };

  // Fetch group details on mount or when id/user changes
  useEffect(() => {
    fetchGroupDetails();
  }, [id, user]);

  // If still loading auth or group data, show nothing
  if (authLoading || loadingGroup) return null;

  // Redirect to login if no user is authenticated
  if (!user) return <Navigate to="/" replace />;

  // Inject group name into posts if the user has access
  const postsWithGroup = accessible
    ? posts.map((post) => ({
        ...post,
        group: { name: groupName },
      }))
    : [];

  return (
    <AppLayout
      left={
        <LeftSidebar
          screenTabProps={{
            tabConfig: groupTabConfig,
            onTabChange: handleTabChange,
            onCurrentTab: currentTab,
          }}
          extra={
            <div className="flex-1 overflow-y-hidden">
              <GroupTab id={id} accessible={accessible} />
            </div>
          }
        />
      }
      center={
        accessible ? <PostsContainer groupId={id} posts={postsWithGroup} /> : <JoinGroup id={id} />
      }
      right={<GroupSearch groupId={id} />}
    />
  );
};

export default Group;

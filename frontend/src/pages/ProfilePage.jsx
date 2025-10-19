import React, { useState } from "react";
import AppLayout from "../layouts/AppLayout";
import LeftSidebar from "../components/LeftSideBar";
import { SuggestedBox, GroupSearch, CreatePost, CreateGroup } from "../";
import Profile from "../components/Profile";
import { homeTabConfig } from "../config/tabConfig";
import RequireAuth from '../components/RequireAuth';

/**
 * Home page component.
 * @returns {JSX.Element}
 */
export default function ProfileScreen() {
    const [currentTab, setCurrentTab] = useState("home");

    const showCreate = currentTab === "create";

    const showCreateGroup = currentTab === "createGroup";

    return (
        <AppLayout
            left={
                <LeftSidebar
                    screenTabProps={{
                        tabConfig: homeTabConfig,
                        onTabChange: setCurrentTab,
                        onCurrentTab: currentTab,
                    }}
                    extra={<SuggestedBox />}
                />
            }
            center={
                showCreate ? <CreatePost /> : <RequireAuth><Profile/></RequireAuth>
            }
            right={
                showCreateGroup ? <CreateGroup /> : <GroupSearch />
            }
        />
    );
}
/**
 * Home page component.
 */
import React, { useState } from "react";
import AppLayout from "../layouts/AppLayout";
import LeftSidebar from "../components/LeftSideBar";
import { SuggestedBox, GroupSearch, CreatePost, CreateGroup, Profile } from "../";
import { profileTabConfig } from "../config/tabConfig";
import RequireAuth from '../components/RequireAuth';

/**
 * Home page component.
 * @returns {JSX.Element}
 */
export default function ProfileScreen() {
    const [currentTab, setCurrentTab] = useState("profile");

    const showCreate = currentTab === "create";

    const showCreateGroup = currentTab === "createGroup";

    return (
        <AppLayout
            left={
                <LeftSidebar
                    screenTabProps={{
                        tabConfig: profileTabConfig,
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
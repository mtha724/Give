import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

export default function PublicProfile() {
  const { userId } = useParams();
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoading(true);
        const ref = doc(db, "users", userId);
        const snap = await getDoc(ref);
        if (!snap.exists()) throw new Error("User not found");
        if (!active) return;
        setUser({ id: snap.id, ...snap.data() });
      } catch (e) {
        if (!active) return;
        setError(e.message || "Failed to load user");
      } finally {
        if (active) setLoading(false);
      }
    }
    if (userId) load();
    return () => {
      active = false;
    };
  }, [userId]);

  if (loading) return <div className="p-6">Loading…</div>;
  // If this public profile is the same as the logged-in user, go to private profile page
  if (authUser && authUser.uid === userId) return <Navigate to="/profile" replace />;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!user) return null;

  const name = user.displayName || user.username || "User";
  const photoURL = user.photoURL || user.profilePic || "/images/noPfp.jpg";

  return (
    <div className="p-8 bg-backgroundGrey rounded-2xl">
      <div className="flex items-center gap-6">
        <img
          src={photoURL}
          alt={`${name} avatar`}
          className="w-28 h-28 rounded-full object-cover border"
        />
        <div>
          <h2 className="text-3xl font-bold">{name}</h2>
          {user.bio && <p className="text-gray-700 mt-1">{user.bio}</p>}
        </div>
      </div>
    </div>
  );
}

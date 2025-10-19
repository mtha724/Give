import React from "react";
import { useAuth } from "../contexts/AuthContext";
// import { Link } from "react-router-dom";

export default function Profile() {
  const { user } = useAuth();
  if (!user) return null;
  const displayName = user.displayName || (user.email ? user.email.split("@")[0] : "User");
  const photoURL = user.photoURL || "/images/noPfp.jpg";
  return (
    <div className="p-8 bg-backgroundGrey rounded-2xl">
      <div className="flex items-center gap-6">
        <img
          src={photoURL}
          alt={`${displayName} avatar`}
          className="w-28 h-28 rounded-full object-cover border"
        />
        <div>
          <h2 className="text-3xl font-bold">{displayName}</h2>
          {user.email && <p className="text-gray-700 mt-1">{user.email}</p>}
        </div>
      </div>
\    </div>
  );
}

import React from 'react';
import './UserInfo.css';

export default function UserInfo({ user }) {
  if (!user) return <p className="loading">Loading user...</p>;

  return (
    <div className="user-info-card">
      <h2 className="user-info-header">{user.name}</h2>
      <p className="user-info-username">@{user.username}</p>
      {user.bio && <p className="user-info-bio">{user.bio}</p>}
    </div>
  );
}
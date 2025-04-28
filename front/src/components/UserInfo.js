import React from 'react';
import './UserInfo.css';

export default function UserInfo({ user }) {
  if (!user) return <p>Loading user...</p>;

  return (
    <div className="mb-4">
      <h2 className="text-2xl font-bold">{user.username}</h2>
    </div>
  );
}
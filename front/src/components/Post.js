// src/components/Post.jsx
import React, { useState } from 'react';
import { API_URL } from '../config';
import { getUser, isLoggedIn } from '../context/AuthContext';
import './Post.css';

export default function Post({ post }) {
  const [likes, setLikes] = useState(post.likes);
  const user = getUser();

  const handleLike = async () => {
    if (!isLoggedIn()) return;
    try {
      const res = await fetch(
        `${API_URL}/posts/${post.id}/like?user_id=${user.id}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        }
      );
      if (!res.ok) throw new Error('Failed to like');
      const updated = await res.json();
      setLikes(updated.likes);
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <span className="post-author">@{post.author.username}</span>
        <span className="post-time">
          {new Date(post.created_at || post.createdAt).toLocaleString()}
        </span>
      </div>
      <div className="post-content">{post.content}</div>
      <div className="post-actions">
        <button
          onClick={handleLike}
          className="like-button"
          disabled={!isLoggedIn()}
        >
          ❤️
        </button>
        <span className="like-count">{likes}</span>
      </div>
    </div>
  );
}
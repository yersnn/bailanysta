import React from 'react';
import './Post.css';

export default function Post({ post }) {
  return (
    <div className="post-card">
      <div className="post-header">
        <span className="post-author">@{post.author.username}</span>
        <span className="post-time">{new Date(post.created_at || post.createdAt).toLocaleString()}</span>
      </div>
      <div className="post-content">{post.content}</div>
    </div>
  );
}
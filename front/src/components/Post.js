import React from 'react';
import './Post.css'

export default function Post({ post }) {
  return (
    <div className="border p-4 rounded">
      <h3 className="font-bold">{post.author.username}</h3>
      <p>{post.content}</p>
      <small>{new Date(post.created_at || post.createdAt).toLocaleString()}</small>
    </div>
  );
}
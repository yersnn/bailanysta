// src/components/PostList.jsx
import React, { useEffect, useState } from 'react';
import Post from './Post';
import { API_URL } from '../config';
import './PostList.css';

export default function PostList({ userId, refreshFlag }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        let data;
        if (userId) {
          const res = await fetch(`${API_URL}/users/${userId}`);
          if (!res.ok) throw new Error(`Error ${res.status}`);
          const user = await res.json();
          data = user.posts;
        } else {
          const res = await fetch(`${API_URL}/posts`);
          if (!res.ok) throw new Error(`Error ${res.status}`);
          data = await res.json();
        }
        setPosts(data);
      } catch (err) {
        console.error('Failed to load posts:', err);
      }
    }
    fetchPosts();
  }, [userId, refreshFlag]);

  return (
    <div className="post-list">
      {posts.map(post => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
}
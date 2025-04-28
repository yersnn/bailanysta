import React, { useState } from 'react';
import { API_URL } from '../config';
import { getUser } from '../context/AuthContext';
import './CreatePost.css';

export default function CreatePost({ onPostCreated }) {
  const [content, setContent] = useState('');

  const user = getUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${API_URL}/users/${user.id}/posts/`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content }),
        }
      );
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const newPost = await res.json();
      setContent('');
      if (onPostCreated) onPostCreated(newPost);
    } catch (err) {
      console.error("Failed to create post:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="What's happening?"
        className="w-full p-2 border rounded"
      />
      <button 
        type="submit" 
        className="mt-2 px-4 py-2 rounded bg-blue-500 text-white"
      >
        Post
      </button>
    </form>
  );
}
import React, { useState } from 'react';
import { API_URL } from '../config';
import { getUser } from '../context/AuthContext';
import './CreatePost.css';

export default function CreatePost({ onPostCreated }) {
  const [content, setContent] = useState('');
  const user = getUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
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
      onPostCreated?.(newPost);
    } catch (err) {
      console.error('Failed to create post:', err);
    }
  };

  return (
    <form className="create-post-form" onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="What's happening?"
      />
      <button
        type="submit"
        className="btn btn-primary"
        disabled={!content.trim()}
      >
        Post
      </button>
    </form>
  );
}
// src/components/CreatePost.jsx
import React, { useState } from 'react';
import { API_URL } from '../config';
import { getUser } from '../context/AuthContext';
import './CreatePost.css';

export default function CreatePost({ onPostCreated }) {
  const [content, setContent] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
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

  const openModal = () => {
    setAiPrompt('');
    setShowModal(true);
  };

  const handleGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setLoadingAI(true);
    try {
      const res = await fetch(`${API_URL}/chat/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: aiPrompt }),
      });
      if (!res.ok) throw new Error(`AI Error ${res.status}`);
      const data = await res.json();
      setContent(data.text);
      setShowModal(false);
    } catch (err) {
      console.error('AI generation failed:', err);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <>
      <div className="create-post-actions">
        <button className="btn btn-secondary" onClick={openModal}>
          Generate Post with AI
        </button>
      </div>

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

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Generate Post with AI</h3>
            <textarea
              value={aiPrompt}
              onChange={e => setAiPrompt(e.target.value)}
              placeholder="Enter prompt for AI"
              className="modal-textarea"
            />
            <div className="modal-buttons">
              <button
                className="btn btn-primary"
                onClick={handleGenerate}
                disabled={loadingAI}
              >
                {loadingAI ? 'Generating…' : 'Generate'}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
                disabled={loadingAI}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

import React, { useState } from 'react';
import CreatePost from '../components/CreatePost';
import PostList from '../components/PostList';
import { isLoggedIn } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import './Home.css';

export default function Home() {
  const [refreshFlag, setRefreshFlag] = useState(0);

  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="home-container">
    <CreatePost
        onPostCreated={() => setRefreshFlag(f => f + 1)}
      />
      <PostList refreshFlag={refreshFlag} />
    </div>
  );
}

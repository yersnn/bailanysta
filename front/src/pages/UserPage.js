import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import UserInfo from '../components/UserInfo';
import PostList from '../components/PostList';
import { API_URL } from '../config';
import './UserPage.css';

export default function UserPage() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/users/${userId}`)
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.error(err));
  }, [userId]);

  return (
    <div>
      <UserInfo user={user} />
      <PostList userId={userId} />
    </div>
  );
}

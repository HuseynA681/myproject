import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Feed from './components/Feed';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState(localStorage.getItem('username'));

  const onLogin = (token, username) => {
    setToken(token);
    setUsername(username);
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
  };

  const logout = () => {
    setToken(null);
    setUsername(null);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  };

  if (!token) return <Login onLogin={onLogin} />;
  return <Feed token={token} username={username} logout={logout} />;
}

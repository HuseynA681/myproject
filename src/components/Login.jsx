import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  async function submit() {
    setError(null);
    try {
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка');
      onLogin(data.token, data.username);
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div>
      <h2>Вход</h2>
      <input placeholder="Имя пользователя" value={username} onChange={e => setUsername(e.target.value)} />
      <input placeholder="Пароль" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={submit}>Войти</button>
      {error && <div style={{color: 'red'}}>{error}</div>}
    </div>
  );
}

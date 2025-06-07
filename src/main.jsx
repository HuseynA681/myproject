// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  HashRouter as Router,   // Заменил BrowserRouter на HashRouter
  Routes,
  Route,
  Navigate,
  useNavigate,
  Link,
} from 'react-router-dom';

const AuthContext = React.createContext();

function AuthProvider({ children }) {
  const [user, setUser] = React.useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (username, password) => {
    const fakeToken = 'token_' + Date.now();
    const newUser = { username, token: fakeToken };
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  return React.useContext(AuthContext);
}

function Header() {
  const { user, logout } = useAuth();

  return (
    <header style={{ backgroundColor: '#4267B2', color: 'white', padding: '10px 20px', display: 'flex', justifyContent: 'space-between' }}>
      <Link to="/" style={{ color: 'white', fontWeight: 'bold', textDecoration: 'none' }}>MySocial</Link>
      <div>
        {user ? (
          <>
            <span>Привет, {user.username}</span>
            <button onClick={logout} style={{ marginLeft: 10 }}>Выйти</button>
          </>
        ) : (
          <Link to="/login" style={{ color: 'white', marginLeft: 10 }}>Войти</Link>
        )}
      </div>
    </header>
  );
}

function LoginPage() {
  const { user, login } = useAuth();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState(null);
  const navigate = useNavigate();

  if (user) return <Navigate to="/" />;

  function handleSubmit(e) {
    e.preventDefault();
    try {
      login(username, password);
      navigate('/');
    } catch (err) {
      setError('Ошибка входа');
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '40px auto', padding: 20, border: '1px solid #ccc' }}>
      <h2>Вход</h2>
      <input
        type="text"
        placeholder="Имя пользователя"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
        style={{ width: '100%', marginBottom: 10, padding: 8 }}
      />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        style={{ width: '100%', marginBottom: 10, padding: 8 }}
      />
      {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}
      <button type="submit" style={{ width: '100%', padding: 10 }}>Войти</button>
    </form>
  );
}

function usePosts() {
  const [posts, setPosts] = React.useState(() => {
    const saved = localStorage.getItem('posts');
    return saved ? JSON.parse(saved) : [];
  });

  React.useEffect(() => {
    localStorage.setItem('posts', JSON.stringify(posts));
  }, [posts]);

  return [posts, setPosts];
}

function Post({ post, onLike, onComment }) {
  const [comment, setComment] = React.useState('');

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      onComment(post.id, comment.trim());
      setComment('');
    }
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: 15, marginBottom: 15, borderRadius: 5, backgroundColor: 'white' }}>
      <div style={{ fontWeight: 'bold' }}>{post.author}</div>
      <div style={{ marginTop: 5 }}>{post.content}</div>
      <div style={{ marginTop: 10, color: '#555' }}>
        <button onClick={() => onLike(post.id)}>❤️ {post.likes}</button>
        <span style={{ marginLeft: 15 }}>💬 {post.comments.length}</span>
      </div>
      <form onSubmit={handleCommentSubmit} style={{ marginTop: 10 }}>
        <input
          type="text"
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Оставьте комментарий..."
          style={{ width: '100%', padding: 8 }}
        />
      </form>
      <div style={{ marginTop: 10 }}>
        {post.comments.map((c, idx) => (
          <div key={idx} style={{ fontSize: '0.9em', borderTop: '1px solid #eee', paddingTop: 5 }}>{c}</div>
        ))}
      </div>
    </div>
  );
}

function FeedPage() {
  const { user } = useAuth();
  const [posts, setPosts] = usePosts();
  const [newPost, setNewPost] = React.useState('');

  const addPost = () => {
    if (newPost.trim()) {
      const post = {
        id: Date.now(),
        author: user.username,
        content: newPost,
        likes: 0,
        comments: [],
      };
      setPosts([post, ...posts]);
      setNewPost('');
    }
  };

  const handleLike = (id) => {
    setPosts(posts.map(post =>
      post.id === id ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  const handleComment = (id, comment) => {
    setPosts(posts.map(post =>
      post.id === id ? { ...post, comments: [...post.comments, comment] } : post
    ));
  };

  if (!user) return <Navigate to="/login" />;

  return (
    <div style={{ maxWidth: 600, margin: '40px auto' }}>
      <h2>Лента</h2>
      <div style={{ marginBottom: 20 }}>
        <textarea
          placeholder="Что у вас нового?"
          value={newPost}
          onChange={e => setNewPost(e.target.value)}
          rows={3}
          style={{ width: '100%', padding: 10 }}
        />
        <button onClick={addPost} style={{ marginTop: 10 }}>Опубликовать</button>
      </div>
      {posts.map(post => (
        <Post key={post.id} post={post} onLike={handleLike} onComment={handleComment} />
      ))}
    </div>
  );
}

function NotFound() {
  return <h2 style={{ textAlign: 'center', marginTop: 50 }}>404 — Страница не найдена</h2>;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/" element={<FeedPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

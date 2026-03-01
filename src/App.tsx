import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoadingPage } from './pages/LoadingPage';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { CreatePostPage } from './pages/CreatePostPage';
import { PostSuccessPage } from './pages/PostSuccessPage';
import { PostListPage } from './pages/PostListPage';
import { ApprovalListPage } from './pages/ApprovalListPage';
import { ProfilePage } from './pages/ProfilePage';
import { AddFriendPage } from './pages/AddFriendPage';
import { RankItemsPage } from './pages/RankItemsPage';
import { authService } from './services/authService';
import './App.css';

function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // 初期ロード時に認証状態をチェック
    authService.getCurrentUser().then((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // 認証状態の変更を監視
    const { data: { subscription } } = authService.onAuthStateChange((authUser) => {
      if (authUser) {
        authService.getCurrentUser().then(setUser);
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/" element={user ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/create-post" element={user ? <CreatePostPage /> : <Navigate to="/login" />} />
        <Route path="/post-success" element={user ? <PostSuccessPage /> : <Navigate to="/login" />} />
        <Route path="/posts" element={user ? <PostListPage /> : <Navigate to="/login" />} />
        <Route path="/approvals" element={user ? <ApprovalListPage /> : <Navigate to="/login" />} />
        <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/add-friend" element={user ? <AddFriendPage /> : <Navigate to="/login" />} />
        <Route path="/rank-items" element={user ? <RankItemsPage /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

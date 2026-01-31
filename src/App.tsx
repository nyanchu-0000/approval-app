import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoadingPage } from './pages/LoadingPage';
import { HomePage } from './pages/HomePage';
import { CreatePostPage } from './pages/CreatePostPage';
import { PostSuccessPage } from './pages/PostSuccessPage';
import { PostListPage } from './pages/PostListPage';
import { ApprovalListPage } from './pages/ApprovalListPage';
import { ProfilePage } from './pages/ProfilePage';
import { AddFriendPage } from './pages/AddFriendPage';
import { RankItemsPage } from './pages/RankItemsPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/loading" element={<LoadingPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/create-post" element={<CreatePostPage />} />
        <Route path="/post-success" element={<PostSuccessPage />} />
        <Route path="/posts" element={<PostListPage />} />
        <Route path="/approvals" element={<ApprovalListPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/add-friend" element={<AddFriendPage />} />
        <Route path="/rank-items" element={<RankItemsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

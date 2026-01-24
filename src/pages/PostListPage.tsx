import React, { useState, useEffect } from 'react';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { PostCard } from '../components/post/PostCard';
import { Post } from '../types';
import { User } from '../types/user';

export const PostListPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    // 現在のユーザー情報を取得
    const userDataStr = localStorage.getItem('currentUser');
    if (!userDataStr) return;

    const userData: User = JSON.parse(userDataStr);
    setCurrentUser(userData);

    // localStorageから投稿を読み込む
    const existingPosts = localStorage.getItem('posts');
    if (existingPosts) {
      const parsedPosts = JSON.parse(existingPosts);
      // 現在のユーザーの投稿のみをフィルタリング
      const userPosts = parsedPosts
        .filter((post: any) => post.userId === userData.uid)
        .map((post: any) => ({
          ...post,
          // プロフィールから最新の情報を取得
          username: userData.username,
          userProfileIcon: userData.profileIcon,
          createdAt: new Date(post.createdAt),
          updatedAt: new Date(post.updatedAt),
          approvals: post.approvals.map((approval: any) => ({
            ...approval,
            timestamp: new Date(approval.timestamp)
          }))
        }));
      setPosts(userPosts);
    }
  };
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#D4E7F5',
      paddingTop: '60px',
      paddingBottom: '70px'
    }}>
      <Header title="投稿一覧" />
      
      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        {posts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#999'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>📝</div>
            <p>まだ投稿がありません</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              showApprovalStatus
              onClick={() => {
                // TODO: 投稿詳細ページに遷移
                console.log('Post clicked:', post.id);
              }}
            />
          ))
        )}
      </div>

      <Footer />
    </div>
  );
};


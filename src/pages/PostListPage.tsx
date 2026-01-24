import React from 'react';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { PostCard } from '../components/post/PostCard';
import { Post } from '../types';

// ダミーデータ
const dummyPosts: Post[] = [
  {
    id: '1',
    userId: 'user1',
    username: 'あなた',
    userProfileIcon: '/dummy-app-icon.svg',
    title: '今日のランチ',
    content: '美味しいパスタを食べました！とても美味しかったです。',
    imageUrl: undefined,
    targetFriendId: 'friend1',
    approvals: [
      {
        userId: 'friend1',
        username: 'フレンド1',
        approved: true,
        timestamp: new Date('2024-01-20T12:00:00')
      }
    ],
    createdAt: new Date('2024-01-20T11:00:00'),
    updatedAt: new Date('2024-01-20T11:00:00')
  },
  {
    id: '2',
    userId: 'user1',
    username: 'あなた',
    userProfileIcon: '/dummy-app-icon.svg',
    title: '新しい趣味',
    content: '最近写真を撮るのにハマっています。カメラを買いたいな。',
    imageUrl: undefined,
    targetFriendId: 'friend2',
    approvals: [],
    createdAt: new Date('2024-01-19T15:00:00'),
    updatedAt: new Date('2024-01-19T15:00:00')
  }
];

export const PostListPage: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#D4E7F5',
      paddingTop: '60px',
      paddingBottom: '70px'
    }}>
      <Header title="投稿一覧" />
      
      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        {dummyPosts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#999'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>📝</div>
            <p>まだ投稿がありません</p>
          </div>
        ) : (
          dummyPosts.map((post) => (
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


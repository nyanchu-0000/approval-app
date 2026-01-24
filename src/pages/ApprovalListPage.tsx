import React from 'react';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { PostCard } from '../components/post/PostCard';
import { ApprovalButton } from '../components/approval/ApprovalButton';
import { Post } from '../types';

// ダミーデータ
const dummyFriendPosts: Post[] = [
  {
    id: '3',
    userId: 'friend1',
    username: 'フレンド1',
    userProfileIcon: '/dummy-app-icon.svg',
    title: '週末に行ったカフェ',
    content: '素敵なカフェを見つけました！雰囲気も良くて、コーヒーも美味しかったです。また行きたいな。',
    imageUrl: undefined,
    targetFriendId: 'user1',
    approvals: [],
    createdAt: new Date('2024-01-21T10:00:00'),
    updatedAt: new Date('2024-01-21T10:00:00')
  },
  {
    id: '4',
    userId: 'friend2',
    username: 'フレンド2',
    userProfileIcon: '/dummy-app-icon.svg',
    title: '新しい本を読み始めた',
    content: 'ミステリー小説にハマっています。続きが気になって仕方がない！',
    imageUrl: undefined,
    targetFriendId: 'user1',
    approvals: [
      {
        userId: 'user1',
        username: 'あなた',
        approved: true,
        timestamp: new Date('2024-01-20T14:00:00')
      }
    ],
    createdAt: new Date('2024-01-20T13:00:00'),
    updatedAt: new Date('2024-01-20T13:00:00')
  }
];

export const ApprovalListPage: React.FC = () => {
  const handleApproval = (postId: string) => {
    // TODO: 承認処理
    console.log('Approve post:', postId);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#D4E7F5',
      paddingTop: '60px',
      paddingBottom: '70px'
    }}>
      <Header title="承認一覧" />
      
      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        {dummyFriendPosts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#999'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>👋</div>
            <p>フレンドの投稿がありません</p>
          </div>
        ) : (
          dummyFriendPosts.map((post) => {
            const isApproved = post.approvals.some(a => a.approved);
            return (
              <div key={post.id} style={{ marginBottom: '20px' }}>
                <PostCard post={post} />
                <div style={{ marginTop: '12px' }}>
                  <ApprovalButton
                    isApproved={isApproved}
                    onClick={() => handleApproval(post.id)}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      <Footer />
    </div>
  );
};


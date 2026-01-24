import React, { useState, useEffect } from 'react';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { PostCard } from '../components/post/PostCard';
import { ApprovalButton } from '../components/approval/ApprovalButton';
import { Post } from '../types';
import { User } from '../types/user';

export const ApprovalListPage: React.FC = () => {
  const [friendPosts, setFriendPosts] = useState<Post[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [hasFriend, setHasFriend] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // 現在のユーザー情報を取得
    const userDataStr = localStorage.getItem('currentUser');
    if (!userDataStr) return;

    const userData: User = JSON.parse(userDataStr);
    setCurrentUser(userData);

    // フレンドがいない場合は何も表示しない
    if (!userData.friendId) {
      setHasFriend(false);
      return;
    }

    setHasFriend(true);

    // フレンドの投稿を取得
    const existingPosts = localStorage.getItem('posts');
    if (existingPosts) {
      const allPosts = JSON.parse(existingPosts);
      // フレンドの投稿のみフィルタリング
      const friendPostsData = allPosts
        .filter((post: any) => post.userId === userData.friendId)
        .map((post: any) => ({
          ...post,
          createdAt: new Date(post.createdAt),
          updatedAt: new Date(post.updatedAt),
          approvals: post.approvals.map((approval: any) => ({
            ...approval,
            timestamp: new Date(approval.timestamp)
          }))
        }));
      setFriendPosts(friendPostsData);
    }
  };

  const handleApproval = (postId: string) => {
    if (!currentUser) return;

    const existingPosts = localStorage.getItem('posts');
    if (!existingPosts) return;

    const allPosts = JSON.parse(existingPosts);
    const updatedPosts = allPosts.map((post: any) => {
      if (post.id === postId) {
        // すでに承認しているか確認
        const alreadyApproved = post.approvals.some(
          (a: any) => a.userId === currentUser.uid
        );

        if (alreadyApproved) {
          // 承認を取り消す（全てのフィールドを保持）
          return {
            ...post,
            approvals: post.approvals.filter((a: any) => a.userId !== currentUser.uid),
            updatedAt: new Date().toISOString()
          };
        } else {
          // 承認を追加（全てのフィールドを保持）
          return {
            ...post,
            approvals: [
              ...post.approvals,
              {
                userId: currentUser.uid,
                username: currentUser.username,
                approved: true,
                timestamp: new Date().toISOString()
              }
            ],
            updatedAt: new Date().toISOString()
          };
        }
      }
      return post;
    });

    localStorage.setItem('posts', JSON.stringify(updatedPosts));
    loadData();
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
        {!hasFriend ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#999'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}></div>
            <p style={{ marginBottom: '8px' }}>フレンドがいません</p>
            <p style={{ fontSize: '14px' }}>
              プロフィール画面からフレンドを追加してください
            </p>
          </div>
        ) : friendPosts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#999'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>👋</div>
            <p>フレンドの投稿がまだありません</p>
          </div>
        ) : (
          friendPosts.map((post) => {
            const isApproved = post.approvals.some(
              a => currentUser && a.userId === currentUser.uid && a.approved
            );
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


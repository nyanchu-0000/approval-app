import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { Button } from '../components/common/Button';
import { ProfileIcon } from '../components/common/ProfileIcon';
import type { User } from '../types/user';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 初回起動時にユーザーを作成
    initializeUser();
  }, []);

  const initializeUser = () => {
    const existingUser = localStorage.getItem('currentUser');
    
    if (!existingUser) {
      // 新規ユーザーを作成
      const newUser: User = {
        uid: generateUserId(),
        username: 'ユーザー',
        email: 'user@example.com',
        profileIcon: '/dummy-app-icon.svg',
        profileIconUrl: undefined,
        bio: '',
        friendId: null,
        friendRequestTo: null,
        friendRequestFrom: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      localStorage.setItem('currentUser', JSON.stringify(newUser));

      // allUsersにも追加
      const allUsersStr = localStorage.getItem('allUsers');
      const allUsers: User[] = allUsersStr ? JSON.parse(allUsersStr) : [];
      allUsers.push(newUser);
      localStorage.setItem('allUsers', JSON.stringify(allUsers));
    }
  };

  const generateUserId = (): string => {
    // ランダムな8文字のIDを生成
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    // 空の場合はデフォルトIDを返す
    return result || 'A1B2C3D4';
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#D4E7F5',
      paddingTop: '60px',
      paddingBottom: '70px'
    }}>
      <Header />
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 20px',
        minHeight: 'calc(100vh - 130px)'
      }}>
        {/* メインコンテンツカード */}
        <div style={{
          width: '100%',
          maxWidth: '500px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {/* ウェルカムメッセージ */}
          <div style={{
            textAlign: 'center',
            marginBottom: '8px'
          }}>
            <h2 style={{
              margin: '0 0 8px 0',
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#333'
            }}>
              ようこそ!
            </h2>
            <p style={{
              margin: 0,
              fontSize: '14px',
              color: '#666',
              lineHeight: '1.6'
            }}>
              友達と思い出を共有して、承認し合いましょう
            </p>
          </div>

          {/* グリッドメニュー */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            marginBottom: '20px'
          }}>
            {/* 投稿ボックス */}
            <div
              onClick={() => navigate('/create-post')}
              style={{
                backgroundColor: '#B8D4E8',
                borderRadius: '16px',
                padding: '32px 20px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                aspectRatio: '1',
                minHeight: '140px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
            >
              <div style={{
                fontSize: '48px',
                marginBottom: '12px',
                filter: 'brightness(0) invert(1)'
              }}>
                📝
              </div>
              <div style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: 'white',
                textAlign: 'center'
              }}>
                投稿
              </div>
            </div>

            {/* 承認ボックス */}
            <div
              onClick={() => navigate('/approvals')}
              style={{
                backgroundColor: '#B8D4E8',
                borderRadius: '16px',
                padding: '32px 20px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                aspectRatio: '1',
                minHeight: '140px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
            >
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                marginBottom: '12px',
                color: '#B8D4E8'
              }}>
                ✓
              </div>
              <div style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: 'white',
                textAlign: 'center'
              }}>
                承認
              </div>
            </div>

            {/* 投稿一覧ボックス */}
            <div
              onClick={() => navigate('/posts')}
              style={{
                backgroundColor: '#B8D4E8',
                borderRadius: '16px',
                padding: '32px 20px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                aspectRatio: '1',
                minHeight: '140px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
            >
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                marginBottom: '12px'
              }}>
                📋
              </div>
              <div style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: 'white',
                textAlign: 'center'
              }}>
                投稿一覧
              </div>
            </div>

            {/* プロフィールボックス */}
            <div
              onClick={() => navigate('/profile')}
              style={{
                backgroundColor: '#B8D4E8',
                borderRadius: '16px',
                padding: '32px 20px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                aspectRatio: '1',
                minHeight: '140px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
            >
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                marginBottom: '12px'
              }}>
                👤
              </div>
              <div style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: 'white',
                textAlign: 'center'
              }}>
                プロフィール
              </div>
            </div>
          </div>

          {/* お知らせカード */}
          <div style={{
            backgroundColor: '#B8D4E8',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              flexShrink: 0
            }}>
              💡
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{
                margin: '0 0 4px 0',
                fontSize: '14px',
                fontWeight: 'bold',
                color: 'white'
              }}>
                友達と思い出をシェアしよう
              </h3>
              <p style={{
                margin: 0,
                fontSize: '12px',
                color: 'rgba(255,255,255,0.9)',
                lineHeight: '1.4'
              }}>
                承認されると投稿が公開されます
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};


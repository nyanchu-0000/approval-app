import React from 'react';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { ProfileIcon } from '../components/common/ProfileIcon';
import { Button } from '../components/common/Button';

export const ProfilePage: React.FC = () => {
  // TODO: 実際のユーザー情報を取得
  const user = {
    username: 'ユーザー名',
    email: 'user@example.com',
    profileIcon: '/dummy-app-icon.svg',
    friends: ['フレンド1', 'フレンド2']
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#D4E7F5',
      paddingTop: '60px',
      paddingBottom: '70px'
    }}>
      <Header title="プロフィール" />
      
      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        {/* プロフィール情報 */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '30px',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <ProfileIcon src={user.profileIcon} size={100} />
          </div>
          
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '8px'
          }}>
            {user.username}
          </h2>
          
          <p style={{
            fontSize: '14px',
            color: '#666',
            marginBottom: '20px'
          }}>
            {user.email}
          </p>

          <Button variant="outline" fullWidth>
            プロフィールを編集
          </Button>
        </div>

        {/* フレンド情報 */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '16px'
          }}>
            フレンド
          </h3>
          
          {user.friends.length === 0 ? (
            <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>
              フレンドがいません
            </p>
          ) : (
            <div>
              {user.friends.map((friend, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px',
                    borderBottom: index < user.friends.length - 1 ? '1px solid #f0f0f0' : 'none'
                  }}
                >
                  <ProfileIcon src="/dummy-app-icon.svg" size={40} />
                  <span style={{
                    marginLeft: '12px',
                    fontSize: '16px',
                    color: '#333'
                  }}>
                    {friend}
                  </span>
                </div>
              ))}
            </div>
          )}
          
          <div style={{ marginTop: '16px' }}>
            <Button variant="outline" fullWidth>
              フレンドを追加
            </Button>
          </div>
        </div>

        {/* その他の設定 */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '16px'
          }}>
            設定
          </h3>
          
          <button style={{
            width: '100%',
            padding: '12px',
            backgroundColor: 'transparent',
            border: 'none',
            textAlign: 'left',
            fontSize: '16px',
            color: '#333',
            cursor: 'pointer',
            borderBottom: '1px solid #f0f0f0'
          }}>
            通知設定
          </button>
          
          <button style={{
            width: '100%',
            padding: '12px',
            backgroundColor: 'transparent',
            border: 'none',
            textAlign: 'left',
            fontSize: '16px',
            color: '#333',
            cursor: 'pointer',
            borderBottom: '1px solid #f0f0f0'
          }}>
            プライバシー設定
          </button>
          
          <button style={{
            width: '100%',
            padding: '12px',
            backgroundColor: 'transparent',
            border: 'none',
            textAlign: 'left',
            fontSize: '16px',
            color: '#d32f2f',
            cursor: 'pointer'
          }}>
            ログアウト
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};


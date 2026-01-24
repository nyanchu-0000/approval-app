import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { ProfileIcon } from '../components/common/ProfileIcon';
import { Button } from '../components/common/Button';
import { User, UserProfile } from '../types/user';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [friendProfile, setFriendProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    // 現在のユーザー情報を取得
    const userDataStr = localStorage.getItem('currentUser');
    if (userDataStr) {
      const userData: User = JSON.parse(userDataStr);
      setCurrentUser(userData);

      // フレンドがいる場合、フレンドの情報を取得
      if (userData.friendId) {
        const allUsersStr = localStorage.getItem('allUsers');
        if (allUsersStr) {
          const allUsers: User[] = JSON.parse(allUsersStr);
          const friend = allUsers.find(u => u.uid === userData.friendId);
          if (friend) {
            setFriendProfile({
              uid: friend.uid,
              username: friend.username,
              profileIcon: friend.profileIcon
            });
          }
        }
      }
    }
  };

  const handleRemoveFriend = () => {
    if (!currentUser || !currentUser.friendId) return;

    const confirmed = window.confirm('フレンドを解除しますか？この操作は取り消せません。');
    if (!confirmed) return;

    const allUsersStr = localStorage.getItem('allUsers');
    if (!allUsersStr) return;

    const allUsers: User[] = JSON.parse(allUsersStr);
    
    // 両者のフレンド関係を解除
    const updatedUsers = allUsers.map(u => {
      if (u.uid === currentUser.uid || u.uid === currentUser.friendId) {
        return { 
          ...u, 
          friendId: null,
          friendRequestTo: null,
          friendRequestFrom: null
        };
      }
      return u;
    });

    localStorage.setItem('allUsers', JSON.stringify(updatedUsers));
    
    // 現在のユーザー情報を更新
    const updatedCurrentUser = updatedUsers.find(u => u.uid === currentUser.uid);
    if (updatedCurrentUser) {
      localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));
    }

    // 状態を更新
    loadUserData();
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
          {/* プロフィールアイコン - クリック可能 */}
          <div 
            style={{ 
              marginBottom: '16px',
              cursor: 'pointer',
              display: 'inline-block'
            }}
            onClick={() => {
              // TODO: プロフィール画像変更機能を実装
              alert('プロフィール画像の変更機能は今後実装予定です');
            }}
          >
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              backgroundColor: '#e0e0e0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              fontSize: '14px',
              color: '#999',
              border: '3px dashed #ccc',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#4a9d8f';
              e.currentTarget.style.backgroundColor = '#f0f4f8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#ccc';
              e.currentTarget.style.backgroundColor = '#e0e0e0';
            }}
            >
              プロフィール<br/>アイコン
            </div>
          </div>
          
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '16px'
          }}>
            ユーザーネーム
          </h2>

          <div style={{
            backgroundColor: '#f0f4f8',
            padding: '8px 16px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '12px',
            color: '#4a9d8f',
            marginBottom: '20px',
            display: 'inline-block'
          }}>
            ID: {currentUser?.uid || 'A1B2C3D4'}
          </div>

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
          
          {!friendProfile ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>👥</div>
              <p style={{ color: '#999', marginBottom: '16px' }}>
                フレンドがいません
              </p>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px',
              marginBottom: '16px',
              backgroundColor: '#f0f4f8',
              borderRadius: '8px'
            }}>
              <ProfileIcon src={friendProfile.profileIcon} size={50} />
              <div style={{ marginLeft: '12px', flex: 1 }}>
                <div style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#333',
                  marginBottom: '4px'
                }}>
                  {friendProfile.username}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#666',
                  fontFamily: 'monospace'
                }}>
                  {friendProfile.uid}
                </div>
              </div>
            </div>
          )}
          
          {currentUser?.friendRequestTo && (
            <div style={{
              padding: '12px',
              backgroundColor: '#fff3e0',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '14px',
              color: '#e65100',
              textAlign: 'center'
            }}>
              ⏳ リクエスト送信済み
            </div>
          )}

          {currentUser?.friendRequestFrom && !currentUser?.friendId && (
            <div style={{
              padding: '12px',
              backgroundColor: '#e3f2fd',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '14px',
              color: '#1565c0',
              textAlign: 'center'
            }}>
              🔔 リクエストが届いています
            </div>
          )}
          
          <div style={{ marginTop: '16px' }}>
            {!currentUser?.friendId ? (
              <Button 
                variant="outline" 
                fullWidth
                onClick={() => navigate('/add-friend')}
              >
                フレンドを追加
              </Button>
            ) : (
              <Button 
                variant="outline" 
                fullWidth
                onClick={handleRemoveFriend}
                style={{ color: '#d32f2f', borderColor: '#d32f2f' }}
              >
                フレンドを解除
              </Button>
            )}
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


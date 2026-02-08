import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { ProfileIcon } from '../components/common/ProfileIcon';
import { Button } from '../components/common/Button';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import type { User, UserProfile } from '../types/user';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [friendProfile, setFriendProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [editBio, setEditBio] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await authService.getCurrentUser();
      if (userData) {
        setCurrentUser(userData);
        setEditUsername(userData.username || 'ユーザーネーム');
        setEditBio(userData.bio || '');

        // フレンドがいる場合、フレンドの情報を取得
        if (userData.friendId) {
          const friend = await userService.getUserById(userData.friendId);
          if (friend) {
            setFriendProfile({
              uid: friend.uid,
              username: friend.username,
              profileIcon: friend.profileIcon
            });
          }
        }
      }
    } catch (error) {
      console.error('ユーザーデータの読み込みに失敗:', error);
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    // 画像をリサイズしてBase64に変換
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const maxSize = 300;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        const base64String = canvas.toDataURL('image/jpeg', 0.8);
        
        try {
          await userService.updateProfile(currentUser.uid, {
            profileIconUrl: base64String
          });
          await loadUserData();
        } catch (error) {
          console.error('プロフィール画像の更新に失敗:', error);
          alert('画像の更新に失敗しました');
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    if (!currentUser) return;

    try {
      await userService.updateProfile(currentUser.uid, {
        username: editUsername,
        bio: editBio
      });
      await loadUserData();
      setIsEditing(false);
      alert('プロフィールを更新しました');
    } catch (error) {
      console.error('プロフィールの更新に失敗:', error);
      alert('プロフィールの更新に失敗しました');
    }
  };

  const handleRemoveFriend = async () => {
    if (!currentUser || !currentUser.friendId) return;
    
    if (window.confirm('フレンドを解除しますか？')) {
      try {
        await userService.removeFriend(currentUser.uid, currentUser.friendId);
        await loadUserData();
        alert('フレンドを解除しました');
      } catch (error) {
        console.error('フレンド解除に失敗:', error);
        alert('フレンド解除に失敗しました');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
      navigate('/login');
    } catch (error) {
      console.error('ログアウトに失敗:', error);
      alert('ログアウトに失敗しました');
    }
  };

  if (!currentUser) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#D4E7F5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <p>読み込み中...</p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#D4E7F5',
      paddingTop: '60px',
      paddingBottom: '70px'
    }}>
      <Header title="プロフィール" />

      <div style={{
        padding: '20px',
        maxWidth: '500px',
        margin: '0 auto'
      }}>
        {/* プロフィールカード */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          {/* プロフィール画像 */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <div
              onClick={() => !isEditing && fileInputRef.current?.click()}
              style={{
                cursor: isEditing ? 'default' : 'pointer',
                position: 'relative'
              }}
            >
              <ProfileIcon
                src={currentUser.profileIconUrl || currentUser.profileIcon}
                size={120}
              />
              {!isEditing && (
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  backgroundColor: '#B8D4E8',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}>
                  <span style={{ fontSize: '18px' }}>+</span>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              style={{ display: 'none' }}
            />
          </div>

          {/* ユーザー名と自己紹介 */}
          {isEditing ? (
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 'bold',
                marginBottom: '8px',
                color: '#333'
              }}>
                ユーザー名
              </label>
              <input
                type="text"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '16px',
                  marginBottom: '16px',
                  boxSizing: 'border-box'
                }}
              />
              
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 'bold',
                marginBottom: '8px',
                color: '#333'
              }}>
                自己紹介
              </label>
              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                placeholder="自己紹介を入力してください"
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '16px',
                  resize: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          ) : (
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#333',
                marginBottom: '8px'
              }}>
                {currentUser.username}
              </h2>
              {currentUser.bio && (
                <p style={{
                  fontSize: '14px',
                  color: '#666',
                  lineHeight: '1.6'
                }}>
                  {currentUser.bio}
                </p>
              )}
            </div>
          )}

          {/* 編集ボタン */}
          {isEditing ? (
            <div style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '20px'
            }}>
              <div style={{ flex: 1 }}>
                <Button
                  onClick={handleSaveProfile}
                  variant="primary"
                  fullWidth
                >
                  保存
                </Button>
              </div>
              <div style={{ flex: 1 }}>
                <Button
                  onClick={() => {
                    setIsEditing(false);
                    setEditUsername(currentUser.username);
                    setEditBio(currentUser.bio || '');
                  }}
                  variant="secondary"
                  fullWidth
                >
                  キャンセル
                </Button>
              </div>
            </div>
          ) : (
            <div style={{ marginBottom: '20px' }}>
              <Button
                onClick={() => setIsEditing(true)}
                variant="secondary"
                fullWidth
              >
                プロフィールを編集
              </Button>
            </div>
          )}

          {/* ユーザーID */}
          <div style={{
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '12px'
          }}>
            <p style={{
              fontSize: '12px',
              color: '#999',
              marginBottom: '4px'
            }}>
              あなたのID
            </p>
            <p style={{
              fontSize: '14px',
              color: '#333',
              fontFamily: 'monospace',
              wordBreak: 'break-all'
            }}>
              {currentUser.uid}
            </p>
          </div>
        </div>

        {/* フレンド情報カード */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '16px'
          }}>
            フレンド
          </h3>

          {friendProfile ? (
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px'
              }}>
                <ProfileIcon
                  src={friendProfile.profileIcon}
                  size={50}
                />
                <div>
                  <p style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#333'
                  }}>
                    {friendProfile.username}
                  </p>
                </div>
              </div>
              <Button
                onClick={handleRemoveFriend}
                variant="secondary"
                fullWidth
              >
                フレンドを解除
              </Button>
            </div>
          ) : (
            <div>
              <p style={{
                fontSize: '14px',
                color: '#666',
                marginBottom: '16px',
                textAlign: 'center'
              }}>
                まだフレンドがいません
              </p>
              <Button
                onClick={() => navigate('/add-friend')}
                variant="primary"
                fullWidth
              >
                フレンドを追加
              </Button>
            </div>
          )}
        </div>

        {/* ログアウトボタン */}
        <button
          onClick={() => setShowLogoutModal(true)}
          style={{
            width: '100%',
            padding: '12px 24px',
            backgroundColor: '#fff',
            color: '#c33',
            border: '1px solid #c33',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          ログアウト
        </button>
      </div>

      {/* ログアウト確認モーダル */}
      {showLogoutModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '400px',
            width: '100%'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#333',
              marginBottom: '16px',
              textAlign: 'center'
            }}>
              ログアウトしますか？
            </h3>
            <div style={{
              display: 'flex',
              gap: '12px'
            }}>
              <button
                onClick={handleLogout}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  backgroundColor: '#c33',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                ログアウト
              </button>
              <div style={{ flex: 1 }}>
                <Button
                  onClick={() => setShowLogoutModal(false)}
                  variant="secondary"
                  fullWidth
                >
                  キャンセル
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

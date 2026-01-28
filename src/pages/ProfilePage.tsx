import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { ProfileIcon } from '../components/common/ProfileIcon';
import { Button } from '../components/common/Button';
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

  const loadUserData = () => {
    // 現在のユーザー情報を取得
    const userDataStr = localStorage.getItem('currentUser');
    if (userDataStr) {
      const userData: User = JSON.parse(userDataStr);
      setCurrentUser(userData);
      setEditUsername(userData.username || 'ユーザーネーム');
      setEditBio(userData.bio || '');

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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    // 画像をリサイズしてBase64に変換
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Canvasで画像をリサイズ（最大サイズ: 300x300）
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

        // Base64に変換（品質を調整してサイズを削減）
        const base64String = canvas.toDataURL('image/jpeg', 0.8);
        
        // ユーザー情報を更新（profileIconとprofileIconUrlの両方を更新）
        const updatedUser = {
          ...currentUser,
          profileIcon: base64String,
          profileIconUrl: base64String
        };

        // localStorageを更新
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));

        // allUsersも更新
        const allUsersStr = localStorage.getItem('allUsers');
        if (allUsersStr) {
          const allUsers: User[] = JSON.parse(allUsersStr);
          const updatedUsers = allUsers.map(u => 
            u.uid === currentUser.uid ? updatedUser : u
          );
          localStorage.setItem('allUsers', JSON.stringify(updatedUsers));
        }

        // 既存の投稿のプロフィール画像も更新
        updatePostsProfile(base64String, currentUser.username);

        setCurrentUser(updatedUser);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const updatePostsProfile = (profileIcon: string, username: string) => {
    // 既存の投稿のプロフィール情報を更新
    const existingPostsStr = localStorage.getItem('posts');
    if (existingPostsStr) {
      const posts = JSON.parse(existingPostsStr);
      const updatedPosts = posts.map((post: any) => {
        if (post.userId === currentUser?.uid) {
          return {
            ...post,
            userProfileIcon: profileIcon,
            username: username
          };
        }
        return post;
      });
      localStorage.setItem('posts', JSON.stringify(updatedPosts));
    }
  };

  const handleSaveProfile = () => {
    if (!currentUser) return;

    const updatedUser = {
      ...currentUser,
      username: editUsername,
      bio: editBio,
      updatedAt: new Date()
    };

    // localStorageを更新
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    // allUsersも更新
    const allUsersStr = localStorage.getItem('allUsers');
    if (allUsersStr) {
      const allUsers: User[] = JSON.parse(allUsersStr);
      const updatedUsers = allUsers.map(u => 
        u.uid === currentUser.uid ? updatedUser : u
      );
      localStorage.setItem('allUsers', JSON.stringify(updatedUsers));
    }

    // 既存の投稿のプロフィール情報も更新
    updatePostsProfile(currentUser.profileIcon || '', editUsername);

    setCurrentUser(updatedUser);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditUsername(currentUser?.username || 'ユーザーネーム');
    setEditBio(currentUser?.bio || '');
    setIsEditing(false);
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

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    // localStorageからcurrentUserを削除
    localStorage.removeItem('currentUser');
    // ホームページに遷移
    navigate('/');
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
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
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            style={{ display: 'none' }}
          />
          
          <div 
            style={{ 
              marginBottom: '16px',
              cursor: 'pointer',
              display: 'inline-block',
              position: 'relative'
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            {currentUser?.profileIcon && currentUser.profileIcon !== '/dummy-app-icon.svg' && currentUser.profileIcon.length > 20 ? (
              <div style={{ position: 'relative' }}>
                <img
                  src={currentUser.profileIcon}
                  alt="プロフィール"
                  style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #E5E5E5'
                  }}
                />
                {/* +ボタン */}
                <div style={{
                  position: 'absolute',
                  bottom: '0',
                  right: '0',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#2C2C2E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '3px solid white',
                  color: 'white',
                  fontSize: '24px',
                  fontWeight: '300',
                  lineHeight: '1'
                }}>
                  +
                </div>
              </div>
            ) : (
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  backgroundColor: '#B0B0B0',
                  border: '2px solid #E5E5E5',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {/* 人物アイコンSVG */}
                  <svg 
                    width="120" 
                    height="120" 
                    viewBox="0 0 100 100"
                    style={{ position: 'absolute' }}
                  >
                    {/* 頭部 */}
                    <circle cx="50" cy="35" r="15" fill="white" />
                    {/* 体部 */}
                    <path 
                      d="M 25 80 Q 25 57 50 57 Q 75 57 75 80 L 75 100 L 25 100 Z" 
                      fill="white" 
                    />
                  </svg>
                  {/* 下部の装飾ドット */}
                  <div style={{
                    position: 'absolute',
                    bottom: '18px',
                    left: 0,
                    right: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '10px',
                    opacity: 0.5
                  }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'white' }} />
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'white' }} />
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'white' }} />
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'white' }} />
                  </div>
                </div>
                {/* +ボタン */}
                <div style={{
                  position: 'absolute',
                  bottom: '0',
                  right: '0',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#2C2C2E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '3px solid white',
                  color: 'white',
                  fontSize: '24px',
                  fontWeight: '300',
                  lineHeight: '1'
                }}>
                  +
                </div>
              </div>
            )}
          </div>
          
          {isEditing ? (
            <div style={{ marginBottom: '16px' }}>
              <input
                type="text"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                placeholder="ユーザーネーム"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '18px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  marginBottom: '12px',
                  boxSizing: 'border-box',
                  textAlign: 'center',
                  fontWeight: 'bold'
                }}
              />
              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                placeholder="自己紹介を入力してください"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '14px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  marginBottom: '12px',
                  boxSizing: 'border-box',
                  minHeight: '80px',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
            </div>
          ) : (
            <>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#333',
                marginBottom: '8px'
              }}>
                {currentUser?.username || 'ユーザーネーム'}
              </h2>

              {currentUser?.bio && (
                <p style={{
                  fontSize: '14px',
                  color: '#666',
                  marginBottom: '16px',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap'
                }}>
                  {currentUser.bio}
                </p>
              )}
            </>
          )}

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

          {isEditing ? (
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button variant="outline" fullWidth onClick={handleCancelEdit}>
                キャンセル
              </Button>
              <Button fullWidth onClick={handleSaveProfile}>
                保存
              </Button>
            </div>
          ) : (
            <Button variant="outline" fullWidth onClick={handleEditProfile}>
              プロフィールを編集
            </Button>
          )}
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
              <div style={{ fontSize: '48px', marginBottom: '12px' }}></div>
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
              <div
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: 'transparent',
                  border: '2px solid #d32f2f',
                  borderRadius: '8px',
                  color: '#d32f2f',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
                onClick={handleRemoveFriend}
              >
                フレンドを解除
              </div>
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
          
          <button 
            onClick={handleLogoutClick}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: 'transparent',
              border: 'none',
              textAlign: 'left',
              fontSize: '16px',
              color: '#d32f2f',
              cursor: 'pointer'
            }}
          >
            ログアウト
          </button>
        </div>
      </div>

      {/* ログアウト確認モーダル */}
      {showLogoutModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '30px',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#333',
              marginBottom: '16px',
              textAlign: 'center'
            }}>
              ログアウトしますか？
            </h3>
            
            <div style={{
              display: 'flex',
              gap: '12px',
              marginTop: '24px'
            }}>
              <button
                onClick={handleLogoutCancel}
                style={{
                  flex: 1,
                  padding: '14px',
                  backgroundColor: 'white',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '500',
                  color: '#333',
                  cursor: 'pointer'
                }}
              >
                いいえ
              </button>
              <button
                onClick={handleLogoutConfirm}
                style={{
                  flex: 1,
                  padding: '14px',
                  backgroundColor: '#d32f2f',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '500',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                はい
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};


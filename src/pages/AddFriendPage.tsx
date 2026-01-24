import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { Button } from '../components/common/Button';
import { User } from '../types/user';

export const AddFriendPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [friendUserId, setFriendUserId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // 現在のユーザー情報を取得
    const userDataStr = localStorage.getItem('currentUser');
    if (userDataStr) {
      const userData = JSON.parse(userDataStr);
      setCurrentUser(userData);
    }
  }, []);

  const handleAddFriend = () => {
    setError('');
    setSuccess('');

    if (!friendUserId.trim()) {
      setError('フレンドIDを入力してください');
      return;
    }

    if (!currentUser) {
      setError('ユーザー情報が見つかりません');
      return;
    }

    if (friendUserId === currentUser.uid) {
      setError('自分自身を追加することはできません');
      return;
    }

    // すでにフレンドがいる場合
    if (currentUser.friendId) {
      setError('すでにフレンドが登録されています');
      return;
    }

    // フレンドリクエストを送信（localStorage版）
    const allUsersStr = localStorage.getItem('allUsers');
    const allUsers: User[] = allUsersStr ? JSON.parse(allUsersStr) : [];
    
    // 相手のユーザーを検索
    const friendUser = allUsers.find(u => u.uid === friendUserId);
    
    if (!friendUser) {
      setError('指定されたIDのユーザーが見つかりません');
      return;
    }

    // 相手がすでに他のフレンドを持っている場合
    if (friendUser.friendId && friendUser.friendId !== currentUser.uid) {
      setError('このユーザーはすでに別のフレンドと繋がっています');
      return;
    }

    // 相手から自分にリクエストが来ている → フレンド成立
    if (friendUser.friendRequestTo === currentUser.uid) {
      // 両者のフレンド関係を確立
      const updatedUsers = allUsers.map(u => {
        if (u.uid === currentUser.uid) {
          return { 
            ...u, 
            friendId: friendUserId,
            friendRequestTo: null,
            friendRequestFrom: null
          };
        }
        if (u.uid === friendUserId) {
          return { 
            ...u, 
            friendId: currentUser.uid,
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
        setCurrentUser(updatedCurrentUser);
      }

      setSuccess('フレンドが追加されました！');
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
      return;
    }

    // 自分からリクエストを送る
    const updatedUsers = allUsers.map(u => {
      if (u.uid === currentUser.uid) {
        return { ...u, friendRequestTo: friendUserId };
      }
      if (u.uid === friendUserId) {
        return { ...u, friendRequestFrom: currentUser.uid };
      }
      return u;
    });

    localStorage.setItem('allUsers', JSON.stringify(updatedUsers));
    
    // 現在のユーザー情報を更新
    const updatedCurrentUser = updatedUsers.find(u => u.uid === currentUser.uid);
    if (updatedCurrentUser) {
      localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));
      setCurrentUser(updatedCurrentUser);
    }

    setSuccess('フレンドリクエストを送信しました。相手も追加するとフレンドになります。');
  };

  const handleCancelRequest = () => {
    if (!currentUser || !currentUser.friendRequestTo) return;

    const allUsersStr = localStorage.getItem('allUsers');
    const allUsers: User[] = allUsersStr ? JSON.parse(allUsersStr) : [];

    // リクエストをキャンセル
    const updatedUsers = allUsers.map(u => {
      if (u.uid === currentUser.uid) {
        return { ...u, friendRequestTo: null };
      }
      if (u.uid === currentUser.friendRequestTo) {
        return { ...u, friendRequestFrom: null };
      }
      return u;
    });

    localStorage.setItem('allUsers', JSON.stringify(updatedUsers));
    
    const updatedCurrentUser = updatedUsers.find(u => u.uid === currentUser.uid);
    if (updatedCurrentUser) {
      localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));
      setCurrentUser(updatedCurrentUser);
    }

    setSuccess('リクエストをキャンセルしました');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#D4E7F5',
      paddingTop: '60px',
      paddingBottom: '70px'
    }}>
      <Header title="フレンドを追加" />
      
      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        {/* あなたのID */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '12px'
          }}>
            あなたのID
          </h3>
          <div style={{
            backgroundColor: '#f0f4f8',
            padding: '16px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#4a9d8f',
            textAlign: 'center',
            letterSpacing: '1px'
          }}>
            {currentUser?.uid || 'loading...'}
          </div>
          <p style={{
            fontSize: '12px',
            color: '#666',
            marginTop: '8px',
            textAlign: 'center'
          }}>
            このIDを相手に教えてください
          </p>
        </div>

        {/* フレンド追加フォーム */}
        {!currentUser?.friendId && !currentUser?.friendRequestTo && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#333',
              marginBottom: '12px'
            }}>
              フレンドのIDを入力
            </h3>
            <input
              type="text"
              value={friendUserId}
              onChange={(e) => setFriendUserId(e.target.value)}
              placeholder="フレンドのIDを入力"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                marginBottom: '12px',
                boxSizing: 'border-box',
                fontFamily: 'monospace'
              }}
            />
            <Button onClick={handleAddFriend} fullWidth>
              フレンドを追加
            </Button>
          </div>
        )}

        {/* リクエスト送信済み */}
        {currentUser?.friendRequestTo && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>⏳</div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#333',
                marginBottom: '8px'
              }}>
                リクエスト送信済み
              </h3>
              <p style={{ fontSize: '14px', color: '#666' }}>
                相手があなたのIDを追加するのを待っています
              </p>
            </div>
            <Button variant="outline" onClick={handleCancelRequest} fullWidth>
              リクエストをキャンセル
            </Button>
          </div>
        )}

        {/* フレンド受信リクエスト */}
        {currentUser?.friendRequestFrom && !currentUser?.friendId && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            border: '2px solid #4a9d8f'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔔</div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#333',
                marginBottom: '8px'
              }}>
                フレンドリクエストが届いています
              </h3>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
                相手のIDを入力してフレンドになりましょう
              </p>
              <div style={{
                backgroundColor: '#f0f4f8',
                padding: '12px',
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#4a9d8f'
              }}>
                {currentUser.friendRequestFrom}
              </div>
            </div>
          </div>
        )}

        {/* エラーメッセージ */}
        {error && (
          <div style={{
            backgroundColor: '#ffebee',
            color: '#c62828',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        {/* 成功メッセージ */}
        {success && (
          <div style={{
            backgroundColor: '#e8f5e9',
            color: '#2e7d32',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {success}
          </div>
        )}

        {/* 説明 */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '12px'
          }}>
            フレンド追加の流れ
          </h3>
          <ol style={{
            fontSize: '14px',
            color: '#666',
            paddingLeft: '20px',
            lineHeight: '1.8'
          }}>
            <li>あなたのIDを相手に教えます</li>
            <li>相手のIDを入力して追加します</li>
            <li>お互いが追加すると自動的にフレンドになります</li>
            <li>フレンドは1人だけ登録できます</li>
          </ol>
        </div>
      </div>

      <Footer />
    </div>
  );
};


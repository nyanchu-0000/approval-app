import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { ImageUpload } from '../components/post/ImageUpload';
import { Button } from '../components/common/Button';
import { User } from '../types/user';

export const CreatePostPage: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string | undefined>(undefined);
  const [showNotification, setShowNotification] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // 現在のユーザー情報を取得
    const userDataStr = localStorage.getItem('currentUser');
    if (userDataStr) {
      const userData = JSON.parse(userDataStr);
      setCurrentUser(userData);
    }
  }, []);

  const handleImageSelect = (file: File) => {
    setImage(file);
    
    // 画像をBase64に変換
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Canvasで画像をリサイズ（最大サイズ: 800x800）
        const canvas = document.createElement('canvas');
        const maxSize = 800;
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

        // Base64に変換
        const base64String = canvas.toDataURL('image/jpeg', 0.8);
        setImageBase64(base64String);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!currentUser) {
      alert('ユーザー情報が見つかりません');
      return;
    }

    // TODO: Firebase に保存する処理
    const newPost = {
      id: Date.now().toString(),
      userId: currentUser.uid,
      username: currentUser.username,
      userProfileIcon: currentUser.profileIcon,
      title,
      content,
      imageUrl: imageBase64,
      targetFriendId: currentUser.friendId || '',
      approvals: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // localStorageに保存（仮実装）
    const existingPosts = localStorage.getItem('posts');
    const posts = existingPosts ? JSON.parse(existingPosts) : [];
    posts.unshift(newPost);
    localStorage.setItem('posts', JSON.stringify(posts));
    
    // 通知を表示
    setShowNotification(true);
    
    // 1.5秒後に投稿一覧に遷移
    setTimeout(() => {
      navigate('/posts');
    }, 1500);
  };

  const canSubmit = title.trim() !== '' && content.trim() !== '';

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#D4E7F5',
      paddingTop: '60px',
      paddingBottom: '70px'
    }}>
      <Header title="投稿する" />
      
      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: 'bold',
            color: '#333'
          }}>
            タイトル
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="タイトルを入力..."
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: 'bold',
            color: '#333'
          }}>
            画像
          </label>
          <ImageUpload onImageSelect={handleImageSelect} />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: 'bold',
            color: '#333'
          }}>
            本文
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="本文を入力..."
            rows={6}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              fontSize: '16px',
              resize: 'vertical',
              boxSizing: 'border-box',
              fontFamily: 'inherit'
            }}
          />
        </div>

        <Button
          onClick={handleSubmit}
          fullWidth
          disabled={!canSubmit}
        >
          投稿
        </Button>
      </div>

      {/* プッシュアップ通知 */}
      {showNotification && (
        <div style={{
          position: 'fixed',
          top: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#4a9d8f',
          color: 'white',
          padding: '16px 32px',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          zIndex: 2000,
          animation: 'slideDown 0.3s ease-out',
          fontSize: '16px',
          fontWeight: 'bold'
        }}>
          ✓ 投稿されました
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>

      <Footer />
    </div>
  );
};


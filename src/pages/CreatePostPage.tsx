import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { ImageUpload } from '../components/post/ImageUpload';
import { Button } from '../components/common/Button';
import { authService } from '../services/authService';
import { postService } from '../services/postService';
import { User } from '../types/user';

export const CreatePostPage: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setCurrentUser(userData);
      
      // フレンドがいない場合は警告
      if (userData && !userData.friendId) {
        alert('投稿するにはまずフレンドを追加してください');
        navigate('/profile');
      }
    } catch (error) {
      console.error('ユーザー情報の取得に失敗:', error);
    }
  };

  const handleImageSelect = (file: File) => {
    setImage(file);
    
    // プレビュー用にBase64に変換
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!currentUser || !currentUser.friendId) {
      alert('フレンドが登録されていません');
      return;
    }

    if (!title.trim() || !content.trim()) {
      alert('タイトルと内容を入力してください');
      return;
    }

    setLoading(true);

    try {
      await postService.createPost(currentUser.uid, {
        title: title.trim(),
        content: content.trim(),
        image,
        targetFriendId: currentUser.friendId,
      });

      // 成功画面へ遷移
      navigate('/post-success');
    } catch (error: any) {
      console.error('投稿の作成に失敗:', error);
      alert(error.message || '投稿の作成に失敗しました');
    } finally {
      setLoading(false);
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
      <Header title="投稿作成" />

      <div style={{
        padding: '20px',
        maxWidth: '500px',
        margin: '0 auto'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          {/* タイトル入力 */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 'bold',
              marginBottom: '8px',
              color: '#333'
            }}>
              タイトル
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="投稿のタイトルを入力"
              disabled={loading}
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

          {/* 画像アップロード */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 'bold',
              marginBottom: '8px',
              color: '#333'
            }}>
              画像
            </label>
            <ImageUpload onImageSelect={handleImageSelect} disabled={loading} />
            {imagePreview && (
              <div style={{
                marginTop: '12px',
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block'
                  }}
                />
              </div>
            )}
          </div>

          {/* 内容入力 */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 'bold',
              marginBottom: '8px',
              color: '#333'
            }}>
              内容
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="投稿の内容を入力してください"
              rows={6}
              disabled={loading}
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

          {/* 投稿ボタン */}
          <Button
            onClick={handleSubmit}
            disabled={loading || !title.trim() || !content.trim()}
            variant="primary"
            style={{ width: '100%' }}
          >
            {loading ? '投稿中...' : '投稿する'}
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

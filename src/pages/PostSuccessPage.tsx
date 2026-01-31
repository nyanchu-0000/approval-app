import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { Button } from '../components/common/Button';

export const PostSuccessPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#D4E7F5',
      paddingTop: '60px',
      paddingBottom: '70px'
    }}>
      <Header title="投稿完了" />
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        minHeight: 'calc(100vh - 130px)'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '40px',
          textAlign: 'center',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          maxWidth: '400px'
        }}>
          <div style={{ fontSize: '80px', marginBottom: '20px' }}>✅</div>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '10px'
          }}>
            投稿完了しました
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#666',
            marginBottom: '30px'
          }}>
            フレンドの承認をお待ちください
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Button onClick={() => navigate('/')} fullWidth>
              ホームに戻る
            </Button>
            <Button onClick={() => navigate('/posts')} variant="outline" fullWidth>
              投稿一覧を見る
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};


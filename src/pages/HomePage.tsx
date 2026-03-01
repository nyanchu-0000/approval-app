import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

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
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="56" height="56">
                  <rect x="20" y="8" width="88" height="112" rx="4" fill="#ffffff"/>
                  <rect x="32" y="24" width="64" height="6" rx="3" fill="#B8D4E8"/>
                  <line x1="32" y1="8" x2="32" y2="120" stroke="#B8D4E8" strokeWidth="4"/>
                </svg>
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
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="56" height="56">
                  <circle cx="64" cy="36" r="24" fill="#ffffff"/>
                  <path fill="#ffffff" d="M96 84c0-17.673-14.327-32-32-32s-32 14.327-32 32v44h64V84z"/>
                </svg>
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
          <div
            onClick={() => navigate('/rank-items')}
            style={{
              backgroundColor: '#B8D4E8',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            }}
          >
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="32" height="32">
                {/* トロフィーのカップ部分 */}
                <path d="M40 30 L40 50 Q40 70 64 70 Q88 70 88 50 L88 30 Z" fill="#B8D4E8"/>
                {/* トロフィーの持ち手 */}
                <path d="M30 30 Q20 30 20 40 Q20 48 30 50 L30 30" fill="#B8D4E8"/>
                <path d="M98 30 Q108 30 108 40 Q108 48 98 50 L98 30" fill="#B8D4E8"/>
                {/* トロフィーの台座 */}
                <rect x="56" y="70" width="16" height="20" fill="#B8D4E8"/>
                <rect x="48" y="90" width="32" height="8" rx="2" fill="#B8D4E8"/>
                {/* 順位表示 (1位のリボン) */}
                <circle cx="64" cy="50" r="12" fill="#ffffff"/>
                <text x="64" y="55" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#B8D4E8">1</text>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{
                margin: 0,
                fontSize: '14px',
                fontWeight: 'bold',
                color: 'white'
              }}>
                ランクとアイテムを見る
              </h3>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};


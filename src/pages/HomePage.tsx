import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { Button } from '../components/common/Button';
import { ProfileIcon } from '../components/common/ProfileIcon';

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
        padding: '40px 20px',
        minHeight: 'calc(100vh - 130px)'
      }}>
        {/* ボタンエリア */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div
            onClick={() => navigate('/create-post')}
            style={{
              backgroundColor: '#F5F1D4',
              borderRadius: '20px',
              padding: '40px 50px',
              textAlign: 'center',
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease',
              minWidth: '200px',
              border: '2px solid rgba(123, 123, 123, 0.1)',
              position: 'relative' as const,
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.15), 0 6px 12px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.08)';
            }}
          >
            <div style={{ 
              color: '#7B7B7B',
              lineHeight: '1.3',
              position: 'relative' as const,
              zIndex: 1
            }}>
              <span style={{ fontSize: '48px', fontWeight: 'bold' }}>投稿</span>
              <br />
              <span style={{ fontSize: '24px', fontWeight: 'normal' }}>する</span>
            </div>
            <div style={{
              position: 'absolute' as const,
              bottom: '-10px',
              right: '-10px',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              zIndex: 0
            }} />
          </div>

          <div
            onClick={() => navigate('/approvals')}
            style={{
              backgroundColor: '#F5F1D4',
              borderRadius: '20px',
              padding: '40px 50px',
              textAlign: 'center',
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease',
              minWidth: '200px',
              border: '2px solid rgba(123, 123, 123, 0.1)',
              position: 'relative' as const,
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.15), 0 6px 12px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.08)';
            }}
          >
            <div style={{ 
              color: '#7B7B7B',
              lineHeight: '1.3',
              position: 'relative' as const,
              zIndex: 1
            }}>
              <span style={{ fontSize: '48px', fontWeight: 'bold' }}>承認</span>
              <br />
              <span style={{ fontSize: '24px', fontWeight: 'normal' }}>する</span>
            </div>
            <div style={{
              position: 'absolute' as const,
              bottom: '-10px',
              right: '-10px',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              zIndex: 0
            }} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};


import React from 'react';

export const LoadingPage: React.FC = () => {

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#4a9d8f',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white'
    }}>
      <div style={{ marginBottom: '30px' }}>
        <img
          src="/dummy-app-icon.svg"
          alt="承認アプリ"
          style={{ width: '120px', height: '120px' }}
        />
      </div>
      
      <h1 style={{
        fontSize: '32px',
        fontWeight: 'bold',
        marginBottom: '20px'
      }}>
        承認アプリ
      </h1>
      
      <div style={{
        width: '40px',
        height: '40px',
        border: '4px solid rgba(255, 255, 255, 0.3)',
        borderTop: '4px solid white',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};



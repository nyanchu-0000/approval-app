import React from 'react';

interface ApprovalButtonProps {
  isApproved: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export const ApprovalButton: React.FC<ApprovalButtonProps> = ({
  isApproved,
  onClick,
  disabled = false
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isApproved}
      style={{
        width: '100%',
        padding: '16px',
        backgroundColor: isApproved ? '#4a9d8f' : '#f5f5f5',
        color: isApproved ? 'white' : '#333',
        border: isApproved ? 'none' : '2px solid #4a9d8f',
        borderRadius: '12px',
        fontSize: '18px',
        fontWeight: 'bold',
        cursor: (disabled || isApproved) ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
      }}
    >
      {isApproved ? (
        <>
          <span style={{ fontSize: '24px' }}>✓</span>
          承認済み
        </>
      ) : (
        <>
          <span style={{ fontSize: '24px' }}>👍</span>
          承認する
        </>
      )}
    </button>
  );
};




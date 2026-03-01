import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  style?: React.CSSProperties;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  fullWidth = false,
  disabled = false,
  type = 'button',
  style
}) => {
  const getBackgroundColor = () => {
    if (disabled) return '#ccc';
    switch (variant) {
      case 'primary':
        return '#4a9d8f';
      case 'secondary':
        return '#f5f5f5';
      case 'outline':
        return 'transparent';
      default:
        return '#4a9d8f';
    }
  };

  const getTextColor = () => {
    if (disabled) return '#666';
    switch (variant) {
      case 'primary':
        return 'white';
      case 'secondary':
        return '#333';
      case 'outline':
        return '#4a9d8f';
      default:
        return 'white';
    }
  };

  const getBorder = () => {
    if (variant === 'outline') {
      return '2px solid #4a9d8f';
    }
    return 'none';
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: fullWidth ? '100%' : 'auto',
        padding: '12px 24px',
        backgroundColor: getBackgroundColor(),
        color: getTextColor(),
        border: getBorder(),
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s',
        opacity: disabled ? 0.6 : 1,
        ...style
      }}
    >
      {children}
    </button>
  );
};



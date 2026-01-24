import React from 'react';

interface ProfileIconProps {
  src: string;
  alt?: string;
  size?: number;
  onClick?: () => void;
}

export const ProfileIcon: React.FC<ProfileIconProps> = ({
  src,
  alt = 'プロフィール',
  size = 50,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        border: '2px solid #e0e0e0',
        backgroundColor: '#f5f5f5'
      }}
    >
      <img
        src={src || '/dummy-app-icon.svg'}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />
    </div>
  );
};


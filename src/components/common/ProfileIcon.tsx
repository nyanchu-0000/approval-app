import React from 'react';

interface ProfileIconProps {
  src?: string;
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
  // 画像がBase64データまたは有効なURLかチェック
  const hasValidImage = src && src !== '/dummy-app-icon.svg' && src.length > 20;

  if (hasValidImage) {
    // 画像がある場合
    return (
      <div
        onClick={onClick}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          overflow: 'hidden',
          cursor: onClick ? 'pointer' : 'default',
          border: '2px solid #E5E5E5',
          backgroundColor: '#f5f5f5',
          flexShrink: 0
        }}
      >
        <img
          src={src}
          alt={alt}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      </div>
    );
  }

  // デフォルトアイコン（画像がない場合）
  return (
    <div
      onClick={onClick}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: '#B0B0B0',
        border: '2px solid #E5E5E5',
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* 人物アイコンSVG */}
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100"
        style={{ position: 'absolute' }}
      >
        {/* 頭部 */}
        <circle cx="50" cy="35" r="15" fill="white" />
        {/* 体部 */}
        <path 
          d="M 25 80 Q 25 57 50 57 Q 75 57 75 80 L 75 100 L 25 100 Z" 
          fill="white" 
        />
      </svg>
      {/* 下部の装飾ドット */}
      <div style={{
        position: 'absolute',
        bottom: size * 0.15,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        gap: size * 0.08,
        opacity: 0.5
      }}>
        <div style={{ width: size * 0.05, height: size * 0.05, borderRadius: '50%', backgroundColor: 'white' }} />
        <div style={{ width: size * 0.05, height: size * 0.05, borderRadius: '50%', backgroundColor: 'white' }} />
        <div style={{ width: size * 0.05, height: size * 0.05, borderRadius: '50%', backgroundColor: 'white' }} />
        <div style={{ width: size * 0.05, height: size * 0.05, borderRadius: '50%', backgroundColor: 'white' }} />
      </div>
    </div>
  );
};




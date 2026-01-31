import React, { useState, useEffect, useRef } from 'react';
import { Post } from '../../types';
import { ProfileIcon } from '../common/ProfileIcon';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface PostCardProps {
  post: Post;
  onClick?: () => void;
  showApprovalStatus?: boolean;
  onDelete?: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  onClick,
  showApprovalStatus = false,
  onDelete
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hasApproval = post.approvals.some(a => a.approved);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleCardClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick();
    }
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('この投稿を削除しますか?')) {
      if (onDelete) {
        onDelete();
      }
    }
    setShowMenu(false);
  };

  return (
    <div
      onClick={handleCardClick}
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '12px',
        cursor: onClick ? 'pointer' : 'default',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'all 0.2s',
        position: 'relative'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
        <ProfileIcon src={post.userProfileIcon} size={40} />
        <div style={{ marginLeft: '12px', flex: 1 }}>
          <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{post.username}</div>
          <div style={{ fontSize: '12px', color: '#999' }}>
            {format(post.createdAt, 'yyyy/MM/dd HH:mm', { locale: ja })}
          </div>
        </div>
        {showApprovalStatus && (
          <div style={{
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 'bold',
            backgroundColor: hasApproval ? '#4a9d8f' : '#e0e0e0',
            color: hasApproval ? 'white' : '#666',
            marginRight: '8px'
          }}>
            {hasApproval ? '承認済' : '承認待'}
          </div>
        )}
        {onDelete && (
          <div style={{ position: 'relative' }} ref={menuRef}>
            <button
              onClick={handleMenuClick}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px 8px',
                fontSize: '20px',
                color: '#666',
                lineHeight: 1
              }}
            >
              ⋯
            </button>
            {showMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  zIndex: 10,
                  minWidth: '120px',
                  marginTop: '4px'
                }}
              >
                <button
                  onClick={handleDeleteClick}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    background: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: '#e74c3c',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f5f5f5';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  削除
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ marginBottom: '8px' }}>
        <h3 style={{ 
          margin: '0 0 8px 0', 
          fontSize: '16px',
          fontWeight: 'bold' 
        }}>
          {post.title}
        </h3>
      </div>

      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt={post.title}
          style={{
            width: '100%',
            borderRadius: '8px',
            marginBottom: '8px',
            maxHeight: '300px',
            objectFit: 'cover'
          }}
          onError={(e) => {
            console.error('画像の読み込みに失敗しました:', post.id);
            console.error('imageUrl length:', post.imageUrl?.length);
            console.error('imageUrl preview:', post.imageUrl?.substring(0, 50));
          }}
        />
      )}

      <p style={{
        margin: 0,
        fontSize: '14px',
        color: '#333',
        lineHeight: '1.5',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }}>
        {post.content}
      </p>
    </div>
  );
};



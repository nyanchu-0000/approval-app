import React from 'react';
import { Post } from '../../types';
import { ProfileIcon } from '../common/ProfileIcon';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface PostCardProps {
  post: Post;
  onClick?: () => void;
  showApprovalStatus?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  onClick,
  showApprovalStatus = false 
}) => {
  const hasApproval = post.approvals.some(a => a.approved);

  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '12px',
        cursor: onClick ? 'pointer' : 'default',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'all 0.2s'
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
            color: hasApproval ? 'white' : '#666'
          }}>
            {hasApproval ? '承認済' : '承認待'}
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


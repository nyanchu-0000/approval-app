import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  path: string;
  icon: string;
  label: string;
}

export const Footer: React.FC = () => {
  const location = useLocation();

  const navItems: NavItem[] = [
    { path: '/', icon: '/icons/home.svg', label: 'ホーム' },
    { path: '/approvals', icon: '/icons/stamp.svg', label: '承認一覧' },
    { path: '/posts', icon: '/icons/notebook.svg', label: '投稿一覧' },
    { path: '/profile', icon: '/icons/person.svg', label: 'プロフィール' },
  ];

  return (
    <footer style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '70px',
      backgroundColor: '#D4F5E0',
      borderTop: '1px solid #e0e0e0',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      zIndex: 1000,
      boxShadow: '0 -2px 4px rgba(0,0,0,0.05)'
    }}>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textDecoration: 'none',
              color: isActive ? '#4a9d8f' : '#999',
              flex: 1,
              padding: '8px'
            }}
          >
            <img 
              src={item.icon} 
              alt={item.label}
              style={{
                width: '28px',
                height: '28px',
                filter: isActive 
                  ? 'brightness(0) saturate(100%) invert(52%) sepia(26%) saturate(938%) hue-rotate(126deg) brightness(95%) contrast(88%)'
                  : 'brightness(0) saturate(100%) invert(70%) sepia(0%) saturate(0%)'
              }}
            />
            <span style={{
              fontSize: '11px',
              marginTop: '4px',
              fontWeight: isActive ? 'bold' : 'normal'
            }}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </footer>
  );
};


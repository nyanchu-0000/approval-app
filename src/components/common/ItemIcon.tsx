import React from 'react';
import type { Item } from '../../utils/items';

interface ItemIconProps {
  item: Item;
  size?: number;
}

export const ItemIcon: React.FC<ItemIconProps> = ({ item, size = 60 }) => {
  const renderItemSvg = () => {
    const { id, category } = item;
    
    // カテゴリーごとに異なる色とデザインを適用
    const colors = {
      fox: ['#FF9A76', '#FFD6A5', '#FFF5E1'],
      'fox-item': ['#E85D75', '#FFB6C1', '#FFF0F5'],
      fish: ['#6FBAFF', '#9DD9FF', '#E0F4FF'],
      food: ['#FFE5B4', '#FFD700', '#FFDAB9'],
      fire: ['#FF6B35', '#FF9F45', '#FFD93D'],
      gem: ['#B57EDC', '#E0BBE4', '#957DAD'],
      adventure: ['#8FBC8F', '#B8D4B8', '#D4E8D4'],
      game: ['#FFB347', '#FFA07A', '#FFE4B5'],
      nature: ['#98D8C8', '#C8E6C9', '#E8F5E9'],
      animal: ['#FFDAB9', '#FFE4C4', '#FFF8DC']
    };
    
    const categoryColors = colors[category as keyof typeof colors] || colors.game;
    const color1 = categoryColors[0];
    const color2 = categoryColors[1];
    const color3 = categoryColors[2];
    
    // IDに基づいてバリエーションを作成
    const variant = id % 10;
    
    if (category === 'fox' || category === 'fox-item') {
      // 狐関連のアイテム
      if (id % 4 === 0) {
        // 狐の顔
        return (
          <svg viewBox="0 0 100 100" width={size} height={size}>
            {/* 耳 */}
            <polygon points="25,20 30,35 20,35" fill={color1} />
            <polygon points="75,20 70,35 80,35" fill={color1} />
            {/* 顔 */}
            <circle cx="50" cy="50" r="25" fill={color1} />
            <ellipse cx="50" cy="60" rx="20" ry="15" fill={color3} />
            {/* 目 */}
            <circle cx="42" cy="48" r="3" fill="#333" />
            <circle cx="58" cy="48" r="3" fill="#333" />
            {/* 鼻 */}
            <circle cx="50" cy="55" r="2" fill="#333" />
          </svg>
        );
      } else if (id % 4 === 1) {
        // 狐火
        return (
          <svg viewBox="0 0 100 100" width={size} height={size}>
            <path d="M50,20 Q40,40 45,60 Q50,50 55,60 Q60,40 50,20" fill={color1} opacity="0.8" />
            <path d="M50,30 Q45,45 48,58 Q50,50 52,58 Q55,45 50,30" fill={color2} />
            <circle cx="50" cy="50" r="8" fill={color3} opacity="0.6" />
          </svg>
        );
      } else if (id % 4 === 2) {
        // 狐の尻尾
        return (
          <svg viewBox="0 0 100 100" width={size} height={size}>
            <path d="M20,80 Q30,70 40,60 Q50,40 60,30 Q70,20 75,15" stroke={color1} strokeWidth="12" fill="none" strokeLinecap="round" />
            <path d="M25,80 Q35,70 45,60 Q55,40 65,30 Q75,20 80,15" stroke={color3} strokeWidth="8" fill="none" strokeLinecap="round" />
          </svg>
        );
      } else {
        // 鳥居や神社アイテム
        return (
          <svg viewBox="0 0 100 100" width={size} height={size}>
            <rect x="20" y="30" width="8" height="50" fill={color1} rx="2" />
            <rect x="72" y="30" width="8" height="50" fill={color1} rx="2" />
            <rect x="15" y="25" width="70" height="8" fill={color1} rx="3" />
            <rect x="18" y="40" width="64" height="6" fill={color2} rx="2" />
          </svg>
        );
      }
    } else if (category === 'fish') {
      // 魚類
      if (variant < 3) {
        // 魚
        return (
          <svg viewBox="0 0 100 100" width={size} height={size}>
            <ellipse cx="55" cy="50" rx="30" ry="15" fill={color1} />
            <polygon points="25,50 15,40 15,60" fill={color1} />
            <circle cx="70" cy="45" r="3" fill="#333" />
            <path d="M55,45 L60,40" stroke={color2} strokeWidth="2" />
            <path d="M55,50 L60,50" stroke={color2} strokeWidth="2" />
          </svg>
        );
      } else if (variant < 6) {
        // イカ・タコ
        return (
          <svg viewBox="0 0 100 100" width={size} height={size}>
            <ellipse cx="50" cy="35" rx="20" ry="18" fill={color1} />
            <rect x="35" y="50" width="4" height="30" fill={color2} rx="2" />
            <rect x="42" y="50" width="4" height="35" fill={color2} rx="2" />
            <rect x="49" y="50" width="4" height="32" fill={color2} rx="2" />
            <rect x="56" y="50" width="4" height="28" fill={color2} rx="2" />
            <circle cx="45" cy="32" r="2" fill="#333" />
            <circle cx="55" cy="32" r="2" fill="#333" />
          </svg>
        );
      } else {
        // 貝殻
        return (
          <svg viewBox="0 0 100 100" width={size} height={size}>
            <path d="M50,30 L30,70 L70,70 Z" fill={color1} />
            <path d="M50,30 L35,70" stroke={color2} strokeWidth="2" />
            <path d="M50,30 L50,70" stroke={color2} strokeWidth="2" />
            <path d="M50,30 L65,70" stroke={color2} strokeWidth="2" />
          </svg>
        );
      }
    } else if (category === 'food') {
      // 食べ物
      if (variant < 3) {
        // おにぎり
        return (
          <svg viewBox="0 0 100 100" width={size} height={size}>
            <polygon points="50,25 25,70 75,70" fill={color3} />
            <rect x="40" y="45" width="20" height="15" fill={color1} rx="2" />
          </svg>
        );
      } else if (variant < 6) {
        // 団子
        return (
          <svg viewBox="0 0 100 100" width={size} height={size}>
            <rect x="45" y="70" width="10" height="20" fill="#8B4513" rx="2" />
            <circle cx="50" cy="30" r="12" fill={color1} />
            <circle cx="50" cy="48" r="12" fill={color2} />
            <circle cx="50" cy="66" r="12" fill={color3} />
          </svg>
        );
      } else {
        // フルーツ
        return (
          <svg viewBox="0 0 100 100" width={size} height={size}>
            <circle cx="50" cy="55" r="22" fill={color1} />
            <ellipse cx="50" cy="30" rx="5" ry="8" fill="#4CAF50" />
            <circle cx="48" cy="52" r="3" fill={color3} opacity="0.6" />
          </svg>
        );
      }
    } else if (category === 'fire') {
      // 炎・光
      return (
        <svg viewBox="0 0 100 100" width={size} height={size}>
          <path d="M50,20 Q35,40 40,60 Q45,50 50,65 Q55,50 60,60 Q65,40 50,20" fill={color1} />
          <path d="M50,30 Q42,45 45,60 Q48,52 50,62 Q52,52 55,60 Q58,45 50,30" fill={color2} />
          <path d="M50,40 Q47,50 48,58 Q49,54 50,60 Q51,54 52,58 Q53,50 50,40" fill={color3} />
        </svg>
      );
    } else if (category === 'gem') {
      // 宝石
      return (
        <svg viewBox="0 0 100 100" width={size} height={size}>
          <polygon points="50,20 30,40 35,70 65,70 70,40" fill={color1} />
          <polygon points="50,20 70,40 50,50" fill={color2} opacity="0.7" />
          <polygon points="30,40 50,50 35,70" fill={color3} opacity="0.5" />
          <polygon points="70,40 50,50 65,70" fill={color2} opacity="0.5" />
        </svg>
      );
    } else if (category === 'adventure') {
      // 冒険アイテム
      if (variant < 5) {
        // 剣
        return (
          <svg viewBox="0 0 100 100" width={size} height={size}>
            <rect x="47" y="20" width="6" height="55" fill={color2} rx="1" />
            <rect x="40" y="15" width="20" height="8" fill={color1} rx="2" />
            <rect x="43" y="72" width="14" height="8" fill={color1} rx="2" />
          </svg>
        );
      } else {
        // 盾
        return (
          <svg viewBox="0 0 100 100" width={size} height={size}>
            <path d="M50,20 L70,30 L70,60 Q70,75 50,80 Q30,75 30,60 L30,30 Z" fill={color1} />
            <circle cx="50" cy="50" r="8" fill={color2} />
          </svg>
        );
      }
    } else if (category === 'game') {
      // ゲームアイテム
      if (variant < 3) {
        // ポーション
        return (
          <svg viewBox="0 0 100 100" width={size} height={size}>
            <rect x="42" y="25" width="16" height="8" fill={color2} rx="2" />
            <path d="M38,33 L38,60 Q38,70 50,70 Q62,70 62,60 L62,33 Z" fill={color1} />
            <rect x="40" y="40" width="20" height="20" fill={color2} opacity="0.6" rx="2" />
          </svg>
        );
      } else if (variant < 6) {
        // コイン
        return (
          <svg viewBox="0 0 100 100" width={size} height={size}>
            <ellipse cx="50" cy="50" rx="25" ry="25" fill={color1} />
            <ellipse cx="50" cy="50" rx="18" ry="18" fill={color2} />
            <circle cx="50" cy="50" r="10" fill={color3} />
          </svg>
        );
      } else {
        // 宝箱
        return (
          <svg viewBox="0 0 100 100" width={size} height={size}>
            <rect x="25" y="45" width="50" height="30" fill={color1} rx="3" />
            <path d="M25,45 Q50,35 75,45" fill={color2} />
            <rect x="48" y="55" width="4" height="8" fill={color3} rx="1" />
          </svg>
        );
      }
    } else if (category === 'nature') {
      // 自然
      if (variant < 4) {
        // 雲
        return (
          <svg viewBox="0 0 100 100" width={size} height={size}>
            <circle cx="35" cy="55" r="15" fill={color1} />
            <circle cx="50" cy="50" r="18" fill={color1} />
            <circle cx="65" cy="55" r="15" fill={color1} />
          </svg>
        );
      } else if (variant < 7) {
        // 星
        return (
          <svg viewBox="0 0 100 100" width={size} height={size}>
            <polygon points="50,20 58,45 85,45 63,60 70,85 50,70 30,85 37,60 15,45 42,45" fill={color1} />
            <polygon points="50,30 55,45 65,45 57,52 60,65 50,57 40,65 43,52 35,45 45,45" fill={color2} />
          </svg>
        );
      } else {
        // 花
        return (
          <svg viewBox="0 0 100 100" width={size} height={size}>
            <circle cx="50" cy="30" r="8" fill={color1} />
            <circle cx="65" cy="40" r="8" fill={color1} />
            <circle cx="65" cy="60" r="8" fill={color1} />
            <circle cx="50" cy="70" r="8" fill={color1} />
            <circle cx="35" cy="60" r="8" fill={color1} />
            <circle cx="35" cy="40" r="8" fill={color1} />
            <circle cx="50" cy="50" r="10" fill={color2} />
          </svg>
        );
      }
    } else if (category === 'animal') {
      // 動物
      if (variant < 3) {
        // 猫
        return (
          <svg viewBox="0 0 100 100" width={size} height={size}>
            <polygon points="30,35 35,25 40,35" fill={color1} />
            <polygon points="60,35 65,25 70,35" fill={color1} />
            <circle cx="50" cy="50" r="20" fill={color1} />
            <circle cx="45" cy="48" r="2" fill="#333" />
            <circle cx="55" cy="48" r="2" fill="#333" />
            <path d="M50,52 L50,56 M45,58 Q50,60 55,58" stroke="#333" strokeWidth="2" fill="none" />
          </svg>
        );
      } else if (variant < 6) {
        // ウサギ
        return (
          <svg viewBox="0 0 100 100" width={size} height={size}>
            <ellipse cx="40" cy="30" rx="6" ry="18" fill={color1} />
            <ellipse cx="60" cy="30" rx="6" ry="18" fill={color1} />
            <circle cx="50" cy="55" r="18" fill={color1} />
            <circle cx="45" cy="52" r="2" fill="#333" />
            <circle cx="55" cy="52" r="2" fill="#333" />
            <circle cx="50" cy="65" r="6" fill={color3} />
          </svg>
        );
      } else {
        // 鳥
        return (
          <svg viewBox="0 0 100 100" width={size} height={size}>
            <ellipse cx="50" cy="50" rx="15" ry="18" fill={color1} />
            <circle cx="50" cy="40" r="12" fill={color1} />
            <path d="M35,50 Q25,45 20,50" stroke={color1} strokeWidth="4" fill="none" />
            <path d="M65,50 Q75,45 80,50" stroke={color1} strokeWidth="4" fill="none" />
            <circle cx="48" cy="38" r="2" fill="#333" />
            <polygon points="50,42 48,45 52,45" fill="#FF9800" />
          </svg>
        );
      }
    }
    
    // デフォルト（汎用アイコン）
    return (
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <rect x="30" y="30" width="40" height="40" fill={color1} rx="5" />
        <circle cx="50" cy="50" r="12" fill={color2} />
      </svg>
    );
  };
  
  return <div style={{ display: 'inline-block', lineHeight: 0 }}>{renderItemSvg()}</div>;
};


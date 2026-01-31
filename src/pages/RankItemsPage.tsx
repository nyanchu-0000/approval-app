import React, { useEffect, useState } from 'react';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { ItemIcon } from '../components/common/ItemIcon';
import type { User } from '../types/user';
import { updateItemsForRank, getItemAtPosition, type PlacedItem } from '../utils/itemPlacement';

export const RankItemsPage: React.FC = () => {
  const [postCount, setPostCount] = useState(0);
  const [rank, setRank] = useState(0);
  const [placements, setPlacements] = useState<PlacedItem[]>([]);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    // 現在のユーザー情報を取得
    const userDataStr = localStorage.getItem('currentUser');
    if (!userDataStr) return;
    const userData: User = JSON.parse(userDataStr);

    // localStorageから投稿を読み込んで投稿数をカウント
    const existingPosts = localStorage.getItem('posts');
    if (existingPosts) {
      const parsedPosts = JSON.parse(existingPosts);
      // 現在のユーザーの投稿のみをカウント
      const userPosts = parsedPosts.filter((post: any) => post.userId === userData.uid);
      const count = userPosts.length;
      setPostCount(count);
      
      // ランクを計算（5投稿ごとに1ランクアップ）
      const calculatedRank = Math.floor(count / 5);
      setRank(calculatedRank);
      
      // アイテムの配置を更新
      const updatedPlacements = updateItemsForRank(userData.uid, calculatedRank);
      setPlacements(updatedPlacements);
    }
  };

  // 5列×30行のアイテムグリッドを生成
  const renderItemGrid = () => {
    const rows = 30;
    const cols = 5;
    const items = [];

    for (let i = 0; i < rows * cols; i++) {
      const item = getItemAtPosition(placements, i);
      const hasItem = !!item;
      
      items.push(
        <div
          key={i}
          style={{
            aspectRatio: '1',
            backgroundColor: hasItem ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            border: hasItem 
              ? '2px solid rgba(255, 255, 255, 0.8)' 
              : '2px dashed rgba(255, 255, 255, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {item && (
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'fadeIn 0.5s ease'
            }}>
              <ItemIcon item={item} size={45} />
            </div>
          )}
        </div>
      );
    }

    return items;
  };

  return (
    <>
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: scale(0.8);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}
      </style>
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#D4E7F5',
        paddingTop: '60px',
        paddingBottom: '70px',
        position: 'relative'
      }}>
        <Header title="アイテム一覧" />

      <div style={{
        padding: '20px',
        maxWidth: '500px',
        margin: '0 auto'
      }}>

        {/* ランク表示エリア */}
        <div style={{
          padding: '40px 20px',
          marginBottom: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          {/* 大きな円 */}
          <div style={{
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            backgroundColor: '#D4E7F5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            position: 'relative'
          }}>
            {/* ランクラベル - 円の上部に配置 */}
            <div style={{
              position: 'absolute',
              top: '20px',
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#666',
              letterSpacing: '1px'
            }}>
              ランク
            </div>
            
            {/* ランク数字 - デザイン性のある表示 */}
            <div style={{
              fontSize: '80px',
              fontWeight: 'bold',
              color: '#4A90B8',
              fontFamily: 'Arial Black, sans-serif',
              textShadow: '2px 2px 4px rgba(0,0,0,0.15)',
              letterSpacing: '-2px',
              marginTop: '10px'
            }}>
              {rank}
            </div>
          </div>

          {/* 投稿数表示 */}
          <div style={{
            fontSize: '14px',
            color: '#666',
            textAlign: 'center',
            marginBottom: '8px'
          }}>
            投稿数: {postCount}
          </div>
          
          {/* 獲得アイテム数表示 */}
          <div style={{
            fontSize: '13px',
            color: '#4A90B8',
            textAlign: 'center',
            fontWeight: 'bold'
          }}>
            獲得アイテム: {placements.length} / 150
          </div>
        </div>

        {/* アイテムグリッド */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          borderRadius: '24px',
          padding: '20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '12px'
        }}>
          {renderItemGrid()}
        </div>
      </div>

        <Footer />
      </div>
    </>
  );
};


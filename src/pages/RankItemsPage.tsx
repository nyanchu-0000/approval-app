import React, { useEffect, useState } from 'react';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { ItemIcon } from '../components/common/ItemIcon';
import { authService } from '../services/authService';
import { postService } from '../services/postService';
import { itemService } from '../services/itemService';
import { updateItemsForRank, getItemAtPosition, type PlacedItem } from '../utils/itemPlacement';

export const RankItemsPage: React.FC = () => {
  const [postCount, setPostCount] = useState(0);
  const [rank, setRank] = useState(0);
  const [placements, setPlacements] = useState<PlacedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) return;

      // 投稿を取得して投稿数をカウント
      const posts = await postService.getMyPosts(currentUser.uid);
      const count = posts.length;
      setPostCount(count);
      
      // ランクを計算（5投稿ごとに1ランクアップ）
      const calculatedRank = Math.floor(count / 5);
      setRank(calculatedRank);
      
      console.log('🔍 デバッグ情報:');
      console.log('投稿数:', count);
      console.log('ランク:', calculatedRank);
      
      // Supabaseからアイテム配置を取得
      const savedPlacements = await itemService.getItemPlacements(currentUser.uid);
      console.log('Supabaseから取得したアイテム:', savedPlacements);
      
      // 新しいアイテムを計算（既存のアイテム配置を渡す）
      const updatedPlacements = updateItemsForRank(currentUser.uid, calculatedRank, savedPlacements);
      console.log('更新後のアイテム:', updatedPlacements);
      
      // 既存のアイテムと比較して、新しいアイテムがあれば保存
      if (updatedPlacements.length > savedPlacements.length) {
        console.log('新しいアイテムを保存します');
        await itemService.saveItemPlacements(currentUser.uid, updatedPlacements);
        setPlacements(updatedPlacements);
      } else {
        console.log('既存のアイテムを使用します');
        setPlacements(savedPlacements);
      }
      
      console.log('最終的にセットされたアイテム数:', updatedPlacements.length > savedPlacements.length ? updatedPlacements.length : savedPlacements.length);
    } catch (error) {
      console.error('データの読み込みに失敗:', error);
    } finally {
      setLoading(false);
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
      
      // デバッグ: アイテムが見つかった場合
      if (hasItem) {
        console.log(`位置 ${i} にアイテム発見:`, item);
      }
      
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
          {hasItem && !item && (
            <div style={{ fontSize: '10px', color: 'red' }}>ERR</div>
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

      {loading ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 130px)'
        }}>
          <p style={{ color: '#666' }}>読み込み中...</p>
        </div>
      ) : (
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
        
        {/* デバッグ情報 */}
        {placements.length > 0 && (
          <div style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            borderRadius: '12px',
            fontSize: '12px',
            color: '#333'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>デバッグ情報:</div>
            {placements.map((p, index) => (
              <div key={index}>
                アイテムID: {p.itemId}, 位置: {p.position}
              </div>
            ))}
          </div>
        )}
        </div>
      )}

        <Footer />
      </div>
    </>
  );
};


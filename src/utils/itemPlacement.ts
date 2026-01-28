import { ITEMS, type Item } from './items';

export interface PlacedItem {
  itemId: number;
  position: number; // 0-149の位置
}

const STORAGE_KEY = 'userItemPlacements';
const TOTAL_SLOTS = 150; // 5列 × 30行

/**
 * ユーザーの配置済みアイテムを取得
 */
export const getUserItemPlacements = (userId: string): PlacedItem[] => {
  const allPlacements = localStorage.getItem(STORAGE_KEY);
  if (!allPlacements) return [];
  
  const parsed = JSON.parse(allPlacements);
  return parsed[userId] || [];
};

/**
 * ユーザーの配置済みアイテムを保存
 */
export const saveUserItemPlacements = (userId: string, placements: PlacedItem[]): void => {
  const allPlacements = localStorage.getItem(STORAGE_KEY);
  const parsed = allPlacements ? JSON.parse(allPlacements) : {};
  
  parsed[userId] = placements;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
};

/**
 * ランクに基づいて新しいアイテムを追加（ランダムな空き位置に配置）
 */
export const updateItemsForRank = (userId: string, currentRank: number): PlacedItem[] => {
  const existingPlacements = getUserItemPlacements(userId);
  
  // 既に配置されているアイテム数
  const placedCount = existingPlacements.length;
  
  // 現在のランクで獲得すべきアイテム数
  const shouldHaveCount = Math.min(currentRank, ITEMS.length);
  
  // 新しく追加する必要があるアイテム数
  const itemsToAdd = shouldHaveCount - placedCount;
  
  if (itemsToAdd <= 0) {
    return existingPlacements;
  }
  
  // 既に使用されている位置を取得
  const usedPositions = new Set(existingPlacements.map(p => p.position));
  
  // 利用可能な位置のリストを作成
  const availablePositions: number[] = [];
  for (let i = 0; i < TOTAL_SLOTS; i++) {
    if (!usedPositions.has(i)) {
      availablePositions.push(i);
    }
  }
  
  // Fisher-Yates シャッフルアルゴリズムで位置をランダム化
  for (let i = availablePositions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [availablePositions[i], availablePositions[j]] = [availablePositions[j], availablePositions[i]];
  }
  
  // 新しいアイテムを追加
  const newPlacements = [...existingPlacements];
  
  for (let i = 0; i < itemsToAdd && i < availablePositions.length; i++) {
    const itemId = placedCount + i + 1; // アイテムIDは1から始まる
    const position = availablePositions[i];
    
    newPlacements.push({
      itemId,
      position
    });
  }
  
  // 保存
  saveUserItemPlacements(userId, newPlacements);
  
  return newPlacements;
};

/**
 * アイテムIDからアイテム情報を取得
 */
export const getItemById = (itemId: number): Item | undefined => {
  return ITEMS.find(item => item.id === itemId);
};

/**
 * 特定の位置に配置されているアイテムを取得
 */
export const getItemAtPosition = (placements: PlacedItem[], position: number): Item | undefined => {
  const placement = placements.find(p => p.position === position);
  if (!placement) return undefined;
  
  return getItemById(placement.itemId);
};

/**
 * すべてのアイテムをリセット（デバッグ用）
 */
export const resetAllItems = (userId: string): void => {
  const allPlacements = localStorage.getItem(STORAGE_KEY);
  if (!allPlacements) return;
  
  const parsed = JSON.parse(allPlacements);
  delete parsed[userId];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
};


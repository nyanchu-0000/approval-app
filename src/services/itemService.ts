import { supabase } from './supabase';
import type { PlacedItem } from '../utils/itemPlacement';

export const itemService = {
  // ユーザーのアイテム配置を取得
  async getItemPlacements(userId: string): Promise<PlacedItem[]> {
    const { data, error } = await supabase
      .from('item_placements')
      .select('*')
      .eq('user_id', userId)
      .order('position', { ascending: true });

    if (error) throw error;
    if (!data) return [];

    return data.map(item => ({
      itemId: item.item_id,
      position: item.position,
      obtainedAt: new Date(item.obtained_at),
    }));
  },

  // アイテム配置を保存（複数）
  async saveItemPlacements(userId: string, placements: PlacedItem[]) {
    // 既存のアイテムを削除
    await supabase
      .from('item_placements')
      .delete()
      .eq('user_id', userId);

    // 新しいアイテムを挿入
    if (placements.length > 0) {
      const { error } = await supabase
        .from('item_placements')
        .insert(
          placements.map(p => ({
            user_id: userId,
            item_id: p.itemId,
            position: p.position,
            obtained_at: p.obtainedAt.toISOString(),
          }))
        );

      if (error) throw error;
    }
  },

  // 単一のアイテムを追加
  async addItemPlacement(userId: string, placement: PlacedItem) {
    const { error } = await supabase
      .from('item_placements')
      .upsert({
        user_id: userId,
        item_id: placement.itemId,
        position: placement.position,
        obtained_at: placement.obtainedAt.toISOString(),
      }, {
        onConflict: 'user_id,position'
      });

    if (error) throw error;
  },
};


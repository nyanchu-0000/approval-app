import { supabase } from './supabase';
import type { User } from '../types/user';

export const userService = {
  // ユーザー情報を更新
  async updateProfile(uid: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update({
        username: updates.username,
        profile_icon_url: updates.profileIconUrl,
        bio: updates.bio,
        updated_at: new Date().toISOString(),
      })
      .eq('uid', uid)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // UIDでユーザーを検索
  async getUserById(uid: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('uid', uid)
      .single();

    if (error) return null;
    if (!data) return null;

    return {
      uid: data.uid,
      username: data.username,
      email: data.email,
      profileIcon: data.profile_icon,
      profileIconUrl: data.profile_icon_url,
      bio: data.bio,
      friendId: data.friend_id,
      friendRequestTo: data.friend_request_to,
      friendRequestFrom: data.friend_request_from,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  },

  // フレンドリクエストを送信
  async sendFriendRequest(fromUid: string, toUid: string) {
    // 送信者の friend_request_to を更新
    const { error: fromError } = await supabase
      .from('users')
      .update({ 
        friend_request_to: toUid,
        updated_at: new Date().toISOString(),
      })
      .eq('uid', fromUid);

    if (fromError) throw fromError;

    // 受信者の friend_request_from を更新
    const { error: toError } = await supabase
      .from('users')
      .update({ 
        friend_request_from: fromUid,
        updated_at: new Date().toISOString(),
      })
      .eq('uid', toUid);

    if (toError) throw toError;
  },

  // フレンドリクエストを承認
  async acceptFriendRequest(uid: string, friendUid: string) {
    // 両方のユーザーのfriend_idを設定し、リクエスト情報をクリア
    await Promise.all([
      supabase
        .from('users')
        .update({
          friend_id: friendUid,
          friend_request_to: null,
          friend_request_from: null,
          updated_at: new Date().toISOString(),
        })
        .eq('uid', uid),
      supabase
        .from('users')
        .update({
          friend_id: uid,
          friend_request_to: null,
          friend_request_from: null,
          updated_at: new Date().toISOString(),
        })
        .eq('uid', friendUid),
    ]);
  },

  // フレンドリクエストをキャンセル/拒否
  async cancelFriendRequest(uid: string, otherUid: string) {
    await Promise.all([
      supabase
        .from('users')
        .update({
          friend_request_to: null,
          friend_request_from: null,
          updated_at: new Date().toISOString(),
        })
        .eq('uid', uid),
      supabase
        .from('users')
        .update({
          friend_request_to: null,
          friend_request_from: null,
          updated_at: new Date().toISOString(),
        })
        .eq('uid', otherUid),
    ]);
  },

  // フレンド関係を解除
  async removeFriend(uid: string, friendUid: string) {
    await Promise.all([
      supabase
        .from('users')
        .update({
          friend_id: null,
          updated_at: new Date().toISOString(),
        })
        .eq('uid', uid),
      supabase
        .from('users')
        .update({
          friend_id: null,
          updated_at: new Date().toISOString(),
        })
        .eq('uid', friendUid),
    ]);
  },
};


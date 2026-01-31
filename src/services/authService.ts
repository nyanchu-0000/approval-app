import { supabase } from './supabase';
import type { User } from '../types/user';

export const authService = {
  // メールアドレスでサインアップ
  async signUp(email: string, password: string, username: string) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('ユーザー作成に失敗しました');

    // usersテーブルにプロフィール情報を作成
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        uid: authData.user.id,
        username,
        email,
        profile_icon: '/dummy-app-icon.svg',
      });

    if (profileError) throw profileError;

    return authData.user;
  },

  // メールアドレスでログイン
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    
    // ログイン後、usersテーブルにデータが無ければ作成
    if (data.user) {
      const { data: existingUser } = await supabase
        .from('users')
        .select('uid')
        .eq('uid', data.user.id)
        .single();

      // usersテーブルにデータが無い場合は作成
      if (!existingUser) {
        const username = email.split('@')[0]; // メールアドレスの@より前をユーザー名として使用
        await supabase
          .from('users')
          .insert({
            uid: data.user.id,
            username,
            email,
            profile_icon: '/dummy-app-icon.svg',
          });
      }
    }
    
    return data.user;
  },

  // ログアウト
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // 現在のユーザーを取得
  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('uid', user.id)
      .single();

    if (!profile) return null;

    return {
      uid: profile.uid,
      username: profile.username,
      email: profile.email,
      profileIcon: profile.profile_icon,
      profileIconUrl: profile.profile_icon_url,
      bio: profile.bio,
      friendId: profile.friend_id,
      friendRequestTo: profile.friend_request_to,
      friendRequestFrom: profile.friend_request_from,
      createdAt: new Date(profile.created_at),
      updatedAt: new Date(profile.updated_at),
    };
  },

  // 認証状態の変更を監視
  onAuthStateChange(callback: (user: any) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user ?? null);
    });
  },
};


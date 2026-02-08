import { supabase } from './supabase';
import type { Post, CreatePostInput } from '../types/post';

export const postService = {
  // 投稿を作成
  async createPost(userId: string, input: CreatePostInput): Promise<Post> {
    // 画像がある場合はStorageにアップロード
    let imageUrl: string | undefined;
    
    if (input.image) {
      const fileExt = input.image.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(fileName, input.image);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('post-images')
        .getPublicUrl(fileName);

      imageUrl = publicUrl;
    }

    // ユーザー情報を取得
    const { data: userData } = await supabase
      .from('users')
      .select('username, profile_icon')
      .eq('uid', userId)
      .single();

    // 投稿を作成
    const { data, error } = await supabase
      .from('posts')
      .insert({
        user_id: userId,
        username: userData?.username || 'ユーザー',
        user_profile_icon: userData?.profile_icon || '/dummy-app-icon.svg',
        title: input.title,
        content: input.content,
        image_url: imageUrl,
        target_friend_id: input.targetFriendId,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      userId: data.user_id,
      username: data.username,
      userProfileIcon: data.user_profile_icon,
      title: data.title,
      content: data.content,
      imageUrl: data.image_url,
      targetFriendId: data.target_friend_id,
      approvals: [],
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  },

  // 自分の投稿を取得
  async getMyPosts(userId: string): Promise<Post[]> {
    const { data: posts, error } = await supabase
      .from('posts')
      .select(`
        *,
        approvals (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!posts) return [];

    return posts.map(post => ({
      id: post.id,
      userId: post.user_id,
      username: post.username,
      userProfileIcon: post.user_profile_icon,
      title: post.title,
      content: post.content,
      imageUrl: post.image_url,
      targetFriendId: post.target_friend_id,
      approvals: (post.approvals || []).map((a: any) => ({
        userId: a.user_id,
        username: a.username,
        approved: a.approved,
        timestamp: new Date(a.timestamp),
      })),
      createdAt: new Date(post.created_at),
      updatedAt: new Date(post.updated_at),
    }));
  },

  // フレンドの投稿を取得（自分宛の投稿）
  async getFriendPosts(myUserId: string): Promise<Post[]> {
    const { data: posts, error } = await supabase
      .from('posts')
      .select(`
        *,
        approvals (*)
      `)
      .eq('target_friend_id', myUserId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!posts) return [];

    return posts.map(post => ({
      id: post.id,
      userId: post.user_id,
      username: post.username,
      userProfileIcon: post.user_profile_icon,
      title: post.title,
      content: post.content,
      imageUrl: post.image_url,
      targetFriendId: post.target_friend_id,
      approvals: (post.approvals || []).map((a: any) => ({
        userId: a.user_id,
        username: a.username,
        approved: a.approved,
        timestamp: new Date(a.timestamp),
      })),
      createdAt: new Date(post.created_at),
      updatedAt: new Date(post.updated_at),
    }));
  },

  // 承認を追加
  async addApproval(postId: string, userId: string, username: string) {
    const { error } = await supabase
      .from('approvals')
      .upsert({
        post_id: postId,
        user_id: userId,
        username,
        approved: true,
      }, {
        onConflict: 'post_id,user_id'
      });

    if (error) throw error;
  },

  // 投稿を削除
  async deletePost(postId: string, userId: string) {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId)
      .eq('user_id', userId);

    if (error) throw error;
  },
};



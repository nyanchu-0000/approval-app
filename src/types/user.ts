export interface User {
  uid: string;
  username: string;
  email: string;
  profileIcon: string;
  friendId: string | null; // 唯一のフレンドのUID（null = フレンドなし）
  friendRequestTo: string | null; // フレンドリクエストを送った相手のUID
  friendRequestFrom: string | null; // フレンドリクエストを受け取った相手のUID
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  uid: string;
  username: string;
  profileIcon: string;
}

export interface FriendStatus {
  hasFriend: boolean;
  friendId: string | null;
  friendProfile: UserProfile | null;
  pendingRequest: boolean;
  requestDirection: 'sent' | 'received' | null;
}


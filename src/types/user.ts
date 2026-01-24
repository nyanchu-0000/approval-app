export interface User {
  uid: string;
  username: string;
  email: string;
  profileIcon: string;
  friends: string[]; // フレンドのUID配列
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  uid: string;
  username: string;
  profileIcon: string;
}


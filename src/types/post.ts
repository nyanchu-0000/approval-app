export interface Post {
  id: string;
  userId: string;
  username: string;
  userProfileIcon: string;
  title: string;
  content: string;
  imageUrl?: string;
  targetFriendId: string; // 投稿先のフレンドUID
  approvals: Approval[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Approval {
  userId: string;
  username: string;
  approved: boolean;
  timestamp: Date;
}

export interface CreatePostInput {
  title: string;
  content: string;
  image?: File;
  targetFriendId: string;
}




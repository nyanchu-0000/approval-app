export interface ApprovalData {
  userId: string;
  username: string;
  approved: boolean;
  timestamp: Date;
}

export interface ApprovalStatus {
  postId: string;
  isApproved: boolean;
  approvedBy: string[];
}



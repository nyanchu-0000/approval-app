import React, { useState, useEffect } from "react";
import { Header } from "../components/common/Header";
import { Footer } from "../components/common/Footer";
import { PostCard } from "../components/post/PostCard";
import { ApprovalButton } from "../components/approval/ApprovalButton";
import { authService } from "../services/authService";
import { postService } from "../services/postService";
import type { Post } from "../types";
import type { User } from "../types/user";

export const ApprovalListPage: React.FC = () => {
    const [friendPosts, setFriendPosts] = useState<Post[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [hasFriend, setHasFriend] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const userData = await authService.getCurrentUser();
            if (!userData) return;

            setCurrentUser(userData);

            // フレンドがいない場合
            if (!userData.friendId) {
                setHasFriend(false);
                return;
            }

            setHasFriend(true);

            // フレンドの投稿を取得（自分宛の投稿）
            const posts = await postService.getFriendPosts(userData.uid);
            
            // 投稿者の情報を最新のプロフィール情報で上書き
            const updatedPosts = await Promise.all(
                posts.map(async (post) => {
                    const { userService } = await import('../services/userService');
                    const author = await userService.getUserById(post.userId);
                    if (author) {
                        return {
                            ...post,
                            username: author.username,
                            userProfileIcon: author.profileIconUrl || author.profileIcon
                        };
                    }
                    return post;
                })
            );
            
            setFriendPosts(updatedPosts);
        } catch (error) {
            console.error("データの読み込みに失敗:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApproval = async (postId: string) => {
        if (!currentUser) return;

        try {
            // 既に承認しているか確認
            const post = friendPosts.find((p) => p.id === postId);
            if (!post) return;

            const alreadyApproved = post.approvals.some(
                (a) => a.userId === currentUser.uid,
            );

            if (!alreadyApproved) {
                // 承認を追加
                await postService.addApproval(
                    postId,
                    currentUser.uid,
                    currentUser.username,
                );
                // データを再読み込み
                await loadData();
            }
        } catch (error) {
            console.error("承認の処理に失敗:", error);
            alert("承認の処理に失敗しました");
        }
    };

    const hasApproved = (post: Post): boolean => {
        if (!currentUser) return false;
        return post.approvals.some((a) => a.userId === currentUser.uid);
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "#D4E7F5",
                paddingTop: "60px",
                paddingBottom: "70px",
            }}
        >
            <Header title="承認一覧" />

            <div
                style={{
                    padding: "20px",
                    maxWidth: "500px",
                    margin: "0 auto",
                }}
            >
                {loading ? (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            minHeight: "200px",
                        }}
                    >
                        <p style={{ color: "#666" }}>読み込み中...</p>
                    </div>
                ) : !hasFriend ? (
                    <div
                        style={{
                            backgroundColor: "white",
                            borderRadius: "16px",
                            padding: "40px 20px",
                            textAlign: "center",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                    >
                        <div
                            style={{
                                width: "80px",
                                height: "80px",
                                borderRadius: "50%",
                                backgroundColor: "#B8D4E8",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 20px",
                                fontSize: "40px",
                            }}
                        >
                            👥
                        </div>
                        <p
                            style={{
                                fontSize: "16px",
                                color: "#333",
                                fontWeight: "bold",
                                marginBottom: "8px",
                            }}
                        >
                            フレンドがいません
                        </p>
                        <p
                            style={{
                                fontSize: "14px",
                                color: "#666",
                                marginBottom: "24px",
                            }}
                        >
                            フレンドを追加すると、投稿が表示されます
                        </p>
                        <button
                            onClick={() =>
                                (window.location.href = "/add-friend")
                            }
                            style={{
                                padding: "12px 24px",
                                backgroundColor: "#B8D4E8",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                fontSize: "16px",
                                fontWeight: "bold",
                                cursor: "pointer",
                            }}
                        >
                            フレンドを追加
                        </button>
                    </div>
                ) : friendPosts.length === 0 ? (
                    <div
                        style={{
                            backgroundColor: "white",
                            borderRadius: "16px",
                            padding: "40px 20px",
                            textAlign: "center",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                    >
                        <p
                            style={{
                                fontSize: "16px",
                                color: "#666",
                                marginBottom: "8px",
                            }}
                        >
                            まだ投稿がありません
                        </p>
                        <p
                            style={{
                                fontSize: "14px",
                                color: "#999",
                            }}
                        >
                            フレンドの投稿を待ちましょう
                        </p>
                    </div>
                ) : (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "16px",
                        }}
                    >
                        {friendPosts.map((post) => (
                            <div key={post.id}>
                                <PostCard post={post} />
                                <div style={{ marginTop: "12px" }}>
                                    <ApprovalButton
                                        isApproved={hasApproved(post)}
                                        onClick={() => handleApproval(post.id)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

import React, { useState, useEffect } from "react";
import { Header } from "../components/common/Header";
import { Footer } from "../components/common/Footer";
import { PostCard } from "../components/post/PostCard";
import { authService } from "../services/authService";
import { postService } from "../services/postService";
import { Post } from "../types";
import { User } from "../types/user";

export const PostListPage: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        try {
            const userData = await authService.getCurrentUser();
            if (!userData) return;

            setCurrentUser(userData);

            // 自分の投稿を取得
            const userPosts = await postService.getMyPosts(userData.uid);
            
            // 投稿のユーザー情報を現在のプロフィール情報で上書き
            const updatedPosts = userPosts.map(post => ({
                ...post,
                username: userData.username,
                userProfileIcon: userData.profileIconUrl || userData.profileIcon
            }));
            
            setPosts(updatedPosts);
        } catch (error) {
            console.error("投稿の読み込みに失敗:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePost = async (postId: string) => {
        if (!currentUser) return;

        if (window.confirm("この投稿を削除しますか？")) {
            try {
                await postService.deletePost(postId, currentUser.uid);
                await loadPosts();
            } catch (error) {
                console.error("投稿の削除に失敗:", error);
                alert("投稿の削除に失敗しました");
            }
        }
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
            <Header title="投稿一覧" />

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
                ) : posts.length === 0 ? (
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
                            新しい投稿を作成してみましょう
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
                        {posts.map((post) => (
                            <PostCard
                                key={post.id}
                                post={post}
                                onDelete={() => handleDeletePost(post.id)}
                                showApprovalStatus={true}
                            />
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

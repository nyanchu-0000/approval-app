import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/common/Header";
import { Footer } from "../components/common/Footer";
import { Button } from "../components/common/Button";
import { authService } from "../services/authService";
import { userService } from "../services/userService";
import type { User } from "../types/user";

export const AddFriendPage: React.FC = () => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [friendUserId, setFriendUserId] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const userData = await authService.getCurrentUser();
            console.log("=== loadUserData ===");
            console.log("取得したユーザーデータ:", userData);
            console.log("friendRequestFrom:", userData?.friendRequestFrom);
            console.log("friendRequestTo:", userData?.friendRequestTo);
            console.log("friendId:", userData?.friendId);
            setCurrentUser(userData);
        } catch (error) {
            console.error("ユーザー情報の取得に失敗:", error);
        }
    };

    const handleAddFriend = async () => {
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            if (!friendUserId.trim()) {
                setError("フレンドIDを入力してください");
                return;
            }

            if (!currentUser) {
                setError("ユーザー情報が見つかりません");
                return;
            }

            if (friendUserId === currentUser.uid) {
                setError("自分自身を追加することはできません");
                return;
            }

            // すでにフレンドがいる場合
            if (currentUser.friendId) {
                setError("すでにフレンドが登録されています");
                return;
            }

            // 相手のユーザーを検索
            const friendUser = await userService.getUserById(friendUserId);

            if (!friendUser) {
                setError("指定されたIDのユーザーが見つかりません");
                return;
            }

            // 相手がすでに他のフレンドを持っている場合
            if (
                friendUser.friendId &&
                friendUser.friendId !== currentUser.uid
            ) {
                setError("このユーザーはすでに別のフレンドと繋がっています");
                return;
            }

            // デバッグログ
            console.log("=== フレンド追加デバッグ ===");
            console.log(
                "現在のユーザー:",
                currentUser.username,
                currentUser.uid,
            );
            console.log(
                "現在のユーザーのfriend_request_to:",
                currentUser.friendRequestTo,
            );
            console.log(
                "現在のユーザーのfriend_request_from:",
                currentUser.friendRequestFrom,
            );
            console.log("相手のユーザー:", friendUser.username, friendUser.uid);
            console.log("相手のfriend_request_to:", friendUser.friendRequestTo);
            console.log(
                "相手のfriend_request_from:",
                friendUser.friendRequestFrom,
            );

            // 相互リクエストをチェック
            const requestFromFriend =
                friendUser.friendRequestTo === currentUser.uid;
            const requestToFriend =
                currentUser.friendRequestTo === friendUserId;
            const friendHasMyRequest =
                friendUser.friendRequestFrom === currentUser.uid;

            console.log("相手が自分にリクエスト送信済み?", requestFromFriend);
            console.log("自分が相手にリクエスト送信済み?", requestToFriend);
            console.log(
                "相手が自分からのリクエストを受信?",
                friendHasMyRequest,
            );

            // 相手から自分にリクエストが来ている → フレンド成立
            // または、自分が相手にリクエストを送っていて、相手も自分にリクエストを送っている場合
            if (requestFromFriend || (requestToFriend && friendHasMyRequest)) {
                console.log("→ フレンド成立処理を実行");
                await userService.acceptFriendRequest(
                    currentUser.uid,
                    friendUserId,
                );
                setSuccess("フレンドが追加されました！");
                setTimeout(() => {
                    navigate("/profile");
                }, 1500);
            } else {
                // 新規リクエストを送信
                console.log("→ 新規リクエストを送信");
                await userService.sendFriendRequest(
                    currentUser.uid,
                    friendUserId,
                );
                setSuccess("フレンドリクエストを送信しました！");
                setTimeout(() => {
                    navigate("/profile");
                }, 1500);
            }
        } catch (error: any) {
            console.error("フレンド追加に失敗:", error);
            setError(error.message || "フレンド追加に失敗しました");
        } finally {
            setLoading(false);
        }
    };

    const handleCancelRequest = async () => {
        if (!currentUser || !currentUser.friendRequestTo) return;

        try {
            setLoading(true);
            await userService.cancelFriendRequest(
                currentUser.uid,
                currentUser.friendRequestTo,
            );
            await loadUserData();
            setSuccess("リクエストをキャンセルしました");
        } catch (error) {
            console.error("リクエストのキャンセルに失敗:", error);
            setError("リクエストのキャンセルに失敗しました");
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptRequest = async () => {
        if (!currentUser || !currentUser.friendRequestFrom) return;

        try {
            setLoading(true);
            await userService.acceptFriendRequest(
                currentUser.uid,
                currentUser.friendRequestFrom,
            );
            setSuccess("フレンドリクエストを承認しました！");
            setTimeout(() => {
                navigate("/profile");
            }, 1500);
        } catch (error) {
            console.error("リクエストの承認に失敗:", error);
            setError("リクエストの承認に失敗しました");
        } finally {
            setLoading(false);
        }
    };

    const handleRejectRequest = async () => {
        if (!currentUser || !currentUser.friendRequestFrom) return;

        try {
            setLoading(true);
            await userService.cancelFriendRequest(
                currentUser.uid,
                currentUser.friendRequestFrom,
            );
            await loadUserData();
            setSuccess("リクエストを拒否しました");
        } catch (error) {
            console.error("リクエストの拒否に失敗:", error);
            setError("リクエストの拒否に失敗しました");
        } finally {
            setLoading(false);
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
            <Header title="フレンド追加" />

            <div
                style={{
                    padding: "20px",
                    maxWidth: "500px",
                    margin: "0 auto",
                }}
            >
                {/* リクエスト受信通知 */}
                {currentUser?.friendRequestFrom && (
                    <div
                        style={{
                            backgroundColor: "#fff3cd",
                            borderRadius: "12px",
                            padding: "16px",
                            marginBottom: "20px",
                            border: "1px solid #ffc107",
                        }}
                    >
                        <p
                            style={{
                                fontSize: "14px",
                                fontWeight: "bold",
                                color: "#856404",
                                marginBottom: "12px",
                            }}
                        >
                            フレンドリクエストが届いています
                        </p>
                        <div
                            style={{
                                display: "flex",
                                gap: "8px",
                            }}
                        >
                            <Button
                                onClick={handleAcceptRequest}
                                disabled={loading}
                                variant="primary"
                                style={{ flex: 1, fontSize: "14px" }}
                            >
                                承認
                            </Button>
                            <Button
                                onClick={handleRejectRequest}
                                disabled={loading}
                                variant="secondary"
                                style={{ flex: 1, fontSize: "14px" }}
                            >
                                拒否
                            </Button>
                        </div>
                    </div>
                )}

                {/* リクエスト送信済み通知 */}
                {currentUser?.friendRequestTo && (
                    <div
                        style={{
                            backgroundColor: "#d1ecf1",
                            borderRadius: "12px",
                            padding: "16px",
                            marginBottom: "20px",
                            border: "1px solid #bee5eb",
                        }}
                    >
                        <p
                            style={{
                                fontSize: "14px",
                                fontWeight: "bold",
                                color: "#0c5460",
                                marginBottom: "12px",
                            }}
                        >
                            フレンドリクエスト送信済み
                        </p>
                        <Button
                            onClick={handleCancelRequest}
                            disabled={loading}
                            variant="secondary"
                            style={{ width: "100%", fontSize: "14px" }}
                        >
                            リクエストをキャンセル
                        </Button>
                    </div>
                )}

                {/* フレンド追加フォーム */}
                <div
                    style={{
                        backgroundColor: "white",
                        borderRadius: "16px",
                        padding: "24px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                >
                    <h2
                        style={{
                            fontSize: "20px",
                            fontWeight: "bold",
                            color: "#333",
                            marginBottom: "16px",
                        }}
                    >
                        フレンドIDを入力
                    </h2>

                    <p
                        style={{
                            fontSize: "14px",
                            color: "#666",
                            marginBottom: "16px",
                            lineHeight: "1.6",
                        }}
                    >
                        フレンドのユーザーIDを入力してください。相手もあなたのIDを入力すると、フレンドとして繋がります。
                    </p>

                    <input
                        type="text"
                        value={friendUserId}
                        onChange={(e) => setFriendUserId(e.target.value)}
                        placeholder="ユーザーIDを入力"
                        disabled={loading || !!currentUser?.friendRequestTo}
                        style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "8px",
                            border: "1px solid #ddd",
                            fontSize: "16px",
                            marginBottom: "16px",
                            fontFamily: "monospace",
                            boxSizing: "border-box",
                        }}
                    />

                    {error && (
                        <div
                            style={{
                                padding: "12px",
                                backgroundColor: "#fee",
                                borderRadius: "8px",
                                marginBottom: "16px",
                                fontSize: "14px",
                                color: "#c33",
                            }}
                        >
                            {error}
                        </div>
                    )}

                    {success && (
                        <div
                            style={{
                                padding: "12px",
                                backgroundColor: "#d4edda",
                                borderRadius: "8px",
                                marginBottom: "16px",
                                fontSize: "14px",
                                color: "#155724",
                            }}
                        >
                            {success}
                        </div>
                    )}

                    <Button
                        onClick={handleAddFriend}
                        disabled={loading || !!currentUser?.friendRequestTo}
                        variant="primary"
                        style={{ width: "100%" }}
                    >
                        {loading ? "処理中..." : "フレンドを追加"}
                    </Button>
                </div>

                {/* あなたのID表示 */}
                {currentUser && (
                    <div
                        style={{
                            backgroundColor: "white",
                            borderRadius: "16px",
                            padding: "24px",
                            marginTop: "20px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                    >
                        <h3
                            style={{
                                fontSize: "16px",
                                fontWeight: "bold",
                                color: "#333",
                                marginBottom: "12px",
                            }}
                        >
                            あなたのID
                        </h3>
                        <p
                            style={{
                                fontSize: "14px",
                                color: "#666",
                                marginBottom: "12px",
                            }}
                        >
                            このIDを相手に伝えてください
                        </p>
                        <div
                            style={{
                                backgroundColor: "#f5f5f5",
                                borderRadius: "8px",
                                padding: "12px",
                                fontFamily: "monospace",
                                fontSize: "14px",
                                color: "#333",
                                wordBreak: "break-all",
                            }}
                        >
                            {currentUser.uid}
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

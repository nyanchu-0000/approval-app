import React, { useState } from "react";
import { ApprovalAnimation } from "./ApprovalAnimation";

interface ApprovalButtonProps {
    isApproved: boolean;
    onClick: () => void;
    disabled?: boolean;
}

export const ApprovalButton: React.FC<ApprovalButtonProps> = ({
    isApproved,
    onClick,
    disabled = false,
}) => {
    const [showAnimation, setShowAnimation] = useState(false);

    const handleClick = async () => {
        if (disabled || isApproved) return;

        console.log("承認ボタンクリック - アニメーション開始");
        setShowAnimation(true);

        try {
            await onClick();
        } catch (error) {
            console.error("承認処理エラー:", error);
        }

        setTimeout(() => {
            console.log("アニメーション終了");
            setShowAnimation(false);
        }, 1500);
    };

    return (
        <div style={{ position: "relative" }}>
            <button
                onClick={handleClick}
                disabled={disabled || isApproved}
                style={{
                    width: "100%",
                    padding: "16px",
                    backgroundColor: isApproved ? "#4a9d8f" : "#B8D4E8",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    fontSize: "18px",
                    fontWeight: "bold",
                    cursor: disabled || isApproved ? "not-allowed" : "pointer",
                    opacity: disabled || isApproved ? 0.6 : 1,
                    transition: "all 0.3s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                }}
            >
                {isApproved ? (
                    <>
                        <span style={{ fontSize: "24px" }}>✓</span>
                        承認済み
                    </>
                ) : (
                    "承認する"
                )}
            </button>

            {showAnimation && <ApprovalAnimation />}
        </div>
    );
};

import React from "react";

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
    return (
        <button
            onClick={onClick}
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
    );
};

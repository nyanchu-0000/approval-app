import { Player } from "@lottiefiles/react-lottie-player";
import animationData from "../../assets/approval-animation.json";

export const ApprovalAnimation: React.FC = () => {
    console.log("ApprovalAnimationコンポーネントがレンダリングされました");

    return (
        <div
            style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "200px",
                height: "200px",
                pointerEvents: "none",
                zIndex: 1000,
                backgroundColor: "rgba(0, 0, 0, 0.1)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Player
                speed={1.5}
                src={animationData}
                autoplay={true}
                loop={false}
                style={{ width: "150px", height: "150px" }}
            />
        </div>
    );
};

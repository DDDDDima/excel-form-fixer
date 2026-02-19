import React from "react";

export const BackgroundBlobs = () => {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            {/* Group 1: 0-100% */}
            <div className="absolute top-[5%] left-[5%] w-[30%] h-[30%] bg-primary/40 rounded-full blur-[80px] animate-blob" />
            <div className="absolute top-[15%] right-[5%] w-[25%] h-[25%] bg-blue-500/30 rounded-full blur-[80px] animate-blob [animation-delay:2s]" />
            <div className="absolute top-[40%] left-[25%] w-[35%] h-[35%] bg-purple-600/30 rounded-full blur-[80px] animate-blob [animation-delay:4s]" />
            <div className="absolute top-[70%] right-[15%] w-[20%] h-[20%] bg-pink-500/30 rounded-full blur-[80px] animate-blob [animation-delay:6s]" />

            {/* Group 2: 100-200% */}
            <div className="absolute top-[110%] left-[15%] w-[25%] h-[25%] bg-blue-400/30 rounded-full blur-[80px] animate-blob [animation-delay:1s]" />
            <div className="absolute top-[140%] right-[20%] w-[30%] h-[30%] bg-primary/30 rounded-full blur-[80px] animate-blob [animation-delay:3s]" />
            <div className="absolute top-[175%] left-[5%] w-[20%] h-[20%] bg-purple-500/30 rounded-full blur-[80px] animate-blob [animation-delay:5s]" />

            {/* Group 3: 200-300% */}
            <div className="absolute top-[220%] right-[10%] w-[25%] h-[25%] bg-pink-400/30 rounded-full blur-[80px] animate-blob [animation-delay:7s]" />
            <div className="absolute top-[250%] left-[10%] w-[35%] h-[35%] bg-blue-600/30 rounded-full blur-[80px] animate-blob [animation-delay:2s]" />
            <div className="absolute top-[280%] right-[25%] w-[20%] h-[20%] bg-primary/40 rounded-full blur-[80px] animate-blob [animation-delay:4s]" />

            {/* Group 4: 300-400% */}
            <div className="absolute top-[330%] left-[20%] w-[25%] h-[25%] bg-purple-400/30 rounded-full blur-[80px] animate-blob" />
            <div className="absolute top-[370%] right-[5%] w-[30%] h-[30%] bg-blue-500/30 rounded-full blur-[80px] animate-blob [animation-delay:1s]" />
        </div>
    );
};

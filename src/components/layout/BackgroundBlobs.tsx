import React from "react";

export const BackgroundBlobs = () => {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-blob" />
            <div className="absolute top-[20%] right-[-5%] w-[35%] h-[35%] bg-blue-500/20 rounded-full blur-[120px] animate-blob [animation-delay:2s]" />
            <div className="absolute bottom-[-10%] left-[10%] w-[45%] h-[45%] bg-purple-500/20 rounded-full blur-[120px] animate-blob [animation-delay:4s]" />
            <div className="absolute bottom-[20%] right-[15%] w-[30%] h-[30%] bg-pink-500/20 rounded-full blur-[120px] animate-blob [animation-delay:6s]" />
        </div>
    );
};

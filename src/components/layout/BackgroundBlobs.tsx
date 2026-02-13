import React from "react";

export const BackgroundBlobs = () => {
    return (
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none min-h-[200vh]">
            <div className="absolute top-[5%] left-[-10%] w-[50%] h-[50%] bg-primary/30 rounded-full blur-[140px] animate-blob" />
            <div className="absolute top-[15%] right-[-15%] w-[45%] h-[45%] bg-blue-500/20 rounded-full blur-[140px] animate-blob [animation-delay:2s]" />
            <div className="absolute top-[40%] left-[20%] w-[55%] h-[55%] bg-purple-600/20 rounded-full blur-[140px] animate-blob [animation-delay:4s]" />
            <div className="absolute top-[70%] right-[10%] w-[40%] h-[40%] bg-pink-500/20 rounded-full blur-[140px] animate-blob [animation-delay:6s]" />
        </div>
    );
};

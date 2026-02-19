import React, { useEffect, useState } from "react";

interface ParallaxBackgroundProps {
    imageUrl: string | null;
}

export const ParallaxBackground: React.FC<ParallaxBackgroundProps> = ({ imageUrl }) => {
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const docHeight = document.documentElement.scrollHeight;
            const winHeight = window.innerHeight;
            const scrollable = docHeight - winHeight;

            if (scrollable <= 0) {
                setOffset(0);
                return;
            }

            // At most, background moves 15% of viewport height
            // or we can use a more robust calculation:
            // Let's stick to a simple factor but ensure height is sufficient
            setOffset(scrollY * 0.2);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        // Initial call
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (!imageUrl) return null;

    return (
        <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
            <div
                className="absolute inset-0 w-full h-[150vh]"
                style={{
                    backgroundImage: `url(${imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center top",
                    transform: `translateY(${-offset}px)`,
                    willChange: "transform"
                }}
            >
                {/* Overlay to ensure readability */}
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px]" />
            </div>
        </div>
    );
};

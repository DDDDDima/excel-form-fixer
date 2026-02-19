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

            // Calculate scroll percentage (0 to 1)
            const scrollPercent = Math.min(Math.max(scrollY / scrollable, 0), 1);

            // Background height is 150vh, Viewport is 100vh.
            // Extra height = 50vh.
            // We want to move the background up by 50vh as we scroll to the bottom.
            const extraHeight = winHeight * 0.5;
            setOffset(scrollPercent * extraHeight);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleScroll);

        // Initial call
        handleScroll();
        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
        };
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

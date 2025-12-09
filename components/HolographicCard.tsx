import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface HolographicCardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export const HolographicCard: React.FC<HolographicCardProps> = ({ children, className = '', onClick }) => {
    const ref = useRef<HTMLDivElement>(null);

    // Mouse position state
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth spring physics for tilt
    const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
    const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

    const [hovered, setHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseXVal = e.clientX - rect.left;
        const mouseYVal = e.clientY - rect.top;

        // Calculate rotation (max 15 degrees)
        const xPct = mouseXVal / width - 0.5;
        const yPct = mouseYVal / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        setHovered(false);
        x.set(0);
        y.set(0);
    };

    // Transform values
    const rotateX = useTransform(mouseY, [-0.5, 0.5], [10, -10]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], [-10, 10]);
    const glareX = useTransform(mouseX, [-0.5, 0.5], [0, 100]);
    const glareY = useTransform(mouseY, [-0.5, 0.5], [0, 100]);

    return (
        <motion.div
            ref={ref}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            className={`relative group perspective-1000 ${className}`}
        >
            {/* 1. Content Container */}
            <div className="relative z-10 w-full h-full bg-brand-black border border-white/5 overflow-hidden transition-colors duration-500 group-hover:border-brand-gold/50">
                {children}
            </div>

            {/* 2. Holographic Glare Overlay */}
            <motion.div
                style={{
                    opacity: hovered ? 1 : 0,
                    background: `
                        radial-gradient(
                            farthest-corner at ${glareX}% ${glareY}%,
                            rgba(255, 255, 255, 0.15) 0%,
                            rgba(200, 169, 126, 0.1) 40%, 
                            transparent 100%
                        )
                    `
                }}
                className="absolute inset-0 z-20 pointer-events-none mix-blend-overlay transition-opacity duration-300"
            />

            {/* 3. Deep Shadow (Elevated Effect) */}
            <motion.div
                style={{
                    opacity: hovered ? 0.6 : 0,
                    transform: 'translateZ(-20px)'
                }}
                className="absolute inset-4 bg-brand-gold/20 blur-[30px] -z-10 transition-opacity duration-500"
            />
        </motion.div>
    );
};

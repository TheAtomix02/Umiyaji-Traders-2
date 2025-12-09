import React from 'react';
import { motion } from 'framer-motion';

interface SplitTextProps {
    children: string;
    className?: string;
    delay?: number;
}

export const SplitText: React.FC<SplitTextProps> = ({ children, className = '', delay = 0 }) => {
    const words = children.split(' ');

    return (
        <div className={`overflow-hidden ${className}`}>
            {words.map((word, i) => (
                <span key={i} className="inline-block overflow-hidden mr-[0.2em] relative align-top">
                    <motion.span
                        initial={{ y: "100%", rotate: 5 }}
                        whileInView={{ y: 0, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{
                            duration: 0.8,
                            ease: [0.16, 1, 0.3, 1], // Cinematic easing
                            delay: delay + i * 0.03, // Stagger words
                        }}
                        className="inline-block"
                    >
                        {word}
                    </motion.span>
                </span>
            ))}
        </div>
    );
};

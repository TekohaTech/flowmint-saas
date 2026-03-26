import React from 'react';
import { motion } from 'framer-motion';

export const Logo = ({ size = 40, showText = true }) => (
    <div className="d-flex align-items-center gap-2">
        <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            style={{ width: size, height: size, position: 'relative' }}
        >
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="var(--neon-cyan)" />
                        <stop offset="100%" stopColor="var(--neon-green)" />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                <path 
                    d="M50 10 C 20 40, 20 70, 50 90 C 80 70, 80 40, 50 10 Z" 
                    fill="url(#logo-grad)" 
                    fillOpacity="0.2"
                    stroke="url(#logo-grad)"
                    strokeWidth="4"
                    filter="url(#glow)"
                />
                <path 
                    d="M35 45 Q 50 30, 65 45 Q 50 60, 35 45 Z" 
                    fill="var(--neon-cyan)"
                    filter="url(#glow)"
                />
                <circle cx="50" cy="70" r="5" fill="var(--neon-green)" filter="url(#glow)" />
            </svg>
        </motion.div>
        {showText && (
            <span className="fs-4 fw-bold text-white tracking-tighter" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                FLOW<span style={{ color: 'var(--neon-cyan)' }}>MINT</span>
            </span>
        )}
    </div>
);

export const HeroIllustration = () => (
    <div className="position-relative" style={{ width: '100%', maxWidth: '600px', margin: '0 auto', aspectRatio: '16/9' }}>
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
        >
            <svg viewBox="0 0 800 450" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="100" y="50" width="600" height="350" rx="20" fill="#1a1a2e" stroke="var(--neon-cyan)" strokeWidth="2" strokeOpacity="0.3" />
                <rect x="120" y="70" width="150" height="310" rx="10" fill="rgba(0, 243, 255, 0.05)" />
                <rect x="290" y="70" width="390" height="80" rx="10" fill="rgba(22, 242, 179, 0.05)" />
                {[290, 425, 560].map((x, i) => (
                    <rect key={i} x={x} y="170" width="120" height="120" rx="10" fill="rgba(139, 92, 246, 0.05)" />
                ))}
            </svg>
        </motion.div>
    </div>
);

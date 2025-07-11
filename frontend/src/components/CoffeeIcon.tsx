
import React from 'react';

interface CoffeeIconProps {
    size?: number;
    className?: string;
    showSteam?: boolean;
}

const CoffeeIcon = ({ size = 120, className = "", showSteam = true }: CoffeeIconProps) => {
    return (
        <div className={`relative ${className}`} style={{ width: size, height: size }}>
            <svg
                width={size}
                height={size}
                viewBox="0 0 120 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-lg"
            >
                {/* Coffee Cup Body */}
                <path
                    d="M25 45 L25 90 Q25 100 35 100 L75 100 Q85 100 85 90 L85 45 Z"
                    fill="url(#coffeeGradient)"
                    stroke="hsl(25, 60%, 35%)"
                    strokeWidth="2"
                />

                {/* Coffee Surface */}
                <ellipse
                    cx="55"
                    cy="47"
                    rx="28"
                    ry="4"
                    fill="hsl(20, 50%, 25%)"
                />

                {/* Cup Handle */}
                <path
                    d="M85 60 Q100 60 100 75 Q100 90 85 90"
                    fill="none"
                    stroke="hsl(25, 60%, 35%)"
                    strokeWidth="3"
                    strokeLinecap="round"
                />

                {/* Saucer */}
                <ellipse
                    cx="55"
                    cy="105"
                    rx="40"
                    ry="8"
                    fill="url(#saucerGradient)"
                    stroke="hsl(25, 40%, 45%)"
                    strokeWidth="1"
                />

                {/* Coffee Foam/Cream */}
                <ellipse
                    cx="55"
                    cy="47"
                    rx="22"
                    ry="3"
                    fill="hsl(40, 30%, 85%)"
                    opacity="0.8"
                />

                {/* Gradients */}
                <defs>
                    <radialGradient id="coffeeGradient" cx="0.3" cy="0.3">
                        <stop offset="0%" stopColor="hsl(30, 50%, 60%)" />
                        <stop offset="70%" stopColor="hsl(25, 60%, 45%)" />
                        <stop offset="100%" stopColor="hsl(20, 50%, 35%)" />
                    </radialGradient>

                    <linearGradient id="saucerGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(30, 40%, 70%)" />
                        <stop offset="100%" stopColor="hsl(25, 50%, 55%)" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Steam Animation */}
            {showSteam && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="coffee-steam absolute w-1 h-8 bg-gradient-to-t from-transparent via-gray-300 to-transparent rounded-full opacity-60"
                            style={{
                                left: `${(i - 1) * 8}px`,
                                animationDelay: `${i * 0.5}s`
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CoffeeIcon;

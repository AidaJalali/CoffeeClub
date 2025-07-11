
import React from 'react';

const CoffeeBackground = () => {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden">
            {/* Main gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-coffee-cream via-accent to-coffee-light" />

            {/* Coffee beans scattered pattern */}
            <div className="absolute inset-0 opacity-5">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-3 h-5 bg-coffee-espresso rounded-full rotate-12"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            transform: `rotate(${Math.random() * 360}deg)`,
                            animationDelay: `${Math.random() * 5}s`
                        }}
                    />
                ))}
            </div>

            {/* Floating geometric shapes */}
            <div className="absolute inset-0 opacity-10">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-20 h-20 border border-coffee-brown/20 rounded-full float-animation"
                        style={{
                            left: `${10 + (i * 20)}%`,
                            top: `${20 + (i * 15)}%`,
                            animationDelay: `${i * 1.2}s`
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default CoffeeBackground;

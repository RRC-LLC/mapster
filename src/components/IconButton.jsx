'use client'
import React, { useState } from 'react';

export default function IconButton({ 
    onClick, 
    children, 
    tooltip, 
    className = "dark-wood-small hover:brightness-110 transition-brightness duration-100 ease h-8 w-8 font-pg flex shadow-inner-button justify-center items-center rounded text-base text-trail-yellow",
    ...props 
}) {
    const [showTooltip, setShowTooltip] = useState(false);

    const handleMouseEnter = () => {
        if (window.matchMedia('(hover: hover)').matches) {
            setShowTooltip(true);
        }
    };

    const handleMouseLeave = () => {
        setShowTooltip(false);
    };

    if (tooltip) {
        return (
            <div className="relative">
                <button 
                    className={className}
                    onClick={onClick}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onFocus={handleMouseEnter}
                    onBlur={handleMouseLeave}
                    {...props}
                >
                    {children}
                </button>
                {showTooltip && (
                    <div className="font-serif absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-1 bg-dark-blue text-white text-xs rounded shadow-lg z-[7000] whitespace-nowrap">
                        {tooltip}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-dark-blue"></div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <button 
            className={className}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    );
}

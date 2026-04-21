import React from 'react';

export const GradientBar = ({
                         greenPercent = 60,     // ← Porcentaje de verde (0 a 100)
                         height = 7,
                         className = ''
                     }) => {
    // Validación básica para que no se rompa
    const percent = Math.max(0, Math.min(100, greenPercent));

    return (
        <div
            className={`w-full rounded-md overflow-hidden ${className} px-5`}
            style={{
                height: typeof height === 'number' ? `${height}px` : height,
            }}
        >
            <div
                className="h-full w-full"
                style={{
                    background: `linear-gradient(to right, #22c55e ${percent}%, #ef4444 ${percent}%)`,
                }}
            />
        </div>
    );
};

import React, { useEffect, useState } from 'react';

const Loader = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const handleLoad = () => {
            setIsLoading(false);
        };
        window.addEventListener('load', handleLoad);
        return () => {
            window.removeEventListener('load', handleLoad);
        };
    }, []);

    if (!isLoading) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'white',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999,
            }}
        >
            <div style={{ position: 'relative', width: '200px', height: '200px' }}>
                {/* Неразукрашенный логотип (контур) */}
                <img
                    src="/vector2.svg"
                    alt="logo outline"
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2 }}
                />
                {/* Цветной логотип с маской для эффекта заполнения */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        clipPath: 'inset(100% 0 0 0)', // Изначально обрезаем всё изображение снизу
                        animation: 'fill-up 3s forwards',
                        zIndex: 2,
                    }}
                >
                    <img
                        src="/vector.svg"
                        alt="logo colored"
                        style={{ width: '100%', height: '100%' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Loader;
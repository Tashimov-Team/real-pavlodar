// components/Layout.tsx
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

// Хук для отслеживания текущей ширины окна
function useWindowWidth() {
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return width;
}

const Layout: React.FC = () => {
    const { pathname } = useLocation();
    const windowWidth = useWindowWidth();

    // Определяем, мобильное ли устройство (брейкпоинт md = 768px)
    const isMobile = windowWidth < 768;

    // Если мы на странице /swipe и это Mobile — прячем Header/Footer
    const hideNavOnSwipeMobile = pathname === '/swipe' && isMobile;

    return (
        <>
            {/* Шапка: показываем, только если не на /swipe на мобильном */}
            {!hideNavOnSwipeMobile && <Header />}

            <main
                className={
                    hideNavOnSwipeMobile
                        ? 'h-screen w-screen'           // на /swipe mobile — контент на весь экран
                        : 'min-h-[calc(100vh-5rem)]'     // иначе — учёт под header/footer (пример: 5rem)
                }
            >
                <Outlet />
            </main>

            {/* Подвал: показываем, только если не на /swipe на мобильном */}
            {!hideNavOnSwipeMobile && <Footer />}
        </>
    );
};

export default Layout;

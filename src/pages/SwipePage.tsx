// pages/SwipePage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProperties } from '../context/PropertiesContext';
import Loader from '../components/Loader';
import {
    HeartIcon as HeartOutline,
    ShareIcon,
    ChevronUpIcon,
    ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import {
    motion,
    AnimatePresence,
    PanInfo,
    useAnimation,
} from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import { Property } from '../types';

function useWindowWidth() {
    const [width, setWidth] = useState(window.innerWidth);
    useEffect(() => {
        const onResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);
    return width;
}

// Анимации с эффектом "прилипания" как в TikTok
const imageVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 300 : -300,
        opacity: 0,
        scale: 0.95
    }),
    center: {
        x: 0,
        opacity: 1,
        scale: 1
    },
    exit: (direction: number) => ({
        x: direction > 0 ? -300 : 300,
        opacity: 0,
        scale: 0.95
    })
};

const cardVariants = {
    enter: (direction: number) => ({
        y: direction > 0 ? '100%' : '-100%',
        opacity: 0,
        scale: 0.95
    }),
    center: {
        y: '0%',
        opacity: 1,
        scale: 1
    },
    exit: (direction: number) => ({
        y: direction > 0 ? '-100%' : '100%',
        opacity: 0,
        scale: 0.95
    })
};

const SwipePage: React.FC = () => {
    const navigate = useNavigate();
    const { filteredProperties, isPending, favoriteProperties, toggleFavorite } = useProperties();
    const properties = filteredProperties;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imgDirection, setImgDirection] = useState(0);

    // Сбрасываем индекс фото при смене объекта
    useEffect(() => {
        setCurrentImageIndex(0);
    }, [currentIndex]);

    const width = useWindowWidth();
    const isMobile = width < 768;

    if (isPending) {
        return <Loader />;
    }

    if (properties.length === 0) {
        return (
            <div className="flex items-center justify-center h-screen w-screen bg-gray-100">
                <p className="text-xl text-gray-600">Нет доступных объектов</p>
            </div>
        );
    }

    const property = properties[currentIndex];
    if (!property) return null;

    // Заявка и шаринг
    const handleRequest = () => {
        alert(`Заявка на объект "${property.title}"`);
    };

    const handleShare = () => {
        const shareData = {
            title: property.title,
            text: `Смотрите квартиру: ${property.title} за ₸ ${property.price.toLocaleString()}`,
            url: window.location.origin + `/property/${property.id}`,
        };

        if (navigator.share) {
            navigator.share(shareData).catch((err) => console.error(err));
        } else {
            navigator.clipboard
                .writeText(shareData.url)
                .then(() => alert('Ссылка скопирована'))
                .catch(() => alert('Не удалось скопировать ссылку'));
        }
    };

    // ---------------------- DESKTOP-ВЕРСИЯ ----------------------
    if (!isMobile) {
        const [cardDirection, setCardDirection] = useState(0);

        const goNextProperty = () => {
            if (currentIndex < properties.length - 1) {
                setCardDirection(1);
                setCurrentIndex((i) => i + 1);
            }
        };

        const goPrevProperty = () => {
            if (currentIndex > 0) {
                setCardDirection(-1);
                setCurrentIndex((i) => i - 1);
            }
        };

        const handlers = useSwipeable({
            onSwipedUp: goNextProperty,
            onSwipedDown: goPrevProperty,
            onSwipedLeft: () => {
                if (currentImageIndex < property.images.length - 1) {
                    setImgDirection(1);
                    setCurrentImageIndex((i) => i + 1);
                }
            },
            onSwipedRight: () => {
                if (currentImageIndex > 0) {
                    setImgDirection(-1);
                    setCurrentImageIndex((i) => i - 1);
                }
            },
            trackMouse: true,
            preventDefaultTouchmoveEvent: true
        });

        const handleImageDragEnd = (_: any, info: PanInfo) => {
            const { offset, velocity } = info;
            const SWIPE_OFFSET = 100;
            const SWIPE_VELOCITY = 500;

            if (offset.x < -SWIPE_OFFSET || velocity.x < -SWIPE_VELOCITY) {
                if (currentImageIndex < property.images.length - 1) {
                    setImgDirection(1);
                    setCurrentImageIndex((i) => i + 1);
                }
            } else if (offset.x > SWIPE_OFFSET || velocity.x > SWIPE_VELOCITY) {
                if (currentImageIndex > 0) {
                    setImgDirection(-1);
                    setCurrentImageIndex((i) => i - 1);
                }
            }
        };

        return (
            <div className="h-screen w-screen bg-gray-100 flex items-center justify-center overflow-hidden">
                <div
                    className="relative w-full max-w-[425px] aspect-[9/16] bg-black rounded-xl overflow-hidden shadow-lg"
                    {...handlers}
                >
                    <AnimatePresence
                        initial={false}
                        exitBeforeEnter
                        custom={cardDirection}
                    >
                        <motion.div
                            key={property.id}
                            custom={cardDirection}
                            variants={cardVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                duration: 0.4,
                                ease: [0.33, 1, 0.68, 1]
                            }}
                            className="absolute inset-0 w-full h-full flex flex-col"
                        >
                            <div className="relative flex-1">
                                <AnimatePresence
                                    initial={false}
                                    exitBeforeEnter
                                    custom={imgDirection}
                                >
                                    <motion.img
                                        key={currentImageIndex}
                                        src={property.images[currentImageIndex]}
                                        alt={property.title}
                                        className="absolute inset-0 w-full h-full object-cover"
                                        variants={imageVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={{
                                            duration: 0.3,
                                            ease: [0.33, 1, 0.68, 1]
                                        }}
                                        drag="x"
                                        dragConstraints={{ left: 0, right: 0 }}
                                        dragElastic={0.3}
                                        onDragEnd={handleImageDragEnd}
                                    />
                                </AnimatePresence>

                                <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-between p-4">
                                    <div className="flex justify-end space-x-2">
                                        <button
                                            onClick={() => toggleFavorite(property.id)}
                                            className="p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition"
                                        >
                                            {favoriteProperties.includes(property.id) ? (
                                                <HeartSolid className="w-6 h-6 text-red-600" />
                                            ) : (
                                                <HeartOutline className="w-6 h-6 text-gray-800" />
                                            )}
                                        </button>
                                        <button
                                            onClick={handleShare}
                                            className="p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition"
                                        >
                                            <ShareIcon className="w-6 h-6 text-gray-800" />
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="bg-white bg-opacity-90 p-3 rounded-lg">
                                            <h2 className="text-xl font-semibold text-gray-800">
                                                {property.title}
                                            </h2>
                                            <p className="text-lg text-gray-700">
                                                ₸ {property.price.toLocaleString()}
                                            </p>
                                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                {property.description}
                                            </p>
                                            <div className="mt-2 flex space-x-2">
                                                <button
                                                    onClick={handleRequest}
                                                    className="flex-1 text-center bg-[#0E54CE] text-white px-2 py-1 rounded hover:bg-[#0E54CE] transition text-sm"
                                                >
                                                    Оставить заявку
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex justify-center space-x-1">
                                            {property.images.map((_, idx) => (
                                                <span
                                                    key={idx}
                                                    className={`w-2 h-2 rounded-full ${
                                                        idx === currentImageIndex
                                                            ? 'bg-white'
                                                            : 'bg-white bg-opacity-50'
                                                    }`}
                                                />
                                            ))}
                                        </div>

                                        <div className="text-center text-white text-sm">
                                            {currentIndex + 1} / {properties.length}
                                        </div>
                                        <div className="text-center text-white text-xs">
                                            Свайп вверх/вниз или стрелки ↑↓ для смены объекта
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    <div className="hidden md:flex flex-col items-center justify-between absolute inset-0 pointer-events-none">
                        <button
                            onClick={goPrevProperty}
                            disabled={currentIndex === 0}
                            className={`mb-4 p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition pointer-events-auto ${
                                currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            <ChevronUpIcon className="w-6 h-6 text-gray-800" />
                        </button>
                        <button
                            onClick={goNextProperty}
                            disabled={currentIndex === properties.length - 1}
                            className={`mt-4 p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition pointer-events-auto ${
                                currentIndex === properties.length - 1
                                    ? 'opacity-50 cursor-not-allowed'
                                    : ''
                            }`}
                        >
                            <ChevronDownIcon className="w-6 h-6 text-gray-800" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ---------------------- MOBILE-ВЕРСИЯ (УЛУЧШЕННАЯ) ----------------------
    const SWIPE_THRESHOLD = 150; // Увеличенный порог для точного свайпа
    const SWIPE_VELOCITY = 800; // Увеличенная скорость для четкого свайпа
    const controls = useAnimation();
    const [offsetY, setOffsetY] = useState(0);
    const [dragging, setDragging] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false); // Флаг анимации


    const handleImageDragEndMobile = (_: any, info: PanInfo) => {
        const { offset, velocity } = info;
        if (offset.x < -SWIPE_THRESHOLD || velocity.x < -SWIPE_VELOCITY) {
            if (currentImageIndex < property.images.length - 1) {
                setImgDirection(1); // ✅ Теперь доступно
                setCurrentImageIndex((i) => i + 1);
            }
        } else if (offset.x > SWIPE_THRESHOLD || velocity.x > SWIPE_VELOCITY) {
            if (currentImageIndex > 0) {
                setImgDirection(-1); // ✅ Теперь доступно
                setCurrentImageIndex((i) => i - 1);
            }
        }
    };

    const nextProperty = useCallback(() => {
        if (!isAnimating && currentIndex < properties.length - 1) {
            setIsAnimating(true);
            setCurrentIndex((i) => i + 1);
        }
    }, [currentIndex, properties.length, isAnimating]);

    const prevProperty = useCallback(() => {
        if (!isAnimating && currentIndex > 0) {
            setIsAnimating(true);
            setCurrentIndex((i) => i - 1);
        }
    }, [currentIndex, isAnimating]);

    const handleCardDrag = (_: any, info: PanInfo) => {
        const currentY = info.point.y;
        const startY = info.start ? info.start.y : 0;
        const newOffset = currentY - startY;
        setDragging(true);
        setOffsetY(newOffset);
    };

    const handleCardDragEnd = (_: any, info: PanInfo) => {
        const { offset, velocity } = info;

        if (Math.abs(offset.y) > SWIPE_THRESHOLD || Math.abs(velocity.y) > SWIPE_VELOCITY) {
            if (offset.y < 0) {
                // Свайп вверх
                controls.start({
                    y: -window.innerHeight,
                    transition: {
                        duration: 0.5,
                        ease: [0.33, 1, 0.68, 1]
                    }
                }).then(() => {
                    setCurrentIndex(i => Math.min(i + 1, properties.length - 1));
                    controls.start({ y: 0 });
                }).finally(() => setIsAnimating(false));
            } else {
                // Свайп вниз
                controls.start({
                    y: window.innerHeight,
                    transition: {
                        duration: 0.5,
                        ease: [0.33, 1, 0.68, 1]
                    }
                }).then(() => {
                    setCurrentIndex(i => Math.max(i - 1, 0));
                    controls.start({ y: 0 });
                }).finally(() => setIsAnimating(false));
            }
        } else {
            controls.start({
                y: 0,
                transition: {
                    type: 'spring',
                    stiffness: 300,
                    damping: 25
                }
            }).finally(() => {
                setDragging(false);
                setIsAnimating(false);
            });
        }
        setOffsetY(0);
    };

    const NextCard: React.FC = () => {
        const next = properties[currentIndex + 1];
        if (!next) return null;

        return (
            <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{
                    duration: 0.5,
                    ease: [0.33, 1, 0.68, 1]
                }}
                className="absolute inset-0"
            >
                <img
                    src={next.images[0]}
                    alt={next.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40" />
            </motion.div>
        );
    };

    const PrevCard: React.FC = () => {
        const prev = properties[currentIndex - 1];
        if (!prev) return null;

        return (
            <motion.div
                initial={{ y: '-100%' }}
                animate={{ y: 0 }}
                exit={{ y: '-100%' }}
                transition={{
                    duration: 0.5,
                    ease: [0.33, 1, 0.68, 1]
                }}
                className="absolute inset-0"
            >
                <img
                    src={prev.images[0]}
                    alt={prev.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40" />
            </motion.div>
        );
    };

    return (
        <div className="relative h-screen w-screen bg-black overflow-hidden">
            {/* Кнопка «Назад» */}
            <button
                onClick={() => navigate(-1)}
                className="absolute top-4 left-4 z-10 bg-white bg-opacity-80 px-3 py-1 rounded-full hover:bg-opacity-100 transition text-gray-800"
            >
                Назад
            </button>

            {/* Предыдущая карточка */}
            <AnimatePresence>
                {currentIndex > 0 && (
                    <PrevCard />
                )}
            </AnimatePresence>

            {/* Следующая карточка */}
            <AnimatePresence>
                {currentIndex < properties.length - 1 && (
                    <NextCard />
                )}
            </AnimatePresence>

            {/* Текущая карточка с вертикальным свайпом */}
            <motion.div
                className="absolute inset-0 flex flex-col"
                drag="y"
                onDrag={handleCardDrag}
                onDragEnd={handleCardDragEnd}
                animate={controls}
                initial={false}
                style={{
                    zIndex: dragging ? 10 : 1,
                    y: offsetY
                }}
            >
                {/* Горизонтальное перелистывание фото */}
                <div className="relative flex-1">
                    <AnimatePresence initial={false}>
                        <motion.img
                            key={currentImageIndex}
                            src={property.images[currentImageIndex]}
                            alt={property.title}
                            className="absolute inset-0 w-full h-full object-cover"
                            variants={imageVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                duration: 0.3,
                                ease: [0.33, 1, 0.68, 1]
                            }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            onDragEnd={handleImageDragEndMobile}
                        />
                    </AnimatePresence>
                </div>

                {/* Оверлей с информацией */}
                <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-4">
                    <div className="bg-white bg-opacity-90 p-3 rounded-lg">
                        <h2 className="text-xl font-semibold text-gray-800">
                            {property.title}
                        </h2>
                        <p className="text-lg text-gray-700">
                            ₸ {property.price.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {property.description}
                        </p>
                        <div className="mt-2 flex space-x-2">
                            <button
                                onClick={handleRequest}
                                className="flex-1 text-center bg-[#0E54CE] text-white px-2 py-1 rounded hover:bg-[#0E54CE] transition text-sm"
                            >
                                Оставить заявку
                            </button>
                        </div>
                    </div>

                    {/* Индикаторы фото */}
                    <div className="flex justify-center space-x-1 mt-2">
                        {property.images.map((_, idx) => (
                            <span
                                key={idx}
                                className={`w-2 h-2 rounded-full ${
                                    idx === currentImageIndex
                                        ? 'bg-white'
                                        : 'bg-white bg-opacity-50'
                                }`}
                            />
                        ))}
                    </div>

                    {/* Избранное и шаринг */}
                    <div className="absolute top-4 right-4 flex space-x-2">
                        <button
                            onClick={() => toggleFavorite(property.id)}
                            className="p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition"
                        >
                            {favoriteProperties.includes(property.id) ? (
                                <HeartSolid className="w-6 h-6 text-red-600" />
                            ) : (
                                <HeartOutline className="w-6 h-6 text-gray-800" />
                            )}
                        </button>
                        <button
                            onClick={handleShare}
                            className="p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition"
                        >
                            <ShareIcon className="w-6 h-6 text-gray-800" />
                        </button>
                    </div>

                    {/* Позиция в списке */}
                    <div className="text-center text-white text-sm mt-2">
                        {currentIndex + 1} / {properties.length}
                    </div>
                    <div className="text-center text-white text-xs">
                        Свайп вверх/вниз для смены объекта
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default SwipePage;
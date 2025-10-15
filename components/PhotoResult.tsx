import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';

interface PhotoResultProps {
    photos: string[];
    frames?: string[];
    gifUrl?: string;
    onClose?: () => void;
}

export default function PhotoResult({ photos, frames = [], gifUrl, onClose }: PhotoResultProps) {
    // Gabungkan semua item untuk thumbnail bar
    const items = [
        ...photos.map((src) => ({ type: 'photo', src })),
        ...frames.map((src) => ({ type: 'frame', src })),
        ...(gifUrl ? [{ type: 'gif', src: gifUrl }] : []),
    ];

    const [current, setCurrent] = useState(0);
    const [shareError, setShareError] = useState<string | null>(null);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const imageRef = useRef<HTMLDivElement>(null);

    // Minimum swipe distance
    const minSwipeDistance = 50;

    // Navigation functions
    const goToPrevious = useCallback(() => {
        setCurrent(prev => prev > 0 ? prev - 1 : items.length - 1);
    }, [items.length]);

    const goToNext = useCallback(() => {
        setCurrent(prev => prev < items.length - 1 ? prev + 1 : 0);
    }, [items.length]);

    // Touch event handlers
    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(0); // Reset touchEnd
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            goToNext();
        } else if (isRightSwipe) {
            goToPrevious();
        }
    };

    // Mouse event handlers for desktop
    const onMouseDown = (e: React.MouseEvent) => {
        if (e.button === 0) { // Left click
            const rect = imageRef.current?.getBoundingClientRect();
            if (rect) {
                const x = e.clientX - rect.left;
                const centerX = rect.width / 2;

                if (x < centerX) {
                    goToPrevious();
                } else {
                    goToNext();
                }
            }
        }
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                goToPrevious();
            } else if (e.key === 'ArrowRight') {
                goToNext();
            } else if (e.key === 'Escape' && onClose) {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, goToNext, goToPrevious]);

    // Share handler
    const handleShare = async () => {
        setShareError(null);
        const item = items[current];
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Photo Booth Result',
                    text: 'Check out my photo!',
                    url: item.src.startsWith('http') ? item.src : undefined,
                    files: item.src.startsWith('data:') && window.File
                        ? [
                            await fetch(item.src)
                                .then(res => res.blob())
                                .then(blob => new window.File([blob], getDownloadName(), { type: blob.type }))
                        ]
                        : undefined,
                });
            } catch {
                setShareError('Share cancelled or failed.');
            }
        } else {
            // Fallback: copy link or show message
            if (item.src.startsWith('http')) {
                await navigator.clipboard.writeText(item.src);
                setShareError('Link copied to clipboard!');
            } else {
                setShareError('Sharing is not supported on this device.');
            }
        }
    };

    const getDownloadName = () => {
        if (items[current].type === 'gif') return 'photobooth.gif';
        if (items[current].type === 'frame') {
            if (items[current].src.startsWith('data:image/png;base64') && items[current].src.length > 100000) {
                return 'photostrip.png';
            }
            return `frame_${current + 1}.png`;
        }
        return `photo_${current + 1}.png`;
    };

    // --- Pindahkan pengecekan items.length === 0 ke sini ---
    if (items.length === 0) {
        return (
            <div style={{ textAlign: 'center', color: '#888', marginTop: 40 }}></div>
        );
    }

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10000,
                padding: '20px',
            }}
        >
            <div
                style={{
                    background: '#fff',
                    borderRadius: 20,
                    boxShadow: '0 8px 32px rgba(250, 117, 170, 0.3)',
                    padding: '32px',
                    maxWidth: '600px',
                    maxHeight: '90vh',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        width: '32px',
                        height: '32px',
                        border: 'none',
                        background: 'rgba(215, 38, 136, 0.1)',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#d72688',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        zIndex: 1,
                    }}
                    title="Close (ESC)"
                >
                    ×
                </button>

                {/* Title */}
                <h2 style={{
                    color: '#d72688',
                    marginBottom: '24px',
                    fontWeight: 700,
                    fontSize: '28px',
                    letterSpacing: '0.5px',
                    textAlign: 'center',
                    margin: '0 0 24px 0'
                }}>
                    Photo Gallery
                </h2>

                {/* Navigation arrows for desktop */}
                {items.length > 1 && (
                    <>
                        <button
                            onClick={goToPrevious}
                            style={{
                                position: 'absolute',
                                left: '16px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                border: '2px solid #fa75aa',
                                background: 'rgba(255, 255, 255, 0.9)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 2,
                                transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#fa75aa';
                                e.currentTarget.style.color = '#fff';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                                e.currentTarget.style.color = '#fa75aa';
                            }}
                            title="Previous (←)"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>

                        <button
                            onClick={goToNext}
                            style={{
                                position: 'absolute',
                                right: '16px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                border: '2px solid #fa75aa',
                                background: 'rgba(255, 255, 255, 0.9)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 2,
                                transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#fa75aa';
                                e.currentTarget.style.color = '#fff';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                                e.currentTarget.style.color = '#fa75aa';
                            }}
                            title="Next (→)"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </>
                )}

                {/* Main image display area */}
                <div
                    ref={imageRef}
                    style={{
                        width: '100%',
                        height: '400px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        cursor: items.length > 1 ? 'pointer' : 'default',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        background: '#f8f9fa',
                    }}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                    onMouseDown={onMouseDown}
                >
                    {items[current].type === 'gif' ? (
                        <Image
                            src={items[current].src}
                            alt="GIF"
                            fill
                            style={{
                                objectFit: 'contain',
                                borderRadius: '8px',
                                userSelect: 'none',
                                pointerEvents: 'none',
                            }}
                        />
                    ) : (
                        <Image
                            src={items[current].src}
                            alt={items[current].type === 'frame' ? 'Photo Strip' : `Photo ${current + 1}`}
                            fill
                            style={{
                                objectFit: 'contain',
                                borderRadius: '8px',
                                userSelect: 'none',
                                pointerEvents: 'none',
                            }}
                        />
                    )}

                    {/* Swipe hint for mobile */}
                    {items.length > 1 && (
                        <div
                            style={{
                                position: 'absolute',
                                bottom: '8px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                background: 'rgba(0, 0, 0, 0.6)',
                                color: 'white',
                                padding: '4px 8px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: '500',
                                opacity: 0.7,
                            }}
                        >
                            Swipe or click to navigate
                        </div>
                    )}
                </div>

                {/* Image info */}
                <div style={{
                    marginTop: '16px',
                    textAlign: 'center',
                    color: '#d72688',
                    fontWeight: 600,
                    fontSize: '18px'
                }}>
                    {items[current].type === 'gif'
                        ? 'GIF'
                        : items[current].type === 'frame'
                            ? items[current].src.startsWith('data:image/png;base64') && items[current].src.length > 100000
                                ? 'Photo Strip'
                                : 'Frame'
                            : 'Photo'}
                    &nbsp;({current + 1} / {items.length})
                </div>

                {/* Thumbnail bar */}
                {items.length > 1 && (
                    <div
                        style={{
                            marginTop: '20px',
                            display: 'flex',
                            gap: '12px',
                            overflowX: 'auto',
                            overflowY: 'hidden', // Hanya scroll horizontal
                            padding: '10px 0',
                            maxWidth: '100%',
                            scrollbarWidth: 'none', // Firefox
                            msOverflowStyle: 'none', // IE/Edge
                            WebkitOverflowScrolling: 'touch', // Smooth scroll on iOS
                        }}
                        className="photoresult-thumbnails"
                    >
                        {items.map((item, idx) => {
                            const isPhotoStrip =
                                item.type === 'frame' &&
                                item.src.startsWith('data:image/png;base64') &&
                                item.src.length > 100000;
                            const isActive = idx === current;

                            const thumbSize = 56;

                            return (
                                <div
                                    key={idx}
                                    onClick={() => setCurrent(idx)}
                                    style={{
                                        border: isActive ? '3px solid #fa75aa' : '2px solid #e0e0e0',
                                        borderRadius: '10px',
                                        padding: '3px',
                                        background: isActive
                                            ? (isPhotoStrip ? '#ffe0f0' : '#fff6fa')
                                            : '#fff',
                                        cursor: 'pointer',
                                        boxShadow: isActive ? '0 2px 8px rgba(250, 117, 170, 0.18)' : undefined,
                                        transition: 'all 0.2s',
                                        flexShrink: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        minWidth: thumbSize + 6,
                                        minHeight: thumbSize + 6,
                                    }}
                                    title={
                                        item.type === 'gif'
                                            ? 'GIF'
                                            : item.type === 'frame'
                                                ? 'Photo Strip'
                                                : 'Photo'
                                    }
                                >
                                    <Image
                                        src={item.src}
                                        alt={item.type === 'gif' ? 'GIF' : item.type}
                                        width={thumbSize}
                                        height={thumbSize}
                                        style={{
                                            objectFit: 'cover',
                                            borderRadius: '8px',
                                            display: 'block',
                                            background: '#f8f9fa',
                                        }}
                                    />
                                </div>
                            );
                        })}
                        <style jsx>{`
                            .photoresult-thumbnails {
                                scrollbar-width: none; /* Firefox */
                                -ms-overflow-style: none; /* IE 10+ */
                            }
                            .photoresult-thumbnails::-webkit-scrollbar {
                                display: none; /* Chrome/Safari/Webkit */
                            }
                            @media (max-width: 480px) {
                                .photoresult-thumbnails {
                                    gap: 8px !important;
                                    padding: 6px 0 !important;
                                }
                            }
                        `}</style>
                    </div>
                )}

                {/* Action buttons */}
                <div
                    style={{
                        display: 'flex',
                        gap: '12px',
                        marginTop: '24px',
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                    }}
                >
                    <a
                        href={items[current].src}
                        download={getDownloadName()}
                        style={{
                            padding: '12px 24px',
                            background: '#fae0ef',
                            color: '#d72688',
                            borderRadius: '8px',
                            fontWeight: 600,
                            fontSize: '16px',
                            textDecoration: 'none',
                            boxShadow: '0 2px 8px rgba(250, 117, 170, 0.2)',
                            cursor: 'pointer',
                            textAlign: 'center',
                            border: 'none',
                            transition: 'all 0.2s ease',
                            minWidth: '120px',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#d72688';
                            e.currentTarget.style.color = '#fff';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#fae0ef';
                            e.currentTarget.style.color = '#d72688';
                        }}
                    >
                        Download
                    </a>

                    <button
                        onClick={handleShare}
                        style={{
                            padding: '12px 24px',
                            background: '#fff0fa',
                            color: '#d72688',
                            borderRadius: '8px',
                            fontWeight: 600,
                            fontSize: '16px',
                            border: '2px solid #fa75aa',
                            boxShadow: '0 2px 8px rgba(250, 117, 170, 0.2)',
                            cursor: 'pointer',
                            textAlign: 'center',
                            transition: 'all 0.2s ease',
                            minWidth: '120px',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#fa75aa';
                            e.currentTarget.style.color = '#fff';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#fff0fa';
                            e.currentTarget.style.color = '#d72688';
                        }}
                        title="Share"
                    >
                        Share
                    </button>
                </div>

                {shareError && (
                    <div
                        style={{
                            marginTop: '12px',
                            color: '#d72688',
                            fontSize: '14px',
                            textAlign: 'center',
                            fontWeight: 500,
                            padding: '8px',
                            background: '#fff0fa',
                            borderRadius: '6px',
                            border: '1px solid #fae0ef',
                        }}
                    >
                        {shareError}
                    </div>
                )}
            </div>
        </div>
    );
}
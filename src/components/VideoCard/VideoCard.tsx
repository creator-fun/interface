import type { VideoData } from '@/types/video';
import { MessageCircle, Heart, Share, Bookmark, Play } from 'lucide-react';
import { formatNumber } from '@/utils/utils';
import { useEffect, useRef, useCallback, useState } from 'react';
import CartDrawer from '@/pages/Home/components/CartDrawer/CartDrawer';
import useVideoStore from '@/stores/video.store';

interface VideoItemProps {
    video: VideoData;
    index: number;
    totalVideos: number;
}

const VideoItem = ({ video }: VideoItemProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(true);
    const [isShowIconPlay, setIsShowIconPlay] = useState<boolean>(false);
    const isMute = useVideoStore((state) => state.isMute);
    // Show controls temporarily

    // Handle play/pause functions
    const handlePlayPause = useCallback(() => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
                setIsShowIconPlay(true);
            } else {
                videoRef.current.play();
                setIsShowIconPlay(false);
            }
        }
    }, [isPlaying]);

    const handleIntersection = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (videoRef.current) {
                    if (entry.isIntersecting) {
                        // Video đang trong viewport, bắt đầu phát
                        if (!isShowIconPlay) {
                            videoRef.current.play().catch((error) => {
                                console.log('Auto-play prevented:', error);
                            });
                        }
                    } else {
                        // Video không còn trong viewport, pause
                        videoRef.current.pause();
                    }
                }
            });
        },
        [isShowIconPlay],
    );

    useEffect(() => {
        const observer = new IntersectionObserver(handleIntersection, {
            threshold: 0.5, // Video sẽ được coi là "visible" khi ít nhất 50% nằm trong viewport
            rootMargin: '0px',
        });

        const currentContainer = containerRef.current;
        if (currentContainer) {
            observer.observe(currentContainer);
        }

        return () => {
            if (currentContainer) {
                observer.unobserve(currentContainer);
            }
            observer.disconnect();
        };
    }, [handleIntersection]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        video.muted = true;
        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);

        video.addEventListener('play', handlePlay);
        video.addEventListener('pause', handlePause);

        return () => {
            video.removeEventListener('play', handlePlay);
            video.removeEventListener('pause', handlePause);
        };
    }, []);

    useEffect(() => {
        if (videoRef.current) {
            if (isMute) {
                videoRef.current.muted = false;
            } else {
                videoRef.current.muted = true;
            }
        }
    }, [isMute]);

    return (
        <div ref={containerRef} className="relative flex items-center justify-center">
            {/* Video Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black">
                <div className="w-full h-full bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>

            {/* Video Placeholder */}
            <div className="relative z-10 w-full flex items-center justify-center">
                <div
                    className="w-screen h-[calc(100vh-68px)] bg-black flex items-center justify-center text-white text-lg font-bold relative overflow-hidden cursor-pointer"
                    onClick={handlePlayPause}
                    onMouseEnter={() => setIsPlaying(true)}
                    onMouseLeave={() => setIsPlaying(false)}
                >
                    <video
                        ref={videoRef}
                        src={video.videoUrl}
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20" />

                    <div
                        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
                            isShowIconPlay && !isPlaying ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handlePlayPause();
                            }}
                            className=" text-white p-4 rounded-full hover:bg-black/70 transition-all duration-200 transform hover:scale-110"
                        >
                            {!isPlaying && <Play size={48} className="fill-white opacity-90" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Side Actions */}
            <div className="absolute right-4 bottom-8 flex flex-col items-center space-y-5 z-20">
                {/* Avatar */}
                <div className="relative">
                    <img
                        src={video.avatar}
                        alt={video.username}
                        className="w-10 h-10 rounded-full border-2 border-white"
                    />
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">+</span>
                    </div>
                </div>

                {/* Like Button */}
                <div className="flex flex-col items-center space-y-1">
                    <button>
                        <Heart
                            size={26}
                            className={`${
                                video.isLiked ? 'fill-red-500 text-red-500' : 'text-white'
                            } transition-colors`}
                        />
                    </button>
                    <span className="text-white text-xs font-medium">{formatNumber(video.likes)}</span>
                </div>

                {/* Comment Button */}
                <div className="flex flex-col items-center space-y-1">
                    <button>
                        <MessageCircle size={26} className="text-white" />
                    </button>
                    <span className="text-white text-xs font-medium">{formatNumber(video.comments)}</span>
                </div>

                {/* Share Button */}
                <div className="flex flex-col items-center space-y-1">
                    <button>
                        <Share size={26} className="text-white" />
                    </button>
                    <span className="text-white text-xs font-medium">{formatNumber(video.shares)}</span>
                </div>

                {/* Bookmark Button */}
                <div className="flex flex-col items-center space-y-1">
                    <button>
                        <Bookmark
                            size={26}
                            className={`${
                                video.isBookmarked ? 'fill-white text-white' : 'text-white'
                            } transition-colors`}
                        />
                    </button>
                </div>
            </div>

            {/* Bottom Content */}
            <div className="absolute bottom-4 left-4 right-20 z-20">
                <CartDrawer />
                <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                        <span className="text-white font-bold text-lg">{video.username}</span>
                    </div>
                    <p className="text-white text-sm leading-relaxed">{video.description}</p>
                    <div className="flex items-center space-x-2 flex-wrap">
                        {video?.hashtags?.map((tag, tagIndex) => (
                            <span key={tagIndex} className="text-white/80 text-xs">
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            {/* <div className="absolute top-4 left-4 right-4 z-20">
                <div className="w-full bg-white/20 rounded-full h-1">
                    <div
                        className="bg-white h-1 rounded-full transition-all duration-300"
                        style={{ width: `${((index + 1) / totalVideos) * 100}%` }}
                    />
                </div>
            </div> */}
        </div>
    );
};

export default VideoItem;

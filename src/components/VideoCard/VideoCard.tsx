import type { VideoData } from '@/types/video';
import { MessageCircle, Heart, Share, Bookmark } from 'lucide-react';
import { formatNumber } from '@/utils/utils';
import { useEffect, useRef } from 'react';

interface VideoItemProps {
    video: VideoData;
    index: number;
    totalVideos: number;
}

const VideoItem = ({ video }: VideoItemProps) => {
    // const videoRef = useRef<HTMLVideoElement>(null);
    // useEffect(() => {
    //     if (videoRef.current) {
    //         videoRef.current.muted = false;
    //     }
    // }, []);

    return (
        <div className="relative h-screen flex items-center justify-center">
            {/* Video Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black">
                <div className="w-full h-full bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>

            {/* Video Placeholder */}
            <div className="relative z-10 w-full h-full flex items-center justify-center">
                <div className="w-screen h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-lg font-bold relative overflow-hidden">
                    <video
                        // ref={videoRef}
                        src={video.videoUrl}
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded">
                        {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                    </div>
                </div>
            </div>

            {/* Right Side Actions */}
            <div className="absolute right-4 bottom-32 flex flex-col items-center space-y-6 z-20">
                {/* Avatar */}
                <div className="relative">
                    <img
                        src={video.avatar}
                        alt={video.username}
                        className="w-12 h-12 rounded-full border-2 border-white"
                    />
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">+</span>
                    </div>
                </div>

                {/* Like Button */}
                <div className="flex flex-col items-center space-y-1">
                    <button className="p-3 bg-black/20 rounded-full backdrop-blur-sm">
                        <Heart
                            size={28}
                            className={`${
                                video.isLiked ? 'fill-red-500 text-red-500' : 'text-white'
                            } transition-colors`}
                        />
                    </button>
                    <span className="text-white text-xs font-medium">{formatNumber(video.likes)}</span>
                </div>

                {/* Comment Button */}
                <div className="flex flex-col items-center space-y-1">
                    <button className="p-3 bg-black/20 rounded-full backdrop-blur-sm">
                        <MessageCircle size={28} className="text-white" />
                    </button>
                    <span className="text-white text-xs font-medium">{formatNumber(video.comments)}</span>
                </div>

                {/* Share Button */}
                <div className="flex flex-col items-center space-y-1">
                    <button className="p-3 bg-black/20 rounded-full backdrop-blur-sm">
                        <Share size={28} className="text-white" />
                    </button>
                    <span className="text-white text-xs font-medium">{formatNumber(video.shares)}</span>
                </div>

                {/* Bookmark Button */}
                <div className="flex flex-col items-center space-y-1">
                    <button className="p-3 bg-black/20 rounded-full backdrop-blur-sm">
                        <Bookmark
                            size={28}
                            className={`${
                                video.isBookmarked ? 'fill-white text-white' : 'text-white'
                            } transition-colors`}
                        />
                    </button>
                </div>
            </div>

            {/* Bottom Content */}
            <div className="absolute bottom-20 left-4 right-20 z-20">
                <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                        <span className="text-white font-bold text-lg">{video.username}</span>
                        <button
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                video.isFollowing ? 'bg-white/20 text-white' : 'bg-red-500 text-white'
                            }`}
                        >
                            {video.isFollowing ? 'Following' : 'Follow'}
                        </button>
                    </div>
                    <p className="text-white text-sm leading-relaxed">{video.description}</p>
                    <div className="flex items-center space-x-2 flex-wrap">
                        {video.hashtags.map((tag, tagIndex) => (
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

import axios from 'axios';
import type { VideoData, VideoResponse } from '@/types/video';

// Real video URLs for testing
const videoUrls = [
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
];

// Function to get random video URL
const getRandomVideoUrl = (): string => {
    return videoUrls[Math.floor(Math.random() * videoUrls.length)];
};

// Mock data generator
const generateMockVideos = (page: number, limit: number = 10): VideoData[] => {
    const categories = ['dance', 'comedy', 'food', 'travel', 'fashion', 'music', 'sports', 'education'];
    const hashtags = ['viral', 'trending', 'fyp', 'dance', 'comedy', 'food', 'travel', 'fashion'];

    return Array.from({ length: limit }, (_, index) => {
        const videoId = `${page}-${index + 1}`;
        const category = categories[Math.floor(Math.random() * categories.length)];
        const hashtag = hashtags[Math.floor(Math.random() * hashtags.length)];

        return {
            id: videoId,
            username: `@user${page}${index + 1}`,
            description: `${category.charAt(0).toUpperCase() + category.slice(1)} content! ${
                ['💃', '🎵', '🍕', '✈️', '👗', '🎮', '📚', '🏃'][Math.floor(Math.random() * 8)]
            } #${category} #${hashtag}`,
            likes: Math.floor(Math.random() * 50000) + 100,
            comments: Math.floor(Math.random() * 1000) + 10,
            shares: Math.floor(Math.random() * 500) + 5,
            avatar: `https://images.unsplash.com/photo-${Math.floor(
                Math.random() * 1000000,
            )}?w=150&h=150&fit=crop&crop=face`,
            videoUrl: getRandomVideoUrl(),
            thumbnail: `https://picsum.photos/400/600?random=${videoId}`,
            duration: Math.floor(Math.random() * 60) + 15,
            createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
            hashtags: [category, hashtag, 'trending'],
            isLiked: Math.random() > 0.7,
            isBookmarked: Math.random() > 0.8,
            isFollowing: Math.random() > 0.6,
        };
    });
};

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const videoApi = {
    async getVideos(page: number): Promise<VideoResponse> {
        console.log('page', page);

        try {
            // Simulate network delay
            await delay(Math.random() * 1000 + 500);

            const limit = 3;
            const videos = generateMockVideos(page, limit);

            // Simulate pagination
            const hasNextPage = page < 5;
            const nextCursor = hasNextPage ? page + 1 : undefined;

            // Simulate axios response structure
            const response = {
                data: {
                    videos,
                    nextCursor,
                    hasNextPage,
                },
                status: 200,
                statusText: 'OK',
            };

            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Axios error:', error.response?.data || error.message);
                throw new Error(error.response?.data?.message || 'Failed to fetch videos');
            }
            console.error('Unexpected error:', error);
            throw new Error('An unexpected error occurred');
        }
    },
};

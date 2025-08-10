export interface VideoData {
    id: string;
    username: string;
    description: string;
    likes: number;
    comments: number;
    shares: number;
    avatar: string;
    videoUrl: string;
    thumbnail: string;
    duration: number;
    createdAt: string;
    hashtags?: string[];
    isLiked: boolean;
    isBookmarked: boolean;
    isFollowing: boolean;
}

export interface VideoResponse {
    videos: VideoData[];
    nextCursor?: number;
    hasNextPage: boolean;
}

export interface VideoFilters {
    limit?: number;
    cursor?: number;
    category?: string;
    trending?: boolean;
    following?: boolean;
}

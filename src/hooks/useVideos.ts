import { useInfiniteQuery } from '@tanstack/react-query';
import { videoApi } from '../services/videoApi';
import type { VideoResponse } from '@/types/video';

export const useVideos = () => {
    return useInfiniteQuery({
        queryKey: ['videos'],
        queryFn: ({ pageParam }) => videoApi.getVideos(Number(pageParam)),
        getNextPageParam: (lastPage: VideoResponse) => (lastPage.hasNextPage ? lastPage.nextCursor : undefined),
        initialPageParam: 0,
    });
};

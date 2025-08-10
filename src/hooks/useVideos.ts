import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { videoApi } from '../services/videoApi';
import type { VideoFilters, VideoResponse } from '@/types/video';
import type { AxiosResponse } from 'axios';

export const useVideos = (params: VideoFilters) => {
    return useInfiniteQuery({
        queryKey: ['videos', params],
        queryFn: ({ pageParam }) => videoApi.getVideos(Number(pageParam), params),
        getNextPageParam: (lastPage: AxiosResponse<VideoResponse>) =>
            lastPage.data.hasNextPage ? lastPage.data.nextCursor : undefined,
        initialPageParam: 0,
    });
};

export const useUploadVideo = () => {
    return useMutation({
        mutationFn: (data: FormData) => videoApi.uploadVideo(data),
    });
};

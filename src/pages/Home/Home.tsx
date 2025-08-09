import { useEffect, useMemo, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useVideos } from '@/hooks/useVideos';
import VideoItem from '@/components/VideoCard/VideoCard';
import useVideoStore from '@/stores/video.store';
import { Volume, Volume2 } from 'lucide-react';

const Home = () => {
    const parentRef = useRef<HTMLDivElement>(null);
    const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useVideos();
    const setIsMute = useVideoStore((state) => state.setIsMute);
    const isMute = useVideoStore((state) => state.isMute);
    const allVideos = useMemo(() => {
        return data?.pages?.flatMap((page) => page.videos) ?? [];
    }, [data]);

    // Virtual scrolling setup
    const rowVirtualizer = useVirtualizer({
        count: hasNextPage ? allVideos.length + 1 : allVideos.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => window.innerHeight - 68,
        overscan: 2,
    });

    useEffect(() => {
        const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();
        if (!lastItem) {
            return;
        }
        if (lastItem.index >= allVideos.length - 1 && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, fetchNextPage, allVideos.length, isFetchingNextPage, rowVirtualizer.getVirtualItems()]);

    if (isLoading) {
        return (
            <div className="h-screen bg-black flex items-center justify-center">
                <div className="text-white text-lg">Loading videos...</div>
            </div>
        );
    }

    return (
        <div className="relative h-screen bg-black overflow-hidden">
            <div ref={parentRef} className="h-full lg:hidden-scrollbar overflow-auto snap-y snap-mandatory">
                <div className="absolute top-4 left-4 z-50">
                    <button onClick={() => setIsMute(!isMute)}>
                        {isMute ? (
                            <Volume2 size={24} className="text-white" />
                        ) : (
                            <Volume size={24} className="text-white" />
                        )}
                    </button>
                </div>
                <div
                    style={{
                        height: `${rowVirtualizer.getTotalSize()}px`,
                        width: '100%',
                        position: 'relative',
                    }}
                >
                    {rowVirtualizer.getVirtualItems().map((virtualItem) => {
                        const video = allVideos[virtualItem.index];
                        const isLoaderRow = virtualItem.index > allVideos.length - 1;
                        if (!video) return null;

                        return (
                            <div
                                key={virtualItem.key}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: `${virtualItem.size}px`,
                                    transform: `translateY(${virtualItem.start}px)`,
                                }}
                                className="snap-start"
                            >
                                {isLoaderRow ? null : (
                                    <VideoItem video={video} index={virtualItem.index} totalVideos={allVideos.length} />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Home;

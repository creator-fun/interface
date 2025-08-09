import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
// import InputFile from '@/components/InputFile/InputFile';

interface VideoUpload {
    file: File;
    preview: string;
    thumbnail?: string;
}

const Create = () => {
    const [videoUpload, setVideoUpload] = useState<VideoUpload | null>(null);
    const [description, setDescription] = useState('');
    const [hashtags, setHashtags] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleFileSelect = useCallback((files: FileList | null) => {
        if (!files || files.length === 0) return;

        const file = files[0];
        if (!file.type.startsWith('video/')) {
            alert('Vui lòng chọn file video!');
            return;
        }

        // Check file size (max 100MB)
        if (file.size > 100 * 1024 * 1024) {
            alert('File video không được vượt quá 100MB!');
            return;
        }

        const preview = URL.createObjectURL(file);
        setVideoUpload({ file, preview });
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragOver(false);
            handleFileSelect(e.dataTransfer.files);
        },
        [handleFileSelect],
    );

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    }, []);

    const removeVideo = () => {
        if (videoUpload) {
            URL.revokeObjectURL(videoUpload.preview);
        }
        setVideoUpload(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleUpload = async () => {
        if (!videoUpload) return;

        setIsUploading(true);
        try {
            // Simulate upload process
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // Here you would typically upload to your server
            console.log('Uploading video:', {
                file: videoUpload.file.name,
                description,
                hashtags: hashtags.split(' ').filter((tag) => tag.startsWith('#')),
            });

            // Reset form after successful upload
            removeVideo();
            setDescription('');
            setHashtags('');
            alert('Video đã được upload thành công!');
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload thất bại! Vui lòng thử lại.');
        } finally {
            setIsUploading(false);
        }
    };

    const extractHashtags = (text: string) => {
        const matches = text.match(/#\w+/g);
        return matches ? matches.join(' ') : '';
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setDescription(value);

        const extractedHashtags = extractHashtags(value);
        if (extractedHashtags && extractedHashtags !== hashtags) {
            setHashtags(extractedHashtags);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
                        Tạo Video Mới
                    </h1>
                    <p className="text-gray-600">Chia sẻ khoảnh khắc tuyệt vời của bạn với mọi người</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Upload Area */}
                    <div className="space-y-6">
                        {!videoUpload ? (
                            <div
                                className={cn(
                                    'relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300',
                                    'hover:border-purple-400 hover:bg-purple-50/50',
                                    isDragOver
                                        ? 'border-purple-500 bg-purple-100 scale-[1.02]'
                                        : 'border-gray-300 bg-white',
                                )}
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                            >
                                {/* <InputFile ref={fileInputRef} /> */}
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl p-6 shadow-lg">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800">Preview Video</h3>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={removeVideo}
                                        className="text-red-500 hover:text-red-700 border-red-200 hover:border-red-300"
                                    >
                                        <svg
                                            className="w-4 h-4 mr-1"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            />
                                        </svg>
                                        Xóa
                                    </Button>
                                </div>

                                <div className="relative aspect-[9/16] max-w-sm mx-auto bg-black rounded-xl overflow-hidden">
                                    <video
                                        ref={videoRef}
                                        src={videoUpload.preview}
                                        controls
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="mt-4 text-sm text-gray-600">
                                    <p>📁 {videoUpload.file.name}</p>
                                    <p>📊 {(videoUpload.file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Form Section */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl p-6 shadow-lg">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin video</h3>

                            <div className="space-y-4">
                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả video</label>
                                    <textarea
                                        value={description}
                                        onChange={handleDescriptionChange}
                                        placeholder="Viết mô tả thú vị cho video của bạn... #hashtag"
                                        rows={4}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                        maxLength={2200}
                                    />
                                    <div className="flex justify-between items-center mt-1">
                                        <p className="text-xs text-gray-500">Sử dụng # để thêm hashtag</p>
                                        <span className="text-xs text-gray-400">{description.length}/2200</span>
                                    </div>
                                </div>

                                {/* Hashtags */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Hashtags</label>
                                    <input
                                        type="text"
                                        value={hashtags}
                                        onChange={(e) => setHashtags(e.target.value)}
                                        placeholder="#trending #viral #fyp"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Hashtag giúp mọi người tìm thấy video của bạn dễ dàng hơn
                                    </p>
                                </div>

                                {/* Privacy Settings */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Quyền riêng tư
                                    </label>
                                    <div className="space-y-2">
                                        <label className="flex items-center">
                                            <input type="radio" name="privacy" defaultChecked className="mr-3" />
                                            <span className="text-sm">🌍 Công khai - Mọi người có thể xem</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input type="radio" name="privacy" className="mr-3" />
                                            <span className="text-sm">👥 Bạn bè - Chỉ bạn bè có thể xem</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input type="radio" name="privacy" className="mr-3" />
                                            <span className="text-sm">🔒 Riêng tư - Chỉ mình tôi</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Upload Button */}
                                <Button
                                    onClick={handleUpload}
                                    disabled={!videoUpload || isUploading}
                                    className={cn(
                                        'w-full h-12 text-lg font-semibold rounded-xl transition-all duration-300',
                                        'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700',
                                        'disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed',
                                    )}
                                >
                                    {isUploading ? (
                                        <>
                                            <svg
                                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Đang upload...
                                        </>
                                    ) : (
                                        <>
                                            <svg
                                                className="w-5 h-5 mr-2"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                />
                                            </svg>
                                            Đăng video
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* Tips */}
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
                            <h4 className="font-semibold text-gray-800 mb-3">💡 Mẹo tạo video viral</h4>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-start">
                                    <span className="text-blue-500 mr-2">•</span>
                                    Sử dụng hashtag trending để tăng lượt xem
                                </li>
                                <li className="flex items-start">
                                    <span className="text-purple-500 mr-2">•</span>
                                    Viết mô tả hấp dẫn, có call-to-action
                                </li>
                                <li className="flex items-start">
                                    <span className="text-pink-500 mr-2">•</span>
                                    Đăng vào giờ vàng (19h-22h) để có nhiều tương tác
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-500 mr-2">•</span>
                                    Video dài 15-30 giây có tỷ lệ hoàn thành cao nhất
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Create;

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import InputFile from '@/components/InputFile';
import { useForm } from 'react-hook-form';
import { uploadVideoSchema, type UploadVideoSchemaType } from '@/utils/rules';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useUploadVideo } from '@/hooks/useVideos';
import { toast } from 'sonner';
interface VideoUpload {
    file: File;
    preview: string;
    thumbnail?: string;
}

const Create = () => {
    const [videoUpload, setVideoUpload] = useState<VideoUpload | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [duration, setDuration] = useState(0);
    const { mutate: uploadVideo, isPending } = useUploadVideo();
    const form = useForm<UploadVideoSchemaType>({
        resolver: zodResolver(uploadVideoSchema),
        defaultValues: {
            description: '',
            status: 'public',
        },
    });

    const handleFileSelect = useCallback((file: File | undefined) => {
        if (!file) return;
        const preview = URL.createObjectURL(file);
        setVideoUpload({ file, preview });
    }, []);

    const descriptionInput = form.watch('description');

    const removeVideo = () => {
        if (videoUpload) {
            URL.revokeObjectURL(videoUpload.preview);
        }
        setVideoUpload(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // const handleUpload = async () => {
    //     if (!videoUpload) return;

    //     setIsUploading(true);
    //     try {
    //         // Simulate upload process
    //         await new Promise((resolve) => setTimeout(resolve, 2000));

    //         // Here you would typically upload to your server
    //         console.log('Uploading video:', {
    //             file: videoUpload.file.name,
    //             description,
    //             hashtags: hashtags.split(' ').filter((tag) => tag.startsWith('#')),
    //         });

    //         // Reset form after successful upload
    //         removeVideo();
    //         setDescription('');
    //         setHashtags('');
    //         alert('Video đã được upload thành công!');
    //     } catch (error) {
    //         console.error('Upload failed:', error);
    //         alert('Upload thất bại! Vui lòng thử lại.');
    //     } finally {
    //         setIsUploading(false);
    //     }
    // };

    const processText = (text: string) => {
        const hashtags = text.match(/#\w+/g)?.map((tag) => tag.slice(1)) || [];
        const hashtagString = hashtags.join(',');

        const cleanText = text.replace(/#\w+/g, '').trim();

        return {
            hashtags: hashtagString,
            cleanText,
        };
    };

    async function onSubmit(values: UploadVideoSchemaType) {
        const { hashtags, cleanText } = processText(values.description);
        if (videoUpload) {
            const formData = new FormData();
            formData.append('video', videoUpload?.file);
            formData.append('description', cleanText);
            formData.append('hashtags', hashtags || '');
            formData.append('duration', Math.ceil(duration).toString());
            formData.append('username', ' @user1');
            formData.append('user_id', ' user1');
            formData.append(
                'thumbnail',
                'https://th.bing.com/th/id/R.8e578585b383dc11bc8753de50819d34?rik=%2fMMSRswpZLPZHg&pid=ImgRaw&r=0',
            );
            formData.append(
                'avatar',
                'https://th.bing.com/th/id/R.8e578585b383dc11bc8753de50819d34?rik=%2fMMSRswpZLPZHg&pid=ImgRaw&r=0',
            );
            // Log FormData entries
            console.log('formData entries:');
            for (const [key, value] of formData.entries()) {
                console.log(key, value);
            }

            uploadVideo(formData, {
                onSuccess: () => {
                    toast.success('Video đã được upload thành công!');
                },
                onError: () => {
                    toast.error('Upload thất bại! Vui lòng thử lại.');
                },
            });
        }
    }

    return (
        <div className="min-h-dvh bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
                        Tạo Video Mới
                    </h1>
                    <p className="text-gray-600">Chia sẻ khoảnh khắc tuyệt vời của bạn</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Upload Area */}
                    <div className="space-y-6">
                        {!videoUpload ? (
                            <div
                                className={cn(
                                    'relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300',
                                    'hover:border-purple-400 hover:bg-purple-50/50',
                                    'border-gray-300 bg-white',
                                )}
                            >
                                <InputFile ref={fileInputRef} onChange={handleFileSelect} />
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
                                        onLoadedMetadata={(e) => {
                                            setDuration(e.currentTarget.duration);
                                        }}
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

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                    <div className="space-y-4">
                                        {/* Description */}
                                        <FormField
                                            control={form.control}
                                            name="description"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="block text-sm font-medium text-gray-700 mb-2">
                                                        Mô tả video
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Viết mô tả thú vị cho video của bạn... #hashtag"
                                                            rows={4}
                                                            className="w-full px-4 min-h-[80px] py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                                            maxLength={2200}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription className="flex justify-between items-center mt-1">
                                                        <span className="text-xs text-gray-500">
                                                            Sử dụng # để thêm hashtag
                                                        </span>
                                                        <span className="text-xs text-gray-400">
                                                            {descriptionInput.length}/500
                                                        </span>
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="block text-sm font-medium text-gray-700 mb-2">
                                            Quyền riêng tư
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="status"
                                            render={({ field }) => (
                                                <FormItem className="space-y-3">
                                                    <FormLabel>Quyền riêng tư</FormLabel>
                                                    <FormControl>
                                                        <RadioGroup
                                                            onValueChange={field.onChange}
                                                            defaultValue={field.value}
                                                            className="flex flex-col"
                                                        >
                                                            <FormItem className="flex items-center space-x-2">
                                                                <FormControl>
                                                                    <RadioGroupItem value="public" id="public" />
                                                                </FormControl>
                                                                <FormLabel
                                                                    htmlFor="public"
                                                                    className="font-normal text-sm"
                                                                >
                                                                    🌍 Công khai - Mọi người có thể xem
                                                                </FormLabel>
                                                            </FormItem>
                                                            <FormItem className="flex items-center space-x-2">
                                                                <FormControl>
                                                                    <RadioGroupItem value="friends" id="friends" />
                                                                </FormControl>
                                                                <FormLabel
                                                                    htmlFor="friends"
                                                                    className="font-normal text-sm"
                                                                >
                                                                    👥 Bạn bè - Chỉ bạn bè có thể xem
                                                                </FormLabel>
                                                            </FormItem>
                                                            <FormItem className="flex items-center space-x-2">
                                                                <FormControl>
                                                                    <RadioGroupItem value="onlyMe" id="onlyMe" />
                                                                </FormControl>
                                                                <FormLabel
                                                                    htmlFor="onlyMe"
                                                                    className="font-normal text-sm"
                                                                >
                                                                    🔒 Riêng tư - Chỉ mình tôi
                                                                </FormLabel>
                                                            </FormItem>
                                                        </RadioGroup>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Upload Button */}
                                        <Button
                                            disabled={!videoUpload || isPending || !descriptionInput}
                                            className={cn(
                                                'w-full h-12 text-lg font-semibold rounded-xl transition-all duration-300',
                                                'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700',
                                                'disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed',
                                            )}
                                        >
                                            {isPending ? (
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
                                </form>
                            </Form>
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

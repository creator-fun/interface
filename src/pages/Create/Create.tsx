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
import { Input } from '@/components/ui/input';
import DialogNonAddressToken from './components/DialogNonAddressToken/DialogNonAddressToken';
import DialogConfirmTokenInfor from './components/DialogConfirmTokenInfor/DialogConfirmTokenInfor';
import { useGetTokenInfo } from '@/queries/useGetTokenInfo';

interface VideoUpload {
    file: File;
    preview: string;
    thumbnail?: string;
}

export interface ITokenCheck {
    id?: string;
    name: string;
    symbol: string;
    decimals: number;
    icon: string;
    launchpad: string;
    usdPrice: number;
}

const Create = () => {
    const [videoUpload, setVideoUpload] = useState<VideoUpload | null>(null);
    const [tokenAddress, setTokenAddress] = useState('');
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [showDialogInfoToken, setShowDialogInfoToken] = useState(false);
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

    const [tokenInfo, setTokenInfo] = useState<ITokenCheck | undefined>(undefined);

    const { mutateAsync: getTokenInfo } = useGetTokenInfo();

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

    const performUpload = (values: UploadVideoSchemaType) => {
        console.log('values', values);
        const { hashtags, cleanText } = processText(values.description);
        if (videoUpload) {
            const formData = new FormData();
            formData.append('video', videoUpload?.file);
            formData.append('description', cleanText);
            formData.append('hashtags', hashtags || '');
            formData.append('duration', Math.ceil(duration).toString());
            formData.append('username', ' @user1');
            formData.append('user_id', ' user1');
            // formData.append('tokenAddress', tokenAddress || '');
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
                    setShowConfirmDialog(false);
                },
                onError: (error) => {
                    console.log('error', { error });
                    toast.error('Upload thất bại! Vui lòng thử lại.');
                    setShowConfirmDialog(false);
                },
            });
        }
    };

    async function onSubmit() {
        // Kiểm tra nếu không có token address thì hiển thị dialog xác nhận
        if (!tokenAddress.trim()) {
            setShowConfirmDialog(true);
            return;
        }

        if (tokenAddress.trim()) {
            try {
                const tokenInfo = await getTokenInfo(tokenAddress);
                console.log('tokenInfo', tokenInfo);
                if (tokenInfo.data.length === 0) {
                    setShowDialogInfoToken(true);
                    setTokenInfo(undefined);
                    return;
                }
                setTokenInfo({
                    id: tokenInfo.data[0].id,
                    name: tokenInfo.data[0].name,
                    symbol: tokenInfo.data[0].symbol,
                    decimals: tokenInfo.data[0].decimals,
                    icon: tokenInfo.data[0].icon,
                    launchpad: tokenInfo.data[0].launchpad,
                    usdPrice: tokenInfo.data[0].usdPrice,
                });
                setShowDialogInfoToken(true);
            } catch (error) {
                toast.error('Lỗi khi lấy thông tin token');
                return;
            }
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
                        {/* Token Address Section */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                            <div className="flex items-center mb-4">
                                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-2 rounded-lg mr-3">
                                    <svg
                                        className="w-5 h-5 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800">Token Address</h3>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Địa chỉ token của bạn</label>
                                <Input
                                    placeholder="Nhập địa chỉ token (ví dụ: 0x1234...abcd)"
                                    value={tokenAddress}
                                    onChange={(e) => setTokenAddress(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                                />
                                <p className="text-xs text-gray-500 flex items-center">
                                    <svg
                                        className="w-4 h-4 mr-1 text-blue-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    Nhập địa chỉ token hợp lệ để liên kết với video của bạn
                                </p>
                            </div>
                        </div>

                        {/* Video Information Section */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                            <div className="flex items-center mb-6">
                                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg mr-3">
                                    <svg
                                        className="w-5 h-5 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800">Thông tin video</h3>
                            </div>

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    {/* Description Section */}
                                    <div className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="description"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center text-sm font-medium text-gray-700 mb-3">
                                                        <svg
                                                            className="w-4 h-4 mr-2 text-purple-500"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M4 6h16M4 12h16M4 18h7"
                                                            />
                                                        </svg>
                                                        Mô tả video
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Viết mô tả thú vị cho video của bạn... #hashtag"
                                                            rows={4}
                                                            className="w-full px-4 min-h-[100px] py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all duration-200"
                                                            maxLength={2200}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription className="flex justify-between items-center mt-2 px-1">
                                                        <span className="text-xs text-gray-500 flex items-center">
                                                            <svg
                                                                className="w-3 h-3 mr-1"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                                                                />
                                                            </svg>
                                                            Sử dụng # để thêm hashtag
                                                        </span>
                                                        <span className="text-xs text-gray-400 font-mono">
                                                            {descriptionInput.length}/500
                                                        </span>
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* Privacy Section */}
                                    <div className="border-t border-gray-100 pt-6">
                                        <FormField
                                            control={form.control}
                                            name="status"
                                            render={({ field }) => (
                                                <FormItem className="space-y-4">
                                                    <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                                                        <svg
                                                            className="w-4 h-4 mr-2 text-blue-500"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                                            />
                                                        </svg>
                                                        Quyền riêng tư
                                                    </FormLabel>
                                                    <FormControl>
                                                        <RadioGroup
                                                            onValueChange={field.onChange}
                                                            defaultValue={field.value}
                                                            className="grid gap-3"
                                                        >
                                                            <FormItem className="flex items-center space-x-3 space-y-0 p-3 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors cursor-pointer">
                                                                <FormControl>
                                                                    <RadioGroupItem value="public" id="public" />
                                                                </FormControl>
                                                                <FormLabel
                                                                    htmlFor="public"
                                                                    className="font-normal text-sm flex items-center cursor-pointer flex-1"
                                                                >
                                                                    <span className="text-lg mr-2">🌍</span>
                                                                    <div>
                                                                        <div className="font-medium">Công khai</div>
                                                                        <div className="text-xs text-gray-500">
                                                                            Mọi người có thể xem
                                                                        </div>
                                                                    </div>
                                                                </FormLabel>
                                                            </FormItem>
                                                            <FormItem className="flex items-center space-x-3 space-y-0 p-3 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors cursor-pointer">
                                                                <FormControl>
                                                                    <RadioGroupItem value="friends" id="friends" />
                                                                </FormControl>
                                                                <FormLabel
                                                                    htmlFor="friends"
                                                                    className="font-normal text-sm flex items-center cursor-pointer flex-1"
                                                                >
                                                                    <span className="text-lg mr-2">👥</span>
                                                                    <div>
                                                                        <div className="font-medium">Bạn bè</div>
                                                                        <div className="text-xs text-gray-500">
                                                                            Chỉ bạn bè có thể xem
                                                                        </div>
                                                                    </div>
                                                                </FormLabel>
                                                            </FormItem>
                                                            <FormItem className="flex items-center space-x-3 space-y-0 p-3 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors cursor-pointer">
                                                                <FormControl>
                                                                    <RadioGroupItem value="onlyMe" id="onlyMe" />
                                                                </FormControl>
                                                                <FormLabel
                                                                    htmlFor="onlyMe"
                                                                    className="font-normal text-sm flex items-center cursor-pointer flex-1"
                                                                >
                                                                    <span className="text-lg mr-2">🔒</span>
                                                                    <div>
                                                                        <div className="font-medium">Riêng tư</div>
                                                                        <div className="text-xs text-gray-500">
                                                                            Chỉ mình tôi
                                                                        </div>
                                                                    </div>
                                                                </FormLabel>
                                                            </FormItem>
                                                        </RadioGroup>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* Upload Button */}
                                    <div className="pt-4">
                                        <Button
                                            type="submit"
                                            disabled={!videoUpload || isPending || !descriptionInput}
                                            className={cn(
                                                'w-full h-14 text-lg font-semibold rounded-xl transition-all duration-300 shadow-lg',
                                                'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700',
                                                'disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed disabled:shadow-none',
                                                'hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0',
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
                                                    Đăng video ngay
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </div>

                        {/* Tips */}
                        <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-6 border border-blue-100">
                            <div className="flex items-center mb-4">
                                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-2 rounded-lg mr-3">
                                    <svg
                                        className="w-5 h-5 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                        />
                                    </svg>
                                </div>
                                <h4 className="font-semibold text-gray-800">Mẹo tạo video viral</h4>
                            </div>
                            <div className="grid gap-3">
                                <div className="flex items-start p-3 bg-white/60 rounded-lg">
                                    <div className="bg-blue-100 p-1 rounded-full mr-3 mt-0.5">
                                        <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98A1 1 0 0117 18H15a1 1 0 110-2h.382l-.724-1.447A1 1 0 0015 14a1 1 0 01-.447-.106l-2-1A1 1 0 0113 12a1 1 0 01.553-.894l2-1A1 1 0 0116 10h2a1 1 0 110 2h-1.382l.724 1.447A1 1 0 0117 14a1 1 0 01.447.106l2 1A1 1 0 0120 16a1 1 0 01-.553.894l-2 1A1 1 0 0117 18a1 1 0 01-.894-.553L13.118 11.4a1 1 0 01.894-1.4z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="text-sm">
                                        <div className="font-medium text-gray-700">Hashtag trending</div>
                                        <div className="text-gray-600">Sử dụng hashtag phổ biến để tăng lượt xem</div>
                                    </div>
                                </div>
                                <div className="flex items-start p-3 bg-white/60 rounded-lg">
                                    <div className="bg-purple-100 p-1 rounded-full mr-3 mt-0.5">
                                        <svg
                                            className="w-3 h-3 text-purple-600"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="text-sm">
                                        <div className="font-medium text-gray-700">Mô tả hấp dẫn</div>
                                        <div className="text-gray-600">Viết mô tả có call-to-action rõ ràng</div>
                                    </div>
                                </div>
                                <div className="flex items-start p-3 bg-white/60 rounded-lg">
                                    <div className="bg-pink-100 p-1 rounded-full mr-3 mt-0.5">
                                        <svg className="w-3 h-3 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="text-sm">
                                        <div className="font-medium text-gray-700">Thời gian đăng tối ưu</div>
                                        <div className="text-gray-600">
                                            Đăng vào giờ vàng (19h-22h) để có nhiều tương tác
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-start p-3 bg-white/60 rounded-lg">
                                    <div className="bg-green-100 p-1 rounded-full mr-3 mt-0.5">
                                        <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="text-sm">
                                        <div className="font-medium text-gray-700">Độ dài video</div>
                                        <div className="text-gray-600">
                                            Video 15-30 giây có tỷ lệ hoàn thành cao nhất
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dialog xác nhận upload không có token */}
            <DialogNonAddressToken
                showConfirmDialog={showConfirmDialog}
                setShowConfirmDialog={setShowConfirmDialog}
                handleUpload={() => performUpload(form.getValues())}
                isUploading={isPending}
            />

            {/* Dialog xác nhận token info */}
            <DialogConfirmTokenInfor
                open={showDialogInfoToken}
                onOpenChange={setShowDialogInfoToken}
                tokenExists={tokenInfo ? true : false}
                tokenInfo={tokenInfo}
                onConfirm={() => performUpload(form.getValues())}
                isLoading={isPending}
            />
        </div>
    );
};

export default Create;

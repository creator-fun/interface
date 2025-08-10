import React, { forwardRef, useCallback, useRef } from 'react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import config from '@/constants/config';

interface Props {
    onChange?: (file?: File) => void;
}

const InputFile = forwardRef<HTMLInputElement, Props>(({ onChange }, ref) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const fileFromLocal = e.target.files?.[0];
            if (
                fileFromLocal &&
                (fileFromLocal.size >= config.maxSizeUploadAvatar || !fileFromLocal.type.includes('video'))
            ) {
                toast.error('Dụng lượng file tối đa 25MB. Định dạng: MP4, MOV, AVI, WMV', {
                    position: 'top-right',
                });
            } else {
                onChange?.(fileFromLocal);
            }
        },
        [onChange],
    );
    return (
        <>
            <input
                ref={ref || fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleInputChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            <div className="space-y-4">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V3a1 1 0 011 1v12a4 4 0 01-4 4H8a4 4 0 01-4-4V4a1 1 0 011-1h0z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 12l-3-3m0 0l3-3m-3 3h6"
                        />
                    </svg>
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Chọn video để upload</h3>
                    <Button className="bg-gradient-to-r mt-2 from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                        </svg>
                        Chọn video
                    </Button>
                </div>

                <div className="text-xs text-gray-400 space-y-1">
                    <p>Hỗ trợ: MP4, MOV, AVI, WMV</p>
                    <p>Tối đa: 100MB, 60 giây</p>
                </div>
            </div>
        </>
    );
});

export default InputFile;

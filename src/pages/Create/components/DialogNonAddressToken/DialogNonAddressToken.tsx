import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface DialogNonAddressTokenProps {
    showConfirmDialog: boolean;
    setShowConfirmDialog: (showConfirmDialog: boolean) => void;
    handleUpload: () => void;
    isUploading: boolean;
}

const DialogNonAddressToken = ({
    showConfirmDialog,
    setShowConfirmDialog,
    handleUpload,
    isUploading,
}: DialogNonAddressTokenProps) => {
    return (
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center text-orange-600">
                        <svg
                            className="w-6 h-6 mr-2 text-orange-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                        </svg>
                        Xác nhận upload video
                    </DialogTitle>
                    <DialogDescription className="text-gray-600 leading-relaxed">
                        Bạn chưa nhập địa chỉ token. Bạn có chắc chắn muốn upload video mà không liên kết với token nào
                        không?
                    </DialogDescription>
                </DialogHeader>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-4">
                    <div className="flex items-start">
                        <svg
                            className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0"
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
                        <div className="text-sm text-yellow-800">
                            <p className="font-medium mb-1">Lưu ý:</p>
                            <p>
                                Video sẽ được upload mà không liên kết với bất kỳ token nào. Bạn có thể thêm token
                                address sau này.
                            </p>
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex gap-3 sm:gap-3">
                    <Button variant="outline" onClick={() => setShowConfirmDialog(false)} className="flex-1">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                        Hủy bỏ
                    </Button>
                    <Button
                        onClick={handleUpload}
                        className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                        disabled={isUploading}
                    >
                        {isUploading ? (
                            <>
                                <svg
                                    className="animate-spin -ml-1 mr-2 h-4 w-4"
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
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                                Xác nhận upload
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DialogNonAddressToken;

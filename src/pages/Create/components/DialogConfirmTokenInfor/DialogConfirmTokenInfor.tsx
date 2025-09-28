import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { ITokenCheck } from '../../Create';

interface DialogConfirmTokenInforProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    tokenExists: boolean;
    tokenInfo?: ITokenCheck;
    onConfirm?: () => void;
    isLoading?: boolean;
}

const DialogConfirmTokenInfor = ({
    open,
    onOpenChange,
    tokenExists,
    tokenInfo,
    onConfirm,
    isLoading = false,
}: DialogConfirmTokenInforProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                {tokenExists && tokenInfo ? (
                    // Token exists - show token information
                    <>
                        <DialogHeader>
                            <DialogTitle className="flex items-center text-green-600">
                                <svg
                                    className="w-6 h-6 mr-2 text-green-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                Thông tin Token
                            </DialogTitle>
                            <DialogDescription className="text-gray-600">
                                Thông tin chi tiết về token được tìm thấy
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            {/* Token Image and Basic Info */}
                            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                    <img
                                        src={tokenInfo.icon}
                                        alt={tokenInfo.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = '/placeholder-token.png';
                                        }}
                                    />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg">{tokenInfo.name}</h3>
                                    <p className="text-gray-600">{tokenInfo.symbol}</p>
                                </div>
                            </div>

                            {/* Token Details */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-gray-600 font-medium">Giá:</span>
                                    <span className="font-semibold text-green-600">{tokenInfo.usdPrice}</span>
                                </div>

                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-gray-600 font-medium">Nền tảng:</span>
                                    <span className="font-medium">{tokenInfo.launchpad}</span>
                                </div>

                                <div className="py-2">
                                    <span className="text-gray-600 font-medium block mb-1">Địa chỉ:</span>
                                    <div className="bg-gray-100 p-2 rounded text-xs font-mono break-all">
                                        {tokenInfo.id}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="flex gap-3 sm:gap-3">
                            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
                                Đóng
                            </Button>
                            {onConfirm && (
                                <Button
                                    onClick={onConfirm}
                                    className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
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
                                            Đang xử lý...
                                        </>
                                    ) : (
                                        <>
                                            <svg
                                                className="w-4 h-4 mr-2"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                            Xác nhận
                                        </>
                                    )}
                                </Button>
                            )}
                        </DialogFooter>
                    </>
                ) : (
                    // Token doesn't exist
                    <>
                        <DialogHeader>
                            <DialogTitle className="flex items-center text-red-600">
                                <svg
                                    className="w-6 h-6 mr-2 text-red-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                Token không tồn tại
                            </DialogTitle>
                            <DialogDescription className="text-gray-600">
                                Không thể tìm thấy thông tin token với địa chỉ được cung cấp
                            </DialogDescription>
                        </DialogHeader>

                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
                            <div className="flex items-start">
                                <svg
                                    className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <div className="text-sm text-red-800">
                                    <p className="font-medium mb-1">Lỗi:</p>
                                    <p>
                                        Token không được tìm thấy hoặc địa chỉ token không hợp lệ. Vui lòng kiểm tra lại
                                        địa chỉ token.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                                Đóng
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default DialogConfirmTokenInfor;

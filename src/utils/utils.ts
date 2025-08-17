export const formatNumber = (num: number): string => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
};

export const truncateAddress = (addr: string, startChars: number = 8) => {
    if (!addr) return '';
    if (addr.length <= startChars + 3) return addr; // Nếu địa chỉ quá ngắn thì hiển thị nguyên
    return `${addr.substring(0, startChars)}...`;
};

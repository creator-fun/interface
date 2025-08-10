import { Progress } from '@/components/ui/progress';

const mockData = {
    avatar: 'https://th.bing.com/th/id/R.8e578585b383dc11bc8753de50819d34?rik=%2fMMSRswpZLPZHg&pid=ImgRaw&r=0',
    avatarBg: '#10B981', // Green background
    tokenName: 'ZEB',
    currentPrice: '$7.3K',
    athValue: '$7.3K',
    progressPercentage: 30,
};

const InfoTokenBuy = () => {
    return (
        <div className="flex items-center gap-2">
            {/* Avatar */}
            <div
                className="w-4 h-4 rounded-full flex items-center justify-center text-black font-bold text-sm"
                style={{ backgroundColor: mockData.avatarBg }}
            >
                <img src={mockData.avatar} alt="avatar" className="w-full h-full object-cover rounded-full" />
            </div>

            {/* Token Info */}
            <div className="flex flex-col">
                <span className="text-white font-medium text-sm">{mockData.tokenName}</span>
            </div>

            {/* Progress Bar */}
            <div className="flex-1">
                <Progress value={mockData.progressPercentage} className="h-1 w-[50px] bg-[#374154]" />
            </div>

            {/* ATH Value */}
            <div className="text-right">
                <div className="text-white text-xs">ATH: {mockData.athValue}</div>
            </div>
        </div>
    );
};

export default InfoTokenBuy;

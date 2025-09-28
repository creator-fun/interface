import { Progress } from '@/components/ui/progress';
import { formatNumber } from '@/utils/utils';

const ATH = 120000;

interface Props {
    icon: string;
    symbol: string;
    mcap: number;
}

const InfoTokenBuy = ({ icon, symbol, mcap }: Props) => {
    return (
        <div className="flex items-center gap-2">
            {/* Avatar */}
            <div
                className="w-4 h-4 rounded-full flex items-center justify-center text-black font-bold text-sm"
                style={{ backgroundColor: '#10B981' }}
            >
                <img src={icon} alt="avatar" className="w-full h-full object-cover rounded-full" />
            </div>

            {/* Token Info */}
            <div className="flex flex-col">
                <span className="text-white font-medium text-sm">{symbol}</span>
            </div>

            {/* Progress Bar */}
            <div className="flex-1">
                <Progress value={(mcap / ATH) * 100} className="h-1 w-[50px] bg-[#374154]" />
            </div>

            {/* ATH Value */}
            <div className="text-right">
                <div className="text-white text-xs">ATH: {formatNumber(ATH)}</div>
            </div>
        </div>
    );
};

export default InfoTokenBuy;

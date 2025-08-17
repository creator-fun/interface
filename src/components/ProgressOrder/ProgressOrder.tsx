import { type FC } from 'react';
import { formatNumber } from '@/utils/utils';
import { Progress } from '../ui/progress';

const ProgressOrder: FC<{ totalOrderATH: number; percentage: number }> = ({ totalOrderATH, percentage }) => {
    console.log('percentage', percentage);

    return (
        <div className="flex items-center flex-1 gap-4">
            <div className="flex-1">
                <Progress value={percentage} className="h-1 w-full bg-[#374154]" />
            </div>

            {/* ATH Value */}
            <div className="text-right">
                <div className="text-white text-base">ATH: {formatNumber(totalOrderATH)}</div>
            </div>
        </div>
    );
};

export default ProgressOrder;

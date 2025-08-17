import ProgressOrder from '@/components/ProgressOrder/ProgressOrder';
import { ChevronDown } from 'lucide-react';

import chartImg from '@/assets/chart.png';
import { formatNumber } from '@/utils/utils';

interface CoinInfoGroupProps {
    name: string;
    image: string;
    symbol: string;
    orderPercentage: number;
    totalATH: number;
    currentOrderATH: number;
}
const CoinInfoGroup = ({ name, image, symbol, orderPercentage, totalATH, currentOrderATH }: CoinInfoGroupProps) => {
    return (
        <div className="px-4 py-3 max-w-[250px] rounded-lg bg-[#2E313A] mt-4 flex-shrink-0">
            <div className="flex items-end gap-2 mb-2">
                <img src={image} alt="img" className="w-12 h-12 rounded-lg" />
                <div>
                    <div className="text-white text-sm font-medium">{name}</div>
                    <div className="text-gray-400 text-sm">{symbol}</div>
                </div>
            </div>
            <div className="flex justify-between gap-4">
                <div>
                    <div className="flex items-end gap-2">
                        <h2 className="text-white text-xl font-medium">${formatNumber(currentOrderATH)}</h2>
                        <span className="text-gray-400 text-base">MC</span>
                    </div>
                    <div className="flex items-center mt-1.5 gap-1">
                        <div className="flex items-center gap-1">
                            <div className="p-0.5 rounded-[50%] bg-red-400 text-white">
                                <ChevronDown className="w-4 h-4" />
                            </div>
                            <span className=" text-base font-medium text-red-400">{orderPercentage}%</span>
                        </div>
                        <span className="text-gray-400 text-base">24h</span>
                    </div>
                </div>
                <div className="w-1/2">
                    <img src={chartImg} alt="chart-img" className="block w-full h-[60px]" />
                </div>
            </div>
            <div className="mt-2">
                <ProgressOrder percentage={orderPercentage} totalOrderATH={totalATH} />
            </div>
        </div>
    );
};

export default CoinInfoGroup;

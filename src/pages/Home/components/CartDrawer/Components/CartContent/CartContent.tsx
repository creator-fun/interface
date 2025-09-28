import { useState } from 'react';
import { X, Star, Sprout, ChartColumnStacked, Bell, Ellipsis } from 'lucide-react';
import { SheetClose, SheetContent } from '@/components/ui/sheet';
import PriceChart from '../../../PriceChart/PriceChart';
import ProgressOrder from '@/components/ProgressOrder/ProgressOrder';
import { formatNumber } from '@/utils/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import InfoToken from '../InfoToken/InfoToken';
import CommentsToken from '../CommentsToken/CommentsToken';
import HolderToken from '../HolderToken/HolderToken';
import type { TokenInfo } from '@/queries/useGetTokenInfo';

interface CartItem {
    id: string;
    name: string;
    subName: string;
    listedTime: string;
    listSocialToken: { name: string; url: string }[];
    listSocialCreator: { name: string; url: string }[];
    orderPercentage: number;
    address: string;
    totalATH: number;
    currentOrderATH: number;
    description: string;
    listHasTag: string[];
    image: string;
    createdBy: string;
    listSameToken: {
        name: string;
        image: string;
        symbol: string;
        orderPercentage: number;
        totalATH: number;
        currentOrderATH: number;
    }[];
}

const mockCartItem: CartItem = {
    id: '1',
    name: 'dumb money',
    subName: 'Gasden',
    createdBy: 'dumb money',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    listedTime: '3',
    listSocialToken: [
        { name: 'X', url: 'https://twitter.com/intent/tweet?url=https://www.google.com' },
        { name: 'YouTube', url: 'https://www.youtube.com/c/YourChannel' },
        { name: 'Telegram', url: 'https://t.me/share/url?url=https://www.google.com' },
        { name: 'Instagram', url: 'https://www.instagram.com/yourprofile' },
    ],
    listSocialCreator: [
        { name: 'X', url: 'https://twitter.com/intent/tweet?url=https://www.google.com' },
        { name: 'YouTube', url: 'https://www.youtube.com/c/YourChannel' },
        { name: 'Telegram', url: 'https://t.me/share/url?url=https://www.google.com' },
        { name: 'Instagram', url: 'https://www.instagram.com/yourprofile' },
    ],
    address: '0x1234567890123456789012345678901234567890',
    orderPercentage: 30,
    totalATH: 1000000,
    currentOrderATH: 300000,
    description: 'this is an amazing token for the community, it has a lot of potential and is a great investment',
    listHasTag: ['tag1', 'tag2', 'tag3'],
    listSameToken: [
        {
            name: 'dumb money',
            image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
            symbol: 'DM',
            orderPercentage: 30,
            totalATH: 1000000,
            currentOrderATH: 300000,
        },
        {
            name: 'dumb money',
            image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
            symbol: 'DM',
            orderPercentage: 30,
            totalATH: 1000000,
            currentOrderATH: 300000,
        },
    ],
};

const chartFilterOptions: { value: string; label: string }[] = [
    { value: 'price', label: 'Price' },
    {
        value: 'vol',
        label: 'Vol',
    },
    {
        value: 'market',
        label: 'Market',
    },
];

const CartContent = ({ token }: { token: TokenInfo }) => {
    console.log('token', token);

    const [cartItem] = useState<CartItem>(mockCartItem);
    const [chartFilter, setChartFilter] = useState<string>('price');
    return (
        <SheetContent side="bottom" className="w-screen z-[1000] bg-[#15161B] border-none text-white">
            <div className="h-[85vh] w-full overflow-auto flex flex-col pb-[60px] relative">
                <div className="text-right relative z-10 flex items-center justify-end gap-2 text-white border-b-[0.5px] border-b-gray-200 pt-4 pb-2 px-4">
                    <button>
                        <ChartColumnStacked />
                    </button>
                    <button className="rounded-[50%] p-1 border border-white">
                        <Bell className="w-[16px] h-[16px]" />
                    </button>
                    <button className="rounded-[50%] p-1 border border-white">
                        <Star className="w-[16px] h-[16px]" />
                    </button>
                    <button className="rounded-[50%] p-1 border border-white">
                        <Ellipsis className="w-[16px] h-[16px]" />
                    </button>
                    <SheetClose className="rounded-[50%] p-1 border border-white">
                        <X size={16} />
                    </SheetClose>
                </div>
                <div className="flex  items-end text-white mb-4 pt-2 gap-2 px-4 relative h-[100px] -mt-[30px]">
                    <div>
                        <img
                            src={token?.icon}
                            alt={token?.name}
                            className="block object-center relative z-10 w-[100px] h-[100px] rounded-full"
                        />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl">{token?.name}</h2>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-300">{token?.symbol}</span>
                            <div className="flex items-center gap-1 text-[#84F0AB]">
                                <span>
                                    <Sprout className="w-[16px] h-[16px]" />
                                </span>
                                <span className="text-base">{cartItem.listedTime}m</span>
                            </div>
                        </div>
                        {/* <CopyComponent address={cartItem.address} /> */}
                    </div>
                    <div>
                        <button className="px-4 py-2 bg-[#84F0AB] rounded-full font-medium text-black">Share</button>
                    </div>
                </div>
                <div className="flex-1">
                    <div className="flex flex-col h-full">
                        <div className="flex gap-2 items-center border-[60606b] px-2 py-2">
                            {chartFilterOptions.map((range) => (
                                <button
                                    key={range.label}
                                    onClick={() => setChartFilter(range.value)}
                                    className={cn(
                                        'rounded px-2 py-1 text-xs transition-colors border border-[60606b]',
                                        chartFilter === range.value
                                            ? 'bg-[#1B1B1C] text-[#F9F9FA]'
                                            : 'text-[#7A7A83] hover:text-[#F9F9FA]',
                                    )}
                                >
                                    {range.label}
                                </button>
                            ))}
                        </div>
                        <div className="flex-shrink-0">
                            <PriceChart tokenAddress={token?.address} />
                        </div>

                        <div className="px-4 mt-1">
                            <h3 className="text-xl mb-2">MaketCap</h3>
                            <div className="flex items-center gap-4">
                                <div className="text-base">{formatNumber(cartItem.currentOrderATH)}</div>
                                <ProgressOrder
                                    totalOrderATH={cartItem.totalATH}
                                    percentage={cartItem.orderPercentage}
                                />
                            </div>
                            <div className="text-base font-medium text-center">{cartItem.orderPercentage}%</div>
                        </div>

                        <div className="border-t border-gray-600 mt-4">
                            <Tabs defaultValue="information" className="w-full text-white">
                                <TabsList className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-1 rounded-none border-r-none border-l-none">
                                    <TabsTrigger
                                        value="information"
                                        className="flex-1 text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:shadow-lg transition-all duration-300 rounded-lg py-2.5 px-4 font-medium hover:text-white hover:bg-gray-700/50"
                                    >
                                        Information
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="comments"
                                        className="flex-1 text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:shadow-lg transition-all duration-300 rounded-lg py-2.5 px-4 font-medium hover:text-white hover:bg-gray-700/50"
                                    >
                                        Comments
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="holders"
                                        className="flex-1 text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:shadow-lg transition-all duration-300 rounded-lg py-2.5 px-4 font-medium hover:text-white hover:bg-gray-700/50"
                                    >
                                        Holders
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent
                                    value="information"
                                    className="px-4 pt-2 pb-4 bg-gray-800/30 border-t border-t-gray-700/50 rounded-none"
                                >
                                    <InfoToken
                                        listHasTag={cartItem.listHasTag}
                                        listSocialCreator={cartItem.listSocialCreator}
                                        description={cartItem.description}
                                        listSameToken={cartItem.listSameToken}
                                    />
                                </TabsContent>
                                <TabsContent value="comments" className="p-4 bg-gray-800/30 border border-gray-700/50">
                                    <CommentsToken />
                                </TabsContent>
                                <TabsContent value="holders" className="p-4 bg-gray-800/30 border border-gray-700/50">
                                    <HolderToken />
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>

                <div className="fixed z-[100] flex items-center justify-between px-4 py-2.5 h-[60px] bottom-0 left-0 right-0 bg-black/90">
                    <div className="flex items-center justify-center gap-2">
                        <button className="text-white border border-white px-4 py-1.5 rounded-md h-[40px]">
                            Join chat
                        </button>
                        <button className="text-white border border-white px-4 py-1.5 rounded-md h-[40px]">Send</button>
                    </div>
                    <div className="flex items-center justify-center border border-white rounded-md h-[40px]">
                        <button className="text-white px-4 py-1.5">Quick Buy</button>
                        <div className="w-[1px] h-full bg-white"></div>
                        <button className="text-white px-4 py-1.5">Buy</button>
                    </div>
                </div>
            </div>
        </SheetContent>
    );
};

export default CartContent;

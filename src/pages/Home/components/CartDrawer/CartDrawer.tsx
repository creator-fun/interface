import { useState } from 'react';
import { X, Star, Sprout, ChartColumnStacked, Bell, Ellipsis, Youtube, Send, Instagram } from 'lucide-react';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import PriceChart from '../PriceChart/PriceChart';
import InfoTokenBuy from '../InfoTokenBuy/InfoTokenBuy';
import { Link } from 'react-router-dom';
import CopyComponent from '@/components/CopyComponent/CopyComponent';
import ProgressOrder from '@/components/ProgressOrder/ProgressOrder';
import { formatNumber } from '@/utils/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InfoToken from './Components/InfoToken/InfoToken';
import CommentsToken from './Components/CommentsToken/CommentsToken';
import HolderToken from './Components/HolderToken/HolderToken';
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

const initialData = [
    { open: 10, high: 10.63, low: 9.49, close: 9.55, time: 1642427876 },
    { open: 9.55, high: 10.3, low: 9.42, close: 9.94, time: 1642514276 },
    { open: 9.94, high: 10.17, low: 9.92, close: 9.78, time: 1642600676 },
    { open: 9.78, high: 10.59, low: 9.18, close: 9.51, time: 1642687076 },
    { open: 9.51, high: 10.46, low: 9.1, close: 10.17, time: 1642773476 },
    { open: 10.17, high: 10.96, low: 10.16, close: 10.47, time: 1642859876 },
    { open: 10.47, high: 11.39, low: 10.4, close: 10.81, time: 1642946276 },
    { open: 10.81, high: 11.6, low: 10.3, close: 10.75, time: 1643032676 },
    { open: 10.75, high: 11.6, low: 10.49, close: 10.93, time: 1643119076 },
    { open: 10.93, high: 11.53, low: 10.76, close: 10.96, time: 1643205476 },
];

const CartDrawer = () => {
    const [cartItem] = useState<CartItem>(mockCartItem);

    return (
        <Sheet>
            <SheetTrigger className="mb-1 bg-black/25 flex items-center gap-2 text-white rounded-full text-xs py-1 px-2 shadow-lg hover:shadow-xl transition-all duration-300">
                <InfoTokenBuy />
            </SheetTrigger>
            <SheetContent side="bottom" className="w-screen z-[1000] bg-[#15161B] border-none text-white">
                <div className="h-[85vh] w-full overflow-auto flex flex-col pb-[60px] relative">
                    <div className="text-right flex items-center justify-end gap-2 text-white border-b-[0.5px] border-b-gray-200 pt-4 pb-2 px-4">
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
                    <div className="flex items-end text-white mb-4 pt-2 gap-2 px-4 relative h-[100px] -mt-[30px]">
                        <div>
                            <img
                                src={cartItem.image}
                                alt={cartItem.name}
                                className="block object-center w-[100px] h-[100px] rounded-lg"
                            />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl">{cartItem.name}</h2>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-300">{cartItem.subName}</span>
                                <div className="flex items-center gap-1 text-[#84F0AB]">
                                    <span>
                                        <Sprout className="w-[16px] h-[16px]" />
                                    </span>
                                    <span className="text-base">{cartItem.listedTime}m</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <button className="px-4 py-2 bg-[#84F0AB] rounded-full font-medium text-black">
                                Share
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 px-4 mb-4">
                        {cartItem.listSocialToken.map((social) => {
                            const getSocialIcon = (name: string) => {
                                switch (name) {
                                    case 'X':
                                        return <X className="w-5 h-5" />;
                                    case 'YouTube':
                                        return <Youtube className="w-5 h-5" />;
                                    case 'Telegram':
                                        return <Send className="w-4 h-4" />;
                                    case 'Instagram':
                                        return <Instagram className="w-5 h-5" />;
                                    default:
                                        return null;
                                }
                            };

                            return (
                                <Link
                                    key={social.name}
                                    to={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="gap-2 w-[40px] h-[30px] flex items-center justify-center rounded-lg text-white border border-white transition-colors"
                                >
                                    {getSocialIcon(social.name)}
                                </Link>
                            );
                        })}
                        <CopyComponent address={cartItem.address} />
                    </div>
                    <div className="px-4 mb-4">
                        <h3 className="text-xl mb-2">MaketCap</h3>
                        <div className="flex items-center gap-4">
                            <div className="text-base">{formatNumber(cartItem.currentOrderATH)}</div>
                            <ProgressOrder totalOrderATH={cartItem.totalATH} percentage={cartItem.orderPercentage} />
                        </div>
                        <div className="text-base font-medium text-center">{cartItem.orderPercentage}%</div>
                    </div>
                    <div className="flex-1">
                        <div className="flex flex-col h-full">
                            <div className="flex-shrink-0">
                                <PriceChart
                                    data={initialData}
                                    colors={{
                                        backgroundColor: '#181921', // Nền đen
                                        lineColor: 'red', // Màu xanh lá cho đường
                                        textColor: '#dbdbdb', // Text màu trắng
                                        areaTopColor: '#089981', // Nến xanh lá (giá tăng)
                                        areaBottomColor: '#F23645', // Nến đỏ (giá giảm)
                                    }}
                                />
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
                                    <TabsContent
                                        value="comments"
                                        className="p-4 bg-gray-800/30 border border-gray-700/50"
                                    >
                                        <CommentsToken />
                                    </TabsContent>
                                    <TabsContent
                                        value="holders"
                                        className="p-4 bg-gray-800/30 border border-gray-700/50"
                                    >
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
                            <button className="text-white border border-white px-4 py-1.5 rounded-md h-[40px]">
                                Send
                            </button>
                        </div>
                        <div className="flex items-center justify-center border border-white rounded-md h-[40px]">
                            <button className="text-white px-4 py-1.5">Quick Buy</button>
                            <div className="w-[1px] h-full bg-white"></div>
                            <button className="text-white px-4 py-1.5">Buy</button>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default CartDrawer;

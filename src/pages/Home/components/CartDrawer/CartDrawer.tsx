import { useState } from 'react';
import { X, ShoppingCart, Star, Heart, Store } from 'lucide-react';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import PriceChart from '../PriceChart/PriceChart';

interface CartItem {
    id: string;
    name: string;
    price: number;
    originalPrice: number;
    image: string;
    discount: number;
    freeShip: boolean;
    rating: number;
    reviews: number;
    description: string;
}

const mockCartItem: CartItem = {
    id: '1',
    name: 'TEE003 Áo thun kẻ Cổ Tàu Henley-Tee chất liệu Cotton basic phong cách Hàn Quốc Unisex MANDO Mens',
    price: 166000,
    originalPrice: 250000,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    discount: 34,
    freeShip: true,
    rating: 4.7,
    reviews: 7797,
    description: 'Áo thun kẻ cổ tàu Henley-Tee chất liệu Cotton basic phong cách Hàn Quốc',
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

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
    };

    return (
        <Sheet>
            <SheetTrigger className="mb-1 bg-black/25 flex items-center gap-2 text-white rounded-full text-xs py-1 px-2 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
                <ShoppingCart size={16} className="text-white" />
                <span className="text-white text-xs">Mua Ngay</span>
            </SheetTrigger>
            <SheetContent side="bottom" className="w-screen z-[1000]">
                <div className="bg-white h-[85vh]  w-full overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
                        <SheetClose className="p-1">
                            <X size={24} className="text-gray-600" />
                        </SheetClose>
                        <div className="flex items-center gap-2 text-gray-700">
                            <span className="text-base">Tìm kiếm:</span>
                            <span className="text-blue-600 font-medium text-base">áo sọc nam</span>
                        </div>
                        <button className="p-1">
                            <ShoppingCart size={24} className="text-gray-700" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto bg-[#F5F5F5]">
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
                                {/* <img
                                    src={cartItem.image}
                                    alt={cartItem.name}
                                    className="object-cover block w-full h-[45vh]"
                                /> */}
                            </div>

                            {/* Product Details */}
                            <div className="flex-1 flex flex-col bg-white">
                                <div className="p-4">
                                    <h3 className="text-sm font-medium text-gray-900 leading-tight mb-2">
                                        {cartItem.name}
                                    </h3>

                                    {/* Rating */}
                                    <div className="flex items-center gap-1 mb-2">
                                        <Star size={12} className="text-yellow-400 fill-current" />
                                        <span className="text-xs text-gray-600">
                                            {cartItem.rating} | {cartItem.reviews.toLocaleString()} lượt đánh giá
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-red-600 font-bold text-lg">
                                            {formatPrice(cartItem.price)}
                                        </span>
                                        <span className="text-gray-400 line-through text-sm">
                                            {formatPrice(cartItem.originalPrice)}
                                        </span>
                                        <span className="bg-red-100 text-red-600 text-xs px-1 py-0.5 rounded">
                                            -{cartItem.discount}%
                                        </span>
                                    </div>

                                    {/* Badges */}
                                    <div className="flex gap-1 mb-3">
                                        {cartItem.freeShip && (
                                            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                                                🌟 Freeship
                                            </span>
                                        )}
                                        <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded">
                                            Giảm 14%
                                        </span>
                                        <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded">
                                            Quà miễn phí
                                        </span>
                                    </div>
                                </div>

                                <div className="border-t p-4 border-gray-200 mt-auto">
                                    <div className="flex gap-3">
                                        <button>
                                            <Store size={24} className="text-black" />
                                        </button>
                                        <button>
                                            <Heart size={24} className="text-black" />
                                        </button>
                                        <button className="bg-gray-100 text-gray-700 p-2 rounded-lg font-medium text-sm flex-1">
                                            Thêm vào giỏ hàng
                                        </button>

                                        <button className="bg-red-500 text-white px-6 py-3 rounded-lg font-medium text-sm">
                                            Mua Ngay
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default CartDrawer;

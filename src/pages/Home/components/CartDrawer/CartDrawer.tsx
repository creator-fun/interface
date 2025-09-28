import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import InfoTokenBuy from '../InfoTokenBuy/InfoTokenBuy';
import CartContent from './Components/CartContent/CartContent';
import { useState } from 'react';
import type { TokenInfo } from '@/queries/useGetTokenInfo';

interface props {
    token: TokenInfo;
}

const CartDrawer = ({ token }: props) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <Sheet defaultOpen={false} onOpenChange={setIsOpen}>
            <SheetTrigger className="mb-1 bg-black/25 flex items-center gap-2 text-white rounded-full text-xs py-1 px-2 shadow-lg hover:shadow-xl transition-all duration-300">
                <InfoTokenBuy icon={token?.icon} symbol={token?.symbol} mcap={token?.mcap} />
            </SheetTrigger>
            {isOpen && <CartContent token={token} />}
        </Sheet>
    );
};

export default CartDrawer;

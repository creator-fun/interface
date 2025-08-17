import CardUserInfo from '@/components/CardUserInfo/CardUserInfo';
import type { FC } from 'react';
import CoinInfoGroup from '../CoinInfoGroup/CoinInfoGroup';

const InfoToken: FC<{
    listHasTag: string[];
    listSocialCreator: { name: string; url: string }[];
    description: string;
    listSameToken: {
        name: string;
        image: string;
        symbol: string;
        orderPercentage: number;
        totalATH: number;
        currentOrderATH: number;
    }[];
}> = ({ listHasTag, listSocialCreator, description, listSameToken }) => {
    return (
        <div className="text-gray-400">
            <div className="text-xl mb-4">Description: {description}</div>
            <div className="flex items-center gap-3">
                {listHasTag.length > 0 &&
                    listHasTag.map((tag) => {
                        return (
                            <div
                                key={tag}
                                rel="noopener noreferrer"
                                className="gap-2 w-[40px] h-[30px] flex items-center justify-center rounded-lg text-white border border-white transition-colors"
                            >
                                {tag}
                            </div>
                        );
                    })}
            </div>
            <div className="mt-4">
                <h4 className="text-xl text-white mb-2">Coin Creator</h4>
                <CardUserInfo
                    title="Dumb Money"
                    subTitle="dumb money"
                    avatar="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop"
                    buttonName="Follow"
                    onClick={() => {}}
                    listSocial={listSocialCreator}
                />
            </div>
            <div className="mt-4">
                <h4 className="text-xl text-white mb-2">Community</h4>
                <CardUserInfo
                    title="Dumb Money"
                    subTitle="100 members"
                    avatar="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop"
                    buttonName="Join"
                    onClick={() => {}}
                />
            </div>
            <div className="mt-4">
                <h4 className="text-xl text-white mb-2">Same Coin</h4>
                <div className="flex overflow-auto gap-2">
                    {listSameToken.length > 0 &&
                        listSameToken.map((item) => <CoinInfoGroup key={item.name} {...item} />)}
                </div>
            </div>
        </div>
    );
};

export default InfoToken;

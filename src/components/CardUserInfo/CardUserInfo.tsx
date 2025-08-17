import { Instagram, Send, X, Youtube } from 'lucide-react';
import { type FC } from 'react';
import { Link } from 'react-router-dom';

const CardUserInfo: FC<{
    title: string;
    subTitle: string;
    avatar: string;
    buttonName: string;
    onClick: () => void;
    listSocial?: { name: string; url: string }[];
}> = ({ title, subTitle, avatar, buttonName = 'Follow', onClick, listSocial }) => {
    return (
        <div>
            <div className="flex items-center gap-3 border border-gray-400 rounded-lg p-2">
                <div>
                    <img src={avatar} alt="image" className="w-12 h-12 rounded-full block" />
                </div>
                <div className="flex-1">
                    <div className="text-base text-white">{title}</div>
                    <div className="text-sm w-fit leading-[12px] mt-1 text-gray-400 border border-gray-400 rounded-lg px-2 py-1.5">
                        {subTitle}
                    </div>
                </div>
                <div>
                    <button className="py-2 px-4 text-white border border-gray-400 rounded-lg" onClick={onClick}>
                        {buttonName}
                    </button>
                </div>
            </div>
            <div className="flex mt-2 items-center gap-3 mb-4">
                {listSocial &&
                    listSocial.length > 0 &&
                    listSocial.map((social) => {
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
            </div>
        </div>
    );
};

export default CardUserInfo;

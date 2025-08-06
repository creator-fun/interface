import { Home as HomeIcon, Search, Plus, User, MessageCircle } from 'lucide-react';

const HeaderMainLayout = () => {
    return (
        <div>
            <div className="fixed bottom-0 z-100 left-0 right-0 bg-black/80 backdrop-blur-sm border-t border-white/10">
                <div className="flex items-center justify-around py-3">
                    <button className="flex flex-col items-center space-y-1">
                        <HomeIcon size={24} className="text-white" />
                        <span className="text-white text-xs">Home</span>
                    </button>
                    <button className="flex flex-col items-center space-y-1">
                        <Search size={24} className="text-white/60" />
                        <span className="text-white/60 text-xs">Discover</span>
                    </button>
                    <button className="flex flex-col items-center space-y-1">
                        <div className="w-12 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <Plus size={20} className="text-white" />
                        </div>
                    </button>
                    <button className="flex flex-col items-center space-y-1">
                        <MessageCircle size={24} className="text-white/60" />
                        <span className="text-white/60 text-xs">Inbox</span>
                    </button>
                    <button className="flex flex-col items-center space-y-1">
                        <User size={24} className="text-white/60" />
                        <span className="text-white/60 text-xs">Profile</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HeaderMainLayout;

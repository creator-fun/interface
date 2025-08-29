import { Home as HomeIcon, Search, Plus, User, MessageCircle } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const HeaderMainLayout = () => {
    return (
        <div>
            <div className="fixed bottom-0 z-100 left-0 right-0 bg-black/80 backdrop-blur-sm border-t border-white/10">
                <div className="flex items-center justify-around py-3">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            'flex flex-col items-center space-y-1 ' + (isActive ? 'text-white' : 'text-white/60')
                        }
                    >
                        <HomeIcon size={24} className="text-current" />
                        <span className="text-current text-xs">Home</span>
                    </NavLink>
                    <NavLink
                        to="/discover"
                        className={({ isActive }) =>
                            'flex flex-col items-center space-y-1 ' + (isActive ? 'text-white' : 'text-white/60')
                        }
                    >
                        <Search size={24} className="text-current" />
                        <span className="text-current text-xs">Discover</span>
                    </NavLink>
                    <NavLink to="/create" className="flex flex-col items-center space-y-1">
                        <div className="w-12 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <Plus size={20} className="text-white" />
                        </div>
                    </NavLink>
                    <NavLink
                        to="/inbox"
                        className={({ isActive }) =>
                            'flex flex-col items-center space-y-1 ' + (isActive ? 'text-white' : 'text-white/60')
                        }
                    >
                        <MessageCircle size={24} className="text-current" />
                        <span className="text-current text-xs">Inbox</span>
                    </NavLink>
                    <NavLink
                        to="/profile"
                        className={({ isActive }) =>
                            'flex flex-col items-center space-y-1 ' + (isActive ? 'text-white' : 'text-white/60')
                        }
                    >
                        <User size={24} className="text-current" />
                        <span className="text-current text-xs">Profile</span>
                    </NavLink>
                </div>
            </div>
        </div>
    );
};

export default HeaderMainLayout;

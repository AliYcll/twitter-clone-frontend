import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, User, LogOut, Hash, Bell, Mail, Bookmark, MoreHorizontal, Feather } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { currentUser, logout } = useAuth();

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to log out?')) {
            logout();
        }
    };

    const navItems = [
        { icon: <Home size={26} />, text: 'Home', path: '/' },
        { icon: <Hash size={26} />, text: 'Explore', path: '/explore' }, // Placeholder
        { icon: <Bell size={26} />, text: 'Notifications', path: '/notifications' }, // Placeholder
        { icon: <Mail size={26} />, text: 'Messages', path: '/messages' }, // Placeholder
        { icon: <Bookmark size={26} />, text: 'Bookmarks', path: '/bookmarks' }, // Placeholder
    ];

    if (currentUser) {
        navItems.push({ icon: <User size={26} />, text: 'Profile', path: '/retweets' }); // Mapping to existing route
        navItems.push({ icon: <Feather size={26} />, text: 'My Tweets', path: '/my-tweets' }); // Mapping to existing route
    }

    return (
        <div className="flex flex-col h-full px-2">
            {/* Logo */}
            <div className="p-3 w-fit hover:bg-white/10 rounded-full transition-colors cursor-pointer">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8 fill-white">
                    <g>
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                    </g>
                </svg>
            </div>

            {/* Navigation */}
            <nav className="mt-2 mb-4 flex-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.text}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-4 p-3 w-fit rounded-full transition-colors ${isActive ? 'font-bold' : 'font-normal'
                            } hover:bg-white/10`
                        }
                    >
                        {item.icon}
                        <span className="text-xl hidden xl:block">{item.text}</span>
                    </NavLink>
                ))}

                <button className="bg-primary hover:bg-primary-hover text-white rounded-full py-3 px-8 w-full mt-4 font-bold text-lg hidden xl:block shadow-lg transition-transform active:scale-95">
                    Post
                </button>
                <div className="xl:hidden p-3 bg-primary hover:bg-primary-hover rounded-full w-fit mt-4 mx-auto">
                    <Feather size={24} />
                </div>
            </nav>

            {/* User Actions */}
            {currentUser && (
                <div className="mt-auto mb-4 flex items-center justify-between p-3 rounded-full hover:bg-white/10 cursor-pointer transition-colors group">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-lg">
                            {currentUser.username ? currentUser.username[0].toUpperCase() : 'U'}
                        </div>
                        <div className="hidden xl:block">
                            <div className="font-bold text-sm">{currentUser.username}</div>
                            <div className="text-gray-text text-sm">@{currentUser.username}</div>
                        </div>
                    </div>
                    <div onClick={handleLogout} title="Logout" className="hidden xl:block">
                        <LogOut size={20} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sidebar;

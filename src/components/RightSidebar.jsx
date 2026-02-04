import React from 'react';
import { Search, MoreHorizontal } from 'lucide-react';

const RightSidebar = () => {
    return (
        <div className="h-full px-4 py-2 sticky top-0 overflow-y-auto hidden lg:block w-[350px]">
            {/* Search Bar */}
            <div className="sticky top-0 bg-black pt-1 pb-3 z-10">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="text-gray-text group-focus-within:text-primary" size={20} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full bg-[#202327] text-white border-none rounded-full py-3 pl-12 pr-4 focus:ring-1 focus:ring-primary focus:bg-black placeholder-gray-text"
                    />
                </div>
            </div>

            {/* Trends for you */}
            <div className="bg-[#16181C] rounded-2xl mt-4 px-4 py-3">
                <h2 className="text-xl font-bold mb-4">Trends for you</h2>
                {[
                    { category: 'Technology · Trending', topic: 'React', posts: '154K posts' },
                    { category: 'Sports · Trending', topic: 'Turkey', posts: '45.2K posts' },
                    { category: 'Politics · Trending', topic: '#Election2026', posts: '982K posts' },
                    { category: 'Business · Trending', topic: 'Crypto', posts: '12K posts' },
                ].map((trend, i) => (
                    <div key={i} className="py-3 hover:bg-white/5 cursor-pointer -mx-4 px-4 transition-colors relative">
                        <div className="flex justify-between items-start">
                            <div className="text-sm text-gray-text">{trend.category}</div>
                            <MoreHorizontal size={16} className="text-gray-text hover:text-primary" />
                        </div>
                        <div className="font-bold mt-0.5">{trend.topic}</div>
                        <div className="text-sm text-gray-text mt-0.5">{trend.posts}</div>
                    </div>
                ))}
                <div className="text-primary text-sm mt-2 cursor-pointer hover:underline">Show more</div>
            </div>

            {/* Who to follow */}
            <div className="bg-[#16181C] rounded-2xl mt-4 px-4 py-3">
                <h2 className="text-xl font-bold mb-4">Who to follow</h2>
                {[
                    { name: 'Google DeepMind', handle: '@DeepMind' },
                    { name: 'OpenAI', handle: '@OpenAI' },
                ].map((user, i) => (
                    <div key={i} className="flex items-center justify-between py-3 hover:bg-white/5 cursor-pointer -mx-4 px-4 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-600"></div>
                            <div>
                                <div className="font-bold text-sm hover:underline">{user.name}</div>
                                <div className="text-gray-text text-sm">{user.handle}</div>
                            </div>
                        </div>
                        <button className="bg-white text-black font-bold rounded-full px-4 py-1.5 text-sm hover:bg-opacity-90">
                            Follow
                        </button>
                    </div>
                ))}
                <div className="text-primary text-sm mt-4 cursor-pointer hover:underline">Show more</div>
            </div>
        </div>
    );
};

export default RightSidebar;

import React, { useState } from 'react';
import tweetService from '../services/tweetService';
import { Image, Smile, Calendar, MapPin, AlignLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const TweetForm = ({ onTweetCreated }) => {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const { currentUser } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        setLoading(true);
        try {
            await tweetService.createTweet(content);
            setContent('');
            if (onTweetCreated) {
                onTweetCreated();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="border-b border-border-color p-4 flex gap-4">
            <div className="shrink-0">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-lg text-white">
                    {currentUser?.username ? currentUser.username[0].toUpperCase() : 'U'}
                </div>
            </div>
            <div className="flex-1">
                <form onSubmit={handleSubmit}>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="What is happening?!"
                        className="w-full bg-transparent text-xl placeholder-gray-text border-none focus:ring-0 resize-none outline-none min-h-[50px] text-white"
                        rows="2"
                    />
                    <div className="flex items-center justify-between mt-4 border-t border-border-color pt-3">
                        <div className="flex gap-4 text-primary">
                            <Image size={20} className="cursor-pointer hover:text-primary-hover" />
                            <div className="hidden sm:block cursor-pointer hover:text-primary-hover"><AlignLeft size={20} /></div>
                            <Smile size={20} className="cursor-pointer hover:text-primary-hover" />
                            <Calendar size={20} className="cursor-pointer hover:text-primary-hover" />
                            <MapPin size={20} className="opacity-50" />
                        </div>
                        <button
                            type="submit"
                            disabled={!content.trim() || loading}
                            className="bg-primary hover:bg-primary-hover text-white rounded-full px-4 py-1.5 font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Posting...' : 'Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TweetForm;

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import tweetService from '../services/tweetService';
import userService from '../services/userService';
import TweetList from '../components/TweetList';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyTweetsPage = () => {
    const { currentUser } = useAuth();
    const [tweets, setTweets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const loadMyTweets = async () => {
        if (!currentUser) {
            setLoading(false);
            return;
        }
        setLoading(true);
        setError('');
        try {
            const profile = await userService.getCurrentUserProfile();
            const data = await tweetService.getTweetsByUserId(profile.id);
            setTweets(data);
        } catch (err) {
            setError(err.message || 'Failed to load tweets.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMyTweets();
    }, [currentUser]);

    return (
        <div className="w-full">
            {/* Sticky Header */}
            <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-border-color px-4 py-3 flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-xl font-bold text-white leading-tight">My Tweets</h1>
                    {currentUser && <p className="text-xs text-gray-text">@{currentUser.username}</p>}
                </div>
            </div>

            {!currentUser && <p className="p-4 text-center text-gray-text">Please login to view your tweets.</p>}

            {currentUser && loading && (
                <div className="p-8 text-center text-primary">
                    <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {currentUser && error && <p className="p-4 text-red-500 text-center">{error}</p>}

            {currentUser && !loading && !error && (
                <TweetList tweets={tweets} onAction={loadMyTweets} />
            )}
        </div>
    );
};

export default MyTweetsPage;

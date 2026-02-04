import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import tweetService from '../services/tweetService';
import TweetForm from '../components/TweetForm';
import TweetList from '../components/TweetList';

const HomePage = () => {
    const { currentUser } = useAuth();
    const [tweets, setTweets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTweets = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await tweetService.getTweets();
            setTweets(data);
        } catch (err) {
            setError(err.message || 'Failed to fetch tweets');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTweets();
    }, [currentUser]);

    return (
        <div className="w-full">
            {/* Sticky Header */}
            <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-border-color">
                <h1 className="px-4 py-3 text-xl font-bold text-white">Home</h1>
                <div className="flex border-b border-border-color">
                    <div className="flex-1 hover:bg-white/10 transition-colors cursor-pointer p-4 text-center font-bold relative">
                        <span>For you</span>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-primary rounded-full"></div>
                    </div>
                    <div className="flex-1 hover:bg-white/10 transition-colors cursor-pointer p-4 text-center text-gray-text font-medium">
                        <span>Following</span>
                    </div>
                </div>
            </div>

            {currentUser ? (
                <div>
                    <TweetForm onTweetCreated={fetchTweets} />
                    {loading && (
                        <div className="p-8 text-center text-primary">
                            <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}
                    {error && <p className="p-4 text-red-500 text-center">{error}</p>}
                    {!loading && !error && <TweetList tweets={tweets} onAction={fetchTweets} />}
                </div>
            ) : (
                <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold mb-4">Welcome to X Clone</h2>
                    <p className="text-gray-text">Please login or register to see what's happening!</p>
                </div>
            )}
        </div>
    );
};

export default HomePage;

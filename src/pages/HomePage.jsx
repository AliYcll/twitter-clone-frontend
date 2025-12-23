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
        <div>
            <h1>Home Page</h1>
            {currentUser ? (
                <div>
                    <p>Welcome, {currentUser.username || 'User'}!</p>
                    <TweetForm onTweetCreated={fetchTweets} />
                    <hr />
                    {loading && <p>Loading tweets...</p>}
                    {error && <p className="error-message">{error}</p>}
                    {!loading && !error && <TweetList tweets={tweets} onAction={fetchTweets} />}
                </div>
            ) : (
                <p>Welcome to the Twitter Clone! Please login or register to see your feed.</p>
            )}
        </div>
    );
};

export default HomePage;

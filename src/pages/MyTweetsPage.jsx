import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import tweetService from '../services/tweetService';
import userService from '../services/userService';
import TweetList from '../components/TweetList';

const MyTweetsPage = () => {
    const { currentUser } = useAuth();
    const [tweets, setTweets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
        <div className="profile-page">
            <h1>Tweetlerim</h1>
            {!currentUser && <p>Tweetlerini görmek için giriş yapmalısın.</p>}
            {currentUser && loading && <p>Tweetler yükleniyor...</p>}
            {currentUser && error && <p className="error-message">{error}</p>}
            {currentUser && !loading && !error && (
                <TweetList tweets={tweets} onAction={loadMyTweets} />
            )}
        </div>
    );
};

export default MyTweetsPage;

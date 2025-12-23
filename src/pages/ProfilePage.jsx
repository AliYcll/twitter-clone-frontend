import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import retweetService from '../services/retweetService';
import TweetList from '../components/TweetList';

const ProfilePage = () => {
    const { currentUser } = useAuth();
    const [retweets, setRetweets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadRetweets = async () => {
        if (!currentUser) {
            setLoading(false);
            return;
        }
        setLoading(true);
        setError('');
        try {
            const data = await retweetService.getMyRetweets();
            setRetweets(data);
        } catch (err) {
            setError(err.message || 'Failed to load retweets.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRetweets();
    }, [currentUser]);

    return (
        <div className="profile-page">
            <h1>Retweetler</h1>
            {!currentUser && <p>Retweetlerini görmek için giriş yapmalısın.</p>}
            {currentUser && loading && <p>Retweetler yükleniyor...</p>}
            {currentUser && error && <p className="error-message">{error}</p>}
            {currentUser && !loading && !error && (
                <TweetList tweets={retweets} onAction={loadRetweets} />
            )}
        </div>
    );
};

export default ProfilePage;

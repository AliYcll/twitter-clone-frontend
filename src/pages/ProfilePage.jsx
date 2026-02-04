import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import retweetService from '../services/retweetService';
import TweetList from '../components/TweetList';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => { // Acts as Retweets page per current route logic
    const { currentUser } = useAuth();
    const [retweets, setRetweets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

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
        <div className="w-full">
            {/* Sticky Header */}
            <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-border-color px-4 py-3 flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-xl font-bold text-white leading-tight">Retweets</h1>
                    {currentUser && <p className="text-xs text-gray-text">@{currentUser.username}</p>}
                </div>
            </div>

            {!currentUser && <p className="p-4 text-center text-gray-text">Please login to view retweets.</p>}

            {currentUser && loading && (
                <div className="p-8 text-center text-primary">
                    <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {currentUser && error && <p className="p-4 text-red-500 text-center">{error}</p>}

            {currentUser && !loading && !error && (
                <TweetList tweets={retweets} onAction={loadRetweets} />
            )}
        </div>
    );
};

export default ProfilePage;

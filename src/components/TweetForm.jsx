import React, { useState } from 'react';
import tweetService from '../services/tweetService';

const TweetForm = ({ onTweetCreated }) => {
    const [content, setContent] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        if (!content.trim()) {
            setMessage('Tweet content cannot be empty.');
            return;
        }

        try {
            await tweetService.createTweet(content);
            setContent('');
            setMessage('Tweet created successfully!');
            if (onTweetCreated) {
                onTweetCreated();
            }
        } catch (error) {
            setMessage(error.message || 'Failed to create tweet.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="tweet-form">
            <h2>What's happening?</h2>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Compose new Tweet..."
                maxLength="280"
                rows="4"
                required
            />
            <button type="submit">Tweet</button>
            {message && <p className="form-message">{message}</p>}
        </form>
    );
};

export default TweetForm;

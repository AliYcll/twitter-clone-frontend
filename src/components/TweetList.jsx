import React from 'react';
import TweetCard from './TweetCard';

const TweetList = ({ tweets, onAction }) => {
    if (!tweets || tweets.length === 0) {
        return <p className="no-tweets">No tweets to display yet.</p>;
    }

    return (
        <div className="tweet-list">
            {tweets.map((tweet) => (
                <TweetCard key={tweet.id} tweet={tweet} onAction={onAction} />
            ))}
        </div>
    );
};

export default TweetList;

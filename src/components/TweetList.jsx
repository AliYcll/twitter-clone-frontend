import React from 'react';
import TweetCard from './TweetCard';

const TweetList = ({ tweets, onAction }) => {
    if (!tweets || tweets.length === 0) {
        return <div className="p-8 text-center text-gray-text">No posts to display.</div>;
    }

    return (
        <div className="flex flex-col">
            {tweets.map((tweet) => (
                <TweetCard key={tweet.id} tweet={tweet} onAction={onAction} />
            ))}
        </div>
    );
};

export default TweetList;

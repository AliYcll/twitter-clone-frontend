import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import commentService from '../services/commentService';
import likeService from '../services/likeService';
import retweetService from '../services/retweetService';
import tweetService from '../services/tweetService';
import { MessageCircle, Repeat, Heart, BarChart2, Share, Trash2, MoreHorizontal } from 'lucide-react';

const TweetCard = ({ tweet, onAction }) => {
    const { currentUser } = useAuth();
    const [liked, setLiked] = useState(false);
    const [retweeted, setRetweeted] = useState(false);
    const [likeCount, setLikeCount] = useState(tweet.likeCount || 0); // Assuming API returns counts, if not default 0
    const [retweetCount, setRetweetCount] = useState(tweet.retweetCount || 0);
    const [commentsOpen, setCommentsOpen] = useState(false);
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        setLiked(Boolean(tweet.likedByCurrentUser));
        setRetweeted(Boolean(tweet.retweetedByCurrentUser));
        // Use defaults if API doesn't provide them yet
        setLikeCount(tweet.likes ? tweet.likes.length : (tweet.likeCount || 0));
        setRetweetCount(tweet.retweets ? tweet.retweets.length : (tweet.retweetCount || 0));
    }, [tweet]);

    const handleLike = async (e) => {
        e.stopPropagation();
        if (!currentUser) return;

        try {
            if (liked) {
                await likeService.dislikeTweet(tweet.id);
                setLiked(false);
                setLikeCount(prev => Math.max(0, prev - 1));
            } else {
                await likeService.likeTweet(tweet.id);
                setLiked(true);
                setLikeCount(prev => prev + 1);
            }
        } catch (error) {
            console.error('Like failed', error);
        }
    };

    const handleRetweet = async (e) => {
        e.stopPropagation();
        if (!currentUser) return;

        try {
            if (retweeted) {
                await retweetService.deleteRetweet(tweet.id);
                setRetweeted(false);
                setRetweetCount(prev => Math.max(0, prev - 1));
            } else {
                await retweetService.createRetweet(tweet.id);
                setRetweeted(true);
                setRetweetCount(prev => prev + 1);
            }
        } catch (error) {
            console.error('Retweet failed', error);
        }
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        if (window.confirm('Delete this tweet?')) {
            try {
                await tweetService.deleteTweet(tweet.id);
                if (onAction) onAction();
            } catch (error) {
                console.error(error);
            }
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return `${diffInSeconds}s`;
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const toggleComments = async () => {
        if (!commentsOpen) {
            try {
                const data = await commentService.getCommentsForTweet(tweet.id);
                setComments(data);
            } catch (error) {
                console.error(error);
            }
        }
        setCommentsOpen(!commentsOpen);
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;
        setSubmitting(true);
        try {
            await commentService.createComment(tweet.id, comment.trim());
            setComment('');
            // Reload comments
            const data = await commentService.getCommentsForTweet(tweet.id);
            setComments(data);
        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    const isOwner = currentUser && (
        tweet.user.id === currentUser.id ||
        tweet.user.email === currentUser.email ||
        tweet.user.username === currentUser.username
    );

    return (
        <div className="border-b border-border-color cursor-pointer hover:bg-white/[0.03] transition-colors p-4 pb-2">
            {/* Retweet Indicator (Optional - adding structure for future) */}
            {/* {retweeted && <div className="text-gray-500 text-xs font-bold mb-1 flex items-center gap-2 ml-8"><Repeat size={12} /> You reposted</div>} */}

            <div className="flex gap-4">
                {/* Avatar */}
                <div className="shrink-0">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-lg text-white">
                        {tweet.user.username ? tweet.user.username[0].toUpperCase() : 'U'}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-1 text-gray-text text-sm truncate">
                            <span className="font-bold text-white text-base hover:underline">{tweet.user.username}</span>
                            <span>@{tweet.user.username}</span>
                            <span>·</span>
                            <span className="hover:underline">{formatDate(tweet.createdAt)}</span>
                        </div>
                        <div className="group relative">
                            <button className="text-gray-text hover:text-primary hover:bg-primary/10 p-1.5 rounded-full transition-colors">
                                <MoreHorizontal size={18} />
                            </button>
                            {isOwner && (
                                <div className="hidden group-hover:block absolute right-0 bg-black border border-border-color shadow-xl rounded-md z-10 w-32 py-1">
                                    <button
                                        onClick={handleDelete}
                                        className="w-full text-left px-4 py-2 hover:bg-white/10 text-red-500 flex items-center gap-2 text-sm"
                                    >
                                        <Trash2 size={16} /> Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Body */}
                    <div className="mt-1 text-white whitespace-pre-wrap break-words text-[15px] leading-normal">
                        {tweet.content}
                    </div>

                    {/* Actions Footer */}
                    <div className="flex justify-between mt-3 max-w-md text-gray-text">
                        <button
                            className="group flex items-center gap-1.5 hover:text-primary transition-colors"
                            onClick={(e) => { e.stopPropagation(); toggleComments(); }}
                            title="Reply"
                        >
                            <div className="p-2 rounded-full group-hover:bg-primary/10 transition-colors">
                                <MessageCircle size={18} />
                            </div>
                            <span className="text-sm">{comments ? comments.length : 0}</span>
                        </button>

                        <button
                            className={`group flex items-center gap-1.5 transition-colors ${retweeted ? 'text-green-500' : 'hover:text-green-500'}`}
                            onClick={handleRetweet}
                            title="Retweet"
                        >
                            <div className="p-2 rounded-full group-hover:bg-green-500/10 transition-colors">
                                <Repeat size={18} />
                            </div>
                            <span className={`text-sm ${retweeted && 'font-bold'}`}>{retweetCount}</span>
                        </button>

                        <button
                            className={`group flex items-center gap-1.5 transition-colors ${liked ? 'text-pink-600' : 'hover:text-pink-600'}`}
                            onClick={handleLike}
                            title="Like"
                        >
                            <div className="p-2 rounded-full group-hover:bg-pink-600/10 transition-colors">
                                <Heart size={18} fill={liked ? "currentColor" : "none"} />
                            </div>
                            <span className={`text-sm ${liked ? 'font-bold' : ''}`}>{likeCount}</span>
                        </button>

                        <button className="group flex items-center gap-1.5 hover:text-primary transition-colors">
                            <div className="p-2 rounded-full group-hover:bg-primary/10 transition-colors">
                                <BarChart2 size={18} />
                            </div>
                            <span className="text-sm hidden sm:block">22K</span>
                        </button>

                        <button className="group flex items-center gap-1.5 hover:text-primary transition-colors">
                            <div className="p-2 rounded-full group-hover:bg-primary/10 transition-colors">
                                <Share size={18} />
                            </div>
                        </button>
                    </div>

                    {/* Comments Section */}
                    {commentsOpen && (
                        <div className="mt-4 border-t border-border-color pt-4">
                            <form onSubmit={handleCommentSubmit} className="flex gap-3 mb-4">
                                <input
                                    type="text"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Post your reply"
                                    className="flex-1 bg-black text-white rounded-full px-4 py-2 border border-border-color focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                                />
                                <button
                                    type="submit"
                                    disabled={submitting || !comment.trim()}
                                    className="bg-primary hover:bg-primary-hover text-white rounded-full px-4 py-2 font-bold disabled:opacity-50"
                                >
                                    Reply
                                </button>
                            </form>

                            <div className="space-y-4">
                                {comments.map((comment) => (
                                    <div key={comment.id} className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold">
                                            {comment.user.username ? comment.user.username[0].toUpperCase() : 'U'}
                                        </div>
                                        <div>
                                            <div className="flex gap-2 text-sm text-gray-text">
                                                <span className="font-bold text-white">{comment.user.username}</span>
                                                <span>{formatDate(comment.createdAt)}</span>
                                            </div>
                                            <p className="text-white text-sm">{comment.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TweetCard;

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import commentService from '../services/commentService';
import likeService from '../services/likeService';
import retweetService from '../services/retweetService';
import tweetService from '../services/tweetService';

const TweetCard = ({ tweet, onAction }) => {
    const { currentUser } = useAuth();
    const storedUser = (() => {
        try {
            return JSON.parse(localStorage.getItem('user'));
        } catch {
            return null;
        }
    })();
    const [message, setMessage] = useState('');
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [liked, setLiked] = useState(false);
    const [retweeted, setRetweeted] = useState(false);
    const [commentsOpen, setCommentsOpen] = useState(false);
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [comments, setComments] = useState([]);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingContent, setEditingContent] = useState('');
    const storageKey = `tweet_status_${tweet.id}`;

    useEffect(() => {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setLiked(Boolean(parsed.liked));
                setRetweeted(Boolean(parsed.retweeted));
            } catch {
                localStorage.removeItem(storageKey);
            }
        }
    }, [storageKey]);

    const saveStatus = (nextLiked, nextRetweeted) => {
        localStorage.setItem(
            storageKey,
            JSON.stringify({ liked: nextLiked, retweeted: nextRetweeted })
        );
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleAction = async (action, options = {}) => {
        const { refreshFeed = true } = options;
        if (!currentUser) {
            setMessage('Please login to perform this action.');
            return;
        }
        setSubmitting(true);
        setMessage('');
        try {
            await action();
            setMessage('Action completed.');
            if (refreshFeed && onAction) {
                onAction();
            }
        } catch (error) {
            setMessage(error.message || 'Action failed.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCommentSubmit = async (event) => {
        event.preventDefault();
        if (!comment.trim()) {
            setMessage('Comment cannot be empty.');
            return;
        }

        await handleAction(() => commentService.createComment(tweet.id, comment.trim()), {
            refreshFeed: false,
        });
        setComment('');
        await loadComments();
    };

    const startEdit = (item) => {
        setEditingCommentId(item.id);
        setEditingContent(item.content);
    };

    const cancelEdit = () => {
        setEditingCommentId(null);
        setEditingContent('');
    };

    const submitEdit = async (event, commentId) => {
        event.preventDefault();
        if (!editingContent.trim()) {
            setMessage('Comment cannot be empty.');
            return;
        }
        await handleAction(() => commentService.updateComment(commentId, editingContent.trim()), {
            refreshFeed: false,
        });
        cancelEdit();
        await loadComments();
    };

    const deleteComment = async (commentId) => {
        await handleAction(() => commentService.deleteComment(commentId), {
            refreshFeed: false,
        });
        await loadComments();
    };

    const isOwner = (user) => {
        const effectiveUser = currentUser || storedUser;
        if (!effectiveUser || !user) {
            return false;
        }
        if (user.id && effectiveUser.id) {
            return String(user.id) === String(effectiveUser.id);
        }
        if (user.email && effectiveUser.email) {
            return user.email === effectiveUser.email;
        }
        if (user.username && effectiveUser.username) {
            return user.username === effectiveUser.username;
        }
        return false;
    };

    const canManageComment = (item) => {
        return isOwner(item?.user) || isOwner(tweet?.user);
    };

    const canDeleteTweet = () => {
        return isOwner(tweet?.user);
    };

    const loadComments = async () => {
        setCommentsLoading(true);
        setMessage('');
        try {
            const data = await commentService.getCommentsForTweet(tweet.id);
            setComments(data);
        } catch (error) {
            setMessage(error.message || 'Failed to load comments.');
        } finally {
            setCommentsLoading(false);
        }
    };

    const toggleComments = async () => {
        const nextState = !commentsOpen;
        setCommentsOpen(nextState);
        if (nextState) {
            await loadComments();
        }
    };

    return (
        <div className="tweet-card">
            <div className="tweet-header">
                <span className="tweet-username">@{tweet.user.username}</span>
                <span className="tweet-date"> {formatDate(tweet.createdAt)}</span>
            </div>
            <p className="tweet-content">{tweet.content}</p>
            <div className="tweet-actions">
                <button
                    type="button"
                    className="tweet-action-button"
                    onClick={() =>
                        handleAction(async () => {
                            if (liked) {
                                await likeService.dislikeTweet(tweet.id);
                                setLiked(false);
                                saveStatus(false, retweeted);
                            } else {
                                await likeService.likeTweet(tweet.id);
                                setLiked(true);
                                saveStatus(true, retweeted);
                            }
                        })
                    }
                    disabled={submitting}
                >
                    {liked ? 'Liked' : 'Like'}
                </button>
                <button
                    type="button"
                    className="tweet-action-button"
                    onClick={() =>
                        handleAction(async () => {
                            if (retweeted) {
                                await retweetService.deleteRetweet(tweet.id);
                                setRetweeted(false);
                                saveStatus(liked, false);
                            } else {
                                await retweetService.createRetweet(tweet.id);
                                setRetweeted(true);
                                saveStatus(liked, true);
                            }
                        })
                    }
                    disabled={submitting}
                >
                    {retweeted ? 'Retweeted' : 'Retweet'}
                </button>
                <button
                    type="button"
                    className="tweet-action-button"
                    onClick={toggleComments}
                    disabled={commentsLoading}
                >
                    {commentsOpen ? 'Hide comments' : 'Show comments'}
                </button>
                {canDeleteTweet() && (
                    <button
                        type="button"
                        className="tweet-action-button danger"
                        onClick={() => handleAction(() => tweetService.deleteTweet(tweet.id))}
                        disabled={submitting}
                    >
                        Delete
                    </button>
                )}
            </div>
            {(liked || retweeted) && (
                <div className="tweet-status">
                    {liked && <span className="tweet-tag liked">✓ Liked</span>}
                    {retweeted && <span className="tweet-tag retweeted">✓ Retweeted</span>}
                </div>
            )}
            <form className="tweet-comment-form" onSubmit={handleCommentSubmit}>
                <input
                    type="text"
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    placeholder="Write a comment..."
                    disabled={submitting || !currentUser}
                />
                <button type="submit" disabled={submitting || !currentUser}>
                    Comment
                </button>
            </form>
            {commentsOpen && (
                <div className="tweet-comments">
                    {commentsLoading && <p>Loading comments...</p>}
                    {!commentsLoading && comments.length === 0 && (
                        <p className="tweet-empty">No comments yet.</p>
                    )}
                    {!commentsLoading &&
                        comments.map((item) => (
                            <div key={item.id} className="tweet-comment">
                                <span className="tweet-username">@{item.user.username}</span>
                                <span className="tweet-date"> {formatDate(item.createdAt)}</span>
                                {editingCommentId === item.id ? (
                                    <form className="comment-edit-form" onSubmit={(event) => submitEdit(event, item.id)}>
                                        <input
                                            type="text"
                                            value={editingContent}
                                            onChange={(event) => setEditingContent(event.target.value)}
                                            disabled={submitting}
                                        />
                                        <div className="comment-actions">
                                            <button type="submit" disabled={submitting}>
                                                Save
                                            </button>
                                            <button type="button" onClick={cancelEdit} disabled={submitting}>
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <>
                                        <p className="tweet-content">{item.content}</p>
                                        {canManageComment(item) && (
                                            <div className="comment-actions">
                                                <button type="button" onClick={() => startEdit(item)}>
                                                    Edit
                                                </button>
                                                <button type="button" onClick={() => deleteComment(item.id)}>
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        ))}
                </div>
            )}
            {message && <p className="tweet-message">{message}</p>}
        </div>
    );
};

export default TweetCard;

const API_URL = 'http://localhost:8080/api/v1/comments';

const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        return { Authorization: 'Bearer ' + user.token };
    }
    return {};
};

const createComment = async (tweetId, content) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
        },
        body: JSON.stringify({ tweetId, content }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Comment failed');
    }

    return response.json();
};

const commentService = {
    createComment,
    getCommentsForTweet: async (tweetId) => {
        const response = await fetch(API_URL + '/tweet/' + tweetId, {
            method: 'GET',
            headers: {
                ...getAuthHeader(),
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to load comments');
        }

        return response.json();
    },
    updateComment: async (commentId, content) => {
        const response = await fetch(API_URL + '/' + commentId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader(),
            },
            body: JSON.stringify({ content }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Update comment failed');
        }

        return response.json();
    },
    deleteComment: async (commentId) => {
        const response = await fetch(API_URL + '/' + commentId, {
            method: 'DELETE',
            headers: {
                ...getAuthHeader(),
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Delete comment failed');
        }

        return response.status === 204 ? null : response.json();
    },
};

export default commentService;

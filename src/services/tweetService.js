const API_URL = 'http://localhost:8080/api/v1/tweets';

const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        return { Authorization: 'Bearer ' + user.token };
    } else {
        return {};
    }
};

const createTweet = async (content) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
        },
        body: JSON.stringify({ content }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Tweet creation failed');
    }

    return response.json();
};

const getTweets = async () => {
    const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
            ...getAuthHeader(),
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch tweets');
    }

    return response.json();
};

const tweetService = {
    createTweet,
    getTweets,
    getTweetsByUserId: async (userId) => {
        const response = await fetch(API_URL + '/user/' + userId, {
            method: 'GET',
            headers: {
                ...getAuthHeader(),
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to fetch user tweets');
        }

        return response.json();
    },
    deleteTweet: async (tweetId) => {
        const response = await fetch(API_URL + '/' + tweetId, {
            method: 'DELETE',
            headers: {
                ...getAuthHeader(),
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Delete tweet failed');
        }

        return response.status === 204 ? null : response.json();
    },
};

export default tweetService;

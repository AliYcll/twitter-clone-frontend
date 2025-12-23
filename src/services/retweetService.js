const API_URL = 'http://localhost:8080/api/v1/retweets';

const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        return { Authorization: 'Bearer ' + user.token };
    }
    return {};
};

const createRetweet = async (tweetId) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
        },
        body: JSON.stringify({ tweetId }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Retweet failed');
    }

    return response.json();
};

const deleteRetweet = async (tweetId) => {
    const response = await fetch(API_URL + '/' + tweetId, {
        method: 'DELETE',
        headers: {
            ...getAuthHeader(),
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Undo retweet failed');
    }

    return response.status === 204 ? null : response.json();
};

const retweetService = {
    createRetweet,
    deleteRetweet,
    getMyRetweets: async () => {
        const response = await fetch(API_URL + '/me', {
            method: 'GET',
            headers: {
                ...getAuthHeader(),
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to load retweets');
        }

        return response.json();
    },
};

export default retweetService;

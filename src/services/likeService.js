const API_URL = 'http://localhost:8080/api/v1/likes';

const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        return { Authorization: 'Bearer ' + user.token };
    }
    return {};
};

const likeTweet = async (tweetId) => {
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
        throw new Error(errorData.message || 'Like failed');
    }

    return response.json();
};

const dislikeTweet = async (tweetId) => {
    const response = await fetch(API_URL + '/dislike', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
        },
        body: JSON.stringify({ tweetId }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Dislike failed');
    }

    return response.status === 204 ? null : response.json();
};

const likeService = {
    likeTweet,
    dislikeTweet,
};

export default likeService;

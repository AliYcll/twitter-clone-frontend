const API_URL = 'http://localhost:8080/api/v1/users';

const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        return { Authorization: 'Bearer ' + user.token };
    }
    return {};
};

const getCurrentUserProfile = async () => {
    const response = await fetch(API_URL + '/me', {
        method: 'GET',
        headers: {
            ...getAuthHeader(),
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to load user profile');
    }

    return response.json();
};

const userService = {
    getCurrentUserProfile,
};

export default userService;

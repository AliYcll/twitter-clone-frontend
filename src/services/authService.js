const API_URL = 'http://localhost:8080/api/v1/auth/';

const register = async (username, email, password) => {
    const response = await fetch(API_URL + 'register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
    }

    return response.json();
};

const login = async (email, password) => {
    const response = await fetch(API_URL + 'login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();
    if (data.token) {
        localStorage.setItem('user', JSON.stringify(data));
    }

    return data;
};

const logout = () => {
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};


const authService = {
    register,
    login,
    logout,
    getCurrentUser,
};

export default authService;

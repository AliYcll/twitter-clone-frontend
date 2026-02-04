import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);
        try {
            await authService.register(username, email, password);
            // Maybe auto-login or redirect to login
            navigate('/login');
        } catch (error) {
            setMessage(error.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full flex justify-center items-center min-h-[80vh]">
            <div className="w-full max-w-sm p-8">
                <div className="flex justify-center mb-8">
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-12 w-12 fill-white">
                        <g>
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                        </g>
                    </svg>
                </div>

                <h1 className="text-3xl font-bold text-white mb-8 text-center">Join X today</h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="bg-black border border-border-color text-white rounded p-4 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-lg"
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-black border border-border-color text-white rounded p-4 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-lg"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-black border border-border-color text-white rounded p-4 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-lg"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-white text-black font-bold rounded-full py-3 mt-4 hover:bg-opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {loading ? 'Creating account...' : 'Create account'}
                    </button>
                </form>

                {message && <p className="text-red-500 mt-4 text-center">{message}</p>}

                <div className="mt-10 text-gray-text text-center">
                    Have an account already? <Link to="/login" className="text-primary hover:underline">Log in</Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;

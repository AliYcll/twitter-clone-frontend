import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { X } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);
        try {
            await login(email, password);
            // Allow time for token to set if needed, usually sync
            navigate('/');
        } catch (error) {
            setMessage(error.message || 'Login failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full flex justify-center items-center min-h-[80vh]">
            <div className="w-full max-w-sm p-8">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-12 w-12 fill-white">
                        <g>
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                        </g>
                    </svg>
                </div>

                <h1 className="text-3xl font-bold text-white mb-8 text-center">Sign in to X</h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Email or username"
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
                        {loading ? 'Signing in...' : 'Next'}
                    </button>

                    <button type="button" className="border border-border-color text-white font-bold rounded-full py-3 hover:bg-white/10 transition-colors">
                        Forgot password?
                    </button>
                </form>

                {message && <p className="text-red-500 mt-4 text-center">{message}</p>}

                <div className="mt-10 text-gray-text text-center">
                    Don't have an account? <Link to="/register" className="text-primary hover:underline">Sign up</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

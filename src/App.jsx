import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './index.css';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import MyTweetsPage from './pages/MyTweetsPage';
import Layout from './components/Layout';
import { useAuth } from './context/AuthContext';

function App() {
  const { currentUser } = useAuth();

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/retweets" element={<ProfilePage />} />
        <Route path="/my-tweets" element={<MyTweetsPage />} />
      </Routes>
    </Layout>
  );
}

export default App;

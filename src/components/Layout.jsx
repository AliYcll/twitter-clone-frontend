import React from 'react';
import Sidebar from './Sidebar';
import RightSidebar from './RightSidebar';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
    const location = useLocation();
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

    if (isAuthPage) {
        return <div className="min-h-screen bg-black text-white">{children}</div>;
    }

    return (
        <div className="flex justify-center min-h-screen bg-black text-white">
            <div className="flex w-full max-w-[1265px]">
                {/* Left Sidebar */}
                <header className="hidden sm:flex flex-col w-[80px] xl:w-[275px] shrink-0 sticky top-0 h-screen">
                    <Sidebar />
                </header>

                {/* Main Feed Area */}
                <main className="flex-1 w-full max-w-[600px] border-x border-border-color min-h-screen">
                    {children}
                </main>

                {/* Right Sidebar */}
                <div className="hidden lg:block w-[350px] shrink-0 pl-8">
                    <RightSidebar />
                </div>
            </div>
        </div>
    );
};

export default Layout;

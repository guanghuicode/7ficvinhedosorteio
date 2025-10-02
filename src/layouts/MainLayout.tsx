import React from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-secondary text-gray-800 flex flex-col items-center p-4">
      <header className="w-full max-w-md mb-8 text-center">
        <h1 className="text-4xl font-bold text-primary">Fair Passport</h1>
      </header>
      <main className="w-full max-w-md">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;


import React from 'react';

interface LoadingProps {
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ fullScreen }) => {
  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${fullScreen ? 'fixed inset-0 bg-white z-[100]' : 'h-64'}`}>
      <div className="relative">
        <div className="w-12 h-12 border-4 border-primary-200 rounded-full animate-pulse"></div>
        <div className="w-12 h-12 border-t-4 border-primary-600 rounded-full animate-spin absolute top-0 left-0"></div>
      </div>
      <p className="text-slate-500 font-medium animate-pulse">Loading your gains...</p>
    </div>
  );
};

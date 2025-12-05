import React from 'react';
import { ViewMode, AppColor } from '../types';

interface BottomNavProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  colorScheme: AppColor;
  isHidden?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({ 
  currentView, 
  onViewChange, 
  colorScheme,
  isHidden = false
}) => {
  
  const colorStyles: Record<AppColor, string> = {
    blue: 'text-blue-600',
    orange: 'text-orange-500',
    green: 'text-green-600',
    indigo: 'text-indigo-600',
    rose: 'text-rose-500',
    red: 'text-red-600',
  };

  const activeColor = colorStyles[colorScheme];
  
  // Stats and Settings tabs are visible if we are in profile, settings, or menu view
  const isExpanded = ['profile', 'settings', 'menu'].includes(currentView);

  // Statistics is active ONLY if we are on the profile view
  const isStatsActive = currentView === 'profile';
  
  // Settings is active ONLY if we are on the settings view
  const isSettingsActive = currentView === 'settings';

  // Bottom right group is active if expanded (Menu, Profile, or Settings)
  const isMenuGroupActive = isExpanded;

  return (
    <nav 
      className={`
        fixed bottom-0 left-0 right-0 z-[60] bg-t-surface border-t border-t-border shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] 
        transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] rounded-t-3xl overflow-hidden
        ${isExpanded ? 'h-36' : 'h-16'}
        ${isHidden ? 'translate-y-full' : 'translate-y-0'}
      `}
    >
      <div className="relative w-full h-full max-w-2xl mx-auto px-4">
        
        {/* Expanded Top Row (Visible only in Menu/Profile/Settings view) */}
        <div 
            className={`
                absolute top-0 left-4 right-4 h-20 flex items-center justify-around
                transition-all duration-500 ease-in-out
                ${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
            `}
        >
            {/* Statistics Icon (Above Editor) */}
            <div className="flex flex-col items-center justify-center w-full">
                 <button
                    onClick={() => onViewChange('profile')}
                    className={`p-2 rounded-2xl transition-colors duration-200 active:scale-95 ${
                        isStatsActive ? activeColor : 'text-t-muted hover:text-t-text'
                    }`}
                    title="Statistics"
                 >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={isStatsActive ? 2 : 1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
                    </svg>
                 </button>
            </div>

            {/* Settings Button (Above Profile) */}
            <div className="flex flex-col items-center justify-center w-full">
                <button 
                     onClick={() => onViewChange('settings')}
                     className={`p-2 rounded-2xl transition-colors duration-200 active:scale-95 ${
                        isSettingsActive ? activeColor : 'text-t-muted hover:text-t-text'
                     }`}
                     title="Settings"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={isSettingsActive ? 2 : 1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.581-.495.644-.869l.214-1.281z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </button>
            </div>
        </div>

        {/* Bottom Row (Nav Items) */}
        <div className="absolute bottom-0 left-4 right-4 h-16 flex justify-around items-center border-t border-transparent">
            <button
            onClick={() => onViewChange('checker')}
            className={`group relative flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-300 pb-safe ${
                currentView === 'checker' 
                ? activeColor 
                : 'text-t-muted hover:text-t-text'
            }`}
            aria-label="Writing Tools"
            >
                <div className={`
                p-2 rounded-2xl transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform
                ${currentView === 'checker' 
                    ? 'bg-current/10 scale-110' 
                    : 'scale-100 group-active:scale-90'
                }
                `}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill={currentView === 'checker' ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={currentView === 'checker' ? 2 : 1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                </div>
            </button>

            <button
            onClick={() => {
                if (currentView === 'checker') {
                    onViewChange('menu');
                }
                // When in menu, profile, or settings, clicking here does nothing.
                // User must use the 'checker' button to close/reset.
            }}
            className={`group relative flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-300 pb-safe ${
                isMenuGroupActive
                ? `${activeColor} cursor-default`
                : 'text-t-muted hover:text-t-text cursor-pointer'
            }`}
            aria-label="Profile & Stats"
            >
                <div className={`
                p-2 rounded-2xl transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform
                ${isMenuGroupActive
                    ? 'bg-current/10 scale-110' 
                    : 'scale-100 group-active:scale-90'
                }
                `}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill={isMenuGroupActive ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={isMenuGroupActive ? 2 : 1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                </div>
            </button>
        </div>

      </div>
    </nav>
  );
};
import React, { useState, useEffect, useRef } from 'react';
import { Theme, AppColor } from '../types';

interface HeaderProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  colorScheme: AppColor;
  onSearch: (term: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentTheme, 
  onThemeChange, 
  onSearch
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Always show if at the very top to avoid getting stuck
      if (window.scrollY < 20) {
        setIsVisible(true);
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        return;
      }

      // Hide immediately when scrolling starts
      setIsVisible(false);

      // Reset the timer to show the header after inactivity
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        setIsVisible(true);
      }, 2000); // 2 seconds of inactivity
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleClearAndClose = () => {
    setSearchValue('');
    setIsSearchOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        onSearch(searchValue);
        inputRef.current?.blur();
        // Optional: setIsSearchOpen(false);
    }
  };

  const themes: Theme[] = ['light', 'dark'];

  // Helper to calculate pill position for Theme
  const getPillPosition = () => {
    const index = themes.indexOf(currentTheme);
    // w-12 (3rem) per button
    switch (index) {
        case 0: return 'translate-x-0';
        case 1: return 'translate-x-[3rem]';
        default: return 'translate-x-0';
    }
  };

  const getThemeIcon = (theme: Theme) => {
    switch (theme) {
      case 'light':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
          </svg>
        );
      case 'dark':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
             <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
          </svg>
        );
    }
  };

  return (
    <header className={`
      fixed top-0 left-0 right-0 z-50
      bg-t-surface border-b border-t-border shadow-sm 
      py-3 rounded-b-3xl
      transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
      ${isVisible ? 'translate-y-0' : '-translate-y-[120%]'}
    `}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        
        {/* Left side: Search Bar */}
        <div className="flex items-center pl-2 h-10">
            <div 
                className={`
                    relative flex items-center rounded-full border
                    transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] overflow-hidden
                    ${isSearchOpen 
                        ? 'w-[180px] sm:w-[240px] bg-t-surface-alt border-t-border' 
                        : 'w-10 border-transparent bg-transparent'
                    }
                `}
            >
                <button
                    onClick={handleSearchToggle}
                    className={`
                        absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center z-10
                        text-t-muted hover:text-t-text active:scale-90 transition-all duration-300
                    `}
                    title="Dictionary Search"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                </button>

                <input 
                    ref={inputRef}
                    type="text" 
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Dictionary..." 
                    className={`
                        w-full h-9 pl-10 pr-4 bg-transparent border-none outline-none text-sm text-t-text placeholder-t-muted/50
                        transition-opacity duration-300
                        ${isSearchOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                    `}
                    onBlur={() => {
                        if (!searchValue) {
                            setIsSearchOpen(false);
                        }
                    }}
                />
            </div>

            {/* Trash Button */}
            <div 
                className={`
                    overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                    ${(isSearchOpen && searchValue) ? 'w-10 opacity-100 ml-2' : 'w-0 opacity-0 ml-0'}
                `}
            >
                 <button
                    onClick={handleClearAndClose}
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-t-border bg-t-surface-alt text-t-muted hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/30 transition-all duration-300"
                    title="Clear and close"
                 >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                         <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                </button>
            </div>
        </div>

        {/* Theme Toggle */}
        <div className="flex items-center justify-end gap-3 pl-2">
            
            <div className="relative flex items-center bg-t-surface-alt p-1 rounded-full border border-t-border transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]">
                
                {/* Sliding Pill for Active Theme */}
                <div 
                    className={`
                        absolute top-1 bottom-1 left-1 w-12 rounded-full bg-t-surface shadow-sm ring-1 ring-t-border
                        transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
                        ${getPillPosition()}
                    `}
                />

                {themes.map((theme) => {
                    const isActive = currentTheme === theme;
                    
                    let activeColorClass = 'text-t-text';
                    if (isActive) {
                        if (theme === 'light') activeColorClass = 'text-yellow-500';
                        if (theme === 'dark') activeColorClass = 'text-blue-500';
                    }

                    return (
                    <button
                        key={theme}
                        type="button"
                        onClick={() => onThemeChange(theme)}
                        title={`${theme} theme`}
                        className={`
                        relative z-10 w-12 py-1.5 text-xs font-semibold capitalize text-center transition-colors duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] flex items-center justify-center select-none
                        ${isActive ? activeColorClass : 'text-t-muted hover:text-t-text'}
                        `}
                    >
                        <div className={`transition-transform duration-700 ease-in-out ${isActive ? 'rotate-[360deg]' : 'rotate-0'}`}>
                            {getThemeIcon(theme)}
                        </div>
                    </button>
                    );
                })}
            </div>
        </div>
      </div>
    </header>
  );
};
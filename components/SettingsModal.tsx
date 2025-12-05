

import React, { useState, useEffect } from 'react';
import { t } from '../services/translations';
import { saveApiKey, getStoredApiKey, removeApiKey } from '../services/storageService';
import { AppColor } from '../types';

interface SettingsPageProps {
  colorScheme: AppColor;
  onColorSchemeChange: (color: AppColor) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ 
    colorScheme,
    onColorSchemeChange
}) => {
  const [apiKey, setApiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const settings = t.settings;

  const colors: { code: AppColor, label: string, bgClass: string }[] = [
    { code: 'blue', label: 'Blue', bgClass: 'bg-blue-600' },
    { code: 'orange', label: 'Orange', bgClass: 'bg-orange-500' },
    { code: 'green', label: 'Green', bgClass: 'bg-green-600' },
    { code: 'indigo', label: 'Indigo', bgClass: 'bg-indigo-600' },
    { code: 'rose', label: 'Rose', bgClass: 'bg-rose-500' },
    { code: 'red', label: 'Red', bgClass: 'bg-red-600' },
  ];

  useEffect(() => {
    const stored = getStoredApiKey();
    setApiKey(stored || '');
    setIsSaved(false);
  }, []);

  const handleSave = () => {
    if (apiKey.trim()) {
      saveApiKey(apiKey.trim());
      setIsSaved(true);
      setTimeout(() => {
          setIsSaved(false);
      }, 2000);
    }
  };

  const handleRemove = () => {
    removeApiKey();
    setApiKey('');
    setIsSaved(false);
  };

  return (
    <div className="space-y-6 animate-fade-in-up pb-32">
      
      {/* Appearance Card */}
      <div className="bg-t-surface w-full rounded-2xl shadow-sm border border-t-border overflow-hidden">
        <div className="px-6 py-4 border-b border-t-border flex justify-between items-center bg-t-surface-alt">
          <h2 className="text-lg font-bold text-t-text flex items-center gap-2">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-t-muted">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
            </svg>
            Appearance
          </h2>
        </div>
        <div className="p-6">
            <div className="space-y-3">
                <label className="text-xs font-bold text-t-text uppercase tracking-wider block">
                App Color Theme
                </label>
                <div className="bg-t-surface-alt p-4 rounded-xl border border-t-border flex items-center justify-center gap-4">
                    {colors.map(color => (
                        <button
                            key={color.code}
                            onClick={() => onColorSchemeChange(color.code)}
                            className={`
                                w-8 h-8 rounded-full transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                                ${color.bgClass}
                                ${colorScheme === color.code 
                                    ? 'ring-4 ring-offset-2 ring-t-surface scale-110 shadow-md' 
                                    : 'opacity-70 active:scale-110 hover:opacity-100'
                                }
                            `}
                            title={color.label}
                            aria-label={`Select ${color.label} theme`}
                        />
                    ))}
                </div>
            </div>
        </div>
      </div>

      {/* API Configuration Card */}
      <div className="bg-t-surface w-full rounded-2xl shadow-sm border border-t-border overflow-hidden">
        <div className="px-6 py-4 border-b border-t-border flex justify-between items-center bg-t-surface-alt">
          <h2 className="text-lg font-bold text-t-text flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-t-muted">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
            </svg>
            {settings.title}
          </h2>
        </div>

        <div className="p-6 space-y-8">
            <div className="space-y-4">
                <div className="space-y-2">
                    <p className="text-sm text-t-muted leading-relaxed">
                        {settings.desc}
                    </p>
                    <label className="text-xs font-bold text-t-text uppercase tracking-wider block">
                    {settings.inputLabel}
                    </label>
                    <div className="relative">
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => {
                                setApiKey(e.target.value);
                                setIsSaved(false);
                            }}
                            placeholder={settings.placeholder}
                            className="w-full px-4 py-3 bg-t-surface border border-t-border rounded-lg text-t-text focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-mono text-sm"
                        />
                    </div>
                    
                    <div className="flex justify-between items-center pt-1">
                        <a 
                            href="https://aistudio.google.com/app/apikey" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1 hover:underline"
                        >
                            {settings.getKey}
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                                <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 18H4.25A2.25 2.25 0 012 15.75V6.25A2.25 2.25 0 014.25 4h4a.75.75 0 010 1.5h-4z" clipRule="evenodd" />
                                <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clipRule="evenodd" />
                            </svg>
                        </a>
                    </div>
                </div>

                <div className="bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
                    <p className="text-xs text-blue-600/80">
                        {settings.note}
                    </p>
                </div>

                <div className="flex gap-3 pt-2">
                    <button
                        onClick={handleSave}
                        disabled={!apiKey.trim()}
                        className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2
                            ${isSaved 
                                ? 'bg-green-500 text-white' 
                                : 'bg-t-text text-t-surface active:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed'
                            }
                        `}
                    >
                        {isSaved ? (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                </svg>
                                {settings.saved}
                            </>
                        ) : settings.save}
                    </button>
                    
                    {getStoredApiKey() && (
                        <button
                            onClick={handleRemove}
                            className="px-4 py-2.5 rounded-lg font-medium text-sm border border-red-500/30 text-red-500 active:bg-red-500/10 transition-colors"
                        >
                            {settings.remove}
                        </button>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
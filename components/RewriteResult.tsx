
import React, { useState } from 'react';
import { RewriteAnalysis } from '../types';
import { t } from '../services/translations';
import { InteractiveText } from './InteractiveText';

interface RewriteResultProps {
  analysis: RewriteAnalysis;
}

export const RewriteResult: React.FC<RewriteResultProps> = ({ analysis }) => {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const results = t.results;
  const tStyles = t.styles;

  const handleCopy = () => {
    navigator.clipboard.writeText(analysis.rewrittenText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleListen = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(analysis.rewrittenText);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    // Default to English
    utterance.lang = 'en-US';
    
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="grid grid-cols-1 gap-6 animate-fade-in-up mt-8">
      
      {/* 1. Rewrite Result Card */}
      <div className="relative group">
        
        <div className="bg-t-surface rounded-2xl shadow-sm border border-purple-500/20 overflow-hidden">
          <div className="bg-purple-500/10 px-6 py-4 border-b border-purple-500/20 flex justify-between items-center flex-wrap gap-2">
            <div className="flex items-center gap-3">
                <h3 className="text-sm font-bold text-purple-600 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                    {tStyles[analysis.style] || analysis.style}
                </h3>
            </div>
            
            <div className="flex items-center gap-2 ml-auto">
              <button 
                  onClick={handleListen}
                  className="text-xs flex items-center justify-center text-purple-700 hover:text-purple-800 font-medium p-2 transition-all opacity-70 hover:opacity-100"
                  title={isSpeaking ? results.stopListen : results.listen}
                >
                  {isSpeaking ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 animate-pulse">
                      <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM17.78 9.22a.75.75 0 10-1.06 1.06c1.5 1.5 1.5 3.94 0 5.44a.75.75 0 001.06 1.06c2.086-2.086 2.086-5.474 0-7.56z" />
                      <path d="M19.9 7.1a.75.75 0 10-1.06 1.06c2.671 2.672 2.671 7.008 0 9.68a.75.75 0 101.06 1.06c3.256-3.256 3.256-8.544 0-11.8z" />
                    </svg>
                  )}
                </button>

                <button 
                  onClick={handleCopy}
                  className="text-xs flex items-center justify-center text-purple-700 hover:text-purple-800 font-medium p-2 transition-all opacity-70 hover:opacity-100"
                  title={results.copy}
                >
                  {copied ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                    </svg>
                  )}
                </button>
            </div>
          </div>
          
          <div className="p-8">
            <InteractiveText 
              content={analysis.rewrittenText} 
              words={analysis.rewrittenWords}
              activeColorClass="text-purple-600"
            />
          </div>
        </div>
      </div>

      {/* 2. Style Explanation Card */}
      <div className="bg-t-surface rounded-2xl border border-t-border overflow-hidden">
        <div className="px-6 py-4 flex items-center gap-2 border-b border-t-border">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-purple-500">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
          </svg>
          <h2 className="text-xs font-bold text-t-muted uppercase tracking-widest">{results.styleExplanation}</h2>
        </div>
        <div className="p-6">
          <p className="text-t-text leading-relaxed font-medium mb-4">
            {analysis.explanation.overview}
          </p>
          
          <ul className="space-y-3">
            {analysis.explanation.improvements.map((item, index) => (
              <li key={index} className="flex items-start gap-3 text-sm text-t-muted leading-relaxed">
                <span className="flex-shrink-0 w-1.5 h-1.5 mt-2 rounded-full bg-purple-400"></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

    </div>
  );
};

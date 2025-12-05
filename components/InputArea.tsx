

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { LoadingState, GrammarAnalysis, RewriteStyle, AppColor } from '../types';
import { t } from '../services/translations';

interface InputAreaProps {
  value: string;
  onChange: (value: string) => void;
  onCheck: () => void;
  onRewrite: (style: RewriteStyle) => void;
  onClear: () => void;
  onRetry: () => void;
  onStop: () => void;
  loadingState: LoadingState;
  analysis: GrammarAnalysis | null;
  colorScheme: AppColor;
  hasRewriteResult: boolean;
}

// Map color codes to their respective color classes for buttons
// Use active:bg instead of hover:bg for mobile app feel
const colorButtonStyles: Record<AppColor, string> = {
    blue: 'bg-blue-600 active:bg-blue-700 text-white',
    orange: 'bg-orange-500 active:bg-orange-600 text-white',
    green: 'bg-green-600 active:bg-green-700 text-white',
    indigo: 'bg-indigo-600 active:bg-indigo-700 text-white',
    rose: 'bg-rose-500 active:bg-rose-600 text-white',
    red: 'bg-red-600 active:bg-red-700 text-white',
};

export const InputArea: React.FC<InputAreaProps> = ({ 
  value, 
  onChange, 
  onCheck,
  onRewrite, 
  onClear,
  onRetry,
  onStop,
  loadingState, 
  analysis,
  colorScheme,
  hasRewriteResult
}) => {
  const input = t.input;
  const tStyles = t.styles;

  const isAnalyzing = loadingState === LoadingState.LOADING;
  const hasResult = analysis !== null;
  const [isRewriteMenuOpen, setIsRewriteMenuOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const rewriteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recognitionRef = useRef<any>(null);
  const valueRef = useRef(value);
  
  // Refs for speech logic
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const baseTextRef = useRef('');

  // Auto-collapse when results are ready
  useEffect(() => {
    if (loadingState === LoadingState.SUCCESS) {
      setIsExpanded(false);
    }
  }, [loadingState]);

  // Re-expand when clearing/resetting to edit mode
  useEffect(() => {
    if (!hasResult && !hasRewriteResult) {
      setIsExpanded(true);
    }
  }, [hasResult, hasRewriteResult]);

  // Keep valueRef updated for the speech recognition callback logic
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      if (!hasResult && !isAnalyzing) onCheck();
    }
  };

  // Timer Logic for Auto-Close
  const startRewriteAutoClose = () => {
    if (rewriteTimerRef.current) clearTimeout(rewriteTimerRef.current);
    rewriteTimerRef.current = setTimeout(() => {
      setIsRewriteMenuOpen(false);
    }, 3000);
  };

  const clearRewriteTimer = () => {
    if (rewriteTimerRef.current) clearTimeout(rewriteTimerRef.current);
  };

  const toggleRewriteMenu = () => {
    if (isRewriteMenuOpen) {
      setIsRewriteMenuOpen(false);
      clearRewriteTimer();
    } else {
      setIsRewriteMenuOpen(true);
      startRewriteAutoClose();
    }
  };

  // Speech Recognition Logic
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
    setIsListening(false);
  };

  const resetSilenceTimer = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
    silenceTimerRef.current = setTimeout(() => {
      stopListening();
    }, 3000); // Stop after 3 seconds of silence
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(t.errors.speech);
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = true;
    recognition.interimResults = false; // Disable interim results
    
    // Default to English
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      baseTextRef.current = valueRef.current; // Snapshot current text
      resetSilenceTimer();
    };

    recognition.onresult = (event: any) => {
      resetSilenceTimer(); // Activity detected, reset stop timer

      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = 0; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      // Combine base text + final session text + interim session text
      const currentBase = baseTextRef.current;
      const separator = currentBase.length > 0 && !currentBase.endsWith(' ') ? ' ' : '';
      
      const fullTranscript = finalTranscript + interimTranscript;
      
      // Only update if we have something to append
      if (fullTranscript) {
         onChange(currentBase + separator + fullTranscript);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };

    recognition.start();
  };

  // Cleanup
  useEffect(() => {
    return () => {
      clearRewriteTimer();
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current && !hasResult) {
      // Reset height to auto to correctly calculate scrollHeight when shrinking
      textareaRef.current.style.height = 'auto';
      // Set to scrollHeight to fit content
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value, hasResult, isExpanded]);

  // Calculate Accuracy Score
  const accuracyScore = useMemo(() => {
    if (!analysis) return 100;
    
    let totalLength = 0;
    let errorWeightedLength = 0;

    analysis.segments.forEach(segment => {
      const len = segment.text.length;
      totalLength += len;
      if (segment.isError) {
        // Critical errors count fully, suggestions count half
        const weight = segment.severity === 'suggestion' ? 0.5 : 1.0;
        errorWeightedLength += len * weight;
      }
    });

    if (totalLength === 0) return 100;
    
    const score = Math.max(0, Math.round(((totalLength - errorWeightedLength) / totalLength) * 100));
    return score;
  }, [analysis]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const allStyles: RewriteStyle[] = [
    'Professional', 'Casual', 'Academic', 'Creative', 
    'Formal', 'Informal', 'Analytical', 'Narrative', 
    'Persuasive', 'Descriptive'
  ];
  
  // Use all styles
  const styles = allStyles;

  // Button logic
  const handleMainButtonClick = () => {
    if (isAnalyzing) {
      onStop();
    } else {
      onCheck();
    }
  };

  const isButtonDisabled = !value.trim() && !isAnalyzing;

  // Helper renderers
  const renderClearButton = () => (
    <button 
      onClick={() => onChange('')}
      className="text-xs flex items-center justify-center font-medium p-2 transition-all rounded-full text-t-muted active:text-t-text active:scale-95"
      title={input.clear}
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
      </svg>
    </button>
  );

  const renderMicButton = () => (
    <button 
      onClick={toggleListening}
      className={`text-xs flex items-center justify-center font-medium p-2 transition-all rounded-full active:scale-95 ${isListening ? 'text-red-500 animate-pulse' : 'text-t-muted active:text-t-text'}`}
      title={isListening ? input.stopDictate : input.dictate}
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
      </svg>
    </button>
  );

  const renderToggleButton = () => (
    <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-xs flex items-center justify-center font-medium p-2 transition-all rounded-full text-t-muted active:text-t-text active:scale-90"
        title={isExpanded ? "Collapse" : "Expand"}
    >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-0' : 'rotate-180'}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
        </svg>
    </button>
  );

  return (
    <div className={`relative bg-t-surface rounded-2xl border border-t-border hover:border-t-muted/30 transition-all duration-500 flex flex-col overflow-hidden ${!isExpanded ? 'shadow-sm' : ''}`}>
      {/* Header / Toolbar */}
      <div className={`bg-t-surface-alt px-6 py-4 flex justify-between items-center z-10 relative transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] border-b ${isExpanded ? 'border-t-border' : 'border-transparent'}`}>
        
        {hasResult ? (
          <div className={`flex items-baseline gap-2 font-bold uppercase tracking-widest ${getScoreColor(accuracyScore)}`}>
            <span className="text-xl font-serif">{accuracyScore}%</span>
            <span className="text-xs opacity-80">{input.accuracy}</span>
          </div>
        ) : (
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-4">
              
              {/* MOVED: Standard controls to left if rewrite result exists */}
              {hasRewriteResult && (
                <div className="flex items-center gap-1 transition-all animate-fade-in">
                   {value.length > 0 && renderClearButton()}
                   {renderMicButton()}
                   {renderToggleButton()}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-1">
              {/* Standard controls on right if NO rewrite result */}
              {!hasRewriteResult && (
                <>
                  {value.length > 0 && renderClearButton()}
                  {renderMicButton()}
                </>
              )}

              {/* Refresh Button for Rewrite Results - Always on Right */}
              {hasRewriteResult && (
                <button 
                  onClick={onRetry}
                  disabled={isAnalyzing}
                  className={`text-xs flex items-center justify-center font-medium p-2 transition-all rounded-full text-t-muted active:text-t-text active:scale-95 animate-fade-in ${isAnalyzing ? 'cursor-not-allowed opacity-70' : ''}`}
                  title={input.refresh}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 transition-transform duration-700 ${isAnalyzing ? 'animate-spin' : 'active:rotate-180'}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}
        
        {hasResult && (
          <div className="flex items-center gap-1">
            {renderToggleButton()}
            <button 
              onClick={onClear}
              className="text-xs flex items-center justify-center text-t-muted active:text-t-text font-medium p-2 transition-all opacity-70 active:opacity-100 active:scale-95"
              title={input.edit}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
            </button>
          </div>
        )}
      </div>
      
      {/* Content Area Wrapper for Animation */}
      <div className={`transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden ${isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
        
        <div className="relative flex-grow">
          {hasResult ? (
            /* Analysis View (Static, No Copy, No Tooltips) */
            <div className="w-full min-h-[150px] p-8 text-xl leading-relaxed font-serif text-t-text whitespace-pre-wrap animate-fade-in select-none cursor-default">
              {analysis.segments.map((segment, index) => {
                  if (segment.isError) {
                    const isCritical = segment.severity === 'critical' || !segment.severity;
                    const textColor = isCritical ? 'text-t-err-text' : 'text-t-warn-text';
                    const bgColor = isCritical ? 'bg-t-err-bg border-red-500/30' : 'bg-t-warn-bg border-yellow-500/30';
                    
                    return (
                      <span 
                        key={index} 
                        className={`pointer-events-none ${textColor}`}
                      >
                        <span className={`${bgColor} border-b-2 pb-0.5 rounded-t px-0.5`}>
                          {segment.text}
                        </span>
                      </span>
                    );
                  }
                  return <span key={index} className="opacity-90">{segment.text}</span>;
                })}
            </div>
          ) : (
            /* Edit Mode (Textarea) */
            <>
              <textarea
                  ref={textareaRef}
                  id="grammar-input"
                  className="w-full min-h-[150px] max-h-[240px] p-8 pb-12 text-xl text-t-text placeholder-t-muted/30 resize-none focus:outline-none font-serif leading-relaxed bg-transparent overflow-y-auto transition-colors duration-300 notranslate"
                  placeholder={input.placeholder}
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isAnalyzing}
                  spellCheck={false}
                  translate="no"
                  maxLength={300}
                  rows={1}
              />
              {/* Character Counter positioned inside */}
              <div className="absolute bottom-4 left-8 pointer-events-none transition-opacity duration-300">
                  <span className={`text-xs text-t-muted font-medium ${value.length === 0 ? 'opacity-0' : 'opacity-100'}`}>
                      {value.length} / 300 {input.chars}
                  </span>
              </div>
            </>
          )}
        </div>

        {/* Footer / Actions */}
        {!hasResult && (
          <div className="p-4 bg-t-surface border-t border-t-border rounded-t-3xl flex justify-end items-center relative overflow-hidden h-[72px]">
              <div 
                  className="flex items-center gap-2 w-full justify-end" 
                  ref={menuRef}
                  onMouseMove={clearRewriteTimer}
                  onMouseLeave={() => { if (isRewriteMenuOpen) startRewriteAutoClose(); }}
              >
                
                {/* Check Grammar Button (Collapsible) */}
                <div className={`
                  overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
                  ${isRewriteMenuOpen ? 'max-w-0 opacity-0' : 'max-w-[200px] opacity-100'}
                `}>
                  <button
                      onClick={handleMainButtonClick}
                      disabled={isButtonDisabled}
                      className={`
                      px-5 py-2 rounded-full font-medium transition-all duration-300 ease-in-out flex items-center gap-2 text-sm z-10 whitespace-nowrap border active:scale-95
                      ${isAnalyzing 
                          ? 'bg-t-surface text-t-text border-t-border active:text-t-text cursor-pointer'
                          : !value.trim() 
                              ? 'bg-t-surface text-t-muted border-t-border opacity-50 cursor-not-allowed'
                              : `${colorButtonStyles[colorScheme]} border-transparent active:opacity-90`
                      }
                      `}
                  >
                      {isAnalyzing ? (
                      <>
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                          </span>
                          <span>{input.stop}</span>
                      </>
                      ) : (
                      <>
                          <span>{input.checkGrammar}</span>
                      </>
                      )}
                  </button>
                </div>

                {/* Styles List (Expandable) */}
                <div 
                  className={`
                    flex items-center bg-t-surface-alt rounded-full overflow-x-auto 
                    transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] no-scrollbar
                    ${isRewriteMenuOpen 
                      ? 'flex-1 opacity-100 p-1 mr-0 border border-t-text/10' 
                      : 'w-0 opacity-0 border-none p-0 mr-0'
                    }
                  `}
                  style={{ 
                    scrollbarWidth: 'none', 
                    msOverflowStyle: 'none',
                  }}
                  onScroll={clearRewriteTimer}
                  onTouchStart={(e) => e.stopPropagation()}
                  onTouchEnd={(e) => e.stopPropagation()}
                >
                  <style>{`
                      .no-scrollbar::-webkit-scrollbar {
                        display: none;
                      }
                    `}</style>
                  <div className="flex items-center gap-1 w-full px-2">
                    {styles.map((style) => (
                      <button
                        key={style}
                        onClick={() => {
                          onRewrite(style);
                          setIsRewriteMenuOpen(false);
                          clearRewriteTimer();
                        }}
                        disabled={isAnalyzing}
                        className="px-4 py-1.5 text-xs font-medium text-t-muted active:text-t-text active:bg-t-surface rounded-full transition-colors whitespace-nowrap flex-shrink-0 flex-grow text-center"
                      >
                        {tStyles[style] || style}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rewrite Toggle Button */}
                <button
                  onClick={toggleRewriteMenu}
                  disabled={!value.trim() || isAnalyzing}
                  className={`
                    flex-shrink-0 px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 border whitespace-nowrap z-10 active:scale-95
                    ${(!value.trim() || isAnalyzing)
                      ? 'bg-t-surface text-t-muted border-t-border opacity-50 cursor-not-allowed'
                      : (isRewriteMenuOpen 
                          ? `${colorButtonStyles[colorScheme]} border-transparent active:opacity-90` 
                          : `${colorButtonStyles[colorScheme]} border-transparent active:opacity-90`
                        )
                    }
                  `}
                >
                  {isRewriteMenuOpen ? input.close : input.rewrite}
                </button>
              </div>
          </div>
        )}
      </div>
    </div>
  );
};
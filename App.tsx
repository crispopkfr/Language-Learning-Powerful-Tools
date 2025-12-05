import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { InputArea } from './components/InputArea';
import { AnalysisResult } from './components/AnalysisResult';
import { RewriteResult } from './components/RewriteResult';
import { Profile } from './components/Profile';
import { SettingsPage } from './components/SettingsModal';
import { DictionaryModal } from './components/DictionaryModal';
import { BottomNav } from './components/BottomNav';
import { 
  GrammarAnalysis, 
  LoadingState, 
  Theme, 
  ViewMode, 
  AppColor,
  RewriteStyle,
  RewriteAnalysis,
  QuickRewriteState,
  DictionaryEntry
} from './types';
import { checkGrammar, rewriteText } from './services/geminiService';
import { 
  saveHistory, 
  saveRewriteHistory,
  saveDictionaryHistory,
  saveAppState 
} from './services/storageService';
import { t } from './services/translations';

const App: React.FC = () => {
  // --- State Initialization ---
  
  // Persistent Settings (Theme & Color Scheme)
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('grammarguard_theme');
      return (saved as Theme) || 'light';
    }
    return 'light';
  });

  const [colorScheme, setColorScheme] = useState<AppColor>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('grammarguard_color_scheme');
      return (saved as AppColor) || 'blue';
    }
    return 'blue';
  });

  // Content State - Reset on refresh as requested
  const [inputText, setInputText] = useState('');
  const [grammarResult, setGrammarResult] = useState<GrammarAnalysis | null>(null);
  const [rewriteResult, setRewriteResult] = useState<RewriteAnalysis | null>(null);
  
  // Quick Rewrite State (Persisted in App)
  const [quickRewriteState, setQuickRewriteState] = useState<QuickRewriteState>({
    styles: [],
    selectedStyle: null,
    result: null,
    isLoading: false
  });

  // UI State
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [currentView, setCurrentView] = useState<ViewMode>('checker');
  const [historyUpdateTrigger, setHistoryUpdateTrigger] = useState(0);

  // Dictionary State
  const [isDictionaryOpen, setIsDictionaryOpen] = useState(false);
  const [dictionaryTerm, setDictionaryTerm] = useState('');
  const [dictionaryData, setDictionaryData] = useState<DictionaryEntry[] | null>(null);
  const [dictionaryLoading, setDictionaryLoading] = useState(false);
  const [dictionaryError, setDictionaryError] = useState<string | null>(null);

  // Request cancellation tracking
  const activeRequestIdRef = useRef<number>(0);

  // Swipe Navigation Logic
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // --- Effects ---

  // Global Click Sound Effect
  useEffect(() => {
    let audioCtx: AudioContext | null = null;

    const playSound = () => {
      // Lazy init audio context
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      // Resume if suspended (browser autoplay policy)
      if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
      }

      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      const now = audioCtx.currentTime;
      
      // Sound Profile: Short, soft "pop"
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(600, now);
      oscillator.frequency.exponentialRampToValueAtTime(300, now + 0.08);

      // Volume Envelope (Attack -> Decay)
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.05, now + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      oscillator.start(now);
      oscillator.stop(now + 0.08);
    };

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Detect clicks on buttons, links, or elements with button role
      const clickable = target.closest('button, a, [role="button"], input[type="submit"], input[type="button"], input[type="radio"], input[type="checkbox"]');
      
      if (clickable) {
        playSound();
      }
    };

    window.addEventListener('click', handleGlobalClick);
    return () => {
      window.removeEventListener('click', handleGlobalClick);
      if (audioCtx && audioCtx.state !== 'closed') {
        audioCtx.close().catch(() => {});
      }
    };
  }, []);

  // Theme Handling
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('grammarguard_theme', currentTheme);
  }, [currentTheme]);

  // Color Scheme Persistence
  useEffect(() => {
    document.documentElement.setAttribute('data-color', colorScheme);
    localStorage.setItem('grammarguard_color_scheme', colorScheme);
  }, [colorScheme]);

  // State Persistence (Debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      saveAppState({
        inputText,
        grammarResult,
        rewriteResult,
        colorScheme
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, [inputText, grammarResult, rewriteResult, colorScheme]);


  // --- Handlers ---

  const handleCheckGrammar = async () => {
    if (!inputText.trim()) return;

    // Generate unique ID for this request
    const requestId = Date.now();
    activeRequestIdRef.current = requestId;

    setLoadingState(LoadingState.LOADING);
    setGrammarResult(null); // Clear previous results while loading
    setRewriteResult(null); 
    setQuickRewriteState({ styles: [], selectedStyle: null, result: null, isLoading: false }); // Reset quick rewrite

    try {
      const result = await checkGrammar(inputText);

      // Check if this request is still active
      if (activeRequestIdRef.current !== requestId) return;

      setGrammarResult(result);
      setLoadingState(LoadingState.SUCCESS);
      
      // Save to history
      saveHistory(inputText, result);
      setHistoryUpdateTrigger(prev => prev + 1);

      // Initialize Random Quick Rewrite Styles
      const allStyles: RewriteStyle[] = [
        'Professional', 'Casual', 'Academic', 'Creative', 
        'Formal', 'Informal', 'Analytical', 'Narrative', 
        'Persuasive', 'Descriptive'
      ];
      // Shuffle and pick 4
      const shuffled = [...allStyles].sort(() => 0.5 - Math.random());
      
      // Double check active request before updating secondary state
      if (activeRequestIdRef.current !== requestId) return;

      setQuickRewriteState(prev => ({
          ...prev,
          styles: shuffled.slice(0, 4),
          selectedStyle: null,
          result: null,
          isLoading: false
      }));

    } catch (error: any) {
      if (activeRequestIdRef.current !== requestId) return;
      console.error(error);
      setLoadingState(LoadingState.ERROR);
      
      const msg = error?.message || error?.toString() || '';
      if (msg.includes("PERMISSION_DENIED")) {
        alert(t.errors.permissionDenied);
        setCurrentView('settings');
      } else {
        alert(t.errors.generic);
      }
    }
  };

  const handleRewrite = async (style: RewriteStyle) => {
    if (!inputText.trim()) return;

    // Generate unique ID for this request
    const requestId = Date.now();
    activeRequestIdRef.current = requestId;

    setLoadingState(LoadingState.LOADING);
    setRewriteResult(null);
    setGrammarResult(null); // Clear grammar result
    setQuickRewriteState({ styles: [], selectedStyle: null, result: null, isLoading: false });

    try {
      const result = await rewriteText(inputText, style);

      if (activeRequestIdRef.current !== requestId) return;

      setRewriteResult(result);
      setLoadingState(LoadingState.SUCCESS);
      
      // Save rewrite to history
      saveRewriteHistory(inputText, result);
      setHistoryUpdateTrigger(prev => prev + 1);
    } catch (error: any) {
      if (activeRequestIdRef.current !== requestId) return;
      console.error(error);
      setLoadingState(LoadingState.ERROR);

      const msg = error?.message || error?.toString() || '';
      if (msg.includes("PERMISSION_DENIED")) {
        alert(t.errors.permissionDenied);
        setCurrentView('settings');
      } else {
        alert(t.errors.generic);
      }
    }
  };

  const handleQuickRewrite = async (style: RewriteStyle) => {
    if (!grammarResult) return;
    
    // Quick rewrites are synchronous UI-wise (don't block main stop button usually)
    // but good to track if we wanted to support cancelling them too.
    setQuickRewriteState(prev => ({ ...prev, selectedStyle: style, isLoading: true }));

    try {
        const result = await rewriteText(grammarResult.correctedSentence, style);
        setQuickRewriteState(prev => ({ 
            ...prev, 
            result: result.rewrittenText, 
            isLoading: false 
        }));
    } catch (error: any) {
        console.error(error);
        setQuickRewriteState(prev => ({ ...prev, isLoading: false }));
        
        const msg = error?.message || error?.toString() || '';
        if (msg.includes("PERMISSION_DENIED")) {
            alert(t.errors.permissionDenied);
            setCurrentView('settings');
        }
    }
  };

  const handleStopQuickRewrite = () => {
    setQuickRewriteState(prev => ({ ...prev, isLoading: false }));
  };

  const handleClear = () => {
    activeRequestIdRef.current = 0; // Invalidate any pending request
    setInputText('');
    setGrammarResult(null);
    setRewriteResult(null);
    setQuickRewriteState({ styles: [], selectedStyle: null, result: null, isLoading: false });
    setLoadingState(LoadingState.IDLE);
  };

  const handleStop = () => {
    activeRequestIdRef.current = 0; // Invalidate any pending request
    setLoadingState(LoadingState.IDLE);
  };

  const handleRetryRewrite = () => {
    if (rewriteResult) {
      handleRewrite(rewriteResult.style);
    }
  };

  const handleDictionarySearch = async (term: string) => {
    if (!term.trim()) return;
    setDictionaryTerm(term);
    setIsDictionaryOpen(true);
    setDictionaryLoading(true);
    setDictionaryError(null);
    setDictionaryData(null);

    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(term)}`);
        if (!response.ok) {
            throw new Error('Word not found');
        }
        const data = await response.json();
        setDictionaryData(data);
        
        // Save to history
        saveDictionaryHistory(term);
        setHistoryUpdateTrigger(prev => prev + 1);
    } catch (err) {
        setDictionaryError("Could not find definition.");
    } finally {
        setDictionaryLoading(false);
    }
  };

  // --- Swipe Handlers ---

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchStartY.current = e.targetTouches[0].clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const diffX = touchStartX.current - touchEndX;
    const diffY = touchStartY.current - touchEndY;

    // Reset
    touchStartX.current = null;
    touchStartY.current = null;

    // Check if horizontal swipe dominates vertical scroll
    if (Math.abs(diffX) > Math.abs(diffY)) {
        const minSwipeDistance = 50;
        if (Math.abs(diffX) > minSwipeDistance) {
            if (diffX > 0) {
                // Swipe Left (Next)
                if (currentView === 'checker') {
                  setCurrentView('menu');
                }
            } else {
                // Swipe Right (Prev)
                if (currentView === 'settings' || currentView === 'profile') {
                    setCurrentView('menu');
                } else if (currentView === 'menu') {
                  setCurrentView('checker');
                }
            }
        }
    }
  };

  return (
    <div 
      className={`min-h-[calc(100vh+1px)] bg-t-bg text-t-text font-sans transition-colors duration-300 selection:bg-blue-500/20 selection:text-blue-700`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <Header 
        currentTheme={currentTheme}
        onThemeChange={setCurrentTheme}
        colorScheme={colorScheme}
        onSearch={handleDictionarySearch}
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-48">
        {(currentView === 'checker' || currentView === 'menu') && (
          <div className="space-y-8 animate-fade-in">
            <InputArea 
              value={inputText}
              onChange={setInputText}
              onCheck={handleCheckGrammar}
              onRewrite={handleRewrite}
              onClear={handleClear}
              onRetry={handleRetryRewrite}
              onStop={handleStop}
              loadingState={loadingState}
              analysis={grammarResult}
              colorScheme={colorScheme}
              hasRewriteResult={!!rewriteResult}
            />

            {/* Grammar Analysis Result */}
            {grammarResult && (
              <AnalysisResult 
                analysis={grammarResult} 
                quickRewriteState={quickRewriteState}
                onQuickRewrite={handleQuickRewrite}
                onStopQuickRewrite={handleStopQuickRewrite}
              />
            )}

            {/* Rewrite Result */}
            {rewriteResult && (
              <RewriteResult 
                analysis={rewriteResult}
              />
            )}
          </div>
        )}
        
        {currentView === 'profile' && (
          <Profile 
            colorScheme={colorScheme} 
            onColorSchemeChange={setColorScheme}
            onThemeChange={setCurrentTheme}
            historyUpdateTrigger={historyUpdateTrigger}
          />
        )}

        {currentView === 'settings' && (
           <SettingsPage
              colorScheme={colorScheme}
              onColorSchemeChange={setColorScheme}
           />
        )}
      </main>

      <BottomNav 
        currentView={currentView}
        onViewChange={setCurrentView}
        colorScheme={colorScheme}
        isHidden={isDictionaryOpen}
      />
      
      <DictionaryModal 
        isOpen={isDictionaryOpen}
        onClose={() => setIsDictionaryOpen(false)}
        term={dictionaryTerm}
        data={dictionaryData}
        loading={dictionaryLoading}
        error={dictionaryError}
      />
    </div>
  );
};

export default App;
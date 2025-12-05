
import React, { useRef, useState, useEffect } from 'react';
import { DictionaryEntry } from '../types';
import { generateExampleSentence } from '../services/geminiService';

interface DictionaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  term: string;
  data: DictionaryEntry[] | null;
  loading: boolean;
  error: string | null;
}

export const DictionaryModal: React.FC<DictionaryModalProps> = ({ 
    isOpen, onClose, term, data, loading, error 
}) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [playingExample, setPlayingExample] = useState<string | null>(null);
    const [generatedExamples, setGeneratedExamples] = useState<Record<string, string>>({});
    const [loadingExamples, setLoadingExamples] = useState<Record<string, boolean>>({});
    const [showCopyFeedback, setShowCopyFeedback] = useState(false);
    const [copyFeedbackText, setCopyFeedbackText] = useState('');

    // Stop audio when modal closes or unmounts
    useEffect(() => {
        if (!isOpen) {
            window.speechSynthesis.cancel();
            setPlayingExample(null);
            setShowCopyFeedback(false);
        }
        return () => {
            window.speechSynthesis.cancel();
        };
    }, [isOpen]);

    // Stop audio and clear generated cache when data changes (new search)
    useEffect(() => {
        window.speechSynthesis.cancel();
        setPlayingExample(null);
        setGeneratedExamples({});
        setLoadingExamples({});
        setShowCopyFeedback(false);
    }, [data]);

    if (!isOpen) return null;

    const playAudio = (url: string) => {
        if (audioRef.current) {
            audioRef.current.src = url;
            audioRef.current.play();
        } else {
            const audio = new Audio(url);
            audioRef.current = audio;
            audio.play();
        }
    };

    const toggleExample = (text: string) => {
        if (!('speechSynthesis' in window)) return;
        
        if (playingExample === text) {
            // Stop if currently playing this text
            window.speechSynthesis.cancel();
            setPlayingExample(null);
        } else {
            // Play new text
            window.speechSynthesis.cancel();
            setPlayingExample(text);

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.onend = () => setPlayingExample(null);
            utterance.onerror = () => setPlayingExample(null);
            window.speechSynthesis.speak(utterance);
        }
    };

    const handleGenerateExample = async (word: string, definition: string, uniqueKey: string) => {
        setLoadingExamples(prev => ({ ...prev, [uniqueKey]: true }));
        try {
            const result = await generateExampleSentence(word, definition);
            if (result) {
                setGeneratedExamples(prev => ({ ...prev, [uniqueKey]: result }));
            }
        } catch (error) {
            console.error("Failed to generate example", error);
        } finally {
            setLoadingExamples(prev => ({ ...prev, [uniqueKey]: false }));
        }
    };

    const handleCopy = (text: string, feedback: string) => {
        navigator.clipboard.writeText(text);
        setCopyFeedbackText(feedback);
        setShowCopyFeedback(true);
        setTimeout(() => setShowCopyFeedback(false), 2000);
    };

    // Helper to find the best phonetic with audio
    const getPhoneticData = (entry: DictionaryEntry) => {
        const withAudio = entry.phonetics.find(p => p.audio && p.text);
        if (withAudio) return withAudio;
        
        const anyAudio = entry.phonetics.find(p => p.audio);
        if (anyAudio) return { text: entry.phonetic, audio: anyAudio.audio };

        return { text: entry.phonetic || entry.phonetics[0]?.text, audio: null };
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div 
                className="bg-t-surface w-full max-w-lg max-h-[85vh] rounded-2xl shadow-xl border border-t-border overflow-hidden transform transition-all animate-scale-in flex flex-col notranslate relative"
                translate="no"
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-t-border flex justify-between items-center bg-t-surface-alt shrink-0">
                    <h2 className="text-lg font-bold text-t-text flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-t-muted">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                        </svg>
                        Dictionary
                    </h2>
                    <button 
                        onClick={onClose} 
                        className="text-t-muted hover:text-t-text transition-colors p-1 rounded-full active:bg-t-surface"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-t-border scrollbar-track-transparent select-none">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-4">
                             <div className="w-8 h-8 border-4 border-t-muted/30 border-t-primary-500 rounded-full animate-spin"></div>
                             <p className="text-t-muted text-sm">Searching for "{term}"...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8">
                            <div className="bg-red-500/10 text-red-500 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-t-text mb-2">No Definitions Found</h3>
                            <p className="text-t-muted text-sm px-4">
                                Sorry, we couldn't find definitions for the word <b>"{term}"</b>. Please check the spelling or try another word.
                            </p>
                        </div>
                    ) : data ? (
                        <div className="space-y-8">
                            {data.map((entry, i) => {
                                const phoneticData = getPhoneticData(entry);
                                return (
                                    <div key={i} className={i > 0 ? "pt-8 border-t border-t-border" : ""}>
                                        <div className="flex items-end justify-between mb-4 flex-wrap gap-2">
                                            <div>
                                                <h1 className="text-3xl font-serif font-bold text-t-text capitalize">{entry.word}</h1>
                                                {phoneticData.text && (
                                                    <span className="text-primary-500 font-sans text-lg">{phoneticData.text}</span>
                                                )}
                                            </div>
                                            
                                            {phoneticData.audio && (
                                                <button 
                                                    onClick={() => playAudio(phoneticData.audio!)}
                                                    className="flex items-center gap-2 bg-primary-500/10 hover:bg-primary-500/20 text-primary-600 px-4 py-2 rounded-full transition-colors active:scale-95"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                                                    </svg>
                                                    Play
                                                </button>
                                            )}
                                        </div>

                                        <div className="space-y-6">
                                            {entry.meanings.map((meaning, mIndex) => (
                                                <div key={mIndex}>
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <span className="text-sm font-bold uppercase tracking-wider text-t-muted italic bg-t-surface-alt px-2 py-1 rounded-full rounded-full">
                                                            {meaning.partOfSpeech}
                                                        </span>
                                                        <div className="h-[1px] flex-1 bg-t-border"></div>
                                                    </div>
                                                    
                                                    <ul className="space-y-3 pl-2">
                                                        {meaning.definitions.map((def, dIndex) => {
                                                            const uniqueKey = `${i}-${mIndex}-${dIndex}`;
                                                            const generatedExample = generatedExamples[uniqueKey];
                                                            const displayExample = def.example || generatedExample;
                                                            const isGenerating = loadingExamples[uniqueKey];

                                                            return (
                                                                <li key={dIndex} className="text-t-text relative pl-7">
                                                                    <span className="absolute left-0 top-0 font-bold text-primary-500 select-none">
                                                                        {dIndex + 1}.
                                                                    </span>
                                                                    <span 
                                                                        className="leading-relaxed cursor-pointer active:opacity-70 transition-opacity" 
                                                                        onClick={() => handleCopy(def.definition, "Copied meaning")}
                                                                    >
                                                                        {def.definition}
                                                                    </span>
                                                                    
                                                                    {displayExample ? (
                                                                        <div className="mt-2 flex items-start gap-2 group/example">
                                                                            <p 
                                                                                className="text-sm text-t-muted italic flex-1 cursor-pointer active:opacity-70 transition-opacity" 
                                                                                onClick={() => handleCopy(displayExample, "Copied sentence")}
                                                                            >
                                                                                "{displayExample}"
                                                                            </p>
                                                                            <button 
                                                                                onClick={() => toggleExample(displayExample)}
                                                                                className="text-primary-600 p-1 flex-shrink-0 opacity-70 focus:outline-none select-none"
                                                                                style={{ WebkitTapHighlightColor: 'transparent' }}
                                                                                title={playingExample === displayExample ? "Stop listening" : "Listen to example"}
                                                                                aria-label={playingExample === displayExample ? "Stop listening" : "Listen to example"}
                                                                            >
                                                                                {playingExample === displayExample ? (
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 animate-pulse">
                                                                                        <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
                                                                                    </svg>
                                                                                ) : (
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                                                                        <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                                                                                    </svg>
                                                                                )}
                                                                            </button>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="mt-2">
                                                                            <button
                                                                                onClick={() => handleGenerateExample(entry.word, def.definition, uniqueKey)}
                                                                                disabled={isGenerating}
                                                                                className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-primary-600 bg-primary-50 rounded-full transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                            >
                                                                                {isGenerating ? (
                                                                                    <>
                                                                                        <span className="w-3 h-3 border-2 border-primary-300 border-t-primary-600 rounded-full animate-spin"></span>
                                                                                        <span>Generating...</span>
                                                                                    </>
                                                                                ) : (
                                                                                    <>
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
                                                                                        </svg>
                                                                                        <span>Generate Example</span>
                                                                                    </>
                                                                                )}
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : null}
                </div>

                {/* Copied Feedback Toast */}
                <div 
                    className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs font-medium px-4 py-2 rounded-full shadow-lg transition-all duration-300 pointer-events-none z-20 ${showCopyFeedback ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
                >
                    {copyFeedbackText}
                </div>
            </div>
        </div>
    );
};

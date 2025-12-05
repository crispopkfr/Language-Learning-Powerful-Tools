

export interface Segment {
  text: string;
  isError: boolean;
  severity?: 'critical' | 'suggestion';
  correction?: string;
  reason?: string;
}

export interface Explanation {
  overview: string;
  improvements: string[];
}

export interface WordData {
  text: string;
  ipa: string;
}

export interface GrammarAnalysis {
  segments: Segment[];
  correctedSentence: string;
  correctedWords?: WordData[];
  explanation: Explanation;
}

export interface RewriteAnalysis {
  originalText: string;
  rewrittenText: string;
  rewrittenWords?: WordData[];
  style: RewriteStyle;
  explanation: Explanation;
}

export type RewriteStyle = 
  | 'Professional' 
  | 'Casual' 
  | 'Academic' 
  | 'Creative' 
  | 'Formal' 
  | 'Informal' 
  | 'Analytical' 
  | 'Narrative' 
  | 'Persuasive' 
  | 'Descriptive';

export interface QuickRewriteState {
  styles: RewriteStyle[];
  selectedStyle: RewriteStyle | null;
  result: string | null;
  isLoading: boolean;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export type Theme = 'light' | 'dark';

export type ViewMode = 'checker' | 'menu' | 'profile' | 'settings';

export type AppColor = 'blue' | 'orange' | 'green' | 'indigo' | 'rose' | 'red';

export type AppLanguage = 'en' | 'es' | 'pt' | 'fr' | 'ja' | 'zh';

export interface HistoryEntry {
  id: string;
  timestamp: number;
  textSnippet: string;
  fullText?: string;
  errorCount: number;
  suggestionCount: number;
  isPerfect: boolean;
  type?: 'grammar' | 'rewrite' | 'dictionary';
  rewriteStyle?: string;
}

export interface UserStats {
  totalChecks: number;
  totalErrors: number;
  accuracyRate: number; // Percentage of perfect submissions
  perfectRuns: number;
}

// Dictionary Types
export interface DictionaryDefinition {
  definition: string;
  example?: string;
  synonyms: string[];
  antonyms: string[];
}

export interface DictionaryMeaning {
  partOfSpeech: string;
  definitions: DictionaryDefinition[];
  synonyms: string[];
  antonyms: string[];
}

export interface DictionaryPhonetic {
  text?: string;
  audio?: string;
}

export interface DictionaryEntry {
  word: string;
  phonetic?: string;
  phonetics: DictionaryPhonetic[];
  meanings: DictionaryMeaning[];
  sourceUrls: string[];
}

// Global augmentations for Vite-injected variables and types
declare global {
  interface ImportMeta {
    env: {
      DEV: boolean;
      [key: string]: any;
    };
  }
}
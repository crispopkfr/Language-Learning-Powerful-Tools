


import { AppLanguage } from "./types";

export const t = {
  nav: {
    tools: "Tools",
    profile: "Profile"
  },
  input: {
    placeholder: "Type or paste your text here...",
    accuracy: "Accuracy",
    chars: "characters",
    checkGrammar: "Check Grammar",
    stop: "Stop",
    rewrite: "Rewrite",
    close: "Close",
    clear: "Clear text",
    refresh: "Redo rewrite",
    dictate: "Dictate text",
    stopDictate: "Stop dictation",
    edit: "Edit Text"
  },
  styles: {
    Professional: "Professional",
    Casual: "Casual",
    Academic: "Academic",
    Creative: "Creative",
    Formal: "Formal",
    Informal: "Informal",
    Analytical: "Analytical",
    Narrative: "Narrative",
    Persuasive: "Persuasive",
    Descriptive: "Descriptive"
  } as Record<string, string>,
  results: {
    corrected: "Corrected Version",
    explanation: "Explanation",
    styleExplanation: "Style Explanation",
    rewritten: "Rewritten",
    copy: "Copy",
    listen: "Listen",
    stopListen: "Stop listening",
    quickRewrites: "Quick Alternatives"
  },
  profile: {
    colorScheme: "Color Theme",
    accuracyRate: "Accuracy Rate",
    accuracyDesc: "Accuracy percentage",
    totalChecks: "Total Checks",
    checksDesc: "Sentences analyzed",
    totalErrors: "Total Errors",
    errorsDesc: "Mistakes identified & fixed",
    recentHistory: "Recent History",
    entries: "entries",
    noHistory: "No history yet. Start checking your grammar!",
    cols: {
      date: "Date",
      text: "Text Preview",
      result: "Result"
    },
    backup: "Backup Data",
    restore: "Restore Data",
    activity: "Activity"
  },
  settings: {
      title: "API Configuration",
      desc: "To use this app, you can provide your own Google Gemini API Key. Your key is stored securely in your browser's local storage and is never sent to our servers.",
      inputLabel: "Gemini API Key",
      placeholder: "Paste your API key here...",
      getKey: "Get a free API key",
      save: "Save Key",
      remove: "Remove Key",
      saved: "Key saved successfully",
      note: "Note: If no key is provided, the app will attempt to use the default environment key."
  },
  errors: {
    generic: "Unable to analyze text at this time. Please check your connection or API key.",
    limit: "API usage limit exceeded. Please try again in a few moments.",
    speech: "Speech recognition is not supported in this browser.",
    missingKey: "API Key Missing. Please add your key in Settings.",
    permissionDenied: "Access denied. Please check your API Key in Settings and ensure it has permissions for Gemini models."
  }
};

export const getLanguageName = (lang: AppLanguage): string => {
  switch (lang) {
    case 'en': return 'English';
    case 'es': return 'Español';
    case 'pt': return 'Português';
    case 'fr': return 'Français';
    case 'ja': return '日本語';
    case 'zh': return '中文';
    default: return 'English';
  }
};
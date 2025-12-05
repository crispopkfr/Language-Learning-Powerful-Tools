
import React, { useState } from 'react';
import { WordData } from '../types';

interface InteractiveTextProps {
  content: string; // Fallback plain text
  words?: WordData[]; // Structured data with IPA
  activeColorClass?: string;
}

export const InteractiveText: React.FC<InteractiveTextProps> = ({ 
  content, 
  words, 
  activeColorClass = 'text-primary-600' 
}) => {
  const [swappedIndices, setSwappedIndices] = useState<Set<number>>(new Set());

  // If no detailed word data is available, render plain text
  if (!words || words.length === 0) {
    return (
      <p 
        className="text-xl leading-relaxed font-serif text-t-text notranslate select-none" 
        translate="no"
        onContextMenu={(e) => e.preventDefault()}
      >
        {content}
      </p>
    );
  }

  const handleToggle = (index: number) => {
    const word = words[index];
    // Only toggle if IPA data exists (i.e., not a space or punctuation)
    if (!word.ipa) return;

    const newSet = new Set(swappedIndices);
    if (newSet.has(index)) {
      newSet.delete(index);
    } else {
      newSet.add(index);
    }
    setSwappedIndices(newSet);
  };

  // Helper to remove slashes if the model generates them
  const formatIpa = (ipa: string) => {
    return ipa.replace(/^\/+|\/+$/g, '');
  };

  return (
    <p 
      className="text-xl leading-relaxed font-serif text-t-text flex flex-wrap gap-y-1 items-baseline notranslate select-none" 
      translate="no"
      onContextMenu={(e) => e.preventDefault()}
    >
      {words.map((item, index) => {
        const isSwapped = swappedIndices.has(index);
        const hasIpa = !!item.ipa;

        // Render standard text for spaces/punctuation or if no IPA available
        if (!hasIpa) {
            // Preserve whitespace using whitespace-pre-wrap if needed, 
            // but since we are flex-wrapping, standard spans usually flow okay.
            // Explicitly handling spaces to ensure they don't collapse unexpectedly in flex.
            if (item.text === ' ') {
                return <span key={index} className="whitespace-pre"> </span>;
            }
            return <span key={index}>{item.text}</span>;
        }

        return (
          <span
            key={index}
            onClick={() => handleToggle(index)}
            className={`
              relative cursor-pointer transition-colors duration-200
              ${isSwapped 
                ? `${activeColorClass} font-sans font-medium` 
                : 'border-b-2 border-dotted border-current/20 hover:border-current/40'
              }
            `}
            title={isSwapped ? "Click to show word" : "Click to show pronunciation"}
          >
            {isSwapped ? formatIpa(item.ipa) : item.text}
          </span>
        );
      })}
    </p>
  );
};

// @toreview
/**
 * @fileoverview TypewriterText primitive — word-by-word text reveal animation with
 * a blinking cursor effect. Supports configurable word delay, skip animation,
 * and completion callback. Part of the Saasflare base component layer.
 * @module packages/core/components/ui/typewriter-text
 * @layer core
 *
 * @component
 * @example
 * import { TypewriterText } from '@saasflare/core';
 * <TypewriterText text="Hello, welcome to Saasflare." wordDelay={60} />
 */
'use client';

// =============================================================================
// TYPEWRITER TEXT
// components/ui/typewriter-text.tsx
//
// Word-by-word reveal animation with blinking cursor
// =============================================================================

import { useState, useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';

interface TypewriterTextProps {
  text: string;
  /** Delay between each word in ms (default: 40) */
  wordDelay?: number;
  /** Skip animation and show full text immediately */
  skipAnimation?: boolean;
  /** Callback when animation completes */
  onComplete?: () => void;
  /** Additional class names */
  className?: string;
}

/**
 * Typewriter component that reveals text word-by-word
 */
export function TypewriterText({
  text,
  wordDelay = 40,
  skipAnimation = false,
  onComplete,
  className,
}: TypewriterTextProps) {
  const [displayedWords, setDisplayedWords] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(skipAnimation);
  const words = useRef(text.split(' '));
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Reset when text changes
    words.current = text.split(' ');

    if (skipAnimation) {
      setDisplayedWords(words.current);
      setIsComplete(true);
      return;
    }

    setDisplayedWords([]);
    setIsComplete(false);

    let currentIndex = 0;

    const revealNextWord = () => {
      if (currentIndex < words.current.length) {
        setDisplayedWords(words.current.slice(0, currentIndex + 1));
        currentIndex++;
        timeoutRef.current = setTimeout(revealNextWord, wordDelay);
      } else {
        setIsComplete(true);
        onComplete?.();
      }
    };

    // Start animation after a brief delay
    timeoutRef.current = setTimeout(revealNextWord, 100);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, wordDelay, skipAnimation, onComplete]);

  return (
    <span className={cn('inline', className)}>
      {displayedWords.join(' ')}
      {!isComplete && (
        <span className="inline-block w-0.5 h-4 bg-primary ml-0.5 animate-pulse" />
      )}
    </span>
  );
}

export default TypewriterText;

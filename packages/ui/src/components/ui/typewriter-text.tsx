// @toreview
"use client"

/**
 * @fileoverview TypewriterText primitive — word-by-word text reveal animation with
 * a blinking cursor effect. Supports configurable word delay, skip animation,
 * and completion callback. Part of the Saasflare base component layer.
 * @module packages/core/components/ui/typewriter-text
 * @layer core
 *
 * @component
 * @example
 * import { TypewriterText } from '@saasflare/ui';
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
import { cn } from '../../lib';
import { useSaasflareProps, type SaasflareComponentProps } from '../../providers';

interface TypewriterTextProps extends SaasflareComponentProps {
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
  animated,
}: TypewriterTextProps) {
  const sf = useSaasflareProps({ animated });
  const effectiveSkip = skipAnimation || !sf.animated;

  const [displayedWords, setDisplayedWords] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(effectiveSkip);
  const words = useRef(text.split(' '));
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Reset when text changes
    words.current = text.split(' ');

    if (effectiveSkip) {
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
  }, [text, wordDelay, effectiveSkip, onComplete]);

  return (
    <span
      data-slot="typewriter-text"
      data-animated={String(sf.animated)}
      className={cn('inline', className)}
    >
      {displayedWords.join(' ')}
      {!isComplete && (
        <span className="inline-block w-0.5 h-4 bg-primary ml-0.5 animate-pulse" />
      )}
    </span>
  );
}

// @reviewed 2026-04-18
/**
 * @fileoverview Floating scroll-to-top button with theme-aware styling.
 * Appears after the user scrolls past a configurable offset. Supports both
 * window-level and custom container scrolling.
 *
 * Integrates with SaasflareProvider:
 *   - `animated` → gates Framer Motion transitions and scroll-to-top behavior
 *   - `surface`  → swaps between flat (solid primary) and glass (backdrop-blur)
 *
 * @module packages/ui/components/composed/scroll-to-top-button
 * @package ui
 *
 * @component
 * @example
 * <ScrollToTopButton scrollOffset={400} />
 *
 * @example
 * // With a custom scroll container
 * <ScrollToTopButton scrollContainerId="main-content" scrollOffset={200} />
 *
 * @example
 * // Per-instance surface override (ignores provider value)
 * <ScrollToTopButton surface="glass" />
 */
'use client';

import { JSX, useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowUpIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../../lib';
import {
    useSaasflareProps,
    type SaasflareComponentProps,
} from '../../providers';

/**
 * Props for the ScrollToTopButton component.
 *
 * @interface
 * @package ui
 */
export interface ScrollToTopButtonProps extends SaasflareComponentProps {
    /**
     * Optional scroll container element ID.
     * If not provided, falls back to the global `window`.
     */
    scrollContainerId?: string;

    /**
     * Vertical scroll offset (in pixels) after which the button is shown.
     * @default 300
     */
    scrollOffset?: number;

    /** Additional class names merged onto the root button. */
    className?: string;
}

/**
 * A floating button that appears after scrolling down and smoothly scrolls
 * the user back to the top of the container (or window).
 *
 * @component
 */
export function ScrollToTopButton({
    scrollContainerId,
    scrollOffset = 300,
    className,
    ...sfProps
}: ScrollToTopButtonProps): JSX.Element {
    const { animated, surface } = useSaasflareProps(sfProps);

    const [isVisible, setIsVisible] = useState(false);

    const finalId = useMemo(() => scrollContainerId ?? null, [scrollContainerId]);

    const getContainer = useCallback(() => {
        if (finalId) {
            const el = document.getElementById(finalId);
            if (el) return el;
        }
        return window;
    }, [finalId]);

    useEffect(() => {
        const container = getContainer();
        if (!container) return;

        const getScrollTop = () =>
            container instanceof Window ? window.scrollY : (container as HTMLElement).scrollTop;

        const onScroll = () => {
            setIsVisible(getScrollTop() > scrollOffset);
        };

        onScroll();

        container.addEventListener('scroll', onScroll, { passive: true });
        return () => container.removeEventListener('scroll', onScroll as EventListener);
    }, [finalId, scrollOffset, getContainer]);

    const scrollToTop = () => {
        const container = getContainer();
        if (!container) return;

        const behavior: ScrollBehavior = animated ? 'smooth' : 'auto';
        if (container instanceof Window) {
            window.scrollTo({ top: 0, behavior });
        } else {
            (container as HTMLElement).scrollTo({ top: 0, behavior });
        }
    };

    // Surface variant — primary color carries the CTA semantic in both modes.
    // Glass adds backdrop-blur and subtle transparency; flat is opaque.
    const surfaceClass =
        surface === 'glass'
            ? 'bg-primary/85 text-primary-foreground backdrop-blur-md border border-[oklch(1_0_0_/_0.15)] shadow-[var(--surface-shadow)]'
            : 'bg-primary text-primary-foreground shadow-lg';

    // Animated=false → zero-duration transitions, Framer still owns AnimatePresence
    // so the mount/unmount stays predictable.
    const duration = animated ? 0.3 : 0;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    onClick={scrollToTop}
                    aria-label="Scroll to top"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 40 }}
                    transition={{ duration }}
                    className={cn(
                        'fixed bottom-6 right-6 z-50 cursor-pointer rounded-full p-3 transition-colors hover:bg-primary/80',
                        surfaceClass,
                        className,
                    )}
                >
                    <ArrowUpIcon className="h-5 w-5" />
                </motion.button>
            )}
        </AnimatePresence>
    );
}

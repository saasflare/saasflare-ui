// @reviewed 2026-04-18
"use client"

/**
 * @fileoverview Floating scroll-to-top button with theme-aware styling.
 * Appears after the user scrolls past a configurable offset. Supports both
 * window-level and custom container scrolling.
 *
 * Integrates with SaasflareProvider:
 *   - `animated` → gates Motion transitions and scroll-to-top behavior
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

import { JSX, useEffect, useState } from 'react';
import * as React from 'react';
import { ArrowUpIcon } from '../ui/phosphor';
import { AnimatePresence, m } from 'motion/react';
import { cn } from '../../lib';
import {
    useSaasflareProps,
    type SaasflareComponentProps,
} from '../../providers';
import { useSaasflareMotion, springGentle } from '../ui/motion-config';

/** Motion event overrides that conflict with React HTML events */
type MotionConflicts = "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd"

/**
 * Props for the ScrollToTopButton component.
 *
 * @interface
 * @package ui
 */
export interface ScrollToTopButtonProps
    extends Omit<React.ComponentProps<"button">, MotionConflicts | keyof SaasflareComponentProps>,
        SaasflareComponentProps {
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
    surface,
    radius,
    animated,
    iconWeight,
    onClick,
    ...props
}: ScrollToTopButtonProps): JSX.Element {
    const sf = useSaasflareProps({ surface, radius, animated, iconWeight });
    const motion = useSaasflareMotion(sf.animated, springGentle);

    const [isVisible, setIsVisible] = useState(false);
    const [container, setContainer] = useState<HTMLElement | Window | null>(null);

    // Resolve the scroll container. When a `scrollContainerId` is given, retry
    // until the target node mounts so late-rendered containers still bind.
    useEffect(() => {
        if (!scrollContainerId) {
            setContainer(window);
            return;
        }

        let raf = 0;
        const resolve = () => {
            const el = document.getElementById(scrollContainerId);
            if (el) {
                setContainer(el);
                return;
            }
            raf = requestAnimationFrame(resolve);
        };
        resolve();

        return () => cancelAnimationFrame(raf);
    }, [scrollContainerId]);

    useEffect(() => {
        if (!container) return;

        const getScrollTop = () =>
            container instanceof Window ? window.scrollY : (container as HTMLElement).scrollTop;

        const onScroll = () => {
            setIsVisible(getScrollTop() > scrollOffset);
        };

        onScroll();

        container.addEventListener('scroll', onScroll, { passive: true });
        return () => container.removeEventListener('scroll', onScroll as EventListener);
    }, [container, scrollOffset]);

    const scrollToTop = (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (!container) return;

        const behavior: ScrollBehavior = sf.animated ? 'smooth' : 'auto';
        if (container instanceof Window) {
            window.scrollTo({ top: 0, behavior });
        } else {
            (container as HTMLElement).scrollTo({ top: 0, behavior });
        }
    };

    // Surface variant — primary color carries the CTA semantic in both modes.
    // Glass adds backdrop-blur and subtle transparency; clay keeps the primary
    // fill (CTA identity) but inherits the pillow shadow stack from surface
    // tokens for the soft 3D finish; flat is opaque.
    const surfaceClass =
        sf.surface === 'glass'
            ? 'bg-primary/85 text-primary-foreground backdrop-blur-md border border-border shadow-[var(--surface-shadow)]'
            : sf.surface === 'clay'
            ? 'bg-primary text-primary-foreground border-0 shadow-[var(--surface-shadow)] active:translate-y-px'
            : 'bg-primary text-primary-foreground shadow-lg';

    return (
        <AnimatePresence>
            {isVisible && (
                <m.button
                    {...props}
                    data-slot="scroll-to-top-button"
                    data-surface={sf.surface}
                    data-radius={sf.radius}
                    data-animated={String(sf.animated)}
                    onClick={scrollToTop}
                    aria-label="Scroll to top"
                    initial={motion.disabled ? false : { opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={motion.disabled ? undefined : { opacity: 0, y: 40 }}
                    transition={motion.transition}
                    className={cn(
                        'fixed bottom-6 right-6 z-50 cursor-pointer rounded-full p-3 transition-colors hover:bg-primary/80',
                        surfaceClass,
                        className,
                    )}
                >
                    <ArrowUpIcon weight={sf.iconWeight} className="h-5 w-5" />
                </m.button>
            )}
        </AnimatePresence>
    );
}

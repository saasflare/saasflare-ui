// @reviewed 2026-05-06
"use client"

/**
 * @fileoverview Top loading bar that shows progress during route transitions.
 *
 * Two render modes, selected by the provider's `animated` flag:
 *   - animated  → A self-trickling 2px bar in `--primary`. Pure CSS + a small
 *                 progress driver; no external runtime dependency.
 *   - static    → A flat 2px bar in `--primary` that simply appears and
 *                 disappears, plus an aria-live region. This keeps a visible
 *                 navigation signal for users with `prefers-reduced-motion`
 *                 (who still want feedback, just without motion) while
 *                 respecting the provider-level kill-switch.
 *
 * Wrapped in Suspense to safely access `useSearchParams` in Next.js App Router.
 *
 * Integrates with SaasflareProvider:
 *   - `animated` → switches between the trickle and static renderers.
 *   - `surface`  → accepted for interface consistency; the 2px bar has no
 *                  background surface, so this value is ignored visually.
 *
 * @module packages/ui/components/composed/top-loading-bar
 * @package ui
 *
 * @component
 * @example
 * import { TopLoadingBar } from '@saasflare/ui';
 * <TopLoadingBar startDelayMs={100} finishDelayMs={300} />
 */

import { Suspense, useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import {
    useSaasflareProps,
    type SaasflareComponentProps,
} from '../../providers';

/**
 * Props for the TopLoadingBar component.
 *
 * @interface
 * @package ui
 */
export interface TopLoadingBarProps extends SaasflareComponentProps {
    /** Delay before starting the progress bar, in ms. @default 100 */
    startDelayMs?: number;
    /** Delay before finishing the progress bar, in ms. @default 300 */
    finishDelayMs?: number;
}

type InnerProps = Pick<TopLoadingBarProps, 'startDelayMs' | 'finishDelayMs'>;

const BAR_BASE_STYLE: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    background: 'var(--primary)',
    transformOrigin: 'left',
    zIndex: 9999,
    pointerEvents: 'none',
};

/**
 * Animated variant — a self-trickling 2px bar. Progress accelerates toward
 * an asymptote (~90%) while the route is changing, then snaps to 100% on
 * completion before fading out. Replaces the historical `nprogress` runtime
 * dependency with a self-contained implementation.
 */
function TopLoadingBarAnimated({
                                   startDelayMs = 100,
                                   finishDelayMs = 300,
                               }: InnerProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [progress, setProgress] = useState(0);
    const [visible, setVisible] = useState(false);
    const trickleRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        let fade: ReturnType<typeof setTimeout> | null = null;

        const start = setTimeout(() => {
            setVisible(true);
            setProgress(0.08);
            trickleRef.current = setInterval(() => {
                setProgress((p) => {
                    if (p >= 0.9) return p;
                    // ease-out trickle: smaller increments as we approach 90%
                    const remaining = 0.9 - p;
                    return p + remaining * 0.06;
                });
            }, 200);
        }, startDelayMs);

        const finish = setTimeout(() => {
            clearTimeout(start);
            if (trickleRef.current) {
                clearInterval(trickleRef.current);
                trickleRef.current = null;
            }
            setProgress(1);
            // Fade out after the snap animation has had a frame to render.
            // `fade` is hoisted to effect scope so the outer cleanup can clear
            // it if the component unmounts during the snap-to-fade window.
            fade = setTimeout(() => {
                setVisible(false);
                setProgress(0);
            }, 200);
        }, finishDelayMs);

        return () => {
            clearTimeout(start);
            clearTimeout(finish);
            if (fade) clearTimeout(fade);
            if (trickleRef.current) {
                clearInterval(trickleRef.current);
                trickleRef.current = null;
            }
        };
    }, [pathname, searchParams, startDelayMs, finishDelayMs]);

    return (
        <>
            <div
                aria-hidden="true"
                style={{
                    ...BAR_BASE_STYLE,
                    transform: `scaleX(${progress})`,
                    opacity: visible ? 1 : 0,
                    transition:
                        'transform 200ms cubic-bezier(0.4, 0, 0.2, 1), opacity 250ms ease-out',
                    boxShadow:
                        '0 0 10px var(--primary), 0 0 5px var(--primary)',
                }}
            />
            <span aria-live="polite" className="sr-only">
                {visible ? 'Loading…' : ''}
            </span>
        </>
    );
}

/**
 * Static variant — motion-free visible signal for users who opted out of
 * animation. Renders a flat 2px bar pinned to the top of the viewport plus
 * an aria-live announcement for assistive tech. The bar itself is decorative
 * (`aria-hidden`); the live region carries the a11y semantics.
 */
function TopLoadingBarStatic({
                                 startDelayMs = 100,
                                 finishDelayMs = 300,
                             }: InnerProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [pending, setPending] = useState(false);

    useEffect(() => {
        const startDelay = setTimeout(() => setPending(true), startDelayMs);

        const finish = setTimeout(() => {
            clearTimeout(startDelay);
            setPending(false);
        }, finishDelayMs);

        return () => {
            clearTimeout(startDelay);
            clearTimeout(finish);
        };
    }, [pathname, searchParams, startDelayMs, finishDelayMs]);

    return (
        <>
            <div
                aria-hidden="true"
                style={{
                    ...BAR_BASE_STYLE,
                    opacity: pending ? 1 : 0,
                    // No transition — this variant is intentionally motion-free.
                }}
            />
            <span aria-live="polite" className="sr-only">
                {pending ? 'Loading…' : ''}
            </span>
        </>
    );
}

export function TopLoadingBar({
                                  startDelayMs,
                                  finishDelayMs,
                                  ...sfProps
                              }: TopLoadingBarProps) {
    const { animated } = useSaasflareProps(sfProps);

    if (!animated) {
        return (
            <Suspense fallback={null}>
                <TopLoadingBarStatic
                    startDelayMs={startDelayMs}
                    finishDelayMs={finishDelayMs}
                />
            </Suspense>
        );
    }

    return (
        <Suspense fallback={null}>
            <TopLoadingBarAnimated
                startDelayMs={startDelayMs}
                finishDelayMs={finishDelayMs}
            />
        </Suspense>
    );
}

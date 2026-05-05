// @reviewed 2026-04-18
/**
 * @fileoverview Top loading bar that shows progress during route transitions.
 *
 * Two render modes, selected by the provider's `animated` flag:
 *   - animated  → NProgress trickle bar (slim, peg-glow, theme-aware).
 *   - static    → A flat 2px bar in `--primary` that simply appears and
 *                 disappears, plus an aria-live region. This keeps a visible
 *                 navigation signal for users with `prefers-reduced-motion`
 *                 (who still want feedback, just without motion) while
 *                 respecting the provider-level kill-switch.
 *
 * Wrapped in Suspense to safely access `useSearchParams` in Next.js App Router.
 *
 * Integrates with SaasflareProvider:
 *   - `animated` → switches between the NProgress and static renderers.
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
'use client';

import { Suspense, useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import {
    useSaasflareProps,
    type SaasflareComponentProps,
} from '../../providers';

NProgress.configure({ showSpinner: false, trickleSpeed: 100 });

/**
 * Theme override for NProgress. The library ships hardcoded `#29d` blue;
 * we pin the bar / peg glow / spinner stroke to the active Saasflare primary
 * via CSS variables so the bar follows the current theme automatically.
 */
const NPROGRESS_THEME_CSS = `
#nprogress .bar {
    background: var(--primary) !important;
    height: 2px;
}
#nprogress .peg {
    box-shadow: 0 0 10px var(--primary), 0 0 5px var(--primary) !important;
}
#nprogress .spinner-icon {
    border-top-color: var(--primary) !important;
    border-left-color: var(--primary) !important;
}
`;

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

/**
 * Animated variant — the original NProgress trickle bar.
 */
function TopLoadingBarAnimated({
                                   startDelayMs = 100,
                                   finishDelayMs = 300,
                               }: InnerProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const startDelay = setTimeout(() => NProgress.start(), startDelayMs);

        const finish = setTimeout(() => {
            clearTimeout(startDelay);
            NProgress.done();
        }, finishDelayMs);

        return () => {
            clearTimeout(startDelay);
            clearTimeout(finish);
        };
    }, [pathname, searchParams, startDelayMs, finishDelayMs]);

    return null;
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
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: 'var(--primary)',
                    opacity: pending ? 1 : 0,
                    zIndex: 9999,
                    pointerEvents: 'none',
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
        <>
            <style dangerouslySetInnerHTML={{ __html: NPROGRESS_THEME_CSS }} />
            <Suspense fallback={null}>
                <TopLoadingBarAnimated
                    startDelayMs={startDelayMs}
                    finishDelayMs={finishDelayMs}
                />
            </Suspense>
        </>
    );
}
// @reviewd 2026-04-11
"use client"

/**
 * @fileoverview Theme toggle button for switching between light and dark mode.
 * Uses next-themes for hydration-safe theme detection and switching.
 * Renders Sun/Moon icons with smooth transitions.
 * @module packages/ui/components/composed/theme-mode-toggle
 * @package ui
 *
 * @component
 * @example
 * import { ThemeModeToggle } from '@saasflare/ui';
 * <ThemeModeToggle />
 *
 * @example
 * // With visible label text
 * <ThemeModeToggle showText textLight="Switch to dark" textDark="Switch to light" />
 */

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Button, MoonIcon, SunIcon } from '../ui';
import { cn } from '../../lib';
import { useSaasflareProps, type SaasflareComponentProps } from '../../providers';

/**
 * Theme mode toggle button with Sun/Moon icons.
 *
 * Props are documented on {@link ThemeModeToggleProps}. Extends
 * {@link SaasflareComponentProps}, so `surface`, `radius`, `animated`, and
 * `iconWeight` are accepted and forwarded to the inner {@link Button}.
 *
 * @component
 * @layer core
 *
 * @returns The toggle button, or `null` before hydration when no SSR seed is provided.
 */
interface ThemeModeToggleProps extends SaasflareComponentProps {
    /** Whether to show the label text visibly. */
    showText?: boolean;
    /** Label shown while in light mode (prompting switch to dark). */
    textLight?: string;
    /** Label shown while in dark mode (prompting switch to light). */
    textDark?: string;
    /** Additional CSS class names. */
    className?: string;
    /**
     * SSR-known resolved theme (`"dark"` or `"light"`) — typically read from a
     * cookie in the parent server component. When provided, the button skips
     * its internal mount-gate and renders the correct sun/moon glyph on the
     * very first paint, eliminating the brief blank frame caused by
     * `next-themes` returning `undefined` during SSR.
     *
     * Leave undefined for the legacy mount-gated behaviour.
     */
    initialResolvedTheme?: 'light' | 'dark';
}

/**
 * Light/dark mode toggle button. Reads and writes the resolved theme via
 * next-themes and renders a ghost {@link Button} with a sun or moon icon,
 * optionally followed by a visible label. Pass `initialResolvedTheme` (e.g.
 * from a cookie) to paint the correct glyph on the very first render;
 * without it, the button mount-gates to `null` until hydration.
 *
 * @component
 * @layer composed
 */
export function ThemeModeToggle({
    showText = false,
    textLight = 'Switch to Dark Mode',
    textDark = 'Switch to Light Mode',
    className,
    surface,
    radius,
    animated,
    iconWeight,
    initialResolvedTheme,
}: ThemeModeToggleProps): React.JSX.Element | null {
    const { setTheme, resolvedTheme } = useTheme();
    const sf = useSaasflareProps({ surface, radius, animated, iconWeight });
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (initialResolvedTheme === undefined && !mounted) {
        // Legacy null-gate when the caller doesn't provide an SSR seed.
        return null;
    }

    // Drive icon + text from resolvedTheme so the button stays in sync when the
    // user's preference is "system" (theme === "system" but resolvedTheme is
    // either "light" or "dark"). On SSR / first render, useTheme is undefined,
    // so we fall back to the caller-supplied seed.
    const effectiveResolved = resolvedTheme ?? initialResolvedTheme;
    const isDark = effectiveResolved === 'dark';
    const label = isDark ? textDark : textLight;

    const toggleTheme = () => {
        setTheme(isDark ? 'light' : 'dark');
    };

    return (
        <Button
            variant="ghost"
            intent="neutral"
            size={showText ? 'sm' : 'icon'}
            surface={sf.surface}
            radius={sf.radius}
            animated={sf.animated}
            iconWeight={sf.iconWeight}
            className={cn('cursor-pointer', className)}
            onClick={toggleTheme}
            aria-label={label}
        >
            {isDark ? (
                <SunIcon
                    weight={sf.iconWeight}
                    aria-hidden="true"
                    className="h-[1.2rem] w-[1.2rem]"
                />
            ) : (
                <MoonIcon
                    weight={sf.iconWeight}
                    aria-hidden="true"
                    className="h-[1.2rem] w-[1.2rem]"
                />
            )}
            {showText && <span className="font-normal">{label}</span>}
        </Button>
    );
}

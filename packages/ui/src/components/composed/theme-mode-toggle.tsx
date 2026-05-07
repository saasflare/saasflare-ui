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
 * import { ThemeModeToggle } from '@saasflare/core';
 * <ThemeModeToggle />
 *
 * @example
 * // With visible label text
 * <ThemeModeToggle showText text="Toggle theme" />
 */
'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '../ui';
import { cn } from '../../lib';
import {JSX} from "react";

/**
 * Theme mode toggle button with Sun/Moon icons.
 *
 * @component
 * @layer core
 *
 * @param {object} props - Component props
 * @param {boolean} [props.showText=false] - Whether to show the label text visibly
 * @param {string} [props.text] - Custom label text override
 * @param {string} [props.className] - Additional CSS class names
 * @returns {JSX.Element | null} The toggle button, or null before hydration
 */
export function ThemeModeToggle({
    showText = false,
    text,
    className,
}: {
    showText?: boolean;
    text?: string;
    className?: string;
}): JSX.Element | null {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        // ⛔ Prevents hydration mismatch
        return null;
    }

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <Button
            variant="ghost"
            size={showText ? 'sm' : 'icon'}
            className={cn('cursor-pointer', className)}
            onClick={toggleTheme}
        >
            <Sun className="h-[1.2rem] w-[1.2rem] hidden dark:block" />
            <Moon className="h-[1.2rem] w-[1.2rem] dark:hidden" />
            <span className={cn(!showText && 'sr-only', 'font-normal')}>
                {text ?? (theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode')}
            </span>
        </Button>
    );
}

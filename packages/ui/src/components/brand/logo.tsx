// @toreview
/**
 * @fileoverview Saasflare brand logo — renders the rainbow-gradient circle mark
 * with optional wordmark. Supports multiple sizes and optional link wrapping.
 * @module packages/ui/components/brand/logo
 * @package ui
 *
 * @component
 * @example
 * import { Logo } from '@saasflare/ui';
 * <Logo size="md" href="/" />
 */
'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '../../lib';
import {
    useSaasflareProps,
    type SaasflareComponentProps,
} from '../../providers';

/**
 * Props for the Logo component.
 *
 * @interface
 * @package ui
 */
export interface LogoProps
    extends Omit<React.ComponentProps<'div'>, keyof SaasflareComponentProps>,
        SaasflareComponentProps {
    /** Visual size of the mark + wordmark. `'icon'` hides the wordmark. @default 'md' */
    size?: 'icon' | 'xs' | 'xxs' | 'sm' | 'md' | 'lg';
    /** Additional class names merged onto the root element. */
    className?: string;
    /** Destination for the wrapping `next/link`. Only used when `interactive`. @default '/' */
    href?: string;
    /** When true, wraps the mark in a `next/link` with hover affordance. @default true */
    interactive?: boolean;
}

/** Per-size dimensions for the circle mark and wordmark. */
const SIZE_MAP: Record<
    NonNullable<LogoProps['size']>,
    { ring: string; hole: string; word: string }
> = {
    xxs: { ring: 'w-5 h-5', hole: 'w-3.5 h-3.5', word: 'text-sm' },
    xs: { ring: 'w-6 h-6', hole: 'w-4 h-4', word: 'text-base' },
    icon: { ring: 'w-8 h-8', hole: 'w-6 h-6', word: 'text-2xl' },
    sm: { ring: 'w-7 h-7', hole: 'w-5 h-5', word: 'text-lg' },
    md: { ring: 'w-8 h-8', hole: 'w-6 h-6', word: 'text-2xl' },
    lg: { ring: 'w-10 h-10', hole: 'w-7 h-7', word: 'text-3xl' },
};

/**
 * Self-contained brand gradient so the mark renders without depending on an
 * external `.rainbow-gradient` utility that may be absent in a consumer build.
 */
const RAINBOW_GRADIENT =
    'conic-gradient(from 180deg, var(--chart-1), var(--chart-2), var(--chart-3), var(--chart-4), var(--chart-5), var(--chart-1))';

/**
 * Logo – Saasflare rainbow-gradient circle mark with optional wordmark.
 */
export function Logo({
    size = 'md',
    className,
    href = '/',
    interactive = true,
    surface,
    radius,
    animated,
    iconWeight,
    ...rest
}: LogoProps) {
    const sf = useSaasflareProps({ surface, radius, animated, iconWeight });
    const dims = SIZE_MAP[size];

    const content = (
        <>
            <div
                className={cn(
                    dims.ring,
                    'rounded-full flex items-center justify-center transition-transform group-hover:scale-110',
                )}
                style={{ backgroundImage: RAINBOW_GRADIENT }}
            >
                <div className={cn(dims.hole, 'rounded-full bg-background')} />
            </div>
            {size !== 'icon' && (
                <span className={cn('font-semibold', dims.word)}>Saasflare</span>
            )}
        </>
    );

    if (interactive) {
        return (
            <Link
                href={href}
                aria-label="Saasflare"
                data-slot="logo"
                data-surface={sf.surface}
                data-radius={sf.radius}
                data-animated={String(sf.animated)}
                className={cn('flex items-center gap-2 group cursor-pointer', className)}
            >
                {content}
            </Link>
        );
    }

    return (
        <div
            aria-label="Saasflare"
            data-slot="logo"
            data-surface={sf.surface}
            data-radius={sf.radius}
            data-animated={String(sf.animated)}
            className={cn('flex items-center gap-2', className)}
            {...rest}
        >
            {content}
        </div>
    );
}

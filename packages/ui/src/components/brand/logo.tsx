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

import React from 'react';
import Link from 'next/link';
import { cn } from '../../lib';

export type LogoProps = {
    size?: 'icon' | 'xs' | 'xxs' | 'sm' | 'md' | 'lg';
    className?: string;
    href?: string;
    interactive?: boolean;
};

export const Logo: React.FC<LogoProps> = ({ size = 'md', className, href = '/', interactive = true }) => {
    const LogoContent = () => (
        <>
            <div className="w-8 h-8 rounded-full rainbow-gradient flex items-center justify-center transition-transform group-hover:scale-110">
                <div className="w-6 h-6 rounded-full bg-background"></div>
            </div>
            {size !== 'icon' && <span className="font-semibold text-2xl">Saasflare</span>}
        </>
    );

    return interactive ? (
        <Link href={href} className={cn("flex items-center gap-2 group cursor-pointer", className)}>
            <LogoContent />
        </Link>
    ) : (
        <div className={cn("flex items-center gap-2", className)}>
            <LogoContent />
        </div>
    );
};

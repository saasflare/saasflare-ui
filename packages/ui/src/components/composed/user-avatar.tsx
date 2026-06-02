// @toreview
/**
 * @fileoverview Reusable user avatar with size variants and fallback initials.
 * @module packages/ui/components/composed/user-avatar
 * @package ui
 *
 * @example
 * import { UserAvatar } from '@saasflare/ui';
 * <UserAvatar src={user.avatar} name={user.name} initials="JD" size="md" />
 */
'use client';

import * as React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui';
import { cn } from '../../lib';
import { useSaasflareProps, type SaasflareComponentProps } from '../../providers';

/**
 * Props for the UserAvatar component.
 *
 * @interface
 * @layer core
 */
export interface UserAvatarProps extends SaasflareComponentProps {
    /** URL of the user's avatar image */
    src: string | null | undefined;
    /** User's display name (used as alt text) */
    name: string | null | undefined;
    /** Initials to show when no avatar image is available */
    initials: string;
    /** Avatar size variant */
    size?: 'sm' | 'md' | 'lg';
    /** Additional CSS class names */
    className?: string;
    /** Optional click handler. When provided, the avatar shows a pointer cursor. */
    onClick?: React.MouseEventHandler<HTMLSpanElement>;
}

const sizeClasses = {
    sm: 'h-7 w-7 text-xs',
    md: 'h-8 w-8 text-xs',
    lg: 'h-12 w-12 text-sm',
};

/**
 * User avatar with image, fallback initials, and size variants.
 *
 * @component
 * @layer core
 *
 * @param {UserAvatarProps} props - Component props
 * @returns {JSX.Element} The rendered avatar
 *
 * @example
 * <UserAvatar src="/avatars/jane.jpg" name="Jane Doe" initials="JD" />
 */
export function UserAvatar({
    src,
    name,
    initials,
    size = 'md',
    className,
    onClick,
    surface,
    radius,
    animated,
    iconWeight,
}: UserAvatarProps) {
    const sf = useSaasflareProps({ surface, radius, animated, iconWeight });

    return (
        <Avatar
            surface={sf.surface}
            radius={sf.radius}
            animated={sf.animated}
            onClick={onClick}
            className={cn(sizeClasses[size], onClick && 'cursor-pointer', className)}
        >
            <AvatarImage src={src || undefined} alt={name || 'User'} />
            <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
    );
}

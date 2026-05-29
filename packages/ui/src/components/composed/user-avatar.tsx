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

import { Avatar, AvatarFallback, AvatarImage } from '../ui';
import { cn } from '../../lib';

/**
 * Props for the UserAvatar component.
 *
 * @interface
 * @layer core
 */
export interface UserAvatarProps {
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
export function UserAvatar({ src, name, initials, size = 'md', className }: UserAvatarProps) {
    return (
        <Avatar className={cn(sizeClasses[size], 'cursor-pointer', className)}>
            <AvatarImage src={src || undefined} alt={name || 'User'} />
            <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
    );
}

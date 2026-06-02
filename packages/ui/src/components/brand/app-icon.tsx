// @toreview
/**
 * @fileoverview Saasflare app icon — minimal SVG logomark rendered as a React component.
 * @module packages/ui/components/brand/app-icon
 * @package ui
 *
 * @component
 * @example
 * import { AppIcon } from '@saasflare/ui';
 * <AppIcon className="h-8 w-auto" />
 */
import * as React from 'react';

interface AppIconProps extends React.SVGProps<SVGSVGElement> {
    size?: number | string;
}

/**
 * AppIcon – Custom SVG icon for Saasflare.
 */
export const AppIcon = React.forwardRef<SVGSVGElement, AppIconProps>(
    ({ size, width, height, ...props }, ref) => (
        <svg
            ref={ref}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 316.82 275.02"
            fill="currentColor"
            width={width ?? size}
            height={height ?? size}
            {...props}
        >
            <path d="M147.35,275.02C59.91,275.02-3.12,210.29.12,128.53,1.47,94.4,13.08,62.19,37.11,37.92,61.14,13.64,93.19.18,127.34,0c.19,0,.39,0,.58,0,61.47,0,111.63,49.85,111.95,111.39l-76.72.39c0-15.05-15.88-36.89-42.71-35.06-28.01,1.92-43.6,27.49-43.6,51.42,0,38.76,29.52,68.15,70.88,70.16,41.36,2.01,88.79-29.81,92.39-86.87h76.72c-.44,53.31-46.62,163.59-169.48,163.59Z" />
        </svg>
    ),
);

AppIcon.displayName = 'AppIcon';
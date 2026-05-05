// @toreview
/**
 * @fileoverview Main barrel export for @saasflare/ui.
 * Re-exports all UI components, utilities, hooks, providers, and commons.
 * Components are standalone and customized, partly animated using Framer Motion.
 * @module packages/ui/index
 * @package ui
 */

// Utilities
export { cn } from './lib';

// Hooks
export { useIsMobile } from './hooks/use-mobile';
export { useReducedMotion } from './hooks/use-reduced-motion';
export { useDisclosure, type UseDisclosureOptions, type UseDisclosureReturn } from './hooks/use-disclosure';
export { useMeasure, type Measurement, type UseMeasureReturn } from './hooks/use-measure';
export {
    usePagination,
    type PaginationRangeItem,
    type UsePaginationOptions,
    type UsePaginationReturn,
} from './hooks/use-pagination';

// UI Components (Premium — from ui/ with animations)
export * from './components/ui/index';

// Types (pure type-only exports from /types)
export {
    PALETTES,
    STYLES,
    RADII,
    type PaletteId,
    type StyleVariant,
    type CustomPalette,
    type Palette,
    type Surface,
    type Radius,
    type RadiusProp,
    type Size,
    type Density,
} from './types';

// Providers
export {
    useAnimation,
    SmoothScrollProvider,
    type SmoothScrollProviderProps,
    SaasflareProvider,
    useSaasflareTheme,
    type SaasflareProviderProps,
    SaasflareShell,
    type SaasflareShellProps,
    SaasflareScript,
    type SaasflareScriptProps,
    useSaasflareProps,
    type SaasflareComponentProps,
    type ResolvedSaasflareProps,
} from './providers';

// Commons
export { ScrollToTopButton } from './components/composed/scroll-to-top-button';
export { ThemeModeToggle } from './components/composed/theme-mode-toggle';
export { TopLoadingBar, type TopLoadingBarProps } from './components/composed/top-loading-bar';
export { UserAvatar, type UserAvatarProps } from './components/composed/user-avatar';

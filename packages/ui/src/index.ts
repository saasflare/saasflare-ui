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
export { useLocalStorage, type UseLocalStorageOptions } from './hooks/use-local-storage';
export {
    usePagination,
    type PaginationRangeItem,
    type UsePaginationOptions,
    type UsePaginationReturn,
} from './hooks/use-pagination';
export { useMergedRef, type PossibleRef } from './hooks/use-merged-ref';
export {
    useInterval,
    type UseIntervalOptions,
    type UseIntervalReturn,
} from './hooks/use-interval';
export { useFocusTrap } from './hooks/use-focus-trap';
export { useCountdown, type CountdownValue } from './hooks/use-countdown';
export {
    useFileDialog,
    type UseFileDialogOptions,
    type UseFileDialogReturn,
} from './hooks/use-file-dialog';

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
export { StatefulButton, type StatefulButtonProps } from './components/composed/stateful-button';
export {
    SocialAuthButton,
    GoogleAuthButton,
    GitHubAuthButton,
    AppleAuthButton,
    MicrosoftAuthButton,
    XAuthButton,
    DiscordAuthButton,
    FacebookAuthButton,
    LinkedInAuthButton,
    MediumAuthButton,
    SlackAuthButton,
    RedditAuthButton,
    PayPalAuthButton,
    StripeAuthButton,
    GitLabAuthButton,
    DribbbleAuthButton,
    TikTokAuthButton,
    PROVIDERS as SOCIAL_AUTH_PROVIDERS,
    type SocialAuthButtonProps,
    type SocialProvider,
} from './components/brand/social-auth-buttons';
export { ThemeModeToggle } from './components/composed/theme-mode-toggle';
export {
    ThemeModeMultiToggle,
    type ThemeModeMultiToggleProps,
    type ThemeModeMultiToggleAppearance,
} from './components/composed/theme-mode-multi-toggle';
export { TopLoadingBar, type TopLoadingBarProps } from './components/composed/top-loading-bar';
export { UserAvatar, type UserAvatarProps } from './components/composed/user-avatar';

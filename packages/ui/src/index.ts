// @toreview
/**
 * @fileoverview Main barrel export for @saasflare/ui.
 * Re-exports all UI components, utilities, hooks, providers, and commons.
 * Components are standalone and customized, partly animated using Motion.
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
    paginationSummary,
    type PaginationRangeItem,
    type UsePaginationOptions,
    type UsePaginationReturn,
    type PaginationSummaryRange,
} from './hooks/use-pagination';
export {
    useDataTable,
    type UseDataTableOptions,
    type UseDataTableReturn,
    type DataTableSelectionMode,
} from './hooks/use-data-table';
export {
    useStepper,
    type StepValidationResult,
    type StepperStepConfig,
    type UseStepperOptions,
    type UseStepperReturn,
} from './hooks/use-stepper';
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
export { useAnimationFrame } from './hooks/use-animation-frame';
export { useClickOutside } from './hooks/use-click-outside';
export { useClipboard, type UseClipboardReturn } from './hooks/use-clipboard';
export {
    useDebounce,
    useDebouncedCallback,
    type DebouncedCallbackOptions,
    type DebouncedFunction,
} from './hooks/use-debounce';
export { useDocumentTitle, type UseDocumentTitleOptions } from './hooks/use-document-title';
export { useEventListener } from './hooks/use-event-listener';
export { useIdle } from './hooks/use-idle';
export { useInView } from './hooks/use-in-view';
export {
    useIntersectionObserver,
    type UseIntersectionObserverOptions,
} from './hooks/use-intersection-observer';
export { useKeyboardShortcut, type KeyboardShortcutOptions } from './hooks/use-keyboard-shortcut';
export {
    useLongPress,
    type UseLongPressOptions,
    type LongPressHandlers,
} from './hooks/use-long-press';
export { useMediaQuery } from './hooks/use-media-query';
export { useMounted } from './hooks/use-mounted';
export {
    useMousePosition,
    type MousePosition,
    type UseMousePositionOptions,
} from './hooks/use-mouse-position';
export { useOnline } from './hooks/use-online';
export { useParallax, type ParallaxValue } from './hooks/use-parallax';
export { usePrevious } from './hooks/use-previous';
export { useScrollLock } from './hooks/use-scroll-lock';
export {
    useScrollPosition,
    type ScrollPosition,
    type ScrollDirection,
    type UseScrollPositionOptions,
} from './hooks/use-scroll-position';
export { useToggle } from './hooks/use-toggle';
export { useWindowSize, type WindowSize } from './hooks/use-window-size';

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
export { Logo, type LogoProps } from './components/brand/logo';
export { AppIcon, type AppIconProps } from './components/brand/app-icon';
export { ThemeModeToggle } from './components/composed/theme-mode-toggle';
export {
    ThemeModeMultiToggle,
    type ThemeModeMultiToggleProps,
    type ThemeModeMultiToggleAppearance,
} from './components/composed/theme-mode-multi-toggle';
export { TopLoadingBar, type TopLoadingBarProps } from './components/composed/top-loading-bar';
export { UserAvatar, type UserAvatarProps } from './components/composed/user-avatar';

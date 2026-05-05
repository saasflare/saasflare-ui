// @reviewed 2026-04-19
/**
 * @fileoverview Providers barrel export — sole public surface of `packages/ui/providers`.
 * All consumers (including the root `packages/ui/index.ts` barrel) import from here.
 * Individual provider files are implementation details and must not be imported directly.
 *
 * Pure type-only exports live in `packages/ui/types` (not re-exported here) to
 * keep this barrel focused on runtime values (providers, hooks, script).
 * @module packages/ui/providers
 * @package ui
 */

export { useAnimation } from './animation-context';

export {
    SmoothScrollProvider,
    type SmoothScrollProviderProps,
} from './smooth-scroll-provider';

export {
    SaasflareProvider,
    useSaasflareTheme,
    type SaasflareProviderProps,
} from './saasflare-provider';

export {
    SaasflareShell,
    type SaasflareShellProps,
} from './saasflare-shell';

export {
    SaasflareScript,
    type SaasflareScriptProps,
} from './saasflare-script';

export {
    useSaasflareProps,
    type SaasflareComponentProps,
    type ResolvedSaasflareProps,
} from './use-saasflare-props';

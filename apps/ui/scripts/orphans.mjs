/**
 * Public exports that live OUTSIDE src/components/ui/*.tsx top-level and are
 * therefore missed by the auto-discovery scan in all three generators.
 *
 * Single source of truth imported by build-registry.mjs (registry items),
 * build-props.mjs (props tables), and build-doc-pages.mjs (sidebar coverage).
 * Keyed by registry slug. `srcPath` is relative to packages/ui (each script
 * resolves PKG_ROOT already). `category` names a key in build-doc-pages.mjs
 * CATEGORIES.
 *
 * Two optional overrides handle the one barrel entry (sidebar):
 *   - `bundleFrom`: sibling module basenames whose sources are inlined into the
 *     registry item's content; their local re-exports are not treated as
 *     registry dependencies (build-registry.mjs).
 *   - `propsFrom`: real .tsx files react-docgen-typescript should parse instead
 *     of the re-export barrel (build-props.mjs).
 */
export const ORPHANS = [
    {
        slug: "logo",
        srcPath: "src/components/brand/logo.tsx",
        title: "Logo",
        description:
            "Saasflare brand mark + wordmark with six size presets (icon hides the wordmark) and an interactive mode that wraps the mark in a next/link with hover affordance.",
        category: "Brand & Auth",
    },
    {
        slug: "app-icon",
        srcPath: "src/components/brand/app-icon.tsx",
        title: "App Icon",
        description:
            "The raw Saasflare SVG mark as a standalone icon — sized via a single size prop (any CSS length), with full SVG prop pass-through for favicons, loaders, and nav rails.",
        category: "Brand & Auth",
    },
    {
        slug: "social-auth-button",
        srcPath: "src/components/brand/social-auth-buttons.tsx",
        title: "Social Auth Button",
        description:
            "Provider-branded OAuth sign-in button for all 16 supported identity providers, with official brand logos, an opt-in colorful weight, and built-in loading state (wraps StatefulButton). Includes 16 pre-bound shortcuts (GoogleAuthButton, GitHubAuthButton, …).",
        category: "Brand & Auth",
    },
    {
        slug: "sidebar",
        srcPath: "src/components/ui/sidebar/index.ts",
        title: "Sidebar",
        description:
            "Collapsible application sidebar system — provider, rail, header/footer, groups, and a full menu (button, action, badge, sub-menu, skeleton) with cookie-persisted open state and a ⌘B keyboard shortcut.",
        category: "Navigation",
        bundleFrom: ["context", "layout", "menu"],
        propsFrom: [
            "src/components/ui/sidebar/layout.tsx",
            "src/components/ui/sidebar/menu.tsx",
            "src/components/ui/sidebar/context.tsx",
        ],
    },
    {
        slug: "stateful-button",
        srcPath: "src/components/composed/stateful-button.tsx",
        title: "Stateful Button",
        description:
            "Button with a built-in async loading state — disables, sets aria-busy, prepends a spinner, and optionally swaps its label for loadingText.",
        category: "Buttons & Actions",
    },
    {
        slug: "user-avatar",
        srcPath: "src/components/composed/user-avatar.tsx",
        title: "User Avatar",
        description:
            "Avatar with image, automatic initials fallback, three size variants, and an optional click handler. The opinionated wrapper most apps reach for.",
        category: "Data Display",
    },
    {
        slug: "theme-mode-toggle",
        srcPath: "src/components/composed/theme-mode-toggle.tsx",
        title: "Theme Mode Toggle",
        description:
            "Two-state light/dark toggle button (Sun/Moon) backed by next-themes, with an SSR seed prop to eliminate the first-paint flash.",
        category: "Brand & Auth",
    },
    {
        slug: "theme-mode-multi-toggle",
        srcPath: "src/components/composed/theme-mode-multi-toggle.tsx",
        title: "Theme Mode Multi Toggle",
        description:
            "Three-segment light / dark / system segmented control (Sun / Moon / Monitor) built on ToggleGroup, with icon, icon-inherit, and button appearances.",
        category: "Brand & Auth",
    },
    {
        slug: "top-loading-bar",
        srcPath: "src/components/composed/top-loading-bar.tsx",
        title: "Top Loading Bar",
        description:
            "Slim top-of-page progress bar for Next.js App Router route transitions — self-trickling when animated, a flat aria-live bar when reduced-motion.",
        category: "Feedback",
    },
    {
        slug: "scroll-to-top-button",
        srcPath: "src/components/composed/scroll-to-top-button.tsx",
        title: "Scroll To Top Button",
        description:
            "Floating button that appears past a scroll offset and smoothly returns to the top — supports window or a custom scroll container, flat or glass surface.",
        category: "Buttons & Actions",
    },
    {
        slug: "animated-tooltip",
        srcPath: "src/components/ui/animated/tooltip.tsx",
        title: "Animated Tooltip",
        description:
            "Row of circular avatars that reveal a spring-tilted, mouse-tracking tooltip on hover — for team rows and contributor stacks.",
        category: "Feedback",
    },
]

/** Convenience lookup used by the scripts. */
export const ORPHAN_BY_SLUG = new Map(ORPHANS.map((o) => [o.slug, o]))

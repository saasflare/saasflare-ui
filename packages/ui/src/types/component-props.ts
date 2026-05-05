// @reviewed 2026-04-18
/**
 * @fileoverview Shared type aliases for component prop value domains.
 * @module packages/ui/types/component-props
 * @package ui
 *
 * These are value-domain types, not mixin interfaces. Components compose
 * them into their own prop signatures and restrict to the subset that
 * makes sense. Lives in /types (not /providers) because these types have
 * no runtime coupling to the Saasflare provider context.
 *
 * @example Full range
 *   interface ButtonProps extends SaasflareComponentProps {
 *     size?: Size
 *   }
 *
 * @example Restricted subset
 *   interface IconProps extends SaasflareComponentProps {
 *     size?: Extract<Size, "xs" | "sm" | "md">   // no lg/xl — too big for icons
 *   }
 *
 * Intent is intentionally NOT here. Saasflare components express semantic
 * coloring through their own `variant` prop (per-component CVA vocabulary)
 * rather than a shared intent token. See individual component files for
 * their variant domains.
 */

/**
 * Standard size scale for Saasflare components.
 *
 * Each component restricts to the subset that makes sense:
 *   - Buttons: full range `"xs" | "sm" | "md" | "lg" | "xl"`
 *   - Icons:   only `"xs" | "sm" | "md"` (lg/xl are cartoonishly large)
 *   - Avatars: `"sm" | "md" | "lg" | "xl"` (xs is too small to be useful)
 *
 * Components pick via `Extract<Size, "xs" | "sm">` in their props definition.
 */
export type Size = "xs" | "sm" | "md" | "lg" | "xl"

/**
 * Spacing density scale for data-dense components.
 *
 * Applies per-instance on components like Table, Form, DataList where
 * the author wants to trade visual breathing-room against vertical space.
 *
 * Not a provider axis (unlike `surface` and `animated`): density stays
 * local to the component instance. If you need app-wide "compact mode",
 * wrap your dashboard in your own `<Density>` context or pass the value
 * down explicitly.
 */
export type Density = "compact" | "normal" | "comfortable"

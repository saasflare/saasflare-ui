// @reviewed 2026-04-19
/**
 * @fileoverview Types barrel — sole public surface of `packages/ui/types`.
 * Holds pure type definitions (zero runtime). Consumers import via the
 * root `@saasflare/ui` barrel; internal files may import from here.
 * @module packages/ui/types
 * @package ui
 */

// Component value-domain types (shared unions for component props).
export type { Size, Density } from './component-props';

// Theme / provider prop types + constant registries.
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
} from './theme-props';

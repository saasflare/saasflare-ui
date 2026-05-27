---
"@saasflare/ui": minor
---

Catalog expansion: Tremor-style data viz, new composed widgets, brand auth, and stateful interactions.

**New components**
- Data viz: `BarList`, `CategoryBar`, `Tracker`, `SparkChart`, `ProgressCircle`
- Inputs: `DatePicker`, `DateRangePicker`, `NumberInput`, `Dropzone`, `TagInput`, `Rating`
- Surfaces: `AuroraBackground`, `Callout`, `CodeBlock`, `NotificationCenter`, `TreeView`
- Composed: `StatefulButton`, `ThemeModeMultiToggle`
- Brand: `SocialAuthButton` and 16 provider presets (`GoogleAuthButton`, `GitHubAuthButton`, `AppleAuthButton`, …)
- Icons: internal `Phosphor` icon set wired to `iconWeight` prop

**New hooks**
- `useLocalStorage`, `useMergedRef`, `useInterval`, `useFocusTrap`, `useFileDialog`

**Theming**
- New `aurora` surface variant alongside `flat`/`glass`/`clay`
- `data-radius` selectors descoped from `:root` so component-level `radius` prop now overrides page-wide radius
- Palette expansions

**Internal**
- Drop unused `lucide-react` dependency
- Build pipeline now emits component registry + LLM docs alongside `tsup` bundle

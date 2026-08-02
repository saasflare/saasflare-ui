---
"@saasflare/ui": minor
---

`PricingCard` can now express a real pricing table. `features` accepts descriptors alongside plain strings — `{ label, tooltip?, excluded? }` — so a tier can explain a limit inline and show what it does *not* include, instead of consumers rebuilding the list markup to get either. Excluded rows render muted with a minus icon and a strikethrough; tooltips get a keyboard-reachable trigger with an accessible name, and a `TooltipProvider` is mounted only when a tooltip is actually present.

The featured ribbon text is now the `badge` prop (default `"Recommended"`), so it can be translated or replaced without a CSS override.

Both changes are backward compatible: `features={["a", "b"]}` behaves exactly as before.

Also registers the five newly exported animated components in the catalog — `AnimatedCounter`, `AnimatedBeam`, `AnimatedShinyText`, `AnimatedCursor`, and `AnimatedTestimonials` now have registry entries, props tables, live demos, and sidebar placement, bringing the catalog to 135 components.

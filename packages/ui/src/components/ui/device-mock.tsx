/**
 * @fileoverview Device frame mockups (Safari browser and iPhone).
 * @author Saasflare™
 * CSS-only device frames for wrapping screenshots and demos.
 * No images or assets required — pure HTML/CSS chrome.
 * @module packages/ui/components/ui/device-mock
 * @package ui
 *
 * @component
 * @example
 * import { SafariMock, IPhoneMock } from '@saasflare/ui';
 * <SafariMock url="https://app.example.com">
 *   <img src="/screenshot.png" alt="App screenshot" />
 * </SafariMock>
 *
 * @example
 * <IPhoneMock>
 *   <img src="/mobile-screenshot.png" alt="Mobile view" />
 * </IPhoneMock>
 */

import { type ReactNode } from "react"
import { cn } from "../../lib"

/* ── Safari Browser Mock ── */

/** Props for the SafariMock component. */
export interface SafariMockProps {
  /** Content to display inside the browser frame. */
  children: ReactNode
  /** URL text shown in the address bar. Default: `"https://example.com"` */
  url?: string
  /** Additional class names. */
  className?: string
}

/**
 * Safari-style browser frame for wrapping screenshots.
 *
 * - CSS-only traffic lights (red/yellow/green dots)
 * - Address bar with optional URL text
 * - Rounded corners matching macOS window chrome
 *
 * @component
 * @package ui
 */
export function SafariMock({
  children,
  url = "https://example.com",
  className,
}: SafariMockProps) {
  return (
    <div
      className={cn("overflow-hidden rounded-xl border bg-background shadow-xl", className)}
      data-slot="safari-mock"
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b bg-muted/50 px-4 py-3">
        {/* Traffic lights */}
        <div className="flex gap-1.5">
          <div className="size-3 rounded-full bg-[#ff5f57]" />
          <div className="size-3 rounded-full bg-[#febc2e]" />
          <div className="size-3 rounded-full bg-[#28c840]" />
        </div>

        {/* Address bar */}
        <div className="mx-auto flex max-w-md flex-1 items-center justify-center rounded-md bg-background/80 px-3 py-1 text-xs text-muted-foreground">
          <svg
            className="mr-1.5 size-3 text-muted-foreground/50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <span className="truncate">{url}</span>
        </div>
      </div>

      {/* Content */}
      <div className="overflow-hidden">{children}</div>
    </div>
  )
}

/* ── iPhone Mock ── */

/** Props for the IPhoneMock component. */
export interface IPhoneMockProps {
  /** Content to display inside the phone frame. */
  children: ReactNode
  /** Additional class names. */
  className?: string
}

/**
 * iPhone-style device frame for wrapping mobile screenshots.
 *
 * - CSS-only frame with rounded corners and notch
 * - Status bar with time and signal indicators
 * - Aspect ratio matches iPhone 15 Pro proportions
 *
 * @component
 * @package ui
 */
export function IPhoneMock({
  children,
  className,
}: IPhoneMockProps) {
  return (
    <div
      className={cn(
        "relative mx-auto w-[280px] rounded-[2.5rem] border-[6px] border-foreground/10 bg-background p-1.5 shadow-xl",
        className,
      )}
      data-slot="iphone-mock"
    >
      {/* Notch / Dynamic Island */}
      <div className="absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-foreground/10" />

      {/* Screen */}
      <div className="overflow-hidden rounded-[2rem] bg-background">
        {/* Status bar */}
        <div className="flex items-center justify-between px-6 py-2 text-[10px] font-semibold text-foreground">
          <span>9:41</span>
          <div className="flex items-center gap-1">
            <div className="flex gap-0.5">
              <div className="h-2 w-0.5 rounded-sm bg-foreground" />
              <div className="h-2.5 w-0.5 rounded-sm bg-foreground" />
              <div className="h-3 w-0.5 rounded-sm bg-foreground" />
              <div className="h-3.5 w-0.5 rounded-sm bg-foreground" />
            </div>
            <span className="ml-1">100%</span>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-hidden">{children}</div>
      </div>

      {/* Home indicator */}
      <div className="mx-auto mt-1.5 h-1 w-28 rounded-full bg-foreground/20" />
    </div>
  )
}

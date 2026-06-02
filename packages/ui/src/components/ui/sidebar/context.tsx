// @toreview
"use client"

/**
 * @fileoverview Sidebar context — React context, provider, cookie-based persistence, and trigger for the sidebar system.
 * Manages sidebar open/collapsed state across desktop and mobile with keyboard shortcut support.
 * @module packages/ui/components/ui/sidebar/context
 * @package ui
 *
 * @example
 * import { SidebarProvider, useSidebar, SidebarTrigger } from '@saasflare/ui';
 * <SidebarProvider>
 *   <SidebarTrigger />
 *   {children}
 * </SidebarProvider>
 */

// ============================================================================
// SIDEBAR CONTEXT
// Context, provider, and constants for the sidebar component system
// ============================================================================

import * as React from "react"
import { SidebarSimpleIcon } from "../phosphor"
import { useIsMobile } from "../../../hooks/use-mobile"
import { cn } from "../../../lib"
import {
  useSaasflareProps,
  type SaasflareComponentProps,
} from "../../../providers"
import { Button } from "../button"
import {
  TooltipProvider,
} from "../tooltip"

// ============================================================================
// CONSTANTS
// ============================================================================

export const SIDEBAR_COOKIE_NAME = "sidebar_state"
export const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
export const SIDEBAR_WIDTH = "16rem"
export const SIDEBAR_WIDTH_MOBILE = "18rem"
export const SIDEBAR_WIDTH_ICON = "3rem"
export const SIDEBAR_KEYBOARD_SHORTCUT = "b"

// ============================================================================
// CONTEXT
// ============================================================================

export type SidebarContextProps = {
  state: "expanded" | "collapsed" | "overlayed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

export const SidebarContext = React.createContext<SidebarContextProps | null>(null)

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}

// ============================================================================
// PROVIDER
// ============================================================================

export function SidebarProvider({
    defaultOpen: defaultOpenProp,
    open: openProp,
    onOpenChange: setOpenProp,
    className,
    style,
    children,
    ...props
}: React.ComponentProps<'div'> & {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}) {
    const isMobile = useIsMobile();

    const [openMobile, setOpenMobile] = React.useState(false);

    // Start with a consistent default for SSR (fallback: open on desktop).
    const [_open, _setOpen] = React.useState(defaultOpenProp ?? true);

    // Track if we've hydrated and read the cookie
    const [hasHydrated, setHasHydrated] = React.useState(false);

    // Read cookie AFTER hydration to avoid mismatch
    React.useEffect(() => {
        if (openProp !== undefined || defaultOpenProp !== undefined) {
            setHasHydrated(true);
            return;
        }

        const cookieValue = document.cookie
            .split('; ')
            .find((row) => row.startsWith(`${SIDEBAR_COOKIE_NAME}=`))
            ?.split('=')[1];

        if (cookieValue !== undefined) {
            _setOpen(cookieValue === 'true');
        }

        setHasHydrated(true);
    }, [openProp, defaultOpenProp]);

    // Viewport-based auto-adjust (only if no cookie preference).
    React.useEffect(() => {
        if (!hasHydrated) return;
        if (openProp !== undefined || defaultOpenProp !== undefined) return;

        const hasCookie = document.cookie.includes(SIDEBAR_COOKIE_NAME);

        if (!hasCookie && !isMobile) {
            _setOpen(true);
        }
    }, [hasHydrated, isMobile, openProp, defaultOpenProp]);

    const open = openProp ?? _open;

    const setOpen = React.useCallback(
        (value: boolean | ((value: boolean) => boolean)) => {
            const openState = typeof value === 'function' ? value(open) : value;
            if (setOpenProp) {
                setOpenProp(openState);
            } else {
                _setOpen(openState);
            }

            // This sets the cookie to keep the sidebar state.
            document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
        },
        [setOpenProp, open],
    );

    // Helper to toggle the sidebar.
    const toggleSidebar = React.useCallback(() => {
        return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
    }, [isMobile, setOpen, setOpenMobile]);

    // Adds a keyboard shortcut to toggle the sidebar.
    React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                toggleSidebar();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [toggleSidebar]);

    // Desktop state reflects `open` only; on mobile the sidebar is presented
    // as an overlay sheet ('overlayed' when its mobile sheet is open). Keeping
    // these branches separate avoids the desktop state flipping when the mobile
    // sheet toggles.
    const state: SidebarContextProps['state'] = isMobile
        ? openMobile
            ? 'overlayed'
            : 'collapsed'
        : open
            ? 'expanded'
            : 'collapsed';

    const contextValue = React.useMemo<SidebarContextProps>(
        () => ({
            state,
            open,
            setOpen,
            isMobile: isMobile,
            openMobile,
            setOpenMobile,
            toggleSidebar,
        }),
        [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar],
    );

    return (
        <SidebarContext.Provider value={contextValue}>
            <TooltipProvider delayDuration={0}>
                <div
                    data-slot="sidebar-wrapper"
                    style={
                        {
                            '--sidebar-width': SIDEBAR_WIDTH,
                            '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
                            ...style,
                        } as React.CSSProperties
                    }
                    className={cn(
                        'group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex h-svh w-full overflow-hidden',
                        className,
                    )}
                    {...props}
                >
                    {children}
                </div>
            </TooltipProvider>
        </SidebarContext.Provider>
    );
}

// ============================================================================
// TRIGGER
// ============================================================================

export function SidebarTrigger({
  className,
  onClick,
  surface,
  radius,
  animated,
  iconWeight,
  ...props
}: React.ComponentProps<typeof Button> & SaasflareComponentProps) {
  const { toggleSidebar } = useSidebar()
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })

  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon"
      surface={sf.surface}
      radius={sf.radius}
      animated={sf.animated}
      iconWeight={sf.iconWeight}
      className={cn("size-7", className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <SidebarSimpleIcon weight={sf.iconWeight} />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
}

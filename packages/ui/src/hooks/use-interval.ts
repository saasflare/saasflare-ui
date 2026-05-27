// @draft
"use client"

/**
 * @fileoverview `setInterval` lifecycle helper with start/stop/toggle
 * controls. Pauses cleanly when the delay is `null`, never leaks a timer
 * across renders, and always invokes the latest callback (no stale closures).
 * @author Saasflare™
 * @module packages/ui/hooks/use-interval
 * @package ui
 *
 * @example
 * // Run every second while active.
 * const { active, start, stop, toggle } = useInterval(() => tick(), 1000);
 *
 * @example
 * // Pause by passing null as the delay.
 * useInterval(() => poll(), isFocused ? 5000 : null);
 */

import { useCallback, useEffect, useRef, useState } from "react"

/** Return value of {@link useInterval}. */
export interface UseIntervalReturn {
    /** Whether the interval is currently running. */
    active: boolean
    /** Start (or restart) the interval. */
    start: () => void
    /** Stop the interval. */
    stop: () => void
    /** Toggle the interval. */
    toggle: () => void
}

/** Options for {@link useInterval}. */
export interface UseIntervalOptions {
    /** If `true`, start the interval immediately. Default: `true`. */
    autoInvoke?: boolean
}

/**
 * Calls `callback` every `delay` milliseconds. The latest callback is always
 * invoked even if the callback identity changes between renders. Pass
 * `delay = null` to pause.
 *
 * @param callback - Function to invoke on each tick.
 * @param delay - Interval in milliseconds, or `null` to pause.
 * @param options - Configuration.
 * @returns Controls for starting/stopping the interval.
 */
export function useInterval(
    callback: () => void,
    delay: number | null,
    options: UseIntervalOptions = {},
): UseIntervalReturn {
    const { autoInvoke = true } = options
    const [active, setActive] = useState(autoInvoke && delay !== null)
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const callbackRef = useRef(callback)

    // Always invoke the latest callback without restarting the interval
    // when the callback identity changes.
    useEffect(() => {
        callbackRef.current = callback
    }, [callback])

    const stop = useCallback(() => {
        if (intervalRef.current !== null) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
        }
        setActive(false)
    }, [])

    const start = useCallback(() => {
        if (delay === null) return
        if (intervalRef.current !== null) clearInterval(intervalRef.current)
        intervalRef.current = setInterval(() => callbackRef.current(), delay)
        setActive(true)
    }, [delay])

    const toggle = useCallback(() => {
        if (active) stop()
        else start()
    }, [active, start, stop])

    useEffect(() => {
        if (autoInvoke && delay !== null) start()
        return stop
    }, [autoInvoke, delay, start, stop])

    return { active, start, stop, toggle }
}

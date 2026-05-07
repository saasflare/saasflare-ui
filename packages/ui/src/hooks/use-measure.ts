// @draft
"use client"

/**
 * @fileoverview ResizeObserver-backed element measurement hook. Returns a
 * callback ref and live width/height/bounding-rect values that update when
 * the observed element resizes.
 * @author Saasflare™
 * @module packages/ui/hooks/use-measure
 * @package ui
 *
 * @example
 * const [ref, { width, height }] = useMeasure<HTMLDivElement>();
 * return <div ref={ref}>{width} × {height}</div>;
 */
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/** Element measurement — dimensions plus bounding-rect position */
export interface Measurement {
    /** Element content-box width in pixels */
    width: number;
    /** Element content-box height in pixels */
    height: number;
    /** DOMRect top (viewport-relative) */
    top: number;
    /** DOMRect left (viewport-relative) */
    left: number;
    /** DOMRect right (viewport-relative) */
    right: number;
    /** DOMRect bottom (viewport-relative) */
    bottom: number;
    /** DOMRect x (viewport-relative) */
    x: number;
    /** DOMRect y (viewport-relative) */
    y: number;
}

/** Return tuple of useMeasure — `[ref, measurement]` */
export type UseMeasureReturn<T extends Element = HTMLElement> = readonly [
    ref: (node: T | null) => void,
    measurement: Measurement,
];

const INITIAL_MEASUREMENT: Measurement = {
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    x: 0,
    y: 0,
};

/**
 * Observes an element's dimensions with a `ResizeObserver` and returns the
 * latest measurement. SSR-safe: returns zeroed values until the observer runs
 * on the client.
 *
 * @template T - The observed element type (defaults to `HTMLElement`)
 * @returns {UseMeasureReturn<T>} Tuple of `[callback ref, measurement]`
 *
 * @example
 * const [ref, { width }] = useMeasure<HTMLDivElement>();
 * const columns = width > 1024 ? 3 : width > 640 ? 2 : 1;
 * return <div ref={ref}>{columns} columns</div>;
 */
export function useMeasure<T extends Element = HTMLElement>(): UseMeasureReturn<T> {
    const [measurement, setMeasurement] = useState<Measurement>(INITIAL_MEASUREMENT);
    const observerRef = useRef<ResizeObserver | null>(null);

    const disconnect = useCallback(() => {
        observerRef.current?.disconnect();
        observerRef.current = null;
    }, []);

    const ref = useCallback(
        (node: T | null) => {
            disconnect();

            if (!node || typeof ResizeObserver === 'undefined') return;

            const observer = new ResizeObserver((entries) => {
                const entry = entries[0];
                if (!entry) return;
                const rect = entry.target.getBoundingClientRect();
                setMeasurement({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height,
                    top: rect.top,
                    left: rect.left,
                    right: rect.right,
                    bottom: rect.bottom,
                    x: rect.x,
                    y: rect.y,
                });
            });

            observer.observe(node);
            observerRef.current = observer;
        },
        [disconnect],
    );

    useEffect(() => disconnect, [disconnect]);

    return [ref, measurement] as const;
}

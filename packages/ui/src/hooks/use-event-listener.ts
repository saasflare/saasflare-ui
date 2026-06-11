// @draft
"use client"

/**
 * @fileoverview Type-safe addEventListener with automatic cleanup.
 * @author Saasflare™
 * @module packages/ui/hooks/use-event-listener
 * @package ui
 *
 * @example
 * // Window event
 * useEventListener('resize', handleResize);
 *
 * // Element event
 * useEventListener('click', handleClick, buttonRef);
 *
 * // Document event
 * useEventListener('visibilitychange', handleVisibility, { current: document });
 */

import { useEffect, useRef, type RefObject } from 'react';

/**
 * Attaches an event listener to a target element with automatic cleanup.
 *
 * @param {string} eventName - The event to listen for
 * @param {Function} handler - Event handler callback
 * @param {RefObject<Element | null> | undefined} element - Target element ref (defaults to window)
 * @param {AddEventListenerOptions} [options] - addEventListener options
 *
 * @example
 * const ref = useRef<HTMLDivElement>(null);
 * useEventListener('scroll', (e) => console.log(e), ref, { passive: true });
 */
export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element?: undefined,
  options?: boolean | AddEventListenerOptions,
): void;

export function useEventListener<K extends keyof HTMLElementEventMap>(
  eventName: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  element: RefObject<HTMLElement | null>,
  options?: boolean | AddEventListenerOptions,
): void;

export function useEventListener<K extends keyof DocumentEventMap>(
  eventName: K,
  handler: (event: DocumentEventMap[K]) => void,
  element: RefObject<Document | null>,
  options?: boolean | AddEventListenerOptions,
): void;

export function useEventListener(
  eventName: string,
  handler: (event: Event) => void,
  element?: RefObject<EventTarget | null>,
  options?: boolean | AddEventListenerOptions,
) {
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  // Depend on the option PRIMITIVES, not object identity — inline option
  // objects (the documented usage) would otherwise tear the listener down on
  // every render and silently break `once` semantics.
  const opts = typeof options === 'boolean' ? { capture: options } : options;
  const capture = opts?.capture;
  const once = opts?.once;
  const passive = opts?.passive;
  const signal = opts?.signal;

  useEffect(() => {
    const target = element?.current ?? window;
    if (!target?.addEventListener) return;

    const listener = (event: Event) => savedHandler.current(event);
    const listenerOptions: AddEventListenerOptions = { capture, once, passive, signal };
    target.addEventListener(eventName, listener, listenerOptions);
    return () => target.removeEventListener(eventName, listener, listenerOptions);
  }, [eventName, element, capture, once, passive, signal]);
}

import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// jsdom lacks matchMedia — next-themes / useReducedMotion / useIsMobile need it.
if (typeof window !== 'undefined' && !window.matchMedia) {
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: (query: string) => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: () => {},
            removeListener: () => {},
            addEventListener: () => {},
            removeEventListener: () => {},
            dispatchEvent: () => false,
        }),
    });
}

// jsdom lacks ResizeObserver — Radix + useMeasure consumers need it.
if (typeof globalThis.ResizeObserver === 'undefined') {
    globalThis.ResizeObserver = class ResizeObserver {
        observe() {}
        unobserve() {}
        disconnect() {}
    };
}

// jsdom lacks IntersectionObserver — useInView / useIntersectionObserver need it.
if (typeof globalThis.IntersectionObserver === 'undefined') {
    globalThis.IntersectionObserver = class IntersectionObserver {
        root = null;
        rootMargin = '';
        thresholds = [];
        observe() {}
        unobserve() {}
        disconnect() {}
        takeRecords() {
            return [];
        }
    } as unknown as typeof IntersectionObserver;
}

// Radix Popover/Select use these pointer APIs that jsdom doesn't implement.
if (typeof Element !== 'undefined') {
    Element.prototype.hasPointerCapture ??= () => false;
    Element.prototype.setPointerCapture ??= () => {};
    Element.prototype.releasePointerCapture ??= () => {};
    Element.prototype.scrollIntoView ??= () => {};
}

afterEach(() => {
    cleanup();
});

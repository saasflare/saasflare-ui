// @draft
"use client"

/**
 * @fileoverview Controlled/uncontrolled open-close state machine for
 * dialogs, drawers, popovers, and sheets. Exposes onOpen/onClose/onToggle
 * controls plus an onOpenChange setter that drops into Radix/shadcn props.
 * @author Saasflare™
 * @module packages/ui/hooks/use-disclosure
 * @package ui
 *
 * @example
 * // Uncontrolled
 * const { isOpen, onOpen, onOpenChange } = useDisclosure();
 * <Button onClick={onOpen}>Open</Button>
 * <Dialog open={isOpen} onOpenChange={onOpenChange}>...</Dialog>
 *
 * @example
 * // Controlled
 * const disclosure = useDisclosure({ isOpen: props.open, onChange: props.onChange });
 */

import { useCallback, useMemo, useState } from 'react';

/** Options for useDisclosure */
export interface UseDisclosureOptions {
    /** Initial open state when uncontrolled. Default: `false` */
    defaultOpen?: boolean;
    /** Controlled open state. When provided, the hook operates in controlled mode. */
    isOpen?: boolean;
    /** Callback fired when the open state changes (in both modes) */
    onChange?: (isOpen: boolean) => void;
}

/** Return value of useDisclosure */
export interface UseDisclosureReturn {
    /** Current open state */
    isOpen: boolean;
    /** Open the disclosure */
    onOpen: () => void;
    /** Close the disclosure */
    onClose: () => void;
    /** Toggle the disclosure */
    onToggle: () => void;
    /** Set the open state — matches Radix/shadcn `onOpenChange` prop shape */
    onOpenChange: (open: boolean) => void;
    /** Whether the disclosure is externally controlled */
    isControlled: boolean;
}

/**
 * Manages open-close state with support for both controlled and uncontrolled usage.
 * Designed to drop into Radix/shadcn primitives via the `onOpenChange` prop.
 *
 * @param {UseDisclosureOptions} [options] - Configuration
 * @returns {UseDisclosureReturn} Open state and control callbacks
 *
 * @example
 * const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
 * <Button onClick={onOpen}>Open</Button>
 * <Dialog open={isOpen} onOpenChange={onOpenChange}>
 *   <Button onClick={onClose}>Close</Button>
 * </Dialog>
 */
export function useDisclosure(options: UseDisclosureOptions = {}): UseDisclosureReturn {
    const { defaultOpen = false, isOpen: controlledOpen, onChange } = options;
    const isControlled = controlledOpen !== undefined;

    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
    const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

    const onOpenChange = useCallback(
        (open: boolean) => {
            if (!isControlled) {
                setUncontrolledOpen(open);
            }
            onChange?.(open);
        },
        [isControlled, onChange],
    );

    const onOpen = useCallback(() => onOpenChange(true), [onOpenChange]);
    const onClose = useCallback(() => onOpenChange(false), [onOpenChange]);
    const onToggle = useCallback(() => onOpenChange(!isOpen), [isOpen, onOpenChange]);

    return useMemo(
        () => ({ isOpen, onOpen, onClose, onToggle, onOpenChange, isControlled }),
        [isOpen, onOpen, onClose, onToggle, onOpenChange, isControlled],
    );
}

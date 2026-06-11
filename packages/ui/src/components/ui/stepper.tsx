"use client"

/**
 * @fileoverview Stepper — a controlled/uncontrolled multi-step wizard. Pairs the
 * existing visual `Steps`/`Step` indicator with content `StepperPanel`s and a
 * built-in `StepperNav` (Back / Next / Finish). State is driven by the headless
 * `useStepper` hook — bring your own instance via `stepper={...}` (controlled)
 * or let `Stepper` own one (uncontrolled). Panel transitions use JS motion
 * (Pattern A) gated by `useSaasflareMotion`.
 * @author Saasflare™
 * @module packages/ui/components/ui/stepper
 * @package ui
 *
 * @component
 * @example
 * import { Stepper, StepperPanel } from "@saasflare/ui";
 *
 * <Stepper
 *   items={[{ title: "Account" }, { title: "Profile" }, { title: "Done" }]}
 * >
 *   <StepperPanel value={0}>Account fields…</StepperPanel>
 *   <StepperPanel value={1}>Profile fields…</StepperPanel>
 *   <StepperPanel value={2}>All set!</StepperPanel>
 * </Stepper>
 */

import {
    Children,
    createContext,
    isValidElement,
    useContext,
    useEffect,
    useId,
    useMemo,
    useRef,
    type KeyboardEvent,
    type ReactElement,
    type ReactNode,
} from "react"
import { AnimatePresence, m } from "motion/react"
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"
import { useStepper, type UseStepperReturn } from "../../hooks/use-stepper"
import { springGentle, useSaasflareMotion } from "./motion-config"
import { Steps, Step } from "./steps"
import { Button } from "./button"
import { CaretLeftIcon, CaretRightIcon, CheckIcon, WarningIcon } from "./phosphor"
import type { ResolvedSaasflareProps } from "../../providers"

/**
 * One step descriptor for the Stepper indicator (mirrors the visual `Step`).
 *
 * @example
 * const items: StepperItem[] = [{ title: "Plan" }, { title: "Add-ons", optional: true }];
 */
export interface StepperItem {
    /** Title shown in the indicator. */
    title: string
    /** Optional sub-description. */
    description?: string
    /** Optional icon replacing the number. */
    icon?: ReactNode
    /** Marks the step skippable. */
    optional?: boolean
}

/**
 * Props for {@link Stepper}.
 *
 * @example
 * <Stepper items={items} linear={false} mountMode="keepMounted">…</Stepper>
 */
export interface StepperProps extends SaasflareComponentProps {
    /** Step metadata for the indicator. Length defines the step count. */
    items: ReadonlyArray<StepperItem>
    /** Indicator layout (forwarded to `Steps`). Default: `"horizontal"` */
    direction?: "horizontal" | "vertical"
    /** Linear mode forwarded to the internal hook. Default: `true` */
    linear?: boolean
    /** Bring-your-own hook instance (controlled). When omitted, Stepper owns one. */
    stepper?: UseStepperReturn
    /** Initial step when Stepper owns the hook (uncontrolled). Default: `0` */
    defaultStep?: number
    /** Global validation gate (uncontrolled mode only). */
    validate?: (
        step: number,
    ) => boolean | string | void | Promise<boolean | string | void>
    /** Fired on finish (uncontrolled mode only). */
    onComplete?: () => void
    /** `"unmount"` = only active panel in DOM; `"keepMounted"` = all panels mounted, inactive hidden. Default: `"unmount"` */
    mountMode?: "unmount" | "keepMounted"
    /** Hide the built-in `<StepperNav>`. Default: `false` */
    hideNav?: boolean
    /** Panel children — one `<StepperPanel>` per step, in order. */
    children: ReactNode
    /** Class for the root. */
    className?: string
}

/**
 * Content panel for a single step. Renders only when active (or stays mounted
 * and hidden in `keepMounted` mode).
 *
 * @example
 * <StepperPanel value={1}><ProfileForm /></StepperPanel>
 */
export interface StepperPanelProps {
    /** 0-based index this panel maps to. */
    value: number
    /** Panel content. */
    children: ReactNode
    /** Class for the panel. */
    className?: string
}

/**
 * Built-in navigation row (Back / Next / Finish). Auto-rendered unless `hideNav`.
 *
 * @example
 * <StepperNav nextLabel="Continue" finishLabel="Submit" />
 */
export interface StepperNavProps {
    /** Override Back label. Default: `"Back"` */
    backLabel?: ReactNode
    /** Override Next label. Default: `"Next"` */
    nextLabel?: ReactNode
    /** Override Finish (last-step Next) label. Default: `"Finish"` */
    finishLabel?: ReactNode
    /** Show a "Skip" button on optional steps. Default: `true` */
    allowSkip?: boolean
    /** Class for the nav row. */
    className?: string
}

/**
 * Render-prop access to the active Stepper's hook (for custom footers/headers).
 *
 * @example
 * <StepperContent>{(s) => <p>Step {s.activeStep + 1} of {s.count}</p>}</StepperContent>
 */
export interface StepperContentProps {
    /** Render-prop receiving the active stepper instance. */
    children: (stepper: UseStepperReturn) => ReactNode
}

/* ── Internal context (not exported) ── */

interface StepperContextValue {
    stepper: UseStepperReturn
    items: ReadonlyArray<StepperItem>
    linear: boolean
    direction: "horizontal" | "vertical"
    /** Stable id namespace for ARIA wiring between step buttons and panels. */
    baseId: string
    /** Resolved theme axes, forwarded to nav Buttons. */
    sf: ResolvedSaasflareProps
}

const StepperContext = createContext<StepperContextValue | null>(null)

/** Reads the nearest Stepper context, throwing a helpful error if absent. */
function useStepperContext(component: string): StepperContextValue {
    const ctx = useContext(StepperContext)
    if (ctx === null) {
        throw new Error(
            `[Saasflare][Stepper] <${component}> must be rendered inside <Stepper>.`,
        )
    }
    return ctx
}

/** Builds the DOM id for a step's trigger button. */
function stepButtonId(baseId: string, i: number): string {
    return `${baseId}-step-${i}`
}

/** Builds the DOM id for a step's content panel. */
function stepPanelId(baseId: string, i: number): string {
    return `${baseId}-panel-${i}`
}

/**
 * Primary multi-step wizard. Resolves theme axes via {@link useSaasflareProps}
 * and emits `data-surface`/`data-radius`/`data-animated` on its root. Owns a
 * {@link useStepper} instance unless one is supplied via `stepper`.
 *
 * Indicator step circles become focusable triggers only in non-linear mode
 * (roving tabindex, Arrow/Home/End/Enter/Space); in linear mode they are
 * non-interactive and `aria-disabled` to enforce order. On step change, focus
 * moves to the newly active panel (skipped on initial mount).
 *
 * @component
 * @layer ui
 *
 * @param {ReadonlyArray<StepperItem>} items - Indicator metadata; length = step count.
 * @param {string} direction - Indicator layout: "horizontal" | "vertical".
 * @param {boolean} linear - Forbid forward jumps past incomplete required steps.
 * @param {UseStepperReturn} stepper - External hook instance (controlled).
 * @param {string} mountMode - "unmount" | "keepMounted".
 *
 * @example
 * <Stepper items={[{ title: "A" }, { title: "B" }]}>
 *   <StepperPanel value={0}>A</StepperPanel>
 *   <StepperPanel value={1}>B</StepperPanel>
 * </Stepper>
 *
 * @example
 * // Controlled: drive an external hook instance
 * const s = useStepper({ count: 3 });
 * <Stepper items={items} stepper={s}>…</Stepper>
 */
export function Stepper({
    items,
    direction = "horizontal",
    linear = true,
    stepper: externalStepper,
    defaultStep = 0,
    validate,
    onComplete,
    mountMode = "unmount",
    hideNav = false,
    children,
    className,
    surface,
    radius,
    animated,
    iconWeight,
}: StepperProps) {
    const sf = useSaasflareProps({ surface, radius, animated, iconWeight })

    const stepConfig = useMemo(
        () => items.map((item) => ({ optional: item.optional })),
        [items],
    )

    // Always call the hook to satisfy the rules-of-hooks; ignore its result when
    // an external instance is provided.
    const ownedStepper = useStepper({
        steps: stepConfig,
        defaultStep,
        linear,
        validate,
        onComplete,
    })
    const stepper = externalStepper ?? ownedStepper

    const baseId = useId()

    const ctx = useMemo<StepperContextValue>(
        () => ({ stepper, items, linear, direction, baseId, sf }),
        [stepper, items, linear, direction, baseId, sf],
    )

    const motion = useSaasflareMotion(sf.animated, springGentle)

    // Collect panels keyed by their declared `value` so we can render the active
    // one (unmount mode) or all of them (keepMounted mode).
    const panels = useMemo(() => {
        const map = new Map<number, ReactElement<StepperPanelProps>>()
        Children.forEach(children, (child) => {
            if (isValidElement(child) && child.type === StepperPanel) {
                const panel = child as ReactElement<StepperPanelProps>
                map.set(panel.props.value, panel)
            }
        })
        return map
    }, [children])

    // Focus the newly active panel on step change (not on first mount).
    const rootRef = useRef<HTMLDivElement>(null)
    const mountedRef = useRef(false)
    useEffect(() => {
        if (!mountedRef.current) {
            mountedRef.current = true
            return
        }
        const node = rootRef.current?.querySelector<HTMLElement>(
            `#${CSS.escape(stepPanelId(baseId, stepper.activeStep))}`,
        )
        node?.focus()
    }, [stepper.activeStep, baseId])

    const activePanel = panels.get(stepper.activeStep)

    return (
        <StepperContext.Provider value={ctx}>
            <div
                ref={rootRef}
                className={cn("flex flex-col gap-6", className)}
                data-slot="stepper"
                data-surface={sf.surface}
                data-radius={sf.radius}
                data-animated={String(sf.animated)}
                role="group"
                aria-label="Progress"
            >
                <StepperIndicator />

                <div className="relative">
                    {mountMode === "keepMounted" ? (
                        // All panels mounted; inactive ones hidden so AT skips them.
                        Array.from(panels.entries()).map(([value, panel]) => (
                            <PanelRegion
                                key={value}
                                value={value}
                                active={value === stepper.activeStep}
                                baseId={baseId}
                                className={panel.props.className}
                            >
                                {panel.props.children}
                            </PanelRegion>
                        ))
                    ) : (
                        <AnimatePresence mode="wait" initial={false}>
                            {activePanel ? (
                                <m.div
                                    key={stepper.activeStep}
                                    initial={
                                        motion.disabled
                                            ? false
                                            : { opacity: 0, x: stepper.direction * 12 }
                                    }
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={
                                        motion.disabled
                                            ? { opacity: 1, x: 0 }
                                            : { opacity: 0, x: stepper.direction * -12 }
                                    }
                                    transition={motion.transition}
                                >
                                    <PanelRegion
                                        value={stepper.activeStep}
                                        active
                                        baseId={baseId}
                                        className={activePanel.props.className}
                                    >
                                        {activePanel.props.children}
                                    </PanelRegion>
                                </m.div>
                            ) : null}
                        </AnimatePresence>
                    )}
                </div>

                {!hideNav && <StepperNav />}
            </div>
        </StepperContext.Provider>
    )
}

/**
 * The indicator row: renders the untouched visual `Steps`/`Step` and overlays
 * focusable trigger buttons (non-linear) or `aria-disabled` placeholders
 * (linear) with roving tabindex + arrow-key navigation. Internal to `Stepper`.
 */
function StepperIndicator() {
    const { stepper, items, linear, direction, baseId, sf } =
        useStepperContext("StepperIndicator")

    const listRef = useRef<HTMLDivElement>(null)

    /** Whether a step index can receive focus / be activated by goTo. */
    const isReachable = (i: number): boolean => {
        if (!linear) return true
        if (i <= stepper.activeStep) return true
        // Forward reachability mirrors the hook's linear goTo guard.
        for (let j = stepper.activeStep; j < i; j++) {
            if (!stepper.isOptional(j) && !stepper.isCompleted(j)) return false
        }
        return true
    }

    const moveFocus = (toIndex: number) => {
        const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>(
            "[data-stepper-trigger]",
        )
        buttons?.[toIndex]?.focus()
    }

    const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, i: number) => {
        const horizontal = direction === "horizontal"
        const nextKey = horizontal ? "ArrowRight" : "ArrowDown"
        const prevKey = horizontal ? "ArrowLeft" : "ArrowUp"
        const last = items.length - 1

        const findNext = (from: number, step: 1 | -1): number => {
            let i2 = from
            for (let guard = 0; guard < items.length; guard++) {
                i2 += step
                if (i2 < 0 || i2 > last) return from
                if (isReachable(i2)) return i2
            }
            return from
        }

        if (event.key === nextKey) {
            event.preventDefault()
            moveFocus(findNext(i, 1))
        } else if (event.key === prevKey) {
            event.preventDefault()
            moveFocus(findNext(i, -1))
        } else if (event.key === "Home") {
            event.preventDefault()
            moveFocus(isReachable(0) ? 0 : findNext(0, 1))
        } else if (event.key === "End") {
            event.preventDefault()
            moveFocus(isReachable(last) ? last : findNext(last, -1))
        } else if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            if (isReachable(i)) stepper.goTo(i)
        }
    }

    const stepLabel = (i: number): string => {
        const item = items[i]
        const parts = [`Step ${i + 1} of ${items.length}: ${item.title}`]
        if (item.optional) parts.push("(optional)")
        if (stepper.errors.has(i)) parts.push("error")
        else if (stepper.isCompleted(i)) parts.push("completed")
        return parts.join(" ")
    }

    // The roving-tabindex anchor: the active step is the single tab stop.
    const tabbableIndex = stepper.activeStep

    return (
        <div className="relative">
            {/* Decorative visual indicator — hidden from assistive tech so the
                interactive overlay below is the single a11y source (otherwise the
                active step claims aria-current on both the Steps listitem and the
                trigger button). */}
            <div aria-hidden="true">
                <Steps
                    current={stepper.activeStep}
                    direction={direction}
                    surface={sf.surface}
                    radius={sf.radius}
                    animated={sf.animated}
                    iconWeight={sf.iconWeight}
                >
                    {items.map((item, i) => (
                        <Step
                            key={i}
                            title={item.title}
                            description={item.description}
                            icon={item.icon}
                            optional={item.optional}
                        />
                    ))}
                </Steps>
            </div>

            {/* Interactive overlay: a button per step for keyboard + click nav. */}
            <div
                ref={listRef}
                className={cn(
                    "absolute inset-0 flex",
                    direction === "horizontal" ? "flex-row items-start" : "flex-col",
                )}
            >
                {items.map((item, i) => {
                    const reachable = isReachable(i)
                    const active = i === stepper.activeStep
                    const hasError = stepper.errors.has(i)
                    return (
                        <button
                            key={i}
                            type="button"
                            data-stepper-trigger=""
                            className={cn(
                                "flex bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full",
                                direction === "horizontal"
                                    ? "flex-1 flex-col items-center self-stretch"
                                    : "flex-row gap-4 self-start",
                                reachable && !active
                                    ? "cursor-pointer"
                                    : "cursor-default",
                            )}
                            // Only the active step is a tab stop (roving tabindex).
                            tabIndex={i === tabbableIndex ? 0 : -1}
                            aria-current={active ? "step" : undefined}
                            aria-controls={stepPanelId(baseId, i)}
                            aria-disabled={reachable ? undefined : true}
                            aria-invalid={hasError ? true : undefined}
                            aria-label={stepLabel(i)}
                            id={stepButtonId(baseId, i)}
                            disabled={!reachable}
                            onClick={() => {
                                if (reachable) stepper.goTo(i)
                            }}
                            onKeyDown={(e) => onKeyDown(e, i)}
                        >
                            {/* Sized spacer matching the circle so the hit area
                                covers the indicator; content stays in Steps. */}
                            <span className="size-9 shrink-0" aria-hidden="true" />
                        </button>
                    )
                })}
            </div>

            {/* Active-step error, announced politely. */}
            {stepper.errors.has(stepper.activeStep) && (
                <p
                    className="mt-2 flex items-center gap-1.5 text-sm text-destructive"
                    role="alert"
                    aria-live="polite"
                >
                    <WarningIcon
                        className="size-4 shrink-0"
                        weight={sf.iconWeight}
                        aria-hidden="true"
                    />
                    {stepper.errors.get(stepper.activeStep)}
                </p>
            )}
        </div>
    )
}

/** A single panel region with the tabpanel-style ARIA wiring. Internal. */
interface PanelRegionProps {
    value: number
    active: boolean
    baseId: string
    className?: string
    children: ReactNode
}

function PanelRegion({ value, active, baseId, className, children }: PanelRegionProps) {
    return (
        <div
            id={stepPanelId(baseId, value)}
            role="tabpanel"
            aria-labelledby={stepButtonId(baseId, value)}
            tabIndex={-1}
            hidden={!active}
            className={cn("outline-none focus-visible:ring-2 focus-visible:ring-ring", className)}
        >
            {children}
        </div>
    )
}

/**
 * Content panel for a single step. As a child of {@link Stepper} it is a data
 * carrier: `Stepper` reads its `value`, `children`, and `className` and renders
 * the matching region itself (so it can apply motion + ARIA). Rendering one
 * standalone simply outputs its children in a labelled region.
 *
 * @component
 * @example
 * <StepperPanel value={0}>Step one content</StepperPanel>
 */
export function StepperPanel(props: StepperPanelProps): ReactNode {
    // When rendered directly (not collected by Stepper), emit a plain region so
    // the node is never lost. Stepper itself never renders this branch — it
    // reads props off the element and renders <PanelRegion> with motion/ARIA.
    return (
        <div data-slot="stepper-panel" className={props.className}>
            {props.children}
        </div>
    )
}

/**
 * Built-in navigation row: Back, an optional Skip (on optional steps), and a
 * Next button that becomes Finish on the last step. Reads the active stepper
 * from context and inherits the wizard's theme axes. Next is disabled while an
 * async gate is validating.
 *
 * @component
 * @example
 * <Stepper items={items} hideNav>
 *   …panels…
 *   <StepperNav nextLabel="Continue" />
 * </Stepper>
 */
export function StepperNav({
    backLabel = "Back",
    nextLabel = "Next",
    finishLabel = "Finish",
    allowSkip = true,
    className,
}: StepperNavProps): ReactNode {
    const { stepper, sf } = useStepperContext("StepperNav")

    const showSkip =
        allowSkip && stepper.isOptional(stepper.activeStep) && !stepper.isLast

    return (
        <div className={cn("flex items-center justify-between gap-3", className)}>
            <Button
                variant="ghost"
                intent="neutral"
                surface={sf.surface}
                radius={sf.radius}
                animated={sf.animated}
                iconWeight={sf.iconWeight}
                startContent={
                    <CaretLeftIcon weight={sf.iconWeight} aria-hidden="true" />
                }
                disabled={!stepper.canBack}
                onClick={() => stepper.back()}
            >
                {backLabel}
            </Button>

            <div className="flex items-center gap-2">
                {showSkip && (
                    <Button
                        variant="ghost"
                        intent="neutral"
                        surface={sf.surface}
                        radius={sf.radius}
                        animated={sf.animated}
                        iconWeight={sf.iconWeight}
                        onClick={() => stepper.goTo(stepper.activeStep + 1)}
                    >
                        Skip
                    </Button>
                )}

                <Button
                    intent="primary"
                    surface={sf.surface}
                    radius={sf.radius}
                    animated={sf.animated}
                    iconWeight={sf.iconWeight}
                    isLoading={stepper.isValidating}
                    endContent={
                        stepper.isLast ? (
                            <CheckIcon weight={sf.iconWeight} aria-hidden="true" />
                        ) : (
                            <CaretRightIcon weight={sf.iconWeight} aria-hidden="true" />
                        )
                    }
                    onClick={() => {
                        void stepper.next()
                    }}
                >
                    {stepper.isLast ? finishLabel : nextLabel}
                </Button>
            </div>
        </div>
    )
}

/**
 * Render-prop escape hatch exposing the active Stepper's hook instance, for
 * custom headers/footers/summaries outside the built-in nav.
 *
 * @component
 * @example
 * <Stepper items={items}>
 *   …panels…
 *   <StepperContent>
 *     {(s) => <p className="text-sm text-muted-foreground">{s.activeStep + 1}/{s.count}</p>}
 *   </StepperContent>
 * </Stepper>
 */
export function StepperContent({ children }: StepperContentProps): ReactNode {
    const { stepper } = useStepperContext("StepperContent")
    return children(stepper)
}

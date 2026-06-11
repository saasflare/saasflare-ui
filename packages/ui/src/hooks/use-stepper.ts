"use client"

/**
 * @fileoverview Headless controlled/uncontrolled wizard state machine. Zero
 * runtime dependencies. Powers the `Stepper` component but composes with any
 * indicator/content layout (e.g. the bare visual `Steps`). Mirrors the
 * controlled-detection idiom of `useDisclosure`/`usePagination`
 * (`activeStep !== undefined` ⇒ controlled).
 * @author Saasflare™
 * @module packages/ui/hooks/use-stepper
 * @package ui
 *
 * @example
 * const s = useStepper({ count: 3, validate: (i) => i !== 1 || form.isValid });
 * <Button onClick={() => s.next()} disabled={s.isValidating}>Next</Button>
 */

import { useCallback, useMemo, useRef, useState } from "react"

/**
 * Result of a per-step validation gate.
 * `true`/`void` = pass; `false` = generic fail; `string` = fail with that message.
 *
 * @example
 * const validate = (): StepValidationResult => form.isValid || "Fill all fields"
 */
export type StepValidationResult = boolean | string | void

/**
 * Per-step config when you want the hook to know optional/validation metadata
 * without a `Step` tree.
 *
 * @example
 * useStepper({ steps: [{ id: "plan" }, { id: "extras", optional: true }] })
 */
export interface StepperStepConfig {
    /** Stable id for the step (optional; index used if omitted). */
    id?: string
    /** Marks the step skippable — `next()` succeeds even with no validation pass. Default: `false` */
    optional?: boolean
    /** Per-step gate. Return false/string to block `next()`. May be async. */
    validate?: () => StepValidationResult | Promise<StepValidationResult>
}

/**
 * Options for {@link useStepper}.
 *
 * @example
 * useStepper({ count: 4, linear: true, onComplete: () => router.push("/done") })
 */
export interface UseStepperOptions {
    /** Number of steps. Required when `steps` is omitted. Clamped to ≥ 1. */
    count?: number
    /** Per-step config. When provided, its length wins over `count`. */
    steps?: ReadonlyArray<StepperStepConfig>
    /** Initial active index when uncontrolled (0-based). Default: `0` */
    defaultStep?: number
    /** Controlled active index. When provided, the hook is controlled (like useDisclosure). */
    activeStep?: number
    /** Pre-completed indices when uncontrolled. Default: `[]` */
    defaultCompleted?: ReadonlyArray<number>
    /** Linear mode: forbid `goTo` jumping forward past an incomplete required step. Default: `true` */
    linear?: boolean
    /** Global gate run before EVERY `next()` (in addition to the step's own `validate`). */
    validate?: (step: number) => StepValidationResult | Promise<StepValidationResult>
    /** Fired whenever the active step changes (both modes). */
    onStepChange?: (step: number, meta: { direction: 1 | -1 }) => void
    /** Fired when the last step is finished via `next()`/`complete()`. */
    onComplete?: () => void
}

/**
 * Imperative + derived API returned by {@link useStepper}.
 *
 * @example
 * const s: UseStepperReturn = useStepper({ count: 3 });
 * s.canNext; s.next(); s.goTo(0);
 */
export interface UseStepperReturn {
    /** Current active index (0-based, clamped to `[0, count-1]`). */
    activeStep: number
    /** Total number of steps. */
    count: number
    /** Motion direction of the last transition (1 = forward, -1 = back). */
    direction: 1 | -1
    /** Immutable set of completed indices. */
    completed: ReadonlySet<number>
    /** Map of index → error string for steps whose gate failed. */
    errors: ReadonlyMap<number, string>
    /** True while an async `validate` is in flight (disable Next button on it). */
    isValidating: boolean
    /** `true` if there is a next step. */
    canNext: boolean
    /** `true` if there is a previous step. */
    canBack: boolean
    /** `true` on the first step. */
    isFirst: boolean
    /** `true` on the last step. */
    isLast: boolean
    /** Whether index `i` is configured optional. */
    isOptional: (i: number) => boolean
    /** Whether index `i` is in the completed set. */
    isCompleted: (i: number) => boolean
    /**
     * Advance one step. Runs the step gate then the global gate; if either fails,
     * stays put and records the error. Marks the current step completed on success.
     * On the last step, marks complete and fires `onComplete`. Returns a Promise
     * resolving to whether it advanced/completed.
     */
    next: () => Promise<boolean>
    /** Go back one step (no gate). No-op on first. */
    back: () => void
    /**
     * Jump to an arbitrary index. In linear mode, forward jumps past an incomplete
     * required step are rejected (returns false). Backward jumps always allowed.
     */
    goTo: (step: number) => boolean
    /** Mark an index completed without navigating. */
    complete: (step?: number) => void
    /** Set or clear an error for a step (clear with `null`). */
    setStepError: (step: number, message: string | null) => void
    /** Reset to `defaultStep`, clear completed + errors. */
    reset: () => void
}

/** Generic message recorded when a gate returns `false` (no string supplied). */
const GENERIC_ERROR = "This step is incomplete." as const

/** Coerce a raw value into a safe 0-based step index within `[0, count-1]`. */
function clampStep(value: number, count: number): number {
    if (!Number.isFinite(value)) return 0
    return Math.min(Math.max(0, Math.floor(value)), count - 1)
}

/**
 * Headless controlled/uncontrolled wizard state machine. Zero dependencies.
 *
 * Controlled detection mirrors `useDisclosure`/`usePagination`: passing
 * `activeStep` switches the hook into controlled mode, where `next`/`back`/`goTo`
 * never mutate the active index internally — they only compute the target and
 * fire `onStepChange`/`onComplete` for the parent to apply. `completed`,
 * `errors`, and `isValidating` remain hook-internal in both modes (they are
 * orthogonal to the active index).
 *
 * @param {UseStepperOptions} options - Wizard configuration.
 * @returns {UseStepperReturn} Active index, derived flags, and navigation actions.
 *
 * @example
 * // Uncontrolled, linear, with an async gate on step 1
 * const s = useStepper({
 *   count: 3,
 *   validate: async (i) => i !== 1 || (await check()) || "Try again",
 * });
 * <Button disabled={s.isValidating} onClick={() => s.next()}>
 *   {s.isLast ? "Finish" : "Next"}
 * </Button>
 *
 * @example
 * // Controlled: parent owns the index
 * const s = useStepper({ activeStep: step, onStepChange: (i) => setStep(i) });
 */
export function useStepper(options: UseStepperOptions): UseStepperReturn {
    const {
        count: countOption,
        steps,
        defaultStep = 0,
        activeStep: controlledStep,
        defaultCompleted,
        linear = true,
        validate: globalValidate,
        onStepChange,
        onComplete,
    } = options

    const count = steps?.length ?? Math.max(1, Math.floor(countOption ?? 1))
    const isControlled = controlledStep !== undefined

    const initialStep = clampStep(defaultStep, count)
    const [uncontrolledStep, setUncontrolledStep] = useState(initialStep)
    const rawStep = isControlled ? controlledStep : uncontrolledStep
    const activeStep = clampStep(rawStep, count)

    const [direction, setDirection] = useState<1 | -1>(1)
    const [completed, setCompleted] = useState<Set<number>>(
        () => new Set(defaultCompleted ?? []),
    )
    const [errors, setErrors] = useState<Map<number, string>>(() => new Map())
    const [isValidating, setIsValidating] = useState(false)

    /** Re-entrancy guard: ignore overlapping `next()` calls while a gate runs. */
    const validatingRef = useRef(false)

    const isFirst = activeStep <= 0
    const isLast = activeStep >= count - 1
    const canBack = !isFirst
    const canNext = !isLast

    const isOptional = useCallback(
        (i: number): boolean => steps?.[i]?.optional === true,
        [steps],
    )

    const isCompleted = useCallback(
        (i: number): boolean => completed.has(i),
        [completed],
    )

    const setStepError = useCallback((step: number, message: string | null) => {
        setErrors((prev) => {
            const has = prev.has(step)
            if (message === null) {
                if (!has) return prev
                const nextMap = new Map(prev)
                nextMap.delete(step)
                return nextMap
            }
            if (has && prev.get(step) === message) return prev
            const nextMap = new Map(prev)
            nextMap.set(step, message)
            return nextMap
        })
    }, [])

    const complete = useCallback(
        (step?: number) => {
            const target = step ?? activeStep
            setCompleted((prev) => {
                if (prev.has(target)) return prev
                const nextSet = new Set(prev)
                nextSet.add(target)
                return nextSet
            })
        },
        [activeStep],
    )

    /** Apply a step change: move the (uncontrolled) index + emit `onStepChange`. */
    const applyStep = useCallback(
        (target: number, dir: 1 | -1) => {
            setDirection(dir)
            if (!isControlled) setUncontrolledStep(target)
            onStepChange?.(target, { direction: dir })
        },
        [isControlled, onStepChange],
    )

    const next = useCallback(async (): Promise<boolean> => {
        if (validatingRef.current) return false

        const current = activeStep
        const stepGate = steps?.[current]?.validate
        let result: StepValidationResult

        const runGates = async (): Promise<StepValidationResult> => {
            if (stepGate) {
                const r = await stepGate()
                if (r === false || typeof r === "string") return r
            }
            if (globalValidate) {
                const r = await globalValidate(current)
                if (r === false || typeof r === "string") return r
            }
            return true
        }

        validatingRef.current = true
        // Only flip the visible validating flag when a gate exists (keeps the
        // common no-gate path fully synchronous for the Next button).
        const hasGate = Boolean(stepGate || globalValidate)
        if (hasGate) setIsValidating(true)
        try {
            result = await runGates()
        } catch {
            result = false
        } finally {
            validatingRef.current = false
            if (hasGate) setIsValidating(false)
        }

        if (result === false || typeof result === "string") {
            const message = typeof result === "string" ? result : GENERIC_ERROR
            setStepError(current, message)
            return false
        }

        // Passed — clear any stale error and mark complete.
        setStepError(current, null)
        complete(current)

        if (current >= count - 1) {
            onComplete?.()
            return true
        }

        applyStep(current + 1, 1)
        return true
    }, [
        activeStep,
        steps,
        globalValidate,
        count,
        setStepError,
        complete,
        onComplete,
        applyStep,
    ])

    const back = useCallback(() => {
        if (activeStep <= 0) return
        applyStep(activeStep - 1, -1)
    }, [activeStep, applyStep])

    const goTo = useCallback(
        (step: number): boolean => {
            const target = clampStep(step, count)
            if (target === activeStep) return true

            const dir: 1 | -1 = target > activeStep ? 1 : -1

            // Backward jumps are always allowed.
            if (dir === -1) {
                applyStep(target, dir)
                return true
            }

            // Forward jump: in linear mode every required step between the
            // current index (inclusive) and the target (exclusive) must be done.
            if (linear) {
                for (let i = activeStep; i < target; i++) {
                    if (!steps?.[i]?.optional && !completed.has(i)) return false
                }
            }

            applyStep(target, dir)
            return true
        },
        [count, activeStep, linear, steps, completed, applyStep],
    )

    const reset = useCallback(() => {
        setDirection(1)
        setCompleted(new Set())
        setErrors(new Map())
        setIsValidating(false)
        validatingRef.current = false
        if (!isControlled) setUncontrolledStep(initialStep)
        // Controlled callers reset their own index; we surface intent via callback.
        else onStepChange?.(initialStep, { direction: -1 })
    }, [isControlled, initialStep, onStepChange])

    const readonlyCompleted = useMemo<ReadonlySet<number>>(
        () => completed,
        [completed],
    )
    const readonlyErrors = useMemo<ReadonlyMap<number, string>>(
        () => errors,
        [errors],
    )

    return useMemo<UseStepperReturn>(
        () => ({
            activeStep,
            count,
            direction,
            completed: readonlyCompleted,
            errors: readonlyErrors,
            isValidating,
            canNext,
            canBack,
            isFirst,
            isLast,
            isOptional,
            isCompleted,
            next,
            back,
            goTo,
            complete,
            setStepError,
            reset,
        }),
        [
            activeStep,
            count,
            direction,
            readonlyCompleted,
            readonlyErrors,
            isValidating,
            canNext,
            canBack,
            isFirst,
            isLast,
            isOptional,
            isCompleted,
            next,
            back,
            goTo,
            complete,
            setStepError,
            reset,
        ],
    )
}

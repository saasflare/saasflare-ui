/**
 * @fileoverview Regression suite — every test pins a bug that shipped once.
 * Run with `pnpm test`. Pure jsdom; no snapshots, no visual assertions.
 */

import '@testing-library/jest-dom/vitest'
import { describe, expect, it, vi, afterEach } from 'vitest'
import * as React from 'react'
import { render, renderHook, screen, fireEvent, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LazyMotion, domAnimation } from 'motion/react'

import { Switch } from './components/ui/switch'
import { DatePicker } from './components/ui/date-picker'
import { TagInput } from './components/ui/tag-input'
import { MultiSelect } from './components/ui/multi-select'
import { useDebouncedCallback } from './hooks/use-debounce'
import { useCountdown } from './hooks/use-countdown'
import { useFileDialog } from './hooks/use-file-dialog'
import { useScrollLock } from './hooks/use-scroll-lock'
import { PALETTES } from './types/theme-props'

/** m.* components require LazyMotion strict — same contract as SaasflareShell. */
function Motion({ children }: { children: React.ReactNode }) {
    return (
        <LazyMotion features={domAnimation} strict>
            {children}
        </LazyMotion>
    )
}

afterEach(() => {
    vi.useRealTimers()
})

describe('Switch — thumb must actually move (was: dead Motion layout prop)', () => {
    it('toggles thumb data-state and carries the translate-x mechanism', async () => {
        const user = userEvent.setup()
        render(<Switch aria-label="toggle" />)
        const thumb = document.querySelector('[data-slot="switch-thumb"]') as HTMLElement
        expect(thumb).not.toBeNull()
        expect(thumb).toHaveAttribute('data-state', 'unchecked')
        // The positioning mechanism is a CSS transform keyed on data-state —
        // if these classes disappear, the thumb stops moving again.
        expect(thumb.className).toContain('data-[state=checked]:translate-x-[calc(100%-2px)]')
        expect(thumb.className).toContain('transition-transform')

        await user.click(screen.getByRole('switch'))
        expect(thumb).toHaveAttribute('data-state', 'checked')
    })
})

describe('DatePicker — controlled clear (was: value-undefined flipped to uncontrolled)', () => {
    it('renders the placeholder again when a controlled value is cleared', () => {
        const date = new Date(2026, 5, 15)
        const { rerender } = render(
            <Motion>
                <DatePicker value={date} placeholder="Pick a date" />
            </Motion>,
        )
        const trigger = screen.getByRole('button')
        expect(trigger).not.toHaveTextContent('Pick a date')

        rerender(
            <Motion>
                <DatePicker value={undefined} placeholder="Pick a date" />
            </Motion>,
        )
        expect(screen.getByRole('button')).toHaveTextContent('Pick a date')
    })

    it('accepts null as controlled-empty from the first render', () => {
        render(
            <Motion>
                <DatePicker value={null} placeholder="Pick a date" />
            </Motion>,
        )
        expect(screen.getByRole('button')).toHaveTextContent('Pick a date')
    })
})

describe('TagInput — separator paste (was: stale-closure loop kept only the last tag)', () => {
    it('keeps every tag from a multi-separator paste', () => {
        const onChange = vi.fn()
        render(
            <Motion>
                <TagInput aria-label="tags" onChange={onChange} />
            </Motion>,
        )
        const input = screen.getByRole('textbox')
        fireEvent.change(input, { target: { value: 'alpha,beta,gamma,' } })

        expect(onChange).toHaveBeenLastCalledWith(['alpha', 'beta', 'gamma'])
        expect(screen.getByText('alpha')).toBeInTheDocument()
        expect(screen.getByText('beta')).toBeInTheDocument()
        expect(screen.getByText('gamma')).toBeInTheDocument()
    })
})

describe('MultiSelect — closeOnSelect semantics (was: inverted vs. prop name)', () => {
    const options = [
        { value: 'react', label: 'React' },
        { value: 'vue', label: 'Vue' },
    ]

    it('stays open on pick by default', async () => {
        const user = userEvent.setup()
        render(
            <Motion>
                <MultiSelect options={options} aria-label="frameworks" />
            </Motion>,
        )
        const trigger = screen.getByRole('combobox')
        await user.click(trigger)
        expect(trigger).toHaveAttribute('aria-expanded', 'true')

        await user.click(await screen.findByText('React'))
        expect(trigger).toHaveAttribute('aria-expanded', 'true')
    })

    it('closes on pick when closeOnSelect is set', async () => {
        const user = userEvent.setup()
        render(
            <Motion>
                <MultiSelect options={options} aria-label="frameworks" closeOnSelect />
            </Motion>,
        )
        const trigger = screen.getByRole('combobox')
        await user.click(trigger)
        await user.click(await screen.findByText('React'))
        expect(trigger).toHaveAttribute('aria-expanded', 'false')
    })
})

describe('useDebouncedCallback — maxWait (was: fired exactly once per lifetime)', () => {
    it('re-arms maxWait for every burst', () => {
        vi.useFakeTimers()
        const spy = vi.fn()
        const { result } = renderHook(() =>
            useDebouncedCallback(spy, { delay: 100, maxWait: 200 }),
        )

        // Burst 1: keep calling faster than `delay` until maxWait fires.
        act(() => {
            result.current('a')
            vi.advanceTimersByTime(90)
            result.current('b')
            vi.advanceTimersByTime(90)
            result.current('c')
            vi.advanceTimersByTime(30) // t=210 > maxWait
        })
        expect(spy).toHaveBeenCalledTimes(1)

        // Burst 2: the maxWait gate must re-arm.
        act(() => {
            result.current('d')
            vi.advanceTimersByTime(90)
            result.current('e')
            vi.advanceTimersByTime(90)
            result.current('f')
            vi.advanceTimersByTime(30)
        })
        expect(spy).toHaveBeenCalledTimes(2)
    })

    it('accepts concretely-typed callbacks (was: generic constraint rejected them)', () => {
        // Type-level regression: this must COMPILE.
        const { result } = renderHook(() =>
            useDebouncedCallback((term: string) => term.length, 50),
        )
        expect(typeof result.current).toBe('function')
    })
})

describe('useCountdown — SSR safety (was: clock read during render)', () => {
    it('renders deterministic zeros on first paint, live value after mount', () => {
        vi.useFakeTimers()
        const target = Date.now() + 60_000
        const snapshots: number[] = []
        function Probe() {
            snapshots.push(useCountdown(target).totalMs)
            return null
        }
        render(<Probe />)
        // First render (= what the server would emit) must be the zero value.
        expect(snapshots[0]).toBe(0)
        // After mount effects, the real countdown is in.
        expect(snapshots[snapshots.length - 1]).toBeGreaterThan(0)
    })

    it('marks an already-expired target without starting a timer loop', () => {
        vi.useFakeTimers()
        const { result } = renderHook(() => useCountdown(Date.now() - 1000))
        expect(result.current.isExpired).toBe(true)
        expect(vi.getTimerCount()).toBe(0)
    })
})

describe('useFileDialog — option staleness + leak (was: first-call options pinned forever)', () => {
    it('re-applies changed options and removes the hidden input on unmount', () => {
        const { result, rerender, unmount } = renderHook(
            ({ accept }: { accept: string }) => useFileDialog({ accept }),
            { initialProps: { accept: 'image/*' } },
        )

        act(() => result.current.open())
        const input = document.querySelector('input[type="file"]') as HTMLInputElement
        expect(input).not.toBeNull()
        expect(input.accept).toBe('image/*')

        rerender({ accept: '.pdf' })
        act(() => result.current.open())
        expect(input.accept).toBe('.pdf')

        unmount()
        expect(document.querySelector('input[type="file"]')).toBeNull()
    })
})

describe('useScrollLock — restore (was: clobbered pre-existing body padding)', () => {
    it('restores the original padding-right on unlock', () => {
        document.body.style.paddingRight = '7px'
        const { rerender } = renderHook(({ locked }: { locked: boolean }) => useScrollLock(locked), {
            initialProps: { locked: true },
        })
        rerender({ locked: false })
        expect(document.body.style.paddingRight).toBe('7px')
        document.body.style.paddingRight = ''
    })
})

describe('PALETTES — registry lockstep (was: 26 in CSS vs 20 in the type)', () => {
    it('exposes all 26 palettes including the house palette first', () => {
        expect(PALETTES).toHaveLength(26)
        expect(PALETTES[0].id).toBe('saasflare')
        const ids = PALETTES.map((p) => p.id)
        for (const id of ['lavender', 'mint', 'sage', 'sky', 'snow']) {
            expect(ids).toContain(id)
        }
    })
})

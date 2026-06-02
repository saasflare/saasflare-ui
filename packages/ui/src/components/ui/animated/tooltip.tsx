// @toreview
"use client"

/**
 * @fileoverview AnimatedTooltip primitive — renders circular avatar images with a
 * mouse-tracking parallax tooltip on hover. Uses Motion for smooth tilt and
 * spring-based transitions. Part of the Saasflare base component layer.
 * @module packages/ui/components/ui/animated/tooltip
 * @package ui
 *
 * @component
 * @example
 * import { AnimatedTooltip } from '@saasflare/ui';
 * <AnimatedTooltip items={[{ id: 1, name: 'Alice', designation: 'Engineer', image: '/alice.jpg' }]} />
 */

import Image from 'next/image';
import React, { type JSX, useState } from 'react';
import { m, useTransform, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
import { useSaasflareProps, type SaasflareComponentProps } from '../../../providers';
import { useSaasflareMotion } from '../motion-config';

/**
 * Shape of a single tooltip item.
 */
export interface TooltipItem {
    /** Unique numeric identifier (used for hover matching). */
    id: number;
    /** Display name shown in the tooltip. */
    name: string;
    /** Secondary label (e.g. job title, role). */
    designation: string;
    /** Image source path or absolute URL. */
    image: string;
}

/**
 * AnimatedTooltip
 *
 * Renders a row (or flex-wrapped set) of circular avatar images that reveal
 * an animated, tilted tooltip on hover. The tooltip tilts and translates in
 * sync with the user’s mouse position, creating a smooth parallax effect.
 *
 * @component
 * @param {Object}   props
 * @param {TooltipItem[]} props.items – Array of tooltip items to render.
 * @returns {JSX.Element} React element containing the interactive avatars.
 *
 * @example
 * ```tsx
 * <AnimatedTooltip
 *   items={[
 *     { id: 1, name: 'Michaela', designation: 'Creator', image: '/img/michaela.jpg' },
 *     { id: 2, name: 'Lukas',    designation: 'Marketer', image: '/img/lukas.jpg'    },
 *   ]}
 * />
 * ```
 */
export interface AnimatedTooltipProps extends SaasflareComponentProps {
    items: TooltipItem[];
}

export const AnimatedTooltip = ({
    items,
    surface,
    radius,
    animated,
}: AnimatedTooltipProps): JSX.Element => {
    const sf = useSaasflareProps({ surface, radius, animated });
    const motion = useSaasflareMotion(sf.animated, { type: 'spring', stiffness: 260, damping: 10 });

    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const springConfig = { stiffness: 100, damping: 5 };
    const x = useMotionValue(0); // going to set this value on mouse move
    // rotate the tooltip
    const rotate = useSpring(useTransform(x, [-100, 100], [-45, 45]), springConfig);
    // translate the tooltip
    const translateX = useSpring(useTransform(x, [-100, 100], [-50, 50]), springConfig);
    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (motion.disabled) return; // no parallax tilt when motion is off
        const halfWidth = event.currentTarget.offsetWidth / 2;
        x.set(event.nativeEvent.offsetX - halfWidth); // set the x value, which is then used in transform and rotate
    };

    return (
        <>
            {items.map((item) => (
                <div
                    className="-mr-4  relative group"
                    key={item.id}
                    onMouseEnter={() => setHoveredIndex(item.id)}
                    onMouseLeave={() => setHoveredIndex(null)}
                >
                    <AnimatePresence>
                        {hoveredIndex === item.id && (
                            <m.div
                                data-slot="animated-tooltip"
                                data-surface={sf.surface}
                                data-radius={sf.radius}
                                data-animated={String(sf.animated)}
                                initial={motion.disabled ? false : { opacity: 0, y: 20, scale: 0.6 }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    scale: 1,
                                    transition: motion.transition,
                                }}
                                exit={motion.disabled ? undefined : { opacity: 0, y: 20, scale: 0.6 }}
                                style={{
                                    translateX: motion.disabled ? 0 : translateX,
                                    rotate: motion.disabled ? 0 : rotate,
                                    whiteSpace: 'nowrap',
                                }}
                                className="absolute -top-16 -left-1/2 translate-x-1/2 flex text-xs  flex-col items-center justify-center rounded-md bg-popover z-50 shadow-xl px-4 py-2"
                            >
                                <div className="absolute inset-x-10 z-30 w-[20%] -bottom-px bg-gradient-to-r from-transparent via-[var(--chart-2)] to-transparent h-px " />
                                <div className="absolute left-10 w-[40%] z-30 -bottom-px bg-gradient-to-r from-transparent via-[var(--chart-3)] to-transparent h-px " />
                                <div className="font-bold text-popover-foreground relative z-30 text-base">{item.name}</div>
                                <div className="text-popover-foreground text-xs">{item.designation}</div>
                            </m.div>
                        )}
                    </AnimatePresence>
                    <Image
                        onMouseMove={handleMouseMove}
                        height={100}
                        width={100}
                        src={item.image}
                        alt={item.name}
                        className="object-cover !m-0 !p-0 object-top rounded-full h-14 w-14 border-2 group-hover:scale-105 group-hover:z-30 border-border  relative transition duration-500"
                    />
                </div>
            ))}
        </>
    );
};

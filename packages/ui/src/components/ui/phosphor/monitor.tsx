import * as React from "react"
import { IconBase, type PhosphorIconProps } from "./icon-base"

const weights = {
  regular: (
    <>
      <rect
        x="32"
        y="48"
        width="192"
        height="144"
        rx="16"
        transform="translate(256 240) rotate(180)"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <line
        x1="160"
        y1="224"
        x2="96"
        y2="224"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </>
  ),
  bold: (
    <><rect x="32" y="48" width="192" height="144" rx="16" transform="translate(256 240) rotate(180)" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/><line x1="160" y1="228" x2="96" y2="228" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/></>
  ),
  fill: (
    <>
      <rect x="24" y="40" width="208" height="160" rx="24" />
      <path d="M160,216H96a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16Z" />
    </>
  ),
  duotone: (
    <>
      <rect
        x="32"
        y="48"
        width="192"
        height="144"
        rx="16"
        transform="translate(256 240) rotate(180)"
        opacity="0.2"
      />
      <rect
        x="32"
        y="48"
        width="192"
        height="144"
        rx="16"
        transform="translate(256 240) rotate(180)"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <line
        x1="160"
        y1="224"
        x2="96"
        y2="224"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </>
  ),
}

export const MonitorIcon = React.forwardRef<SVGSVGElement, PhosphorIconProps>(
  function MonitorIcon(props, ref) {
    return <IconBase ref={ref} weights={weights} {...props} />
  },
)

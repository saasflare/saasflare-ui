import * as React from "react"
import { IconBase, type PhosphorIconProps } from "./icon-base"

const weights = {
  regular: (
    <>
      <line
        x1="40"
        y1="128"
        x2="216"
        y2="128"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <polyline
        points="144 56 216 128 144 200"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </>
  ),
  bold: (
    <><line x1="40" y1="128" x2="216" y2="128" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/><polyline points="144 56 216 128 144 200" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/></>
  ),
  fill: (
    <path d="M221.66,133.66l-72,72A8,8,0,0,1,136,200V136H40a8,8,0,0,1,0-16h96V56a8,8,0,0,1,13.66-5.66l72,72A8,8,0,0,1,221.66,133.66Z" />
  ),
  duotone: (
    <>
      <polygon points="144 56 216 128 144 200 144 56" opacity="0.2" />
      <line
        x1="40"
        y1="128"
        x2="144"
        y2="128"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <polygon
        points="144 56 216 128 144 200 144 56"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </>
  ),
}

export const ArrowRightIcon = React.forwardRef<
  SVGSVGElement,
  PhosphorIconProps
>(function ArrowRightIcon(props, ref) {
  return <IconBase ref={ref} weights={weights} {...props} />
})

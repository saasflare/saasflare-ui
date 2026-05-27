import * as React from "react"
import { IconBase, type PhosphorIconProps } from "./icon-base"

const weights = {
  regular: (
    <>
      <circle
        cx="112"
        cy="112"
        r="80"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <line
        x1="168.57"
        y1="168.57"
        x2="224"
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
    <><circle cx="112" cy="112" r="80" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/><line x1="168.57" y1="168.57" x2="224" y2="224" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/></>
  ),
  fill: (
    <path d="M168,112a56,56,0,1,1-56-56A56,56,0,0,1,168,112Zm61.66,117.66a8,8,0,0,1-11.32,0l-50.06-50.07a88,88,0,1,1,11.32-11.31l50.06,50.06A8,8,0,0,1,229.66,229.66ZM112,184a72,72,0,1,0-72-72A72.08,72.08,0,0,0,112,184Z" />
  ),
  duotone: (
    <>
      <circle cx="112" cy="112" r="80" opacity="0.2" />
      <circle
        cx="112"
        cy="112"
        r="80"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <line
        x1="168.57"
        y1="168.57"
        x2="224"
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

export const MagnifyingGlassIcon = React.forwardRef<
  SVGSVGElement,
  PhosphorIconProps
>(function MagnifyingGlassIcon(props, ref) {
  return <IconBase ref={ref} weights={weights} {...props} />
})

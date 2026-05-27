import * as React from "react"
import { IconBase, type PhosphorIconProps } from "./icon-base"

const weights = {
  regular: (
    <>
      <line
        x1="200"
        y1="56"
        x2="56"
        y2="200"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <line
        x1="200"
        y1="200"
        x2="56"
        y2="56"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </>
  ),
  bold: (
    <><line x1="200" y1="56" x2="56" y2="200" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/><line x1="200" y1="200" x2="56" y2="56" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/></>
  ),
  fill: (
    <path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM181.66,170.34a8,8,0,0,1-11.32,11.32L128,139.31,85.66,181.66a8,8,0,0,1-11.32-11.32L116.69,128,74.34,85.66A8,8,0,0,1,85.66,74.34L128,116.69l42.34-42.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
  ),
  duotone: (
    <>
      <rect x="40" y="40" width="176" height="176" rx="16" opacity="0.2" />
      <line
        x1="200"
        y1="56"
        x2="56"
        y2="200"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <line
        x1="200"
        y1="200"
        x2="56"
        y2="56"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </>
  ),
}

export const XIcon = React.forwardRef<SVGSVGElement, PhosphorIconProps>(
  function XIcon(props, ref) {
    return <IconBase ref={ref} weights={weights} {...props} />
  },
)

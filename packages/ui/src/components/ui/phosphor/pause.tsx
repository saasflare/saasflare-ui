import * as React from "react"
import { IconBase, type PhosphorIconProps } from "./icon-base"

const weights = {
  regular: (
    <>
      <rect
        x="152"
        y="40"
        width="56"
        height="176"
        rx="8"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <rect
        x="48"
        y="40"
        width="56"
        height="176"
        rx="8"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </>
  ),
  bold: (
    <><rect x="152" y="40" width="56" height="176" rx="8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/><rect x="48" y="40" width="56" height="176" rx="8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/></>
  ),
  fill: (
    <path d="M216,48V208a16,16,0,0,1-16,16H160a16,16,0,0,1-16-16V48a16,16,0,0,1,16-16h40A16,16,0,0,1,216,48ZM96,32H56A16,16,0,0,0,40,48V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V48A16,16,0,0,0,96,32Z" />
  ),
  duotone: (
    <>
      <rect x="152" y="40" width="56" height="176" rx="8" opacity="0.2" />
      <rect x="48" y="40" width="56" height="176" rx="8" opacity="0.2" />
      <rect
        x="152"
        y="40"
        width="56"
        height="176"
        rx="8"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <rect
        x="48"
        y="40"
        width="56"
        height="176"
        rx="8"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </>
  ),
}

export const PauseIcon = React.forwardRef<SVGSVGElement, PhosphorIconProps>(
  function PauseIcon(props, ref) {
    return <IconBase ref={ref} weights={weights} {...props} />
  },
)

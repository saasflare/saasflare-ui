import * as React from "react"
import { IconBase, type PhosphorIconProps } from "./icon-base"

const weights = {
  regular: (
    <>
      <circle
        cx="128"
        cy="128"
        r="96"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <path
        d="M120,120a8,8,0,0,1,8,8v40a8,8,0,0,0,8,8"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <circle cx="124" cy="84" r="12" />
    </>
  ),
  bold: (
    <><circle cx="124" cy="84" r="16"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/><path d="M120,124a8,8,0,0,1,8,8v36a8,8,0,0,0,8,8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/></>
  ),
  fill: (
    <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm-4,48a12,12,0,1,1-12,12A12,12,0,0,1,124,72Zm12,112a16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40a8,8,0,0,1,0,16Z" />
  ),
  duotone: (
    <>
      <circle cx="128" cy="128" r="96" opacity="0.2" />
      <path
        d="M120,120a8,8,0,0,1,8,8v40a8,8,0,0,0,8,8"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <circle
        cx="128"
        cy="128"
        r="96"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <circle cx="124" cy="84" r="12" />
    </>
  ),
}

export const InfoIcon = React.forwardRef<SVGSVGElement, PhosphorIconProps>(
  function InfoIcon(props, ref) {
    return <IconBase ref={ref} weights={weights} {...props} />
  },
)

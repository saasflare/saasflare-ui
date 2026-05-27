import * as React from "react"
import { IconBase, type PhosphorIconProps } from "./icon-base"

const weights = {
  regular: (
    <>
      <polyline
        points="88 136 112 160 168 104"
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
    </>
  ),
  bold: (
    <><polyline points="88 136 112 160 168 104" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/></>
  ),
  fill: (
    <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z" />
  ),
  duotone: (
    <>
      <circle cx="128" cy="128" r="96" opacity="0.2" />
      <polyline
        points="88 136 112 160 168 104"
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
    </>
  ),
}

export const CheckCircleIcon = React.forwardRef<
  SVGSVGElement,
  PhosphorIconProps
>(function CheckCircleIcon(props, ref) {
  return <IconBase ref={ref} weights={weights} {...props} />
})

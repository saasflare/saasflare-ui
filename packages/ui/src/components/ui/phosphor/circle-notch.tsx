import * as React from "react"
import { IconBase, type PhosphorIconProps } from "./icon-base"

const weights = {
  regular: (
    <path
      d="M168,40a97,97,0,0,1,56,88,96,96,0,0,1-192,0A97,97,0,0,1,88,40"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="16"
    />
  ),
  bold: (
    <><path d="M168,40a97,97,0,0,1,56,88,96,96,0,0,1-192,0A97,97,0,0,1,88,40" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/></>
  ),
  fill: (
    <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,176A72,72,0,0,1,92,65.64a8,8,0,0,1,8,13.85,56,56,0,1,0,56,0,8,8,0,0,1,8-13.85A72,72,0,0,1,128,200Z" />
  ),
  duotone: (
    <>
      <circle cx="128" cy="128" r="96" opacity="0.2" />
      <path
        d="M168,40a97,97,0,0,1,56,88,96,96,0,0,1-192,0A97,97,0,0,1,88,40"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </>
  ),
}

export const CircleNotchIcon = React.forwardRef<
  SVGSVGElement,
  PhosphorIconProps
>(function CircleNotchIcon(props, ref) {
  return <IconBase ref={ref} weights={weights} {...props} />
})

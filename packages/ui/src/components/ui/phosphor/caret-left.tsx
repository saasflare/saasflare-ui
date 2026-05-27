import * as React from "react"
import { IconBase, type PhosphorIconProps } from "./icon-base"

const weights = {
  regular: (
    <polyline
      points="160 208 80 128 160 48"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="16"
    />
  ),
  bold: (
    <><polyline points="160 208 80 128 160 48" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/></>
  ),
  fill: (
    <path d="M163.06,40.61a8,8,0,0,0-8.72,1.73l-80,80a8,8,0,0,0,0,11.32l80,80A8,8,0,0,0,168,208V48A8,8,0,0,0,163.06,40.61Z" />
  ),
  duotone: (
    <>
      <polygon points="160 208 80 128 160 48 160 208" opacity="0.2" />
      <polygon
        points="160 208 80 128 160 48 160 208"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </>
  ),
}

export const CaretLeftIcon = React.forwardRef<SVGSVGElement, PhosphorIconProps>(
  function CaretLeftIcon(props, ref) {
    return <IconBase ref={ref} weights={weights} {...props} />
  },
)

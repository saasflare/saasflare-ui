import * as React from "react"
import { IconBase, type PhosphorIconProps } from "./icon-base"

const weights = {
  regular: (
    <polyline
      points="208 96 128 176 48 96"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="16"
    />
  ),
  bold: (
    <><polyline points="208 96 128 176 48 96" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/></>
  ),
  fill: (
    <path d="M215.39,92.94A8,8,0,0,0,208,88H48a8,8,0,0,0-5.66,13.66l80,80a8,8,0,0,0,11.32,0l80-80A8,8,0,0,0,215.39,92.94Z" />
  ),
  duotone: (
    <>
      <polygon points="208 96 128 176 48 96 208 96" opacity="0.2" />
      <polygon
        points="208 96 128 176 48 96 208 96"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </>
  ),
}

export const CaretDownIcon = React.forwardRef<SVGSVGElement, PhosphorIconProps>(
  function CaretDownIcon(props, ref) {
    return <IconBase ref={ref} weights={weights} {...props} />
  },
)

import * as React from "react"
import { IconBase, type PhosphorIconProps } from "./icon-base"

const weights = {
  regular: (
    <polyline
      points="48 160 128 80 208 160"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="16"
    />
  ),
  bold: (
    <><polyline points="48 160 128 80 208 160" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/></>
  ),
  fill: (
    <path d="M213.66,154.34l-80-80a8,8,0,0,0-11.32,0l-80,80A8,8,0,0,0,48,168H208a8,8,0,0,0,5.66-13.66Z" />
  ),
  duotone: (
    <>
      <polygon points="48 160 128 80 208 160 48 160" opacity="0.2" />
      <polygon
        points="48 160 128 80 208 160 48 160"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </>
  ),
}

export const CaretUpIcon = React.forwardRef<SVGSVGElement, PhosphorIconProps>(
  function CaretUpIcon(props, ref) {
    return <IconBase ref={ref} weights={weights} {...props} />
  },
)

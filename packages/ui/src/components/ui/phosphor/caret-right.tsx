import * as React from "react"
import { IconBase, type PhosphorIconProps } from "./icon-base"

const weights = {
  regular: (
    <polyline
      points="96 48 176 128 96 208"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="16"
    />
  ),
  bold: (
    <><polyline points="96 48 176 128 96 208" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/></>
  ),
  fill: (
    <path d="M181.66,122.34l-80-80A8,8,0,0,0,88,48V208a8,8,0,0,0,13.66,5.66l80-80A8,8,0,0,0,181.66,122.34Z" />
  ),
  duotone: (
    <>
      <polygon points="96 48 176 128 96 208 96 48" opacity="0.2" />
      <polygon
        points="96 48 176 128 96 208 96 48"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </>
  ),
}

export const CaretRightIcon = React.forwardRef<
  SVGSVGElement,
  PhosphorIconProps
>(function CaretRightIcon(props, ref) {
  return <IconBase ref={ref} weights={weights} {...props} />
})

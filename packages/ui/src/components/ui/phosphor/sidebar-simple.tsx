import * as React from "react"
import { IconBase, type PhosphorIconProps } from "./icon-base"

const weights = {
  regular: (
    <>
      <line
        x1="88"
        y1="48"
        x2="88"
        y2="208"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <rect
        x="32"
        y="48"
        width="192"
        height="160"
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
    <><line x1="88" y1="48" x2="88" y2="208" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/><rect x="32" y="48" width="192" height="160" rx="8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/></>
  ),
  fill: (
    <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H88V56H216V200Z" />
  ),
  duotone: (
    <>
      <path
        d="M40,208a8,8,0,0,1-8-8V56a8,8,0,0,1,8-8H88V208Z"
        opacity="0.2"
      />
      <line
        x1="88"
        y1="48"
        x2="88"
        y2="208"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <rect
        x="32"
        y="48"
        width="192"
        height="160"
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

export const SidebarSimpleIcon = React.forwardRef<
  SVGSVGElement,
  PhosphorIconProps
>(function SidebarSimpleIcon(props, ref) {
  return <IconBase ref={ref} weights={weights} {...props} />
})

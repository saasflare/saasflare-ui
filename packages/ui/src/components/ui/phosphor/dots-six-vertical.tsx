import * as React from "react"
import { IconBase, type PhosphorIconProps } from "./icon-base"

const weights = {
  regular: (
    <>
      <circle cx="92" cy="60" r="12" />
      <circle cx="164" cy="60" r="12" />
      <circle cx="92" cy="128" r="12" />
      <circle cx="164" cy="128" r="12" />
      <circle cx="92" cy="196" r="12" />
      <circle cx="164" cy="196" r="12" />
    </>
  ),
  bold: (
    <><circle cx="92" cy="60" r="16"/><circle cx="164" cy="60" r="16"/><circle cx="92" cy="128" r="16"/><circle cx="164" cy="128" r="16"/><circle cx="92" cy="196" r="16"/><circle cx="164" cy="196" r="16"/></>
  ),
  fill: (
    <path d="M192,16H64A16,16,0,0,0,48,32V224a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V32A16,16,0,0,0,192,16ZM100,200a12,12,0,1,1,12-12A12,12,0,0,1,100,200Zm0-60a12,12,0,1,1,12-12A12,12,0,0,1,100,140Zm0-60a12,12,0,1,1,12-12A12,12,0,0,1,100,80Zm56,120a12,12,0,1,1,12-12A12,12,0,0,1,156,200Zm0-60a12,12,0,1,1,12-12A12,12,0,0,1,156,140Zm0-60a12,12,0,1,1,12-12A12,12,0,0,1,156,80Z" />
  ),
  duotone: (
    <>
      <rect x="48" y="16" width="160" height="224" rx="16" opacity="0.2" />
      <circle cx="92" cy="60" r="12" />
      <circle cx="164" cy="60" r="12" />
      <circle cx="92" cy="128" r="12" />
      <circle cx="164" cy="128" r="12" />
      <circle cx="92" cy="196" r="12" />
      <circle cx="164" cy="196" r="12" />
    </>
  ),
}

export const DotsSixVerticalIcon = React.forwardRef<
  SVGSVGElement,
  PhosphorIconProps
>(function DotsSixVerticalIcon(props, ref) {
  return <IconBase ref={ref} weights={weights} {...props} />
})

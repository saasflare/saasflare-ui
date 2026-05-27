import * as React from "react"
import { BrandIconBase, type BrandIconProps } from "./brand-icon-base"

const weights = {
  regular: (
    <><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M168,88H152a24,24,0,0,0-24,24V224" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="96" y1="144" x2="160" y2="144" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/></>
  ),
  bold: (
    <><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/><path d="M168,88H152a24,24,0,0,0-24,24V224" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/><line x1="96" y1="144" x2="160" y2="144" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/></>
  ),
  fill: (
    <><path d="M232,128a104.16,104.16,0,0,1-91.55,103.26,4,4,0,0,1-4.45-4V152h24a8,8,0,0,0,8-8.53,8.17,8.17,0,0,0-8.25-7.47H136V112a16,16,0,0,1,16-16h16a8,8,0,0,0,8-8.53A8.17,8.17,0,0,0,167.73,80H152a32,32,0,0,0-32,32v24H96a8,8,0,0,0-8,8.53A8.17,8.17,0,0,0,96.27,152H120v75.28a4,4,0,0,1-4.44,4A104.15,104.15,0,0,1,24.07,124.09c2-54,45.74-97.9,99.78-100A104.12,104.12,0,0,1,232,128Z"/></>
  ),
  duotone: (
    <><circle cx="128" cy="128" r="96" opacity="0.2"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M168,88H152a24,24,0,0,0-24,24V224" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="96" y1="144" x2="160" y2="144" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/></>
  ),
}

const colorful = {
  viewBox: "0 0 256 256",
  content: (
    <>
        <path fill="#1877f2" d="M256 128C256 57.308 198.692 0 128 0S0 57.308 0 128c0 63.888 46.808 116.843 108 126.445V165H75.5v-37H108V99.8c0-32.08 19.11-49.8 48.348-49.8C170.352 50 185 52.5 185 52.5V84h-16.14C152.959 84 148 93.867 148 103.99V128h35.5l-5.675 37H148v89.445c61.192-9.602 108-62.556 108-126.445" />
        <path fill="#fff" d="m177.825 165l5.675-37H148v-24.01C148 93.866 152.959 84 168.86 84H185V52.5S170.352 50 156.347 50C127.11 50 108 67.72 108 99.8V128H75.5v37H108v89.445A129 129 0 0 0 128 256a129 129 0 0 0 20-1.555V165z" />
    </>
  ),
}

export const FacebookLogoIcon = React.forwardRef<SVGSVGElement, BrandIconProps>(
  function FacebookLogoIcon(props, ref) {
    return <BrandIconBase ref={ref} weights={weights} colorful={colorful} {...props} />
  },
)

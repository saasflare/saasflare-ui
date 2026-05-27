import * as React from "react"
import { BrandIconBase, type BrandIconProps } from "./brand-icon-base"

const weights = {
  regular: (
    <><circle cx="72" cy="128" r="56" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><ellipse cx="184" cy="128" rx="24" ry="56" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="240" y1="72" x2="240" y2="184" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/></>
  ),
  bold: (
    <><circle cx="68" cy="128" r="56" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/><ellipse cx="184" cy="128" rx="24" ry="56" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/><line x1="244" y1="72" x2="244" y2="184" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/></>
  ),
  fill: (
    <><path d="M136,128A64,64,0,1,1,72,64,64.07,64.07,0,0,1,136,128Zm48-64c-5.68,0-16.4,2.76-24.32,21.25C154.73,96.8,152,112,152,128s2.73,31.2,7.68,42.75C167.6,189.24,178.32,192,184,192s16.4-2.76,24.32-21.25C213.27,159.2,216,144,216,128s-2.73-31.2-7.68-42.75C200.4,66.76,189.68,64,184,64Zm56,0a8,8,0,0,0-8,8V184a8,8,0,0,0,16,0V72A8,8,0,0,0,240,64Z"/></>
  ),
  duotone: (
    <><circle cx="72" cy="128" r="56" opacity="0.2"/><ellipse cx="184" cy="128" rx="24" ry="56" opacity="0.2"/><circle cx="72" cy="128" r="56" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><ellipse cx="184" cy="128" rx="24" ry="56" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="240" y1="72" x2="240" y2="184" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/></>
  ),
}

const colorful = {
  viewBox: "0 0 256 146",
  content: (
    <>
        <path d="M72.2 0c39.877 0 72.2 32.549 72.2 72.696c0 40.148-32.326 72.694-72.2 72.694c-39.872 0-72.2-32.546-72.2-72.694C0 32.55 32.325 0 72.2 0m115.3 4.258c19.938 0 36.101 30.638 36.101 68.438h.003c0 37.791-16.163 68.438-36.1 68.438c-19.939 0-36.101-30.647-36.101-68.438c0-37.79 16.16-68.438 36.098-68.438m55.803 7.129c7.011 0 12.697 27.449 12.697 61.31c0 33.85-5.684 61.31-12.697 61.31s-12.694-27.452-12.694-61.31s5.684-61.31 12.694-61.31"/>
    </>
  ),
}

export const MediumLogoIcon = React.forwardRef<SVGSVGElement, BrandIconProps>(
  function MediumLogoIcon(props, ref) {
    return <BrandIconBase ref={ref} weights={weights} colorful={colorful} {...props} />
  },
)

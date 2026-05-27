import * as React from "react"
import { BrandIconBase, type BrandIconProps } from "./brand-icon-base"

const weights = {
  regular: (
    <><polygon points="48 40 96 40 208 216 160 216 48 40" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="113.88" y1="143.53" x2="48" y2="216" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="208" y1="40" x2="142.12" y2="112.47" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/></>
  ),
  bold: (
    <><polygon points="48 40 96 40 208 216 160 216 48 40" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/><line x1="113.88" y1="143.53" x2="48" y2="216" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/><line x1="208" y1="40" x2="142.12" y2="112.47" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/></>
  ),
  fill: (
    <><path d="M215,219.85a8,8,0,0,1-7,4.15H160a8,8,0,0,1-6.75-3.71l-40.49-63.63L53.92,221.38a8,8,0,0,1-11.84-10.76l61.77-68L41.25,44.3A8,8,0,0,1,48,32H96a8,8,0,0,1,6.75,3.71l40.49,63.63,58.84-64.72a8,8,0,0,1,11.84,10.76l-61.77,67.95,62.6,98.38A8,8,0,0,1,215,219.85Z"/></>
  ),
  duotone: (
    <><polygon points="48 40 96 40 208 216 160 216 48 40" opacity="0.2"/><polygon points="48 40 96 40 208 216 160 216 48 40" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="113.88" y1="143.53" x2="48" y2="216" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="208" y1="40" x2="142.12" y2="112.47" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/></>
  ),
}

const colorful = {
  viewBox: "0 0 251 256",
  content: (
    <>
        <path d="M149.079 108.399L242.33 0h-22.098l-80.97 94.12L74.59 0H0l97.796 142.328L0 256h22.1l85.507-99.395L175.905 256h74.59L149.073 108.399zM118.81 143.58l-9.909-14.172l-78.84-112.773h33.943l63.625 91.011l9.909 14.173l82.705 118.3H186.3l-67.49-96.533z" />
    </>
  ),
}

export const XLogoIcon = React.forwardRef<SVGSVGElement, BrandIconProps>(
  function XLogoIcon(props, ref) {
    return <BrandIconBase ref={ref} weights={weights} colorful={colorful} {...props} />
  },
)

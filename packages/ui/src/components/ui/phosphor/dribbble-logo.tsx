import * as React from "react"
import { BrandIconBase, type BrandIconProps } from "./brand-icon-base"

const weights = {
  regular: (
    <><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M71,205.27A159.93,159.93,0,0,1,208,128c5.39,0,10.73.27,16,.79" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M188,53.09A159.69,159.69,0,0,1,64,112a161.14,161.14,0,0,1-30.16-2.84" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M85.93,41.69a159.91,159.91,0,0,1,79,138,160.45,160.45,0,0,1-4.73,38.78" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/></>
  ),
  bold: (
    <><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/><path d="M71,205.27A159.93,159.93,0,0,1,208,128c5.39,0,10.73.27,16,.79" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/><path d="M188,53.09A159.69,159.69,0,0,1,64,112a161.14,161.14,0,0,1-30.16-2.84" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/><path d="M85.93,41.69a159.91,159.91,0,0,1,79,138,160.45,160.45,0,0,1-4.73,38.78" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/></>
  ),
  fill: (
    <><path d="M93.27,36.86a4,4,0,0,1,.82-7.19,103.94,103.94,0,0,1,88.66,9.95,4,4,0,0,1,1,5.87,153.32,153.32,0,0,1-41.89,37A169.43,169.43,0,0,0,93.27,36.86ZM127.58,90a153,153,0,0,0-56-46.91,3.94,3.94,0,0,0-4,.33,104.41,104.41,0,0,0-38.34,52,4,4,0,0,0,3,5.16A152.34,152.34,0,0,0,64,104,151,151,0,0,0,127.58,90Zm103.8,26.69A103.81,103.81,0,0,0,202.19,55.2a4,4,0,0,0-6,.34,169.15,169.15,0,0,1-45.69,40.4,167.73,167.73,0,0,1,13.55,29.9A167.64,167.64,0,0,1,208,120,169.35,169.35,0,0,1,227,121.07,4,4,0,0,0,231.38,116.72Zm-62.91,24.5a167.7,167.7,0,0,1,4.45,38.47,168,168,0,0,1-4.11,36.85A4,4,0,0,0,174.5,221a104.25,104.25,0,0,0,56.57-79.25,4,4,0,0,0-3.49-4.49,152.44,152.44,0,0,0-59.11,4Zm-19.64-10.45a151.76,151.76,0,0,0-12.39-27.21A167,167,0,0,1,64,120a168.4,168.4,0,0,1-34.88-3.65,4,4,0,0,0-4.81,3.56q-.31,4-.32,8.09a103.72,103.72,0,0,0,33,75.91,4,4,0,0,0,6.15-.92A169,169,0,0,1,148.83,130.77ZM75.69,213.25a4,4,0,0,0,1.52,5.48,103.88,103.88,0,0,0,68.85,11.69,3.93,3.93,0,0,0,3.06-2.65,152.6,152.6,0,0,0,7.8-48.08,151.3,151.3,0,0,0-3.74-33.46A152.94,152.94,0,0,0,75.69,213.25Z"/></>
  ),
  duotone: (
    <><circle cx="128" cy="128" r="96" opacity="0.2"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M71,205.27A159.93,159.93,0,0,1,208,128c5.39,0,10.73.27,16,.79" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M188,53.09A159.69,159.69,0,0,1,64,112a161.14,161.14,0,0,1-30.16-2.84" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M85.93,41.69a159.91,159.91,0,0,1,79,138,160.45,160.45,0,0,1-4.73,38.78" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/></>
  ),
}

const colorful = {
  viewBox: "0 0 256 256",
  content: (
    <>
        <path fill="#e74d89" d="M128 8.5c66 0 119.4 53.4 119.4 119.3S194 247.2 128 247.2S8.6 193.8 8.6 127.9S62 8.5 128 8.5"/><path fill="#b2215a" d="M128 255.7c-70.6 0-128-57.3-128-127.8C0 57.3 57.4 0 128 0s128 57.3 128 127.8s-57.4 127.9-128 127.9m107.9-110.4c-3.7-1.2-33.8-10.1-68.1-4.7c14.3 39.2 20.1 71.2 21.2 77.8c24.6-16.5 42.1-42.7 46.9-73.1m-65.2 83.2c-1.6-9.6-8-43-23.3-82.8c-.2.1-.5.2-.7.2c-61.7 21.5-83.8 64.2-85.8 68.2c18.5 14.4 41.8 23 67.1 23c15.1.1 29.6-3 42.7-8.6M46.8 201c2.5-4.2 32.5-53.8 88.9-72.1c1.4-.5 2.9-.9 4.3-1.3c-2.7-6.2-5.7-12.4-8.9-18.5c-54.6 16.3-107.6 15.6-112.4 15.5c0 1.1-.1 2.2-.1 3.3c.1 28.1 10.7 53.7 28.2 73.1M21 105.6c4.9.1 49.9.3 101.1-13.3C104 60.1 84.4 33.1 81.6 29.2C50.9 43.6 28.1 71.8 21 105.6m81.4-83.8c3 4 22.9 31 40.8 63.9c38.9-14.6 55.3-36.6 57.3-39.4c-19.3-17.1-44.7-27.5-72.5-27.5c-8.8 0-17.4 1.1-25.6 3m110.2 37.1c-2.3 3.1-20.6 26.6-61 43.1c2.5 5.2 5 10.5 7.3 15.8c.8 1.9 1.6 3.8 2.4 5.6c36.4-4.6 72.5 2.8 76.1 3.5c-.3-25.7-9.5-49.4-24.8-68"/>
    </>
  ),
}

export const DribbbleLogoIcon = React.forwardRef<SVGSVGElement, BrandIconProps>(
  function DribbbleLogoIcon(props, ref) {
    return <BrandIconBase ref={ref} weights={weights} colorful={colorful} {...props} />
  },
)

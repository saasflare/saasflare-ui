import * as React from "react"
import { BrandIconBase, type BrandIconProps } from "./brand-icon-base"

const weights = {
  regular: (
    <><circle cx="184" cy="32" r="16" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><polyline points="128 72 136 24 168.29 28.97" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M59.41,89.88C77.72,78.75,101.72,72,128,72s50.28,6.75,68.59,17.88h0a24,24,0,1,1,31.62,34.79h0A51.6,51.6,0,0,1,232,144c0,39.76-46.56,72-104,72S24,183.76,24,144a51.6,51.6,0,0,1,3.79-19.33h0A24,24,0,1,1,59.41,89.88Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><circle cx="88" cy="128" r="16"/><circle cx="168" cy="128" r="16"/><path d="M160,176a68,68,0,0,1-64,0" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/></>
  ),
  bold: (
    <><circle cx="184" cy="32" r="12" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/><path d="M59.41,89.88C77.72,78.75,101.72,72,128,72s50.28,6.75,68.59,17.88h0a24,24,0,1,1,31.62,34.79h0A51.6,51.6,0,0,1,232,144c0,39.76-46.56,72-104,72S24,183.76,24,144a51.6,51.6,0,0,1,3.79-19.33h0A24,24,0,1,1,59.41,89.88Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/><circle cx="88" cy="128" r="20"/><circle cx="168" cy="128" r="20"/><path d="M156,172a100,100,0,0,1-56,0" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/><polyline points="128 72 136 24 172.16 30.03" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/></>
  ),
  fill: (
    <><path d="M248,104a32,32,0,0,0-52.94-24.19c-16.75-8.9-36.76-14.28-57.66-15.53l5.19-31.17,17.72,2.72a24,24,0,1,0,2.87-15.74l-26-4a8,8,0,0,0-9.11,6.59L121.2,64.16c-21.84.94-42.82,6.38-60.26,15.65a32,32,0,0,0-42.59,47.74A59,59,0,0,0,16,144c0,21.93,12,42.35,33.91,57.49C70.88,216,98.61,224,128,224s57.12-8,78.09-22.51C228,186.35,240,165.93,240,144a59,59,0,0,0-2.35-16.45A32.16,32.16,0,0,0,248,104ZM72,128a16,16,0,1,1,16,16A16,16,0,0,1,72,128Zm91.75,55.07a76.18,76.18,0,0,1-71.5,0,8,8,0,1,1,7.5-14.14,60.18,60.18,0,0,0,56.5,0,8,8,0,1,1,7.5,14.14ZM168,144a16,16,0,1,1,16-16A16,16,0,0,1,168,144Z"/></>
  ),
  duotone: (
    <><path d="M59.41,89.88C77.72,78.75,101.72,72,128,72s50.28,6.75,68.59,17.88h0a24,24,0,1,1,31.62,34.79h0A51.6,51.6,0,0,1,232,144c0,39.76-46.56,72-104,72S24,183.76,24,144a51.6,51.6,0,0,1,3.79-19.33h0A24,24,0,1,1,59.41,89.88Z" opacity="0.2"/><circle cx="184" cy="32" r="16" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><polyline points="128 72 136 24 168.29 28.97" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M59.41,89.88C77.72,78.75,101.72,72,128,72s50.28,6.75,68.59,17.88h0a24,24,0,1,1,31.62,34.79h0A51.6,51.6,0,0,1,232,144c0,39.76-46.56,72-104,72S24,183.76,24,144a51.6,51.6,0,0,1,3.79-19.33h0A24,24,0,1,1,59.41,89.88Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><circle cx="88" cy="128" r="16"/><circle cx="168" cy="128" r="16"/><path d="M160,176a68,68,0,0,1-64,0" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/></>
  ),
}

const colorful = {
  viewBox: "0 0 256 256",
  content: (
    <>
        <circle cx="128" cy="128" r="128" fill="#ff4500"/><path fill="#fff" d="M213.15 129.22c0-10.376-8.391-18.617-18.617-18.617a18.74 18.74 0 0 0-12.97 5.189c-12.818-9.157-30.368-15.107-49.9-15.87l8.544-39.981l27.773 5.95c.307 7.02 6.104 12.667 13.278 12.667c7.324 0 13.275-5.95 13.275-13.278c0-7.324-5.95-13.275-13.275-13.275c-5.188 0-9.768 3.052-11.904 7.478l-30.976-6.562c-.916-.154-1.832 0-2.443.458c-.763.458-1.22 1.22-1.371 2.136l-9.464 44.558c-19.837.612-37.692 6.562-50.662 15.872a18.74 18.74 0 0 0-12.971-5.188c-10.377 0-18.617 8.391-18.617 18.617c0 7.629 4.577 14.037 10.988 16.939a33.6 33.6 0 0 0-.458 5.646c0 28.686 33.42 52.036 74.621 52.036c41.202 0 74.622-23.196 74.622-52.036a35 35 0 0 0-.458-5.646c6.408-2.902 10.985-9.464 10.985-17.093M85.272 142.495c0-7.324 5.95-13.275 13.278-13.275c7.324 0 13.275 5.95 13.275 13.275s-5.95 13.278-13.275 13.278c-7.327.15-13.278-5.953-13.278-13.278m74.317 35.251c-9.156 9.157-26.553 9.768-31.588 9.768c-5.188 0-22.584-.765-31.59-9.768c-1.371-1.373-1.371-3.51 0-4.883c1.374-1.371 3.51-1.371 4.884 0c5.8 5.8 18.008 7.782 26.706 7.782s21.058-1.983 26.704-7.782c1.374-1.371 3.51-1.371 4.884 0c1.22 1.373 1.22 3.51 0 4.883m-2.443-21.822c-7.325 0-13.275-5.95-13.275-13.275s5.95-13.275 13.275-13.275c7.327 0 13.277 5.95 13.277 13.275c0 7.17-5.95 13.275-13.277 13.275"/>
    </>
  ),
}

export const RedditLogoIcon = React.forwardRef<SVGSVGElement, BrandIconProps>(
  function RedditLogoIcon(props, ref) {
    return <BrandIconBase ref={ref} weights={weights} colorful={colorful} {...props} />
  },
)

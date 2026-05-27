import * as React from "react"
import { BrandIconBase, type BrandIconProps } from "./brand-icon-base"

const weights = {
  regular: (
    <><line x1="220.23" y1="110.84" x2="93.41" y2="200.44" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="162.59" y1="200.44" x2="35.77" y2="110.84" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M175.35,96,195,42.62a3.93,3.93,0,0,1,7.53.38l19.89,76.12a49,49,0,0,1-18.87,52.4l-73.26,51.76a3.91,3.91,0,0,1-4.52,0L52.48,171.52a49,49,0,0,1-18.87-52.4L53.5,43A3.93,3.93,0,0,1,61,42.62L80.65,96Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/></>
  ),
  bold: (
    <><path d="M175.35,96,195,42.62a3.93,3.93,0,0,1,7.53.38l19.89,76.12a49,49,0,0,1-18.87,52.4l-73.26,51.76a3.91,3.91,0,0,1-4.52,0L52.48,171.52a49,49,0,0,1-18.87-52.4L53.5,43A3.93,3.93,0,0,1,61,42.62L80.65,96Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/><line x1="220.23" y1="110.84" x2="93.41" y2="200.44" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/><line x1="162.59" y1="200.44" x2="35.77" y2="110.84" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/></>
  ),
  fill: (
    <><path d="M230.15,117.1,210.25,41a11.94,11.94,0,0,0-22.79-1.11L169.78,88H86.22L68.54,39.87A11.94,11.94,0,0,0,45.75,41L25.85,117.1a57.19,57.19,0,0,0,22,61l73.27,51.76a11.91,11.91,0,0,0,13.74,0l73.27-51.76A57.19,57.19,0,0,0,230.15,117.1Zm-189.47,7L114.13,176,93.41,190.65,57.09,165A41.06,41.06,0,0,1,40.68,124.11Zm87.32,91-20.73-14.65L128,185.8l20.73,14.64ZM198.91,165l-36.32,25.66L141.87,176l73.45-51.9A41.06,41.06,0,0,1,198.91,165Z"/></>
  ),
  duotone: (
    <><path d="M35.77,110.84,53.5,43A3.93,3.93,0,0,1,61,42.62L80.65,96h94.7L195,42.62a3.93,3.93,0,0,1,7.53.38l17.73,67.84L128,176Z" opacity="0.2"/><path d="M175.35,96,195,42.62a3.93,3.93,0,0,1,7.53.38l19.89,76.12a49,49,0,0,1-18.87,52.4l-73.26,51.76a3.91,3.91,0,0,1-4.52,0L52.48,171.52a49,49,0,0,1-18.87-52.4L53.5,43A3.93,3.93,0,0,1,61,42.62L80.65,96Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="220.23" y1="110.84" x2="93.41" y2="200.44" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="162.59" y1="200.44" x2="35.77" y2="110.84" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/></>
  ),
}

const colorful = {
  viewBox: "0 0 256 247",
  content: (
    <>
        <path fill="#e24329" d="m251.845 97.642l-.328-.986l-34.85-90.903c-.657-1.808-1.972-3.287-3.616-4.274Q210.586 0 207.627 0c-1.973 0-3.78.822-5.26 1.973a8.73 8.73 0 0 0-3.124 4.767l-23.506 71.999H80.56l-23.506-72c-.493-1.808-1.644-3.451-3.123-4.766C52.45.822 50.643 0 48.67 0s-3.781.329-5.425 1.48c-1.644.986-2.96 2.465-3.617 4.273L4.781 96.656l-.33.986c-10.355 26.959-1.479 57.37 21.535 74.794h.328c0 .164 53.096 39.944 53.096 39.944l26.3 19.89l15.946 12c3.78 2.96 9.205 2.96 12.986 0l15.945-12l26.3-19.89l53.424-39.944c23.014-17.425 31.726-47.835 21.37-74.794z"/><path fill="#fc6d26" d="m251.845 97.642l-.328-.986c-17.26 3.616-33.205 10.85-46.849 21.04c-.164 0-41.424 31.398-76.602 57.863a18377 18377 0 0 0 48.657 36.821l53.424-39.944c23.013-17.425 31.726-47.835 21.37-74.794z"/><path fill="#fca326" d="m79.245 212.38l26.301 19.89l15.945 12c3.78 2.96 9.206 2.96 12.986 0l15.945-12l26.301-19.89s-22.684-17.095-48.657-36.82c-26.136 19.725-48.82 36.82-48.82 36.82"/><path fill="#fc6d26" d="M51.465 117.697c-13.644-10.192-29.589-17.589-46.849-21.04l-.329.985c-10.356 26.959-1.479 57.37 21.534 74.794h.33c0 .164 53.094 39.944 53.094 39.944s22.685-17.095 48.821-36.82c-35.013-26.466-76.272-57.699-76.601-57.863"/>
    </>
  ),
}

export const GitlabLogoIcon = React.forwardRef<SVGSVGElement, BrandIconProps>(
  function GitlabLogoIcon(props, ref) {
    return <BrandIconBase ref={ref} weights={weights} colorful={colorful} {...props} />
  },
)

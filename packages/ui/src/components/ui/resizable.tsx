// @toreview
"use client"

/**
 * @fileoverview Resizable primitive — drag-to-resize panel groups with optional grip handles.
 * Built on react-resizable-panels. Part of the Saasflare base component layer.
 * @module packages/core/components/ui/resizable
 * @layer core
 *
 * @requires react-resizable-panels — peer dependency.
 *
 * @component
 * @example
 * import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@saasflare/core';
 * <ResizablePanelGroup direction="horizontal">
 *   <ResizablePanel>Left</ResizablePanel>
 *   <ResizableHandle withHandle />
 *   <ResizablePanel>Right</ResizablePanel>
 * </ResizablePanelGroup>
 */
"use client"

import { GripVerticalIcon } from "lucide-react"
import * as ResizablePrimitive from "react-resizable-panels"

import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"

type ResizablePanelGroupProps = ResizablePrimitive.GroupProps & SaasflareComponentProps

function ResizablePanelGroup({
  className,
  surface,
  radius,
  animated,
  ...props
}: ResizablePanelGroupProps) {
  const sf = useSaasflareProps({ surface, radius, animated })

  return (
    <ResizablePrimitive.Group
      {...props}
      data-slot="resizable-panel-group"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      className={cn(
        "flex h-full w-full aria-[orientation=vertical]:flex-col",
        className
      )}
    />
  )
}

function ResizablePanel({ ...props }: ResizablePrimitive.PanelProps) {
  return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />
}

function ResizableHandle({
  withHandle,
  className,
  ...props
}: ResizablePrimitive.SeparatorProps & {
  withHandle?: boolean
}) {
  return (
    <ResizablePrimitive.Separator
      data-slot="resizable-handle"
      className={cn(
        "relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:outline-hidden aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:after:left-0 aria-[orientation=horizontal]:after:h-1 aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:translate-x-0 aria-[orientation=horizontal]:after:-translate-y-1/2 [&[aria-orientation=horizontal]>div]:rotate-90",
        className
      )}
      {...props}
    >
      {withHandle && (
        <div className="z-10 flex h-4 w-3 items-center justify-center rounded-xs border bg-border">
          <GripVerticalIcon className="size-2.5" />
        </div>
      )}
    </ResizablePrimitive.Separator>
  )
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup, type ResizablePanelGroupProps }

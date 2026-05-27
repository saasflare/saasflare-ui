// @toreview
/**
 * @fileoverview Pagination primitive — page navigation controls with previous/next links and ellipsis.
 * Pure HTML nav with Tailwind styling, using Button variants for link appearance. Part of the Saasflare base component layer.
 * @module packages/core/components/ui/pagination
 * @layer core
 *
 * @component
 * @example
 * import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from '@saasflare/core';
 * <Pagination>
 *   <PaginationContent>
 *     <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
 *     <PaginationItem><PaginationLink href="#" isActive>1</PaginationLink></PaginationItem>
 *     <PaginationItem><PaginationLink href="#">2</PaginationLink></PaginationItem>
 *     <PaginationItem><PaginationNext href="#" /></PaginationItem>
 *   </PaginationContent>
 * </Pagination>
 */
import * as React from "react"
import {
  CaretLeftIcon,
  CaretRightIcon,
  DotsThreeIcon,
} from "./phosphor"

import { cn } from "../../lib"
import { useSaasflareProps } from "../../providers"
import { buttonVariants } from "./button"

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  )
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  )
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"
} & React.ComponentProps<"a">

function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        className
      )}
      {...props}
    />
  )
}

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  const sf = useSaasflareProps()
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="md"
      className={cn("gap-1 px-2.5 sm:pl-2.5", className)}
      {...props}
    >
      <CaretLeftIcon weight={sf.iconWeight} />
      <span className="hidden sm:block">Previous</span>
    </PaginationLink>
  )
}

function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  const sf = useSaasflareProps()
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="md"
      className={cn("gap-1 px-2.5 sm:pr-2.5", className)}
      {...props}
    >
      <span className="hidden sm:block">Next</span>
      <CaretRightIcon weight={sf.iconWeight} />
    </PaginationLink>
  )
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  const sf = useSaasflareProps()
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <DotsThreeIcon weight={sf.iconWeight} className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}

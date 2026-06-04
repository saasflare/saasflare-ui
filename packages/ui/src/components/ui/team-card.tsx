"use client"

/**
 * @fileoverview Team member card with photo, name, role, and social links.
 * @author Saasflare™
 * @module packages/ui/components/ui/team-card
 * @package ui
 *
 * @component
 * @example
 * import { TeamCard } from '@saasflare/ui';
 * <TeamCard
 *   name="Jane Doe"
 *   role="CEO & Co-Founder"
 *   photo="/team/jane.jpg"
 *   socials={[
 *     { label: "Twitter", url: "https://twitter.com/jane", icon: <TwitterIcon /> },
 *     { label: "LinkedIn", url: "https://linkedin.com/in/jane", icon: <LinkedInIcon /> },
 *   ]}
 * />
 */

import * as React from "react"
import { type ReactNode } from "react"

import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"

/** A social link entry. */
export interface SocialLink {
  /** Accessible label for the link. */
  label: string
  /** URL to the social profile. */
  url: string
  /** Icon element. */
  icon: ReactNode
}

/** Props for the TeamCard component. */
export interface TeamCardProps
  extends Omit<React.ComponentProps<"div">, keyof SaasflareComponentProps>,
    SaasflareComponentProps {
  /** Person's name. */
  name: string
  /** Role or job title. */
  role: string
  /** Photo URL. */
  photo?: string
  /** Short bio text. */
  bio?: string
  /** Social media links. */
  socials?: SocialLink[]
}

/**
 * Team member card with photo, name, role, and social links.
 *
 * @component
 * @package ui
 */
export function TeamCard({
  name,
  role,
  photo,
  bio,
  socials,
  className,
  surface,
  radius,
  animated,
  iconWeight,
  ...props
}: TeamCardProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })
  return (
    <div
      data-slot="team-card"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      className={cn(
        "flex flex-col items-center rounded-xl border surface-card p-6 text-center",
        "transition-all duration-200 hover:-translate-y-px hover:shadow-md",
        "motion-reduce:hover:transform-none",
        className,
      )}
      {...props}
    >
      {photo && (
        <img
          src={photo}
          alt={name}
          className="mb-4 size-24 rounded-full object-cover"
        />
      )}
      <h3 className="text-base font-semibold">{name}</h3>
      <p className="text-sm text-muted-foreground">{role}</p>
      {bio && <p className="mt-2 text-sm text-muted-foreground">{bio}</p>}
      {socials && socials.length > 0 && (
        <div className="mt-4 flex gap-2">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label={s.label}
            >
              {s.icon}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

// @toreview
"use client"

/**
 * @fileoverview Saasflare SettingsSection — label + description + control layout.
 * @module packages/core/components/ui/settings-section
 * @layer core
 *
 * A horizontal layout for settings rows: label/description on the left,
 * control (toggle, select, input) on the right. Stacks vertically on mobile.
 *
 * @example
 * import { SettingsSection } from "@saasflare/core";
 *
 * <SettingsSection
 *   label="Email Notifications"
 *   description="Receive email updates about your account activity."
 * >
 *   <Switch checked={enabled} onCheckedChange={setEnabled} />
 * </SettingsSection>
 */

import * as React from "react"
import { cn } from "../../lib"

/** Props for the SettingsSection component */
interface SettingsSectionProps extends React.ComponentProps<"div"> {
  /** Setting label */
  label: string
  /** Optional description of the setting */
  description?: string
}

/**
 * Settings row with label, description, and control slot.
 *
 * @component
 * @layer core
 *
 * @param {string} label - Setting label
 * @param {string} description - Description of what the setting controls
 *
 * @example
 * <SettingsSection
 *   label="Two-Factor Authentication"
 *   description="Add an extra layer of security to your account."
 * >
 *   <Button variant="outline" size="sm">Enable</Button>
 * </SettingsSection>
 */
function SettingsSection({
  label,
  description,
  className,
  children,
  ...props
}: SettingsSectionProps) {
  return (
    <div
      data-slot="settings-section"
      className={cn(
        "flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6",
        className
      )}
      {...props}
    >
      <div className="space-y-0.5">
        <div className="text-sm font-medium">{label}</div>
        {description && (
          <div className="text-sm text-muted-foreground">{description}</div>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

export { SettingsSection, type SettingsSectionProps }

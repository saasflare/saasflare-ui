"use client"

import { Icons, TeamCard } from "@saasflare/ui"

/** A team member card with photo, role, bio, and social links. */
export function Demo() {
    return (
        <TeamCard
            className="w-full max-w-xs"
            name="Jordan Avery"
            role="CEO & Co-Founder"
            photo="https://i.pravatar.cc/192?img=33"
            bio="Previously led platform at two YC startups. Building developer tools she wished she'd had."
            socials={[
                { label: "Website", url: "https://example.com", icon: <Icons.globe /> },
                { label: "GitHub", url: "https://github.com", icon: <Icons.github /> },
            ]}
        />
    )
}

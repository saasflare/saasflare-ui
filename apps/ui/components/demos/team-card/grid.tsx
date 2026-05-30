"use client"

import { Icons, TeamCard } from "@saasflare/ui"

const TEAM = [
    {
        name: "Jordan Avery",
        role: "CEO & Co-Founder",
        photo: "https://i.pravatar.cc/192?img=33",
    },
    {
        name: "Theo Nakamura",
        role: "CTO & Co-Founder",
        photo: "https://i.pravatar.cc/192?img=15",
    },
    {
        name: "Ines Costa",
        role: "Head of Design",
        photo: "https://i.pravatar.cc/192?img=44",
    },
]

/** A team grid for an about or careers page. */
export function Demo() {
    return (
        <div className="grid w-full gap-4 sm:grid-cols-3">
            {TEAM.map((member) => (
                <TeamCard
                    key={member.name}
                    name={member.name}
                    role={member.role}
                    photo={member.photo}
                    socials={[
                        { label: "GitHub", url: "https://github.com", icon: <Icons.github /> },
                    ]}
                />
            ))}
        </div>
    )
}

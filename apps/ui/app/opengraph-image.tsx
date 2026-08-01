/**
 * @fileoverview Default Open Graph / Twitter card image (1200×630), generated
 * at the edge. Applies to every route unless a page provides its own. Uses
 * literal brand colors — OG images can't read the CSS design tokens.
 */
import { ImageResponse } from "next/og"
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site"

export const runtime = "edge"
export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpengraphImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    background: "#0a0a0f",
                    padding: "80px",
                    fontFamily: "sans-serif",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    <div
                        style={{
                            width: "56px",
                            height: "56px",
                            borderRadius: "16px",
                            background: "linear-gradient(135deg, #5b7cfa, #6aa8ff)",
                        }}
                    />
                    <span style={{ color: "#e6e8ef", fontSize: "32px", fontWeight: 600 }}>
                        {SITE_NAME}
                    </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div
                        style={{
                            display: "flex",
                            fontSize: "82px",
                            fontWeight: 800,
                            lineHeight: 1.05,
                            color: "#f5f6fa",
                        }}
                    >
                        Components your AI
                    </div>
                    <div
                        style={{
                            display: "flex",
                            fontSize: "82px",
                            fontWeight: 800,
                            lineHeight: 1.05,
                            background: "linear-gradient(90deg, #5b7cfa, #6aa8ff)",
                            backgroundClip: "text",
                            color: "transparent",
                        }}
                    >
                        already understands
                    </div>
                    <span style={{ fontSize: "30px", color: "#9aa0ad", marginTop: "8px" }}>
                        117 components · 24 palettes · MCP-ready · Tailwind v4
                    </span>
                </div>
            </div>
        ),
        size,
    )
}

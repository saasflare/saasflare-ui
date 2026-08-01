/**
 * @fileoverview MCP server endpoint — exposed at `/api/mcp`.
 *
 * Bridges Next.js Web standard `Request`/`Response` to the MCP SDK's
 * `WebStandardStreamableHTTPServerTransport`. Stateless: one transport
 * per request. Supports POST (JSON-RPC) and GET (capability discovery).
 *
 * @module apps/ui/app/api/mcp/route
 */

import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js"
import { createSaasflareMcpServer } from "@/lib/mcp/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

async function handle(req: Request): Promise<Response> {
    const server = await createSaasflareMcpServer()
    const transport = new WebStandardStreamableHTTPServerTransport({
        // Stateless mode — no session id, no resumption store. Each POST
        // is self-contained, which fits a public read-only catalog server.
        sessionIdGenerator: undefined,
    })
    await server.connect(transport)
    // Do not call transport.close() here — the returned Response carries a
    // streaming body; the SDK closes the transport when the consumer ends
    // the stream. Closing here would truncate the SSE chunks.
    return transport.handleRequest(req)
}

export async function POST(req: Request): Promise<Response> {
    return handle(req)
}

export async function GET(req: Request): Promise<Response> {
    return handle(req)
}

export async function DELETE(req: Request): Promise<Response> {
    return handle(req)
}

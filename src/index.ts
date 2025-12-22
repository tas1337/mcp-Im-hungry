// =============================================================================
// MCP SERVER ENTRY POINT
// =============================================================================
// Basic MCP server using stdio transport (standard input/output).
//
// PROTOCOLS:
// - MCP:  Cursor talks to THIS server via stdio
//
// HOW IT WORKS:
// 1. Cursor connects to this server via stdio
// 2. User asks for food (e.g., "find me a burger")
// 3. MCP server receives tool call
// 4. Tool handler calls api-clients.ts functions directly
// 5. API clients return mock data
// 6. Results shown to user
//
// KEY DIFFERENCE FROM A2A VERSION:
// - Basic MCP: Direct API calls, stdio transport
// - A2A MCP:   Agent discovery, HTTP transport
// =============================================================================

import { startServer } from './server.js';

startServer();

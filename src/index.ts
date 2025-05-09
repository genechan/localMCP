import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create an MCP server
const server = new McpServer({
  name: "DemoServer",
  version: "1.0.0",
});

// Add a tool: Performs addition
server.tool(
  "add",
  {
    a: z.number().describe("First number"),
    b: z.number().describe("Second number"),
  },
  async ({ a, b }) => ({
    content: [{ type: "text", text: String(a + b) }],
  })
);

// Add a resource: Returns a greeting
server.resource(
  "greeting",
  new ResourceTemplate("greeting://{name}", { list: undefined }),
  async (uri, { name }) => ({
    contents: [{ uri: uri.href, text: `Hello this test works, ${name}!` }],
  })
);

// Start the server with stdio transport
async function startServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log("MCP server is running...");
}

startServer().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});

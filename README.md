<a href="https://clay.earth"><img src="https://assets.clay.earth/emails/assets/logo_badge.png" alt="Clay Logo" width="70"/></a>

# Clay MCP Server

A simple Model Context Protocol (MCP) server for [Clay](https://clay.earth).

## Demo Video
Coming soon!

## Getting Started
### Via Smithery (fastest)
[![smithery badge](https://smithery.ai/badge/@clayhq/clay-mcp)](https://smithery.ai/server/@clayhq/clay-mcp)
1. [Click here to log into Clay and generate your Clay API key](https://web.clay.earth/settings/api-keys).
2. [Visit Clay's Smithery page](https://smithery.ai/server/@clay-inc/clay-mcp) and enter your Clay API key under "Installation".
3. Under Claude > NPM, copy the NPM command and run it in your terminal.

### Manual installation
1. Edit your `claude_desktop_config.json` (in the Claude Desktop app, go to Preferences > Developer > Edit Config)
2. Add the Clay MCP server as below:

```
{
  "mcpServers": {
    "clay-mcp": {
      "command": "npx",
      "args": ["@clayhq/clay-mcp@latest"],
      "env": {
        "CLAY_API_KEY": "YOUR_CLAY_API_KEY"
      }
    }
  }
}
```

## Features
- **Contact Search**: Find contacts by job title, company, location, or specific keywords.
- **Interaction Search**: Retrieve past interactions based on various criteria.
- **Contact Statistics**: Obtain numerical statistics and percentages related to your contacts.
- **Detailed Contact Info**: Access comprehensive information for a specific contact by ID.
- **Add New Contact**: Create new contacts with details like name, phone, email, and more.
- **Add Contact Note**: Create a note associated with a specific contact.
- **Retrieve Groups**: Get all user-defined groups or lists.
- **Create New Group**: Create a new group or list.
- **Update Group**: Update a group's title or modify its members.
- **Retrieve Notes**: Get notes created within a specified date range.
- **Retrieve Events**: Fetch meetings and events scheduled within a specified date range.

## Examples
- "Who in my network works at Google as a Product Manager?"
- "Who have I emailed the most this year?"
- "How many of my contacts are based in New York?"
- "Who is John Smith?"
- "Add a new contact named Jane Doe, who is a Designer at Figma."
- "Save a note for John Smith: 'Follow up about the Q2 report.'"
- "Create a group called 'Investors 2025.'"
- "Add Jane Doe and John Smith to the Investors 2025 group."
- "What notes did I take last week?"
- "What meetings do I have scheduled for tomorrow?"

## More information
Learn more and reach out at the [Clay Library](https://library.clay.earth).

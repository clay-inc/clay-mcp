#!/usr/bin/env node

import { FastMCP } from "fastmcp";
import { z } from "zod";

const server = new FastMCP({
  name: "Clay",
  version: "1.0.5",
  authenticate: async (request) => {
    let apiKey = process.env.CLAY_API_KEY;

    if(request && request.url) {
      try {
        const url = new URL(request.url, "http://localhost");
        const clayApiKey = url.searchParams.get("clayApiKey");

        if(clayApiKey) {
          apiKey = clayApiKey;
        }
      } catch (e) {
        console.error('Error getting api key', e)
      }
    }

    return {
      apiKey,
    }
  }
});

async function callTool(path, params, session) {
  console.log('Calling tool', path, session)
  return fetch(`https://nexum.clay.earth/tools${path}`, {
    body: JSON.stringify(params),
    headers: {
      Authorization: `ApiKey ${session.apiKey}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  }).then((res) => res.text());
}

server.addTool({
  name: "searchContacts",
  description:
    'Search for contacts and return matching people. Use for questions about specific contacts or "who" questions (e.g. "Who did I meet most?" or "who works as an engineer?"). Returns actual contact records for queries needing specific people.',
  parameters: z.object({
    job_title: z
      .array(z.string())
      .describe(
        "If the query refers to a job title, position, or industry, list relevant job titles as they would be on a LinkedIn profile. Examples: Developer should return positions such as 'Software Engineer', 'Full Stack Developer', 'Data Scientist', etc. Banker should return positions such as 'Financial Analyst', 'Investment Banker', 'Credit Analyst', etc. Healthcare industry should return positions such as 'Registered Nurse', 'Physician', 'Medical Director', etc. Legal industry should return positions such as 'Attorney', 'Legal Counsel', 'Paralegal', etc."
      )
      .default([]),
    company_name: z
      .array(z.string())
      .describe(
        "If the query refers to a company or acronym of companies, list company names as they would on a LinkedIn profile."
      )
      .default([]),
    location: z
      .array(z.string())
      .describe(
        'If the query refers to a location (city, state, country, region) where people are located or based, list the locations as they would appear on a LinkedIn profile. For example, if someone asks about "people in New York", return "New York City Metropolitan Area" or if they ask about "contacts in California", return "San Francisco Bay Area", "Greater Los Angeles Area", etc.'
      )
      .default([]),
    query: z
      .string()
      .describe(
        'The raw search query from the user. Must preserve exact intent and details to enable accurate searching, including: relationship qualifiers, interaction metrics, relationship strength, names, companies, locations, dates (specific dates, date ranges, or relative dates like "last week" are required if mentioned by user), job titles, skills, and logical conditions (OR/AND).'
      ),
    keywords: z
      .array(z.string())
      .describe(
        "Extract and list specific keywords related to professional expertise, skills, interests, or hobbies that the user is searching for. For example, if someone asks for 'people who know about machine learning or play tennis', the keywords would be ['machine learning', 'tennis']. Do not include job titles or company names here as those have dedicated fields. Focus on capturing domain expertise, technical skills, personal interests, and hobby-related terms that help identify relevant contacts."
      )
      .default([]),
    limit: z
      .number()
      .describe(
        "The number of contacts to return if the user asks for an amount."
      )
      .default(10),
    exclude_contact_ids: z
      .array(z.number())
      .describe(
        'Used to exclude previously returned contact IDs when the user asks for more results (e.g. "who else" or "show me more"). You should pass all contact IDs from previous searchContacts responses to ensure new results are shown.'
      )
      .optional(),
    sort_instructions: z
      .string()
      .describe(
        'How would you like the results sorted? For example: "most recent contacts" will sort by last interaction date, "closest connections" will sort by interaction count, and "alphabetical" will sort by name. If no sort preference is given, this can be left empty.'
      )
      .optional(),
  }),
  execute: async (params, { session }) => callTool("/search", params, session),
});

server.addTool({
  name: "searchInteractions",
  description:
    'Search for interactions and return matching interactions. Use for questions about specific interactions, "who" questions (e.g. "Who did I meet most?"), finding best friends based on relevance score, or finding recently added/created contacts. Returns actual contact records for queries needing specific interactions.',
  parameters: z.object({
    job_title: z
      .array(z.string())
      .describe(
        "If the query refers to a job title, position, or industry, list relevant job titles as they would be on a LinkedIn profile. Examples: Developer should return positions such as 'Software Engineer', 'Full Stack Developer', 'Data Scientist', etc. Banker should return positions such as 'Financial Analyst', 'Investment Banker', 'Credit Analyst', etc. Healthcare industry should return positions such as 'Registered Nurse', 'Physician', 'Medical Director', etc. Legal industry should return positions such as 'Attorney', 'Legal Counsel', 'Paralegal', etc."
      )
      .default([]),
    company_name: z
      .array(z.string())
      .describe(
        "If the query refers to a company or acronym of companies, list company names as they would on a LinkedIn profile."
      )
      .default([]),
    location: z
      .array(z.string())
      .describe(
        'If the query refers to a location (city, state, country, region) where people are located or based, list the locations as they would appear on a LinkedIn profile. For example, if someone asks about "people in New York", return "New York City Metropolitan Area" or if they ask about "contacts in California", return "San Francisco Bay Area", "Greater Los Angeles Area", etc.'
      )
      .default([]),
    query: z
      .string()
      .describe(
        'The raw search query from the user. Must preserve exact intent and details to enable accurate searching, including: relationship qualifiers, interaction metrics, relationship strength, names, companies, locations, dates (specific dates, date ranges, or relative dates like "last week" are required if mentioned by user), job titles, skills, and logical conditions (OR/AND).'
      ),
    keywords: z
      .array(z.string())
      .describe(
        "Extract and list specific keywords related to professional expertise, skills, interests, or hobbies that the user is searching for. For example, if someone asks for 'people who know about machine learning or play tennis', the keywords would be ['machine learning', 'tennis']. Do not include job titles or company names here as those have dedicated fields. Focus on capturing domain expertise, technical skills, personal interests, and hobby-related terms that help identify relevant contacts."
      )
      .default([]),
    limit: z
      .number()
      .describe(
        "The number of contacts to return if the user asks for an amount."
      )
      .default(10),
    exclude_contact_ids: z
      .array(z.number())
      .describe(
        'Used to exclude previously returned contact IDs when the user asks for more results (e.g. "who else" or "show me more"). You should pass all contact IDs from previous searchContacts responses to ensure new results are shown.'
      )
      .optional(),
    sort_instructions: z
      .string()
      .describe(
        'How would you like the results sorted? For example: "most recent contacts" will sort by last interaction date, "closest connections" will sort by interaction count, and "alphabetical" will sort by name. If no sort preference is given, this can be left empty.'
      )
      .optional(),
  }),
  execute: async (params, { session }) => callTool("/search-interactions", params, session),
});

server.addTool({
  name: "aggregateContacts",
  description:
    'Get numerical statistics and counts ONLY. Returns numbers and percentages, never specific contacts. For counting questions like "how many work at Google?" or "what % are engineers?". Use search endpoint instead for any "who" questions or to get actual contact details.',
  parameters: z.object({
    job_title: z
      .array(z.string())
      .describe(
        "If the query refers to a job title, position, or industry, list relevant job titles as they would be on a LinkedIn profile. Examples: Developer should return positions such as 'Software Engineer', 'Full Stack Developer', 'Data Scientist', etc. Banker should return positions such as 'Financial Analyst', 'Investment Banker', 'Credit Analyst', etc. Healthcare industry should return positions such as 'Registered Nurse', 'Physician', 'Medical Director', etc. Legal industry should return positions such as 'Attorney', 'Legal Counsel', 'Paralegal', etc."
      )
      .default([]),
    company_name: z
      .array(z.string())
      .describe(
        "If the query refers to a company or acronym of companies, list company names as they would on a LinkedIn profile."
      )
      .default([]),
    location: z
      .array(z.string())
      .describe(
        'If the query refers to a location (city, state, country, region) where people are located or based, list the locations as they would appear on a LinkedIn profile. For example, if someone asks about "people in New York", return "New York City Metropolitan Area" or if they ask about "contacts in California", return "San Francisco Bay Area", "Greater Los Angeles Area", etc.'
      )
      .default([]),
    query: z
      .string()
      .describe(
        "The raw search query from the user. This field is required and should contain all the key details extracted from the user's prompt to enable effective database searching and aggregation. For example, if the user asks 'how many people work at Google', preserve both the company filter 'Google' and the fact that they want a count. If they ask 'what are the most common job titles in my network', preserve that they want job titles aggregated and ranked by frequency. The query should maintain any conditions (OR, AND) and aggregation needs to properly build the elasticsearch query."
      ),
  }),
  execute: async (params) => callTool("/aggregate", params),
});

server.addTool({
  name: "getContact",
  description:
    "Get details for a contact by id, including emails, social links, phone numbers, and notes.",
  parameters: z.object({
    contact_id: z
      .number()
      .describe("The ID of the contact to get details for."),
  }),
  execute: async (params, { session }) => callTool("/get-contact", params, session),
});

server.addTool({
  name: "createContact",
  description:
    "Create a new contact record in Clay. This endpoint should only be used when you need to create a completely new contact, not for adding contacts to groups.",
  parameters: z.object({
    first_name: z
      .string()
      .describe("The first name of the contact.")
      .optional(),
    last_name: z.string().describe("The last name of the contact.").optional(),
    phone: z
      .array(z.string())
      .describe("The phone number of the contact.")
      .optional(),
    email: z
      .array(z.string())
      .describe("The email of the contact.")
      .default([]),
    linkedin: z
      .string()
      .describe("The LinkedIn handle of the contact.")
      .optional(),
    website: z
      .array(z.string())
      .describe("The website of the contact.")
      .default([]),
    title: z.string().describe("The job title of the contact.").optional(),
    organization: z
      .string()
      .describe("The organization of the contact.")
      .optional(),
    birthday: z
      .string()
      .describe(
        "The birthday of the contact. Use the format YYYY-MM-DD, if no year is specified use 0, month and day are required."
      )
      .optional(),
  }),
  execute: async (params, { session }) => callTool("/create-contact", params, session),
});

server.addTool({
  name: "createNote",
  description:
    "Create a note for a contact. Only use this when the user explicitly asks to create, add, or save a note.",
  parameters: z.object({
    contact_id: z
      .number()
      .describe("The ID of the contact to add the note to."),
    content: z.string().describe("The content of the note."),
  }),
  execute: async (params, { session }) => callTool("/note", params, session),
});

server.addTool({
  name: "getGroups",
  description: "Get all groups or lists for the user.",
  parameters: z.object({
    limit: z
      .number()
      .describe("The maximum number of groups to return.")
      .optional(),
  }),
  execute: async (params) => callTool("/get-groups", params),
});

server.addTool({
  name: "createGroup",
  description:
    "Create a group or list for the user. If a group with the same name already exists, it will not create a duplicate unless explicitly requested to ignore the check.",
  parameters: z.object({
    title: z.string().describe("The name of the group to create."),
  }),
  execute: async (params) => callTool("/create-group", params),
});

server.addTool({
  name: "updateGroup",
  description:
    "Update a group or list. Use this to update the group title and/or modify its members. When adding or removing contacts, provide ALL contact IDs to add/remove in a single call - do not make multiple calls for individual contacts.",
  parameters: z.object({
    group_id: z.number().describe("The ID of the group or list to update."),
    title: z
      .string()
      .describe("The new name of the group if the user wants to rename it.")
      .optional(),
    add_contact_ids: z
      .array(z.number())
      .describe(
        "A list of contact IDs that should be added to this group. Each ID should be a number representing an existing contact in your network. You can provide multiple IDs to add several contacts at once."
      )
      .default([]),
    remove_contact_ids: z
      .array(z.number())
      .describe(
        "A list of contact IDs that should be removed from this group. Each ID should be a number representing an existing contact in your network. You can provide multiple IDs to remove several contacts at once."
      )
      .default([]),
  }),
  execute: async (params) => callTool("/update-group", params),
});

server.addTool({
  name: "getNotes",
  description:
    'Use ONLY when the user explicitly mentions "note" or "notes" to retrieve notes between two dates (e.g. "what notes from last week?"). Returns notes by creation date only - does NOT search note content or filter by other criteria. NEVER use this tool for finding contacts or any other purpose besides retrieving notes. This tool is strictly prohibited from being used unless "note" or "notes" are explicitly mentioned in the query.',
  parameters: z.object({
    start: z
      .string()
      .describe(
        "Use Date Math with now +/- time intervals. Supported units: d (days), w (weeks), M (months), y (years), h (hours), m (minutes), s (seconds). Examples: now-1d (yesterday), now+2w (2 weeks ahead), now/M (start of month), now+1M/M (start of next month)."
      ),
    end: z
      .string()
      .describe(
        "Use Date Math with now +/- time intervals. Supported units: d (days), w (weeks), M (months), y (years), h (hours), m (minutes), s (seconds). Examples: now-1d (yesterday), now+2w (2 weeks ahead), now/M (start of month), now+1M/M (start of next month)."
      ),
  }),
  execute: async (params, { session }) => callTool("/moments/notes", params, session),
});

server.addTool({
  name: "getEvents",
  description:
    'Use this tool ONLY to fetch meetings/events in a date range (e.g. "what meetings next week?", "show calendar for tomorrow"). DO NOT use for counting meetings, analyzing patterns, or finding frequent participants.',
  parameters: z.object({
    start: z
      .string()
      .describe(
        "Use Date Math with now +/- time intervals. Supported units: d (days), w (weeks), M (months), y (years), h (hours), m (minutes), s (seconds). Examples: now-1d (yesterday), now+2w (2 weeks ahead), now/M (start of month), now+1M/M (start of next month)."
      ),
    end: z
      .string()
      .describe(
        "Use Date Math with now +/- time intervals. Supported units: d (days), w (weeks), M (months), y (years), h (hours), m (minutes), s (seconds). Examples: now-1d (yesterday), now+2w (2 weeks ahead), now/M (start of month), now+1M/M (start of next month)."
      ),
  }),
  execute: async (params, { session }) => callTool("/moments/events", params, session),
});

const httpTransport = process.env.TRANSPORT === "http";

server.start({
  transportType: httpTransport ? "httpStream" : "stdio",
  httpStream: {
    port: process.env.PORT ? Number.parseInt(process.env.PORT) : undefined,
  }
});

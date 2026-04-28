import { config } from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env — try workspace root first, then fall back to server/.env
config({ path: path.resolve(__dirname, '../../.env') });
if (!process.env.DATABASE_URL) {
  config({ path: path.resolve(__dirname, '../../server/.env') });
}

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { prisma } from './lib/prisma.js';

const server = new McpServer({
  name: 'ai-quiz',
  version: '1.0.0',
  description:
    'MCP server for managing AI Quiz questions — create and list questions directly from any MCP-compatible client.',
});

// ─── Tool: create_question ───────────────────────────────────────────────────

server.registerTool(
  'create_question',
  {
    title: 'Create Question',
    description: 'Create a new quiz question with answer and explanation',
    inputSchema: z.object({
      question: z.string().min(1).describe('The quiz question text'),
      answer: z.string().min(1).describe('The correct answer'),
      explanation: z
        .string()
        .min(1)
        .describe('Explanation of why this is the correct answer'),
    }),
  },
  async ({ question, answer, explanation }) => {
    const created = await prisma.question.create({
      data: { question, answer, explanation },
    });

    return {
      content: [
        {
          type: 'text' as const,
          text: [
            `✅ Question created successfully!`,
            ``,
            `📋 ID: ${created.id}`,
            `❓ Question: ${created.question}`,
            `✔️  Answer: ${created.answer}`,
            `💡 Explanation: ${created.explanation}`,
          ].join('\n'),
        },
      ],
    };
  },
);

// ─── Tool: list_questions ────────────────────────────────────────────────────

server.registerTool(
  'list_questions',
  {
    title: 'List Questions',
    description: 'List all quiz questions, optionally filtered by search text',
    inputSchema: z.object({
      search: z
        .string()
        .optional()
        .describe(
          'Optional text to filter questions by (case-insensitive match on question text)',
        ),
    }),
  },
  async ({ search }) => {
    const questions = await prisma.question.findMany({
      orderBy: { id: 'asc' },
      ...(search
        ? {
            where: {
              question: { contains: search, mode: 'insensitive' as const },
            },
          }
        : {}),
    });

    if (questions.length === 0) {
      return {
        content: [
          {
            type: 'text' as const,
            text: search
              ? `No questions found matching "${search}".`
              : 'No questions found in the database.',
          },
        ],
      };
    }

    const searchSuffix = search ? ` matching "${search}"` : '';

    const formatted = questions
      .map(
        (q) =>
          `[${q.id}] ${q.question}\n    Answer: ${q.answer}\n    Explanation: ${q.explanation}`,
      )
      .join('\n\n');

    return {
      content: [
        {
          type: 'text' as const,
          text: `📚 Found ${questions.length} question${questions.length === 1 ? '' : 's'}${searchSuffix}:\n\n${formatted}`,
        },
      ],
    };
  },
);

// ─── Start Server ────────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);
console.error('🚀 AI Quiz MCP server running on stdio');

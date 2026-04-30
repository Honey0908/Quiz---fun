import { config } from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';

// Load .env for local development (in production, env vars are set by the platform)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

config({ path: path.resolve(root, '.env') });
if (!process.env.DATABASE_URL) {
  config({ path: path.resolve(root, '..', '.env') });
}
if (!process.env.DATABASE_URL) {
  config({ path: path.resolve(root, '..', 'server', '.env') });
}

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js';
import express from 'express';
import cors from 'cors';
import { z } from 'zod';
import { prisma } from './lib/prisma.js';

// ─── MCP Server Factory ─────────────────────────────────────────────────────

function createMcpServer() {
  const server = new McpServer({
    name: 'ai-quiz',
    version: '1.0.0',
    description:
      'MCP server for managing AI Quiz questions — create and list questions directly from any MCP-compatible client.',
  });

  // ── Tool: create_question ──────────────────────────────────────────────────

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

  // ── Tool: list_questions ───────────────────────────────────────────────────

  server.registerTool(
    'list_questions',
    {
      title: 'List Questions',
      description:
        'List all quiz questions, optionally filtered by search text',
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

  // ── Tool: get_question ─────────────────────────────────────────────────────

  server.registerTool(
    'get_question',
    {
      title: 'Get Question',
      description: 'Fetch a single quiz question by its ID',
      inputSchema: z.object({
        id: z.number().int().positive().describe('The question ID to fetch'),
      }),
    },
    async ({ id }) => {
      const question = await prisma.question.findUnique({ where: { id } });

      if (!question) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `❌ Question with ID ${id} not found.`,
            },
          ],
          isError: true,
        };
      }

      return {
        content: [
          {
            type: 'text' as const,
            text: [
              `📋 Question #${question.id}`,
              ``,
              `❓ Question: ${question.question}`,
              `✔️  Answer: ${question.answer}`,
              `💡 Explanation: ${question.explanation}`,
              `📅 Created: ${question.createdAt.toISOString()}`,
              `🔄 Updated: ${question.updatedAt.toISOString()}`,
            ].join('\n'),
          },
        ],
      };
    },
  );

  // ── Tool: update_question ──────────────────────────────────────────────────

  server.registerTool(
    'update_question',
    {
      title: 'Update Question',
      description:
        'Update an existing quiz question. Provide only the fields you want to change.',
      inputSchema: z.object({
        id: z.number().int().positive().describe('The question ID to update'),
        question: z
          .string()
          .min(1)
          .optional()
          .describe('New question text (optional)'),
        answer: z
          .string()
          .min(1)
          .optional()
          .describe('New answer text (optional)'),
        explanation: z
          .string()
          .min(1)
          .optional()
          .describe('New explanation text (optional)'),
      }),
    },
    async ({ id, question, answer, explanation }) => {
      const data: Record<string, string> = {};
      if (question !== undefined) data.question = question;
      if (answer !== undefined) data.answer = answer;
      if (explanation !== undefined) data.explanation = explanation;

      if (Object.keys(data).length === 0) {
        return {
          content: [
            {
              type: 'text' as const,
              text: '⚠️ No fields provided to update. Provide at least one of: question, answer, explanation.',
            },
          ],
          isError: true,
        };
      }

      try {
        const updated = await prisma.question.update({
          where: { id },
          data,
        });

        return {
          content: [
            {
              type: 'text' as const,
              text: [
                `✅ Question #${updated.id} updated successfully!`,
                ``,
                `❓ Question: ${updated.question}`,
                `✔️  Answer: ${updated.answer}`,
                `💡 Explanation: ${updated.explanation}`,
              ].join('\n'),
            },
          ],
        };
      } catch (error: unknown) {
        const prismaError = error as { code?: string };
        if (prismaError.code === 'P2025') {
          return {
            content: [
              {
                type: 'text' as const,
                text: `❌ Question with ID ${id} not found.`,
              },
            ],
            isError: true,
          };
        }
        throw error;
      }
    },
  );

  // ── Tool: delete_question ──────────────────────────────────────────────────

  server.registerTool(
    'delete_question',
    {
      title: 'Delete Question',
      description: 'Permanently delete a quiz question by its ID',
      inputSchema: z.object({
        id: z.number().int().positive().describe('The question ID to delete'),
      }),
    },
    async ({ id }) => {
      try {
        const deleted = await prisma.question.delete({ where: { id } });

        return {
          content: [
            {
              type: 'text' as const,
              text: `🗑️ Question #${deleted.id} deleted successfully!\n\nDeleted question: "${deleted.question}"`,
            },
          ],
        };
      } catch (error: unknown) {
        const prismaError = error as { code?: string };
        if (prismaError.code === 'P2025') {
          return {
            content: [
              {
                type: 'text' as const,
                text: `❌ Question with ID ${id} not found.`,
              },
            ],
            isError: true,
          };
        }
        throw error;
      }
    },
  );

  // ── Tool: bulk_create_questions ────────────────────────────────────────────

  server.registerTool(
    'bulk_create_questions',
    {
      title: 'Bulk Create Questions',
      description:
        'Create multiple quiz questions at once. Provide an array of questions.',
      inputSchema: z.object({
        questions: z
          .array(
            z.object({
              question: z.string().min(1).describe('The quiz question text'),
              answer: z.string().min(1).describe('The correct answer'),
              explanation: z
                .string()
                .min(1)
                .describe('Explanation of why this is the correct answer'),
            }),
          )
          .min(1)
          .describe('Array of questions to create'),
      }),
    },
    async ({ questions }) => {
      const created = await prisma.$transaction(
        questions.map((q) =>
          prisma.question.create({
            data: {
              question: q.question,
              answer: q.answer,
              explanation: q.explanation,
            },
          }),
        ),
      );

      const summary = created
        .map((q) => `  • [${q.id}] ${q.question}`)
        .join('\n');

      return {
        content: [
          {
            type: 'text' as const,
            text: `✅ Successfully created ${created.length} question${created.length === 1 ? '' : 's'}!\n\n${summary}`,
          },
        ],
      };
    },
  );

  // ── Tool: get_quiz_stats ───────────────────────────────────────────────────

  server.registerTool(
    'get_quiz_stats',
    {
      title: 'Get Quiz Stats',
      description:
        'Get statistics about the quiz question database — total count, date range, and most recent question.',
      inputSchema: z.object({}),
    },
    async () => {
      const [totalCount, oldest, newest] = await Promise.all([
        prisma.question.count(),
        prisma.question.findFirst({ orderBy: { createdAt: 'asc' } }),
        prisma.question.findFirst({ orderBy: { createdAt: 'desc' } }),
      ]);

      if (totalCount === 0) {
        return {
          content: [
            {
              type: 'text' as const,
              text: '📊 Quiz Stats\n\nNo questions in the database yet.',
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text' as const,
            text: [
              `📊 Quiz Statistics`,
              ``,
              `📝 Total questions: ${totalCount}`,
              `📅 Oldest question: ${oldest!.createdAt.toISOString()} — "${oldest!.question}"`,
              `🆕 Newest question: ${newest!.createdAt.toISOString()} — "${newest!.question}"`,
            ].join('\n'),
          },
        ],
      };
    },
  );

  // ── Tool: export_questions ─────────────────────────────────────────────────

  server.registerTool(
    'export_questions',
    {
      title: 'Export Questions',
      description:
        'Export all quiz questions as structured JSON data for backup or migration',
      inputSchema: z.object({}),
    },
    async () => {
      const questions = await prisma.question.findMany({
        orderBy: { id: 'asc' },
      });

      if (questions.length === 0) {
        return {
          content: [
            {
              type: 'text' as const,
              text: '📦 No questions to export.',
            },
          ],
        };
      }

      const exportData = {
        exportedAt: new Date().toISOString(),
        totalQuestions: questions.length,
        questions: questions.map((q) => ({
          id: q.id,
          question: q.question,
          answer: q.answer,
          explanation: q.explanation,
          createdAt: q.createdAt.toISOString(),
          updatedAt: q.updatedAt.toISOString(),
        })),
      };

      return {
        content: [
          {
            type: 'text' as const,
            text: `📦 Exported ${questions.length} question${questions.length === 1 ? '' : 's'}:\n\n${JSON.stringify(exportData, null, 2)}`,
          },
        ],
      };
    },
  );

  return server;
}

// ─── Express + Streamable HTTP Transport ─────────────────────────────────────

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use(
  cors({
    origin: '*',
    exposedHeaders: ['Mcp-Session-Id'],
  }),
);

// Store transports by session ID
const transports = new Map<string, StreamableHTTPServerTransport>();

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root — so Railway/browsers see a response at /
app.get('/', (_req, res) => {
  res.json({
    name: 'ai-quiz-mcp-server',
    status: 'running',
    mcp_endpoint: '/mcp',
    health: '/health',
  });
});

// MCP POST — handles initialization + JSON-RPC requests
app.post('/mcp', async (req, res) => {
  const sessionId = req.headers['mcp-session-id'] as string | undefined;

  try {
    if (sessionId && transports.has(sessionId)) {
      const transport = transports.get(sessionId)!;
      await transport.handleRequest(req, res, req.body);
    } else if (!sessionId && isInitializeRequest(req.body)) {
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        onsessioninitialized: (sid) => {
          transports.set(sid, transport);
        },
      });

      transport.onclose = () => {
        if (transport.sessionId) {
          transports.delete(transport.sessionId);
        }
      };

      const server = createMcpServer();
      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);
    } else {
      res.status(400).json({
        jsonrpc: '2.0',
        error: { code: -32000, message: 'Bad Request: No valid session ID' },
        id: null,
      });
    }
  } catch (error) {
    console.error('Error handling MCP request:', error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: '2.0',
        error: { code: -32603, message: 'Internal server error' },
        id: null,
      });
    }
  }
});

// MCP GET — SSE stream for server-to-client notifications
app.get('/mcp', async (req, res) => {
  const sessionId = req.headers['mcp-session-id'] as string | undefined;
  if (!sessionId || !transports.has(sessionId)) {
    res.status(400).send('Invalid or missing session ID');
    return;
  }
  await transports.get(sessionId)!.handleRequest(req, res);
});

// MCP DELETE — session termination
app.delete('/mcp', async (req, res) => {
  const sessionId = req.headers['mcp-session-id'] as string | undefined;
  if (!sessionId || !transports.has(sessionId)) {
    res.status(400).send('Invalid or missing session ID');
    return;
  }
  await transports.get(sessionId)!.handleRequest(req, res);
});

// ─── Start Server ────────────────────────────────────────────────────────────

const httpServer = app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`🚀 AI Quiz MCP server listening on http://0.0.0.0:${PORT}/mcp`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down...');
  httpServer.close();
  for (const [sid, transport] of transports) {
    await transport.close();
    transports.delete(sid);
  }
  await prisma.$disconnect();
  process.exit(0);
});

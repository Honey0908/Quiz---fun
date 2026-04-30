import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';

export function registerListQuestions(server: McpServer) {
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
}

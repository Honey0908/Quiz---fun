import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';

export function registerBulkCreateQuestions(server: McpServer) {
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
}

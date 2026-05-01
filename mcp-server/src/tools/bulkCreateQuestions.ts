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
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
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
    async ({ questions }, { sendNotification, _meta }) => {
      const progressToken = _meta?.progressToken;
      const total = questions.length;

      // Inform server logs (visible to client if logging capability negotiated)
      await server.server.sendLoggingMessage({
        level: 'info',
        data: `bulk_create_questions: starting batch of ${total} question(s)`,
      });

      const created: Awaited<ReturnType<typeof prisma.question.create>>[] = [];
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const row = await prisma.question.create({
          data: {
            question: q.question,
            answer: q.answer,
            explanation: q.explanation,
          },
        });
        created.push(row);

        if (progressToken !== undefined) {
          await sendNotification({
            method: 'notifications/progress',
            params: {
              progressToken,
              progress: i + 1,
              total,
              message: `Created ${i + 1}/${total}: ${q.question.slice(0, 60)}`,
            },
          });
        }
      }

      await server.server.sendLoggingMessage({
        level: 'info',
        data: `bulk_create_questions: created ${created.length} question(s)`,
      });

      // Notify connected clients that resources have changed
      server.sendResourceListChanged();

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

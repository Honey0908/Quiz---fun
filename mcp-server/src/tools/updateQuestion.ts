import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';

export function registerUpdateQuestion(server: McpServer) {
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

        // Notify connected clients that resources have changed
        server.sendResourceListChanged();

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
}

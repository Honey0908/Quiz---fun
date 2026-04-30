import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';

export function registerGetQuestion(server: McpServer) {
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
}

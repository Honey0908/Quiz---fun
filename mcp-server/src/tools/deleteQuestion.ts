import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';

export function registerDeleteQuestion(server: McpServer) {
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
}

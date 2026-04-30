import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';

export function registerGetQuizStats(server: McpServer) {
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
}

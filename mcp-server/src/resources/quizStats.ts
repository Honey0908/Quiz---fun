import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { prisma } from '../lib/prisma.js';

export function registerQuizStatsResource(server: McpServer) {
  server.registerResource(
    'quiz_stats',
    'quiz://stats',
    {
      description:
        'Quiz database statistics — total questions, date range, and recent activity',
      mimeType: 'application/json',
    },
    async () => {
      const [totalCount, oldest, newest] = await Promise.all([
        prisma.question.count(),
        prisma.question.findFirst({ orderBy: { createdAt: 'asc' } }),
        prisma.question.findFirst({ orderBy: { createdAt: 'desc' } }),
      ]);

      const stats = {
        totalQuestions: totalCount,
        oldestQuestion: oldest
          ? {
              id: oldest.id,
              question: oldest.question,
              createdAt: oldest.createdAt.toISOString(),
            }
          : null,
        newestQuestion: newest
          ? {
              id: newest.id,
              question: newest.question,
              createdAt: newest.createdAt.toISOString(),
            }
          : null,
      };

      return {
        contents: [
          {
            uri: 'quiz://stats',
            mimeType: 'application/json',
            text: JSON.stringify(stats, null, 2),
          },
        ],
      };
    },
  );
}

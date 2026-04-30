import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { prisma } from '../lib/prisma.js';

export function registerAllQuestionsResource(server: McpServer) {
  server.registerResource(
    'all_questions',
    'quiz://questions',
    {
      description: 'Browse all quiz questions in the database',
      mimeType: 'application/json',
    },
    async () => {
      const questions = await prisma.question.findMany({
        orderBy: { id: 'asc' },
      });

      return {
        contents: [
          {
            uri: 'quiz://questions',
            mimeType: 'application/json',
            text: JSON.stringify(questions, null, 2),
          },
        ],
      };
    },
  );
}

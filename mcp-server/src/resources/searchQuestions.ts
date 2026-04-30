import {
  type McpServer,
  ResourceTemplate,
} from '@modelcontextprotocol/sdk/server/mcp.js';
import { prisma } from '../lib/prisma.js';

export function registerSearchQuestionsResource(server: McpServer) {
  server.registerResource(
    'search_questions',
    new ResourceTemplate('quiz://search/{term}', {
      list: undefined,
    }),
    {
      description:
        'Search quiz questions by keyword — returns all questions matching the search term',
      mimeType: 'application/json',
    },
    async (uri, { term }) => {
      const searchTerm = decodeURIComponent(term as string);
      const questions = await prisma.question.findMany({
        where: {
          OR: [
            { question: { contains: searchTerm, mode: 'insensitive' } },
            { answer: { contains: searchTerm, mode: 'insensitive' } },
            { explanation: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        orderBy: { id: 'asc' },
      });

      return {
        contents: [
          {
            uri: uri.href,
            mimeType: 'application/json',
            text: JSON.stringify(
              {
                searchTerm,
                totalResults: questions.length,
                questions,
              },
              null,
              2,
            ),
          },
        ],
      };
    },
  );
}

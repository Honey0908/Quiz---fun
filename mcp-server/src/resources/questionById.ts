import {
  type McpServer,
  ResourceTemplate,
} from '@modelcontextprotocol/sdk/server/mcp.js';
import { prisma } from '../lib/prisma.js';

export function registerQuestionByIdResource(server: McpServer) {
  server.registerResource(
    'question_by_id',
    new ResourceTemplate('quiz://questions/{id}', {
      list: async () => {
        const questions = await prisma.question.findMany({
          select: { id: true, question: true },
          orderBy: { id: 'asc' },
        });
        return {
          resources: questions.map((q) => ({
            uri: `quiz://questions/${q.id}`,
            name: `Question #${q.id}: ${q.question.substring(0, 60)}`,
          })),
        };
      },
      complete: {
        id: async (value) => {
          const questions = await prisma.question.findMany({
            where: {
              id: { gte: parseInt(value) || 0 },
            },
            select: { id: true },
            take: 10,
            orderBy: { id: 'asc' },
          });
          return questions.map((q) => String(q.id));
        },
      },
    }),
    {
      description: 'Fetch a single quiz question by its ID',
      mimeType: 'application/json',
    },
    async (uri, { id }) => {
      const questionId = parseInt(id as string);
      if (isNaN(questionId)) {
        return {
          contents: [
            {
              uri: uri.href,
              mimeType: 'text/plain',
              text: `Invalid question ID: "${id}"`,
            },
          ],
        };
      }

      const question = await prisma.question.findUnique({
        where: { id: questionId },
      });

      if (!question) {
        return {
          contents: [
            {
              uri: uri.href,
              mimeType: 'text/plain',
              text: `Question with ID ${questionId} not found.`,
            },
          ],
        };
      }

      return {
        contents: [
          {
            uri: uri.href,
            mimeType: 'application/json',
            text: JSON.stringify(question, null, 2),
          },
        ],
      };
    },
  );
}

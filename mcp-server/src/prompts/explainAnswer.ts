import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';

export function registerExplainAnswerPrompt(server: McpServer) {
  server.registerPrompt(
    'explain-answer',
    {
      title: 'Explain Answer',
      description:
        'Generate a detailed, educational explanation for a quiz question and its answer',
      argsSchema: {
        questionId: z.string().describe('The ID of the question to explain'),
      },
    },
    async ({ questionId }) => {
      const id = parseInt(questionId);
      const question = await prisma.question.findUnique({ where: { id } });

      if (!question) {
        return {
          messages: [
            {
              role: 'assistant' as const,
              content: {
                type: 'text' as const,
                text: `Question with ID ${questionId} not found in the database.`,
              },
            },
          ],
        };
      }

      return {
        messages: [
          {
            role: 'assistant' as const,
            content: {
              type: 'text' as const,
              text: [
                `You are an expert AI/tech educator. Provide a detailed, engaging explanation for the following quiz question.`,
                ``,
                `**Question:** ${question.question}`,
                `**Correct Answer:** ${question.answer}`,
                `**Current Explanation:** ${question.explanation}`,
                ``,
                `Please provide:`,
                `1. **Deep explanation** — Why is this the correct answer? Explain the underlying concepts.`,
                `2. **Common misconceptions** — What wrong answers might people give and why?`,
                `3. **Real-world context** — How does this concept apply in practice?`,
                `4. **Fun fact** — An interesting related tidbit that makes the topic memorable`,
                `5. **Learn more** — Suggest one resource (docs, article, video) to learn more about this topic`,
              ].join('\n'),
            },
          },
        ],
      };
    },
  );
}

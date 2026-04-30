import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';

export function registerReviewQuestionPrompt(server: McpServer) {
  server.registerPrompt(
    'review-question',
    {
      title: 'Review Question',
      description:
        'Review an existing quiz question for quality, accuracy, and clarity',
      argsSchema: {
        questionId: z.string().describe('The ID of the question to review'),
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
                `You are an expert quiz reviewer. Please review the following quiz question for quality, accuracy, and clarity.`,
                ``,
                `## Question to Review`,
                ``,
                `**Question:** ${question.question}`,
                `**Answer:** ${question.answer}`,
                `**Explanation:** ${question.explanation}`,
                ``,
                `## Review Criteria`,
                ``,
                `Please evaluate and provide feedback on:`,
                `1. **Accuracy** — Is the answer factually correct and up to date?`,
                `2. **Clarity** — Is the question unambiguous? Would teams understand it when read aloud?`,
                `3. **Difficulty** — Rate as easy/medium/advanced and explain why`,
                `4. **Answer quality** — Is the answer concise and definitive?`,
                `5. **Explanation quality** — Does it teach something valuable?`,
                `6. **Suggested improvements** — Any rewording or corrections needed?`,
                ``,
                `If changes are needed, provide the improved version in JSON format:`,
                `{ "question": "...", "answer": "...", "explanation": "..." }`,
              ].join('\n'),
            },
          },
        ],
      };
    },
  );
}

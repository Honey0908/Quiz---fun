import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';

export function registerCreateQuestion(server: McpServer) {
  server.registerTool(
    'create_question',
    {
      title: 'Create Question',
      description: 'Create a new quiz question with answer and explanation',
      inputSchema: z.object({
        question: z.string().min(1).describe('The quiz question text'),
        answer: z.string().min(1).describe('The correct answer'),
        explanation: z
          .string()
          .min(1)
          .describe('Explanation of why this is the correct answer'),
      }),
    },
    async ({ question, answer, explanation }) => {
      const created = await prisma.question.create({
        data: { question, answer, explanation },
      });

      // Notify connected clients that resources have changed
      server.sendResourceListChanged();

      return {
        content: [
          {
            type: 'text' as const,
            text: [
              `✅ Question created successfully!`,
              ``,
              `📋 ID: ${created.id}`,
              `❓ Question: ${created.question}`,
              `✔️  Answer: ${created.answer}`,
              `💡 Explanation: ${created.explanation}`,
            ].join('\n'),
          },
        ],
      };
    },
  );
}

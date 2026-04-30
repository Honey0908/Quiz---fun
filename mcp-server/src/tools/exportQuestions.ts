import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';

export function registerExportQuestions(server: McpServer) {
  server.registerTool(
    'export_questions',
    {
      title: 'Export Questions',
      description:
        'Export all quiz questions as structured JSON data for backup or migration',
      inputSchema: z.object({}),
    },
    async () => {
      const questions = await prisma.question.findMany({
        orderBy: { id: 'asc' },
      });

      if (questions.length === 0) {
        return {
          content: [
            {
              type: 'text' as const,
              text: '📦 No questions to export.',
            },
          ],
        };
      }

      const exportData = {
        exportedAt: new Date().toISOString(),
        totalQuestions: questions.length,
        questions: questions.map((q) => ({
          id: q.id,
          question: q.question,
          answer: q.answer,
          explanation: q.explanation,
          createdAt: q.createdAt.toISOString(),
          updatedAt: q.updatedAt.toISOString(),
        })),
      };

      return {
        content: [
          {
            type: 'text' as const,
            text: `📦 Exported ${questions.length} question${questions.length === 1 ? '' : 's'}:\n\n${JSON.stringify(exportData, null, 2)}`,
          },
        ],
      };
    },
  );
}

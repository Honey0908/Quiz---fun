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
      annotations: {
        readOnlyHint: true,
        openWorldHint: false,
      },
      inputSchema: z.object({}),
    },
    async (_args, { sendNotification, _meta }) => {
      const progressToken = _meta?.progressToken;

      const sendProgress = async (
        progress: number,
        total: number,
        message: string,
      ) => {
        if (progressToken === undefined) return;
        await sendNotification({
          method: 'notifications/progress',
          params: { progressToken, progress, total, message },
        });
      };

      await sendProgress(0, 3, 'Counting questions…');
      const total = await prisma.question.count();

      await sendProgress(1, 3, `Fetching ${total} question(s)…`);
      const questions = await prisma.question.findMany({
        orderBy: { id: 'asc' },
      });

      if (questions.length === 0) {
        await sendProgress(3, 3, 'Nothing to export.');
        return {
          content: [
            {
              type: 'text' as const,
              text: '📦 No questions to export.',
            },
          ],
        };
      }

      await sendProgress(2, 3, 'Serializing export payload…');
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

      await sendProgress(3, 3, 'Export complete.');
      await server.server.sendLoggingMessage({
        level: 'info',
        data: `export_questions: exported ${questions.length} question(s)`,
      });

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

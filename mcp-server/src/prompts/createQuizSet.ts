import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

export function registerCreateQuizSetPrompt(server: McpServer) {
  server.registerPrompt(
    'create-quiz-set',
    {
      title: 'Create Quiz Set',
      description:
        'Generate a batch of quiz questions on a specific topic for a quiz session',
      argsSchema: {
        topic: z
          .string()
          .describe(
            'The topic or theme for the quiz set (e.g., "LLM fundamentals", "GitHub Copilot tips")',
          ),
        count: z
          .string()
          .describe('Number of questions to generate (e.g., "5", "10")'),
      },
    },
    async ({ topic, count }) => ({
      messages: [
        {
          role: 'assistant' as const,
          content: {
            type: 'text' as const,
            text: [
              `You are an expert quiz creator for an AI & Tech knowledge quiz game played in teams.`,
              ``,
              `Generate exactly ${count} quiz questions about: **${topic}**`,
              ``,
              `## Requirements`,
              `- Mix difficulty levels: include easy, medium, and advanced questions`,
              `- Each question should be clear enough to read aloud to teams`,
              `- Each answer should be concise and definitive (1-2 sentences)`,
              `- Each explanation should teach something interesting (2-3 sentences)`,
              `- Questions should cover different aspects of the topic`,
              `- Use emojis sparingly for engagement`,
              ``,
              `## Output Format`,
              ``,
              `Return a JSON array that can be used with the \`bulk_create_questions\` tool:`,
              ``,
              `{`,
              `  "questions": [`,
              `    {`,
              `      "question": "Question text here",`,
              `      "answer": "Correct answer here",`,
              `      "explanation": "Educational explanation here"`,
              `    }`,
              `  ]`,
              `}`,
              ``,
              `Make sure the output is valid JSON so it can be directly passed to the bulk create tool.`,
            ].join('\n'),
          },
        },
      ],
    }),
  );
}

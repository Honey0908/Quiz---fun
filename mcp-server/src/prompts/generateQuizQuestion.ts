import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

export function registerGenerateQuizQuestionPrompt(server: McpServer) {
  server.registerPrompt(
    'generate-quiz-question',
    {
      title: 'Generate Quiz Question',
      description:
        'Generate a new AI/tech quiz question on a given topic and difficulty level',
      argsSchema: {
        topic: z
          .string()
          .describe(
            'The topic for the question (e.g., "GitHub Copilot", "RAG", "prompt engineering")',
          ),
        difficulty: z
          .enum(['easy', 'medium', 'advanced'])
          .describe('Difficulty level of the question'),
      },
    },
    async ({ topic, difficulty }) => ({
      messages: [
        {
          role: 'assistant' as const,
          content: {
            type: 'text' as const,
            text: [
              `You are an expert quiz question creator for an AI & Tech knowledge quiz game.`,
              `The quiz is played in teams and questions are read aloud, so clarity matters.`,
              ``,
              `Generate exactly ONE quiz question following these rules:`,
              `- Topic: ${topic}`,
              `- Difficulty: ${difficulty}`,
              `- The question should be clear, specific, and have one definitive correct answer`,
              `- Include a concise answer (1-2 sentences max)`,
              `- Include an explanation (2-3 sentences) that teaches something interesting`,
              `- Use emojis sparingly in the question text for engagement`,
              ``,
              `Respond in this exact JSON format:`,
              `{`,
              `  "question": "Your question here",`,
              `  "answer": "The correct answer",`,
              `  "explanation": "Why this is correct and an interesting fact"`,
              `}`,
            ].join('\n'),
          },
        },
      ],
    }),
  );
}

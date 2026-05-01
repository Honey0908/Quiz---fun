import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { completable } from '@modelcontextprotocol/sdk/server/completable.js';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { TOPIC_SUGGESTIONS } from '../lib/suggestions.js';

/**
 * Sampling-powered tool: asks the CLIENT's LLM to generate a quiz question,
 * then parses the response and saves it to the database.
 *
 * Flow:  tool invoked → server calls `createMessage` (sampling) → client's LLM
 * generates JSON → server parses & persists → returns saved question.
 */
export function registerGenerateAndSaveQuestion(server: McpServer) {
  server.registerTool(
    'generate_and_save_question',
    {
      title: 'Generate & Save Question (AI)',
      description:
        'Use the client LLM (via MCP Sampling) to generate a quiz question on a given topic, then save it to the database automatically.',
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true, // involves LLM call via sampling
      },
      inputSchema: z.object({
        topic: completable(
          z
            .string()
            .min(1)
            .describe(
              'The topic for the generated question (e.g. "JavaScript closures")',
            ),
          (value: string) =>
            TOPIC_SUGGESTIONS.filter((t: string) =>
              t.toLowerCase().startsWith(value.toLowerCase()),
            ),
        ),
        difficulty: z
          .enum(['easy', 'medium', 'hard'])
          .optional()
          .describe('Difficulty level (default: medium)'),
      }),
    },
    async ({ topic, difficulty }) => {
      const level = difficulty ?? 'medium';

      await server.server.sendLoggingMessage({
        level: 'info',
        data: `generate_and_save_question: requesting LLM to create a ${level} question on "${topic}"`,
      });

      // ── Step 1: Ask the client's LLM via Sampling ────────────────────────
      const systemPrompt = [
        'You are a quiz question generator.',
        'Generate exactly ONE quiz question in valid JSON with these fields:',
        '  "question": string — the quiz question',
        '  "answer": string — the correct answer',
        '  "explanation": string — a brief explanation of why this is correct',
        '',
        'Rules:',
        `- Topic: ${topic}`,
        `- Difficulty: ${level}`,
        '- Output ONLY the raw JSON object, no markdown fences, no extra text.',
      ].join('\n');

      let samplingResult;
      try {
        samplingResult = await server.server.createMessage({
          messages: [
            {
              role: 'user',
              content: {
                type: 'text',
                text: `Generate a ${level} quiz question about: ${topic}`,
              },
            },
          ],
          systemPrompt,
          maxTokens: 500,
          includeContext: 'none',
        });
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: 'text' as const,
              text: `❌ Sampling failed — the client may not support sampling.\n\nError: ${msg}`,
            },
          ],
          isError: true,
        };
      }

      // ── Step 2: Parse the LLM response ───────────────────────────────────
      if (samplingResult.content.type !== 'text') {
        return {
          content: [
            {
              type: 'text' as const,
              text:
                '❌ Expected a text response from sampling, got: ' +
                samplingResult.content.type,
            },
          ],
          isError: true,
        };
      }

      const rawText = samplingResult.content.text;

      // Strip potential markdown fences the LLM might sneak in
      const cleaned = rawText
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();

      let parsed: { question: string; answer: string; explanation: string };
      try {
        parsed = JSON.parse(cleaned);
      } catch {
        return {
          content: [
            {
              type: 'text' as const,
              text: `❌ Failed to parse LLM output as JSON.\n\nRaw response:\n${rawText}`,
            },
          ],
          isError: true,
        };
      }

      // Validate required fields
      if (!parsed.question || !parsed.answer || !parsed.explanation) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `❌ LLM response missing required fields (question, answer, explanation).\n\nParsed:\n${JSON.stringify(parsed, null, 2)}`,
            },
          ],
          isError: true,
        };
      }

      // ── Step 3: Save to database ─────────────────────────────────────────
      const created = await prisma.question.create({
        data: {
          question: parsed.question,
          answer: parsed.answer,
          explanation: parsed.explanation,
        },
      });

      server.sendResourceListChanged();

      await server.server.sendLoggingMessage({
        level: 'info',
        data: `generate_and_save_question: saved question #${created.id} on "${topic}"`,
      });

      return {
        content: [
          {
            type: 'text' as const,
            text: [
              `🤖 AI-generated question saved!`,
              ``,
              `📋 ID: ${created.id}`,
              `🎯 Topic: ${topic}`,
              `📊 Difficulty: ${level}`,
              `❓ Question: ${created.question}`,
              `✔️  Answer: ${created.answer}`,
              `💡 Explanation: ${created.explanation}`,
              ``,
              `ℹ️  Model used: ${samplingResult.model}`,
            ].join('\n'),
          },
        ],
      };
    },
  );
}

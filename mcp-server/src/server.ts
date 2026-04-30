import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

// ─── Tools ───────────────────────────────────────────────────────────────────
import { registerCreateQuestion } from './tools/createQuestion.js';
import { registerListQuestions } from './tools/listQuestions.js';
import { registerGetQuestion } from './tools/getQuestion.js';
import { registerUpdateQuestion } from './tools/updateQuestion.js';
import { registerDeleteQuestion } from './tools/deleteQuestion.js';
import { registerBulkCreateQuestions } from './tools/bulkCreateQuestions.js';
import { registerGetQuizStats } from './tools/getQuizStats.js';
import { registerExportQuestions } from './tools/exportQuestions.js';

// ─── Resources ───────────────────────────────────────────────────────────────
import { registerAllQuestionsResource } from './resources/allQuestions.js';
import { registerQuizStatsResource } from './resources/quizStats.js';
import { registerQuestionByIdResource } from './resources/questionById.js';
import { registerSearchQuestionsResource } from './resources/searchQuestions.js';

// ─── MCP Server Factory ─────────────────────────────────────────────────────

export function createMcpServer() {
  const server = new McpServer({
    name: 'ai-quiz',
    version: '1.0.0',
    description:
      'MCP server for managing AI Quiz questions — create and list questions directly from any MCP-compatible client.',
  });

  // Register tools
  registerCreateQuestion(server);
  registerListQuestions(server);
  registerGetQuestion(server);
  registerUpdateQuestion(server);
  registerDeleteQuestion(server);
  registerBulkCreateQuestions(server);
  registerGetQuizStats(server);
  registerExportQuestions(server);

  // Register resources
  registerAllQuestionsResource(server);
  registerQuizStatsResource(server);
  registerQuestionByIdResource(server);
  registerSearchQuestionsResource(server);

  return server;
}

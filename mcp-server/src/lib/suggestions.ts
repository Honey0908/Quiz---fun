import { prisma } from './prisma.js';

/**
 * Static topic suggestions for autocomplete on prompt/tool arguments.
 */
export const TOPIC_SUGGESTIONS = [
  'JavaScript',
  'TypeScript',
  'React',
  'Next.js',
  'Node.js',
  'Python',
  'Machine Learning',
  'Deep Learning',
  'LLM fundamentals',
  'RAG',
  'Prompt Engineering',
  'GitHub Copilot',
  'MCP',
  'LangChain',
  'Vector Databases',
  'Transformers',
  'Fine-tuning',
  'Docker',
  'Kubernetes',
  'Git',
  'REST APIs',
  'GraphQL',
  'SQL',
  'MongoDB',
  'CSS',
  'HTML',
  'Web Security',
  'OAuth',
  'CI/CD',
  'Testing',
];

/**
 * Autocomplete callback for question IDs — queries DB for matching IDs.
 */
export async function completeQuestionId(value: string): Promise<string[]> {
  const numericPrefix = Number.parseInt(value) || 0;
  const questions = await prisma.question.findMany({
    where: { id: { gte: numericPrefix } },
    select: { id: true },
    take: 10,
    orderBy: { id: 'asc' },
  });
  return questions.map((q) => String(q.id));
}

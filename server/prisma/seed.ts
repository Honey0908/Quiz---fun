import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const questions = [
  {
    id: 1,
    question: '💬 Which company created ChatGPT?',
    answer: 'OpenAI',
    explanation:
      '🏢 OpenAI was founded in 2015 and released ChatGPT in November 2022 — it gained 1 million users in just 5 days, making it the fastest-growing app in history at the time!',
  },
  {
    id: 2,
    question: '🤖 Which company created Claude AI?',
    answer: 'Anthropic',
    explanation:
      '🛡️ Anthropic was founded in 2021 by former OpenAI researchers, including Dario and Daniela Amodei. Claude is their AI assistant, built with a focus on safety and helpfulness — guided by their "Constitutional AI" approach!',
  },
  {
    id: 3,
    question: '🔵 What does the @ symbol do in GitHub Copilot Chat?',
    answer:
      'It references a participant or agent to scope the conversation (e.g. @workspace, @vscode)',
    explanation:
      '🎯 @workspace tells Copilot to search your entire project for context. @vscode lets you ask about editor settings. The @ symbol is your shortcut to bringing in the right expert for the job!',
  },
  {
    id: 4,
    question: '📁 What is the # symbol used for in GitHub Copilot Chat?',
    answer: 'Attaching a specific file or context reference to your prompt',
    explanation:
      '📎 Typing #filename.ts lets you attach a specific file to your Copilot conversation. Instead of Copilot guessing what code you mean, you hand it exactly the right context!',
  },
  {
    id: 5,
    question: '🔢 What is a "token" in the context of LLMs?',
    answer:
      'A chunk of text (roughly 3-4 characters or ~¾ of a word) that the model processes as a single unit',
    explanation:
      '📊 LLMs don\'t read character-by-character or word-by-word — they use tokens. "unhappiness" might be 3 tokens. This is why context window sizes are measured in tokens, not words!',
  },
  {
    id: 6,
    question: '🤖 What is "Agentic AI"?',
    answer:
      'AI that autonomously pursues goals over multiple steps by planning, calling tools, and adapting based on results',
    explanation:
      '🚀 Agentic AI goes beyond answering a single prompt — it breaks down a goal, decides on actions, executes tools (read files, run code, search web), evaluates the outcome, and loops until the task is complete, much like a human developer would!',
  },
  {
    id: 7,
    question: '🤝 What is "MCP"?',
    answer: 'Model Context Protocol',
    explanation:
      '🔌 MCP is an open standard that lets AI models securely connect to external tools, APIs, and data sources — enabling agents to act beyond their training data!',
  },
  {
    id: 8,
    question: '🎭 What is "role prompting" in AI engineering?',
    answer:
      'Instructing the model to adopt a specific persona or role to improve output quality',
    explanation:
      '👤 "You are a senior TypeScript engineer with 10 years of experience..." instantly shifts the model\'s tone, vocabulary, and depth. Role prompting is one of the simplest and most effective prompt engineering tricks!',
  },
  {
    id: 9,
    question:
      '🔄 What is the difference between "zero-shot" and "one-shot" prompting?',
    answer:
      'Zero-shot = no examples given; One-shot = exactly one example given to guide the model',
    explanation:
      "🎯 Zero-shot relies purely on the model's training. One-shot gives it a single example to pattern-match from. Few-shot gives 2-5 examples. More examples generally = better accuracy for complex tasks!",
  },
  {
    id: 10,
    question: '📐 What does "RAG" stand for in AI development?',
    answer: 'Retrieval-Augmented Generation',
    explanation:
      '📦 RAG combines a retrieval step (fetching relevant docs/data) with generation so the LLM answers with up-to-date, context-specific information instead of just its training data!',
  },
  {
    id: 11,
    question: '🛠️ In GitHub Copilot, what are "Tools" used for?',
    answer: 'Extending Copilot with external actions and data sources',
    explanation:
      '🔧 Tools let Copilot call external functions — like searching the web, querying a database, or running code — going beyond pure text generation!',
  },
  {
    id: 12,
    question: '🎓 What is a Copilot "Skill" (.instructions.md / SKILL.md)?',
    answer:
      'A file that provides domain-specific instructions to guide Copilot',
    explanation:
      '📚 Skills package reusable expertise — like testing patterns or API design rules — so Copilot applies consistent best practices automatically for that domain!',
  },
  {
    id: 13,
    question: '🎬 Give any 5 character names from the "Dhurandhar"?',
    answer:
      'Hamza Ali Mazari, Rehman Dakait, SP Chaudhary Aslam, Major Iqbal, Ajay Sanyal',
    explanation:
      '🎭 This is a recall-based question where you identify key characters from the movie Dhurandhar, which features a mix of undercover agents, law enforcement, and underworld figures.',
  },
  {
    id: 14,
    question:
      '🤔 What is the difference between Copilot Agent mode, Plan mode, and Ask mode?',
    answer:
      'Ask = conversational Q&A only; Plan = generates a step-by-step plan for review before acting; Agent = autonomously executes the plan by calling tools and editing files',
    explanation:
      '🗺️ Ask mode just answers questions. Plan mode produces a structured action plan and waits for your approval. Agent mode goes further — it reads files, runs commands, and iterates until the goal is done, all in one go.',
  },
  {
    id: 15,
    question: '⚔️ What is the difference between Copilot Skills and Agents?',
    answer:
      'Skills are passive instruction files that shape HOW Copilot responds; Agents are active runtimes that autonomously plan, call tools, and take actions',
    explanation:
      "📘 A Skill (.instructions.md / SKILL.md) is like a rulebook — it changes the model's behaviour through injected context. An Agent is an execution engine that reads that rulebook and then actually does the work: running tools, editing files, and iterating toward a goal.",
  },
  {
    id: 16,
    question: '🌐 Name 7 popular MCP servers available today.',
    answer:
      'GitHub, Playwright, Postman, Notion, GitKraken, Context7, Sequential Thinking',
    explanation:
      '🔌 MCP servers extend Copilot agents: GitHub (repo actions), Playwright (browser automation), Postman (API testing), Notion (workspace data), GitKraken (git/PR workflows), Context7 (live library docs), Sequential Thinking (structured reasoning).',
  },
  {
    id: 17,
    question:
      '🗂️ In Copilot Skills (.instructions.md), what does the "applyTo" frontmatter field control?',
    answer:
      'Which file glob patterns automatically activate the skill/instructions',
    explanation:
      '📌 Setting `applyTo: "**/*.test.ts"` means Copilot loads those testing instructions only when working on test files — keeping context focused and avoiding instruction bloat.',
  },
  {
    id: 18,
    question:
      '🔗 In an MCP server setup, what is a "resource" vs a "tool" vs a "prompt"?',
    answer:
      'Resource = read-only data the model can fetch; Tool = callable action with side-effects; Prompt = reusable templated instruction',
    explanation:
      '📚 MCP separates concerns cleanly: resources expose context (files, DB rows), tools perform actions (run query, write file), and prompts are pre-built message templates — together they form a composable AI capability layer.',
  },
  {
    id: 19,
    question:
      '📄 What is the difference between .github/copilot-instructions.md and *.instructions.md files?',
    answer:
      'copilot-instructions.md applies globally to every chat; *.instructions.md files are scoped via "applyTo" globs and activate only for matching files',
    explanation:
      '🎯 .github/copilot-instructions.md is always injected into every Copilot Chat session. *.instructions.md (e.g. in .github/instructions/) use frontmatter like `applyTo: "**/*.tsx"` to load domain-specific rules only when relevant files are open — avoiding context bloat.',
  },
  {
    id: 20,
    question: '🧬 What is "embedding" in AI and how is it used in code search?',
    answer:
      'Converting text/code into a numerical vector that captures semantic meaning, enabling similarity search',
    explanation:
      '🔍 Embeddings let you find code that is semantically similar — not just keyword matched. "fetch user data" and "retrieve account info" would have similar embeddings even though the words differ!',
  },
  {
    id: 21,
    question:
      '🪝 What are "hooks" in GitHub Copilot / AI agent workflows, and when should you use them?',
    answer:
      'Hooks are event-driven callbacks that trigger custom logic at defined points in the agent lifecycle (e.g. before/after a tool call or response)',
    explanation:
      '🔗 Hooks let you intercept the agent loop — for example, a pre-tool hook can validate or log a planned action, and a post-response hook can reformat output. Use them for auditing, guardrails, telemetry, or injecting extra context at runtime without changing the core prompt.',
  },
  {
    id: 22,
    question:
      '📦 What happens when an AI agent\'s context window fills up, and how can you "compact" it?',
    answer:
      'Older context is truncated; in GitHub Copilot you can use /compact to summarise and reduce the current conversation context',
    explanation:
      '🗜️ When the context window fills up, earlier messages are dropped, which can affect accuracy. In GitHub Copilot (VS Code), the /compact command helps by summarising the conversation into a shorter version, freeing up space while keeping important context so the agent can continue effectively.',
  },
  {
    id: 23,
    question:
      '☁️ What is the difference between a Cloud agent, a Background agent, and a Local agent?',
    answer:
      'Cloud = runs on provider servers (persistent, shareable); Background = runs asynchronously without blocking your IDE; Local = runs on your machine with direct file/terminal access',
    explanation:
      '🖥️ Local agents (e.g. Copilot in VS Code) run in your editor with full filesystem access. Background agents execute tasks asynchronously — you can kick one off and check results later. Cloud agents (e.g. GitHub Copilot Workspace) run entirely on remote infrastructure, enabling collaboration and longer-running jobs without tying up your laptop.',
  },
  {
    id: 24,
    question:
      '🛠️ Name the top 5 most widely used AI coding assistants available in 2026.',
    answer:
      'GitHub Copilot, Cursor, Claude (Anthropic), ChatGPT / Codex (OpenAI), Gemini Code Assist (Google)',
    explanation:
      '🚀 GitHub Copilot (Microsoft/GitHub) leads the market with deep IDE integration. Cursor took the developer world by storm with its AI-native editor. Claude (Anthropic) powers many coding workflows via API and integrations. ChatGPT/Codex (OpenAI) remains hugely popular for code generation. Gemini Code Assist (Google) rounds out the top 5 with strong cloud and workspace integration. Honourable mentions: Amazon Q, Tabnine, and Windsurf (Codeium)!',
  },
  {
    id: 25,
    question: '🧭 What is an "orchestrator" in AI agent architecture?',
    answer: 'A component that manages planning, tool usage, and execution flow',
    explanation:
      '🎯 Orchestrators coordinate multiple steps, tools, and agents — acting as the brain of an agentic system.',
  },
  {
    id: 26,
    question:
      '⚡ What are the latest stable versions of Next.js and React as of early 2026?',
    answer: 'Next.js 16.2 and React 19.2',
    explanation:
      '🚀 Next.js 16 launched in October 2025 with Turbopack as the default bundler, Cache Components, and React 19.2 support — followed by 16.1 (stable Turbopack file system caching) and 16.2 (AI-ready scaffolding, experimental Agent DevTools). ⚛️ React 19 dropped in December 2024, React 19.1 in June 2025, and React 19.2 in October 2025 — introducing the <Activity /> component, useEffectEvent hook, and Performance Tracks in Chrome DevTools!',
  },
  {
    id: 27,
    question:
      '🏷️ What is "agent handoff" and what data must be passed during one?',
    answer:
      'Transferring control from one agent to another mid-task; the handoff payload must include the current goal, relevant conversation history, tool results so far, and any constraints the receiving agent must respect',
    explanation:
      '🤝 A handoff without context is like handing a case to a new lawyer without briefing them. The sending agent packages a structured handoff object — goal, progress, constraints, outputs — so the receiving agent can pick up exactly where the previous one left off, with no loss of state!',
  },
  {
    id: 28,
    question:
      '🧠 If you want to customize Copilot responses in the chat window, what should you configure?',
    answer:
      'Update memory/instruction context: use user memory for persistent preferences and add .github/copilot-instructions.md or scoped *.instructions.md files',
    explanation: `Simple mental model 📌\n\nMemory = your personal behavior preference layer\nGlobal instruction file = always-on project rulebook\nScoped instruction files = conditional rulebooks by file/task\nCurrent prompt = immediate request for this one response`,
  },
  {
    id: 29,
    question:
      '🏆 In Anthropic Claude, which model tier is considered the most capable overall?',
    answer: 'Opus (the Claude Opus tier) / Mythos (the latest and greatest)',
    explanation:
      '🧩 Anthropic uses model tiers like Haiku (fast/light), Sonnet (balanced), and Opus (highest capability). So if someone asks for the "best" Claude model in terms of raw capability, the answer is the latest Claude Opus release.',
  },
];

async function main() {
  console.log('🌱 Seeding questions...');

  for (const q of questions) {
    await prisma.question.upsert({
      where: { id: q.id },
      update: {
        question: q.question,
        answer: q.answer,
        explanation: q.explanation,
      },
      create: {
        id: q.id,
        question: q.question,
        answer: q.answer,
        explanation: q.explanation,
      },
    });
  }

  // Reset the autoincrement sequence to avoid ID conflicts on new inserts
  await prisma.$executeRawUnsafe(
    `SELECT setval(pg_get_serial_sequence('"Question"', 'id'), COALESCE(MAX(id), 0) + 1, false) FROM "Question"`,
  );

  console.log(`✅ Seeded ${questions.length} questions successfully!`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

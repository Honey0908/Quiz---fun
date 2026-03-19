import type { Question } from '../types';

export const questions: Question[] = [
  {
    id: 1,
    question: '🛠️ In GitHub Copilot, what are "Tools" used for?',
    answer: 'Extending Copilot with external actions and data sources',
    explanation:
      '🔧 Tools let Copilot call external functions — like searching the web, querying a database, or running code — going beyond pure text generation!',
  },

  {
    id: 2,
    question: '🎓 What is a Copilot "Skill" (.instructions.md / SKILL.md)?',
    answer:
      'A file that provides domain-specific instructions to guide Copilot',
    explanation:
      '📚 Skills package reusable expertise — like testing patterns or API design rules — so Copilot applies consistent best practices automatically for that domain!',
  },

  {
    id: 3,
    question: '📐 What does "RAG" stand for in AI development?',
    answer: 'Retrieval-Augmented Generation',
    explanation:
      '📦 RAG combines a retrieval step (fetching relevant docs/data) with generation so the LLM answers with up-to-date, context-specific information instead of just its training data!',
  },

  {
    id: 4,
    question: '🔁 What is "prompt chaining" in AI agent workflows?',
    answer: 'Passing the output of one prompt as input to the next',
    explanation:
      '⛓️ Prompt chaining breaks complex tasks into steps — each LLM call does one job and feeds its result into the next, improving accuracy and reducing errors!',
  },

  {
    id: 5,
    question: '🌡️ What does "temperature" control in an AI language model?',
    answer: 'The randomness / creativity of the generated output',
    explanation:
      '🎲 Temperature 0 = very deterministic and focused; temperature 1+ = more creative and varied. For coding tasks, lower temperatures are usually preferred!',
  },
  {
    id: 6,
    question:
      '🔍 What VS Code slash command asks Copilot to explain selected code?',
    answer: '/explain',
    explanation:
      '💬 Highlight any code, open Copilot Chat, type /explain and Copilot will describe what the code does line by line — great for onboarding to a new codebase!',
  },
  {
    id: 7,
    question: '🤝 What is "MCP" in the context of AI tools and agents?',
    answer: 'Model Context Protocol',
    explanation:
      '🔌 MCP is an open standard that lets AI models securely connect to external tools, APIs, and data sources — enabling agents to act beyond their training data!',
  },

  {
    id: 8,
    question:
      '⚙️ In a Copilot agent loop, what triggers the agent to STOP iterating?',
    answer:
      'When the model emits no further tool calls (a final text response)',
    explanation:
      '🔄 Agents run in a loop: plan → call tool → observe result → re-plan. The loop exits when the model decides all goals are met and returns a pure text answer with no pending tool calls.',
  },
  {
    id: 9,
    question:
      '🧩 What is the key difference between a Copilot "participant" (@workspace) and a custom "agent"?',
    answer:
      'Participants are built-in scoped contexts; custom agents are fully programmable with their own tools and instructions',
    explanation:
      '🎯 @workspace, @vscode etc. are first-party participants that scope context. Custom agents (via the extension API or MCP) can define their own tool set, system prompt, and multi-step reasoning logic.',
  },

  {
    id: 10,
    question:
      '🔬 What is "few-shot prompting" and why is it powerful for Copilot?',
    answer:
      'Providing 2-5 worked examples inside the prompt so the model infers the desired pattern',
    explanation:
      "🎯 Few-shot prompting leverages in-context learning — no fine-tuning needed. Showing Copilot 3 examples of your team's test style instantly aligns its output with your conventions.",
  },

  {
    id: 11,
    question:
      '🗂️ In Copilot Skills (.instructions.md), what does the "applyTo" frontmatter field control?',
    answer:
      'Which file glob patterns automatically activate the skill/instructions',
    explanation:
      '📌 Setting `applyTo: "**/*.test.ts"` means Copilot loads those testing instructions only when working on test files — keeping context focused and avoiding instruction bloat.',
  },

  {
    id: 12,
    question:
      '⚠️ What is "hallucination" in a coding LLM and what is the best mitigation strategy?',
    answer:
      'Confidently generating plausible-but-wrong code/APIs; mitigated by grounding the model with real context (RAG, #codebase, docs)',
    explanation:
      '🧱 LLMs predict likely tokens, not ground truth. Hallucinations (invented APIs, wrong signatures) drop dramatically when you feed the model real source files, type definitions, or official docs as context.',
  },
  {
    id: 13,
    question:
      '🔗 In an MCP server setup, what is a "resource" vs a "tool" vs a "prompt"?',
    answer:
      'Resource = read-only data the model can fetch; Tool = callable action with side-effects; Prompt = reusable templated instruction',
    explanation:
      '📚 MCP separates concerns cleanly: resources expose context (files, DB rows), tools perform actions (run query, write file), and prompts are pre-built message templates — together they form a composable AI capability layer.',
  },
];

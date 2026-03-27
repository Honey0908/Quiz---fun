import type { Question } from '../types';

// Questions removed from the active quiz — restore by moving back to questions.ts

export const archivedQuestions: Question[] = [
  {
    id: 2,
    question:
      '✅ True or False: GitHub Copilot can write unit tests for your code.',
    answer: 'True!',
    explanation:
      '🧪 Use the /tests slash command in Copilot Chat to auto-generate unit tests for any selected function. It detects your testing framework (Jest, Vitest, PyTest etc.) and writes matching test cases!',
  },
  {
    id: 3,
    question:
      '🔍 What VS Code slash command asks Copilot to explain selected code?',
    answer: '/explain',
    explanation:
      '💬 Highlight any code, open Copilot Chat, type /explain and Copilot will describe what the code does line by line — great for onboarding to a new codebase!',
  },
  {
    id: 10,
    question: '🌡️ What does "temperature" control in an AI language model?',
    answer: 'The randomness / creativity of the generated output',
    explanation:
      '🎲 Temperature 0 = very deterministic and focused; temperature 1+ = more creative and varied. For coding tasks, lower temperatures are usually preferred!',
  },
  {
    id: 12,
    question:
      '🔬 What is "few-shot prompting" and why is it powerful for Copilot?',
    answer:
      'Providing 2-5 worked examples inside the prompt so the model infers the desired pattern',
    explanation:
      "🎯 Few-shot prompting leverages in-context learning — no fine-tuning needed. Showing Copilot 3 examples of your team's test style instantly aligns its output with your conventions.",
  },
  {
    id: 21,
    question:
      '🧩 What is the key difference between a Copilot "participant" (@workspace) and a custom "agent"?',
    answer:
      'Participants are built-in scoped contexts; custom agents are fully programmable with their own tools and instructions',
    explanation:
      '🎯 @workspace, @vscode etc. are first-party participants that scope context. Custom agents (via the extension API or MCP) can define their own tool set, system prompt, and multi-step reasoning logic.',
  },
  {
    id: 22,
    question:
      '⚙️ In a Copilot agent loop, what triggers the agent to STOP iterating?',
    answer:
      'When the model emits no further tool calls (a final text response)',
    explanation:
      '🔄 Agents run in a loop: plan → call tool → observe result → re-plan. The loop exits when the model decides all goals are met and returns a pure text answer with no pending tool calls.',
  },
  {
    id: 27,
    question: '🔁 What is the "ReAct" prompting pattern in AI agents?',
    answer:
      'A pattern where the agent alternates between Reasoning and Acting steps to solve a task',
    explanation:
      '🧩 ReAct = Reason + Act. The agent thinks out loud ("I need to check the file first"), then acts (calls read_file tool), then reasons again based on the result. This loop continues until the task is done!',
  },
];

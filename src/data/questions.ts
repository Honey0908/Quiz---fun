import type { Question } from '../types';

export const questions: Question[] = [
  {
    id: 1,
    question: `✈️ What is Autopilot/Auto Mode in AI coding agents?`,
    answer: `It is an autonomous setting that auto-approves agent actions to complete tasks without constant user prompts; Claude supports it via "Auto Mode" in Claude Code.`,
    explanation: `🤖 Autopilot (or Auto Mode) shifts the AI from a passive assistant to an active developer. Instead of waiting for a user to manually click 'Approve' on every terminal command or file write, the agent runs in a continuous loop until a goal is achieved. While GitHub Copilot utilizes Autopilot to bypass approvals, Anthropic includes a background safety classifier in Claude Code Auto Mode to intelligently allow safe tasks automatically while halting and asking for human confirmation if a destructive or high-risk command is triggered.`
  },
  {
    id: 2,
    question: `🤝 What is Agent Handoff in AI systems?`,
    answer: `Agent Handoff is the process of transferring a task or conversation from one AI agent to another that is better suited to handle it.`,
    explanation: `🔄 Instead of one agent doing everything, specialized agents can collaborate by handing off tasks. For example, a Coding Agent may hand off a deployment request to a DevOps Agent, or a Customer Support Agent may transfer a billing question to a Billing Agent. This allows each agent to focus on its expertise, resulting in more accurate and efficient task completion.`
  },
  {
    id: 3,
    question: `🎲 What is Sampling in an MCP server?`,
    answer: `Sampling is a feature that allows an MCP server to request the AI model to generate text or perform reasoning on its behalf.`,
    explanation: `🧠 Instead of implementing its own AI logic, an MCP (Model Context Protocol) server can ask the connected language model to "sample" a response. For example, a Git MCP server could ask the model to summarize a pull request, explain a code diff, or generate a commit message using the current repository context.`
  },
  {
    id: 4,
    question: `🚀 How many ways are there to deploy an MCP server?`,
    answer: `Three main ways: Local (STDIO), Remote (SSE/HTTP), and Managed Cloud Containers.`,
    explanation: `🌐 MCP servers can be deployed depending on your scale and access needs. 1) Local deployment runs on your machine via STDIO (e.g., using 'npx' for Node packages) for personal desktop apps like Claude Desktop or Cursor. 2) Remote deployment hosts the server via Server-Sent Events (SSE) over HTTPS, allowing multiple users to connect. 3) Managed deployment packages the server into a Docker container scaled on infrastructure like Google Cloud Run or AWS for enterprise workloads.`
  },
  {
    id: 5,
    question: `📢 What is a Server Notification in the MCP Inspector, and what kinds of notifications can a server send?`,
    answer: `A Server Notification is a one-way message sent from an MCP server to the client without expecting a response.`,
    explanation: `🔔 Server notifications keep the client informed about events or state changes while a request is in progress or when something changes on the server. Common examples include progress notifications for long-running tasks, logging notifications for debugging, resource change notifications when data is updated, and tool list or prompt list change notifications when available capabilities are modified. Unlike requests, notifications are asynchronous and do not require a reply from the client.`
  },
  {
    id: 6,
    question: `🏁 What are the latest flagship models in the Claude Opus and OpenAI GPT series?`,
    answer: `The latest flagship models are Claude Opus 4.8 and OpenAI GPT-5.5.`,
    explanation: `🏗️ The frontier AI landscape features massive technical iterations. Anthropic's flagship is Claude Opus 4.8, which expands the context window to 1 million tokens and delivers elite reasoning alongside self-correcting autonomous capabilities. OpenAI competes at the same flagship tier with GPT-5.5, which integrates advanced multi-step computer use, natively scales across long-horizon codebases, and features a matching 1 million token context limit to execute complex tasks.`
  },
  {
    id: 7,
    question: `🎭 What is the difference between Claude AI, Claude Code, and Claude Cowork?`,
    answer: `Claude AI is a standard conversational chatbot, Claude Code is a CLI agent for developers, and Claude Cowork is a desktop agent for non-technical knowledge workers.`,
    explanation: `🏢 Anthropic splits its ecosystem into three distinct interfaces based on the user's workflow. 1) Claude AI (Chat) is the traditional browser interface used for turn-based Q&A and writing text. 2) Claude Code is an advanced terminal/CLI application that allows an autonomous agent to execute shell commands, edit files, and build apps inside code repositories. 3) Claude Cowork is a graphical desktop interface built for non-technical professionals (like marketing or finance teams) to delegate multi-step computer tasks, organize messy local file systems, and build spreadsheets autonomously without touching a command-line interface.`
  },
  {
    id: 8,
    question: `📚 What is an LLM's Context Window?`,
    answer: `The maximum number of tokens the model can process in a single request, including input and output.`,
    explanation: `🧠 Everything inside the context window counts—system prompts, user messages, previous conversation history, tool outputs, and the model's response. If the limit is exceeded, older information must be removed or summarized.`
  },
  {
    id: 9,
    question: `🧩 What are the main components of a single AI prompt-response cycle?`,
    answer: `A typical AI interaction consists of a System Prompt, User Prompt, Context/Conversation History, Tool Results (if any), and the Model's Response.`,
    explanation: `⚙️ Before generating a response, the model processes multiple inputs together. The System Prompt defines the AI's behavior, the User Prompt contains the user's request, Context includes previous messages, Tool Results provide external information (such as MCP tools or web searches), and finally the model generates its Response. All of these components contribute to the total token count. For example, if the system prompt is 500 tokens, the conversation history is 1,000 tokens, the user prompt is 100 tokens, and tool output is 400 tokens, the model processes about 2,000 tokens before producing its answer.`
  },
  {
    id: 10,
    question: `📝 What is a System Prompt in an AI model?`,
    answer: `A System Prompt is a high-priority instruction that defines the AI's role, behavior, rules, and constraints before it processes user requests.`,
    explanation: `🧠 The system prompt acts as the AI's "operating manual." It tells the model how to behave throughout the conversation, such as "You are a helpful coding assistant" or "Always respond in JSON." For example, if the system prompt says "Only answer React-related questions," and a user asks about cooking, the model should politely decline or redirect the conversation according to those instructions. A system prompt is a persistent instruction block sent before the conversation — invisible to users, setting the AI's behavior, persona, tools, and knowledge. Unlike user messages that appear once per conversation, the system prompt is sent on every single API call. This means every extra token in your system prompt is multiplied across all your API calls. A 500-token system prompt across 10,000 daily calls = 5 billion extra tokens per day just from prompt overhead. This is exactly why caching the system prompt is so high-value.`
  },

  {
    id: 11,
    question: `🎬 Name any 4 Bollywood movies whose titles start with the letter "Y".`,
    answer: `Yuva, Yeh Jawaani Hai Deewani, Yaadon Ki Baaraat, Yaarana`,
    explanation: `🍿 There are relatively few Bollywood movies that start with "Y". Some well-known examples include *Yuva*, *Yeh Jawaani Hai Deewani*, *Yaadon Ki Baaraat*, and *Yaarana*. This makes it a fun movie trivia question!`
  },
  {
    id: 12,
    question: `🎟️ What are the distinct types of tokens used to calculate AI usage and billing?`,
    answer: `Input tokens (user requests), Output tokens (AI responses), Cached tokens (reused context history), and Reasoning tokens (internal thinking steps).`,
    explanation: `💳 Modern AI models charge users based on four distinct token categories. Input tokens represent your prompt, while Output tokens are the generated response text. To lower expenses, Cached tokens refer to system instructions or previous conversation history that the server reuses at a major discount. Finally, specialized models leverage Reasoning tokens to compute hidden 'thinking steps' in the background before delivering the final answer, which are billed alongside standard output costs.`
  },
  {
    id: 13,
    question: `💰 How does an LLM price a short message like "hi , how are you" under the hood?`,
    answer: `The phrase itself is only 5-6 tokens, but you are billed for the entire past chat history and system prompts sent alongside it.`,
    explanation: `🧮 LLMs have no local memory, meaning they cannot remember what was said in the previous turn. Every time you send a new message, the platform bundles your text with the entire preceding conversation history and system instructions, converting them into tokens (roughly 4 characters each). You are billed a lower rate for this cumulative input context, and a higher premium rate for the new output tokens the model generates in response.`
  },
  {
    id: 14,
    question: `🗺️ What is Graphify and how does it optimize AI codebase context?`,
    answer: `Graphify parses a repository once to build a structured knowledge graph, stopping the AI from repeatedly rereading files.`,
    explanation: `🌿 AI assistants often re-read files file-by-file across different chat sessions, eating up context windows. Graphify runs a local extraction command to build a visual, structured map of dependencies and code relationships. Instead of loading every source file, the AI queries this pre-built graph to instantly understand project architecture, lowering initialization token costs by up to 70%.`
  },

  {
    id: 15,
    question: `📊 If a React dashboard makes 10,000 real-time API calls daily using an identical 2,000-token system prompt, how is it billed?`,
    answer: `By default, it bills 20 million system tokens daily, but implementing Prompt Caching reduces these repetitive costs by up to 90%.`,
    explanation: `📉 Your team is building a React dashboard that makes 10,000 API calls per day, each with the same 2,000-token system prompt. Without caching, how much do you pay just for that system prompt daily on Sonnet 4.6? How much with caching (after day 1)? Calculation hard Answer / What to cover Without caching: 10,000 calls × 2,000 tokens × $3/MTok = $0.06 per call × 10,000 = $60/day just for the system prompt. With caching: 1 cache write per day (tiny) + 9,999 reads at $0.30/MTok = 9,999 × 2,000 tokens × $0.30/MTok ≈ $6/day. Caching saves ~$54/day = ~$1,620/month from one optimization. This is a real calculation your team should run on your actual system prompt size. In most production apps, caching the system prompt is the single biggest easy win.`
  },
  {
    id: 16,
    question: `⏳ Why does Claude use a 5-hour rolling window to reset its usage limits?`,
    answer: `To manage global server demand and compute costs using a dynamic sliding window triggered by your first prompt.`,
    explanation: `📉 Anthropic implements a 5-hour rolling window rather than a fixed calendar reset to ensure fair server availability. The timer starts the moment you send your first message, and your used tokens gradually 'age out' and refresh 5 hours later. This stops heavy users from overloading infrastructure while allowing developers to space out work sessions. Note that during high-congestion peak hours, Anthropic may dynamically tighten this 5-hour message allowance based on real-time server traffic.`
  },

  {
    id: 17,
    question: `📦 What is a Batch API, and why do companies use it for large data pipelines?`,
    answer: `An asynchronous endpoint that processes large collections of prompt requests in the background at a 50% pricing discount.`,
    explanation: `⏳ Standard APIs execute synchronously, charging a premium for instantaneous token generation. A Batch API allows developers to compile up to thousands of requests into a single JSONL file and upload it to a provider like OpenAI or Anthropic. The infrastructure processes these requests during off-peak resource windows—guaranteeing completion within a set timeframe (often 1 to 24 hours)—allowing organizations to manage massive offline analytical or evaluation pipelines for exactly half the operational cost.`
  },
  {
    id: 18,
    question: `🎯 What are the core criteria used to choose the proper AI model for a production task?`,
    answer: `Balancing task complexity, context window size requirements, latency needs, and operational token costs.`,
    explanation: `⚖️ Selecting an LLM involves mapping architectural constraints to model profiles. Simple tasks like text classification are routed to fast, cheap 'mini' models to optimize latency and cost. Massive data extraction or cross-file code refactoring requires deep context capacities and heavy reasoning footprints. Engineering teams use public leaderboards like Chatbot Arena alongside localized test suites to pick the most efficient model that safely clears their technical baseline.`
  },
]

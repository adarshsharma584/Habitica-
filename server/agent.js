import dotenv from 'dotenv';
import { tavily } from "@tavily/core";
import Groq from "groq-sdk";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are an intelligent AI Life Optimization Agent.

Your goal is to help users achieve their desired goals by understanding their routine, identifying inefficiencies, designing an optimized schedule, and providing real-world resources.

### WORKFLOW:

1. INFORMATION COLLECTION: Ask structured questions to collect details like wake-up/sleep times, commitments, travel, energy peaks, skill gaps, and goal deadlines. Do NOT generate the final plan until you have sufficient details.

2. ROUTINE ANALYSIS: Analyze available hours, identify time leaks, and ensure balance (sleep, activity, breaks).

3. RESOURCE SEARCH: Use the available web search tools to find high-quality YouTube videos, articles, and tools. Never fabricate URLs.

4. PLAN GENERATION: Once all info is collected and research is done, generate a realistic, sustainable plan.

### OUTPUT FORMAT:

If you are still collecting information, respond with clear questions.
If you are generating the final plan, you MUST return ONLY a valid JSON object in this format:

{
  "goal_analysis": {
    "goal": "string",
    "deadline": "string",
    "difficulty_level": "Low | Moderate | High",
    "key_focus_areas": []
  },
  "routine_summary": {
    "available_productive_hours": "number",
    "identified_time_leaks": [],
    "energy_alignment_strategy": "string"
  },
  "optimized_daily_schedule": [
    {
      "time_block": "string",
      "activity": "string",
      "purpose": "string"
    }
  ],
  "weekly_strategy": [],
  "mental_balance_plan": [],
  "productivity_methods": [],
  "recommended_resources": {
    "youtube_videos": [{"title": "string", "url": "string", "why_recommended": "string"}],
    "articles_or_websites": [{"title": "string", "url": "string", "why_recommended": "string"}],
    "diet_resources": [],
    "productivity_tools": []
  },
  "extra_tips": []
}

### CRITICAL RULES:
1. Return ONLY the JSON object when providing the final plan. No markdown or explanation.
2. If you need more information, ask before generating the plan.
3. Use the webSearch tool whenever you need to find specific links or resources.`;

async function webSearch({ query }) {
  console.log("Searching the Web for:", query);
  try {
    const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
    const response = await tvly.search(query, { maxResults: 3 });
    const mergedResponse = response?.results?.map(result => `Content: ${result.content}\nURL: ${result.url}`).join("\n\n") || "No results found.";
    console.log("Web Search completed.");
    return mergedResponse;
  } catch (error) {
    console.error("Web search error:", error);
    return "Failed to perform web search.";
  }
}

export async function generatePlan(chatMessages) {
  try {
    // Convert frontend message format to Groq format
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...chatMessages.map(m => ({
        role: m.role === 'ai' || m.role === 'bot' ? 'assistant' : 'user',
        content: m.content || (m.data ? JSON.stringify(m.data) : ' ')
      }))
    ];

    const tools = [
      {
        "type": "function",
        "function": {
          "name": "webSearch",
          "description": "Performs a web search to find real links and resources.",
          "parameters": {
            "type": "object",
            "properties": {
              "query": {
                "type": "string",
                "description": "The search query."
              }
            },
            "required": ["query"]
          }
        }
      }
    ];

    let searchCount = 0;
    const MAX_SEARCHES = 3;

    let currentIteration = 0;
    while (currentIteration < 5) {
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: messages,
        tools: tools,
        tool_choice: "auto",
        temperature: 0.1 // Lowered temperature for more stable tool use
      });

      const responseMessage = completion.choices[0].message;

      // Handle tool calls
      if (responseMessage.tool_calls) {
        messages.push(responseMessage);

        for (const toolCall of responseMessage.tool_calls) {
          if (searchCount >= MAX_SEARCHES) {
            messages.push({
              role: "tool",
              tool_call_id: toolCall.id,
              name: toolCall.function.name,
              content: "Search limit reached. Please proceed with information you have."
            });
            continue;
          }

          const functionName = toolCall.function.name;
          const functionArgs = JSON.parse(toolCall.function.arguments);

          if (functionName === "webSearch") {
            searchCount++;
            const searchResults = await webSearch(functionArgs);
            messages.push({
              role: "tool",
              tool_call_id: toolCall.id,
              name: functionName,
              content: searchResults
            });
          }
        }
        currentIteration++;
        continue;
      }

      // If no tool calls, it's either text or the plan
      if (responseMessage.content) {
        const content = responseMessage.content.trim();

        if (content.startsWith('{') || content.includes('"plan":') || content.includes('"goal_analysis":')) {
          try {
            const parsedData = parseJsonResponse(content);
            return { type: 'plan', data: parsedData };
          } catch (e) {
            return { type: 'text', content: content };
          }
        }
        return { type: 'text', content: content };
      }
      break;
    }

    return { type: 'text', content: "I'm ready to help. What's your next question or should I build the plan?" };
  } catch (error) {
    console.error("generatePlan error:", error);
    return {
      type: 'text',
      content: "❌ I encountered an error. Please try again or rephrase your goal."
    };
  }
}

function parseJsonResponse(content) {
  try {
    // Try clean JSON
    const firstBrace = content.indexOf('{');
    const lastBrace = content.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      return JSON.parse(content.substring(firstBrace, lastBrace + 1));
    }
    return JSON.parse(content);
  } catch (e) {
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1]);
    }
    throw new Error("Could not parse valid JSON from AI response");
  }
}

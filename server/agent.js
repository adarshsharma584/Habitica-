import dotenv from 'dotenv';
import { tavily } from "@tavily/core";
import Groq from "groq-sdk";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are "Habitica AI", an expert daily routine planner and success coach. 

### YOUR GOAL
Help the user create a personalized daily plan and a long-term roadmap.

### PHASE 1: QUESTIONING
- Ask the user relevant questions one-by-one to understand their goal, schedule, constraints, and preferences.
- ONLY ask one question at a time.
- Usually 2-4 questions are enough before generating the plan.

### PHASE 2: PLAN GENERATION
When you have sufficient information, you MUST generate a response in valid JSON format.
The sections must be DYNAMIC based on the user's goal.

#### REQUIRED SECTIONS:
1. "📅 Daily Routine": A detailed time-based plan for their day.
2. "🚀 Complete Roadmap": A step-by-step long-term roadmap to achieve their goal.

#### OPTIONAL SECTIONS (Add if goal is fitness/health related):
3. "🥗 Diet & Nutrition": Specific meal guidelines.
4. "💪 Training/Workout": Specific exercise routines.

#### JSON STRUCTURE:
{
  "plan": {
    "title": "Your [Goal Name] Plan",
    "children": [
      {
        "title": "📅 Daily Routine",
        "children": [
          {"title": "Time - Activity 1"},
          {"title": "Time - Activity 2"}
        ]
      },
      {
        "title": "🚀 Complete Roadmap",
        "children": [
          {"title": "Step 1: [Milestone Name]"},
          {"title": "Step 2: [Milestone Name]"}
        ]
      }
      // Add more sections if needed
    ]
  }
}

### CRITICAL RULES:
1. Return ONLY the JSON object when generating the plan.
2. The Roadmap should be detailed and actionable.
3. For resources or specific tools, use the webSearch tool (LIMIT: 3 searches per turn).
4. Return ONLY valid JSON. No markdown explanation around it.`;

async function webSearch({ query }) {
  console.log("Searching the Web for:", query);
  try {
    const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
    // Use search with a limit of 5 total results for the agent's context 
    // (though the prompt says 5 total searches, we keep individual search results tight)
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
        content: m.content
      }))
    ];

    const tools = [
      {
        "type": "function",
        "function": {
          "name": "webSearch",
          "description": "A function that performs web search to find relevant information.",
          "parameters": {
            "type": "object",
            "properties": {
              "query": {
                "type": "string",
                "description": "The search query string."
              }
            },
            "required": ["query"]
          }
        }
      }
    ];

    let searchCount = 0;
    const MAX_SEARCHES = 3; // Limit to 3 searches per turn to stay within 5 total safely

    // Loop for tool calling (manual handling)
    let currentIteration = 0;
    while (currentIteration < 5) { // Safety break
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: messages,
        tools: tools,
        tool_choice: "auto",
        temperature: 0.3
      });

      const responseMessage = completion.choices[0].message;

      // If there's content and no tool calls, it's either a question or the plan
      if (responseMessage.content && !responseMessage.tool_calls) {
        const content = responseMessage.content.trim();

        // Check if it's JSON
        if (content.startsWith('{') || content.includes('"plan":')) {
          try {
            return {
              type: 'plan',
              data: parseJsonResponse(content)
            };
          } catch (e) {
            console.error("JSON parse failed, returning as text", e);
            return { type: 'text', content: content };
          }
        }

        return { type: 'text', content: content };
      }

      // Handle tool calls
      if (responseMessage.tool_calls) {
        messages.push(responseMessage);

        for (const toolCall of responseMessage.tool_calls) {
          if (searchCount >= MAX_SEARCHES) {
            messages.push({
              role: "tool",
              tool_call_id: toolCall.id,
              name: toolCall.function.name,
              content: "Search limit reached. Please generate the plan with available info."
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
      } else {
        break;
      }
    }

    // Fallback
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

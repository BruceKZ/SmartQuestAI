
import { GoogleGenerativeAI } from "@google/generative-ai";

async function listModels() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    console.error("No API key found");
    return;
  }

  // Fetch the list of models using the REST API because the SDK might not expose it easily in this version
  // or it's just easier to fetch directly.
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.models) {
        console.log("Available Models:");
        data.models.forEach((m: any) => {
            console.log(`- ${m.name} (${m.supportedGenerationMethods.join(', ')})`);
        });
    } else {
        console.log("No models found or error:", data);
    }

  } catch (error) {
    console.error("Error listing models:", error);
  }
}

// We need to read the env file manually since we are running with tsx
const fs = require('fs');
try {
    const envLocal = fs.readFileSync('.env.local', 'utf8');
    const match = envLocal.match(/GOOGLE_GENERATIVE_AI_API_KEY=(.*)/);
    if (match) {
        process.env.GOOGLE_GENERATIVE_AI_API_KEY = match[1];
    }
} catch (e) {}

listModels();

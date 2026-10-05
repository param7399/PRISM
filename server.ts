import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getGenAIClient() {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '2mb' }));

  // Multi-turn Gemini Career Mentor Chat Endpoint with optional Google Search Grounding
  app.post('/api/gemini/chat', async (req, res) => {
    try {
      const {
        messages = [],
        studentContext = {},
        modelMode = 'general',
        useSearch = false
      } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.status(400).json({
          error:
            'GEMINI_API_KEY is not configured. Please check your API key in the Settings > Secrets panel.'
        });
      }

      const ai = getGenAIClient();

      // Select model based on task complexity mode
      let selectedModel = 'gemini-3.8-flash';
      if (modelMode === 'fast' && !useSearch) {
        selectedModel = 'gemini-3.1-flash-lite';
      } else if (modelMode === 'complex') {
        selectedModel = 'gemini-3.1-pro-preview';
      }

      const systemInstruction = `You are the PRISM Career Mentor — a smart, practical engineering senior and career advisor for college students.
Your core philosophy is: "Don't just learn more. Know what to do next."

Current Student Profile Context:
- Name: ${studentContext.name || 'Alex'}
- College: ${studentContext.college || 'Demo University'} (${studentContext.degree || 'B.Tech'} in ${studentContext.branch || 'Computer Science & Engineering'}, ${studentContext.year || '3rd Year'})
- Career Goal: ${studentContext.careerGoal || 'AI / ML Engineer'}
- Career Readiness: ${studentContext.readiness ?? 72}%
- Current Skills: ${
        Array.isArray(studentContext.skills)
          ? studentContext.skills.map((s: { name: string; score: number; level: string }) => `${s.name} (${s.score}%, ${s.level})`).join(', ')
          : 'Python (82%), SQL (68%), DSA (61%), Machine Learning (45%)'
      }
- Projects: ${
        Array.isArray(studentContext.projects)
          ? studentContext.projects.map((p: { name: string; status: string }) => `${p.name} (${p.status})`).join(', ')
          : 'Expense Tracker (Completed), EcoLearn (In Progress)'
      }

Guidelines:
- Speak in plain, friendly, direct human language (2-4 short paragraphs or bullet points).
- Avoid generic AI hype or buzzwords.
- Give concrete, actionable advice tied to their current skill levels and projects.
- When Google Search grounding is active, cite concrete current benchmarks, tools, or opportunities.`;

      const formattedContents = messages.map(
        (m: { role: 'user' | 'model'; text: string }) => ({
          role: m.role === 'model' ? 'model' : 'user',
          parts: [{ text: m.text }]
        })
      );

      const config: Record<string, unknown> = {
        systemInstruction
      };

      if (useSearch) {
        config.tools = [{ googleSearch: {} }];
      }

      let response;
      try {
        response = await ai.models.generateContent({
          model: selectedModel,
          contents: formattedContents,
          config
        });
      } catch (err: unknown) {
        // If complex pro model requires billing key, fallback gracefully to gemini-3.8-flash
        if (selectedModel === 'gemini-3.1-pro-preview') {
          selectedModel = 'gemini-3.8-flash';
          response = await ai.models.generateContent({
            model: selectedModel,
            contents: formattedContents,
            config
          });
        } else {
          throw err;
        }
      }

      const text = response.text || 'I analyzed your profile. Let me know what skill or project you want to tackle next.';

      const rawChunks =
        response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = rawChunks
        .map((chunk: { web?: { uri?: string; title?: string } }) =>
          chunk.web?.uri
            ? {
                uri: chunk.web.uri,
                title: chunk.web.title || chunk.web.uri
              }
            : null
        )
        .filter(Boolean);

      return res.json({
        text,
        modelUsed: selectedModel,
        sources
      });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error('Gemini Chat API Error:', msg);
      return res.status(500).json({
        error: msg
      });
    }
  });

  // Google Search Grounding Endpoint for Live Career / Opportunity Insights
  app.post('/api/gemini/search-grounding', async (req, res) => {
    try {
      const { query, careerGoal = 'AI / ML Engineer', skills = [] } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.status(400).json({
          error:
            'GEMINI_API_KEY is not configured. Please check the Settings > Secrets panel.'
        });
      }

      const ai = getGenAIClient();
      const prompt =
        query ||
        `What are the most in-demand practical skills, open-source tools, and internship expectations right now for a 3rd year B.Tech student targeting ${careerGoal} who already knows ${skills.slice(0, 5).join(', ')}? Keep it concise and practical.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'You are PRISM Career Intelligence. Provide a concise, factual, student-friendly brief grounded in live Google Search data. Use clear bullet points and avoid fluff.',
          tools: [{ googleSearch: {} }]
        }
      });

      const rawChunks =
        response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = rawChunks
        .map((chunk: { web?: { uri?: string; title?: string } }) =>
          chunk.web?.uri
            ? {
                uri: chunk.web.uri,
                title: chunk.web.title || chunk.web.uri
              }
            : null
        )
        .filter(Boolean);

      return res.json({
        text: response.text || '',
        sources
      });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error('Gemini Search Grounding Error:', msg);
      return res.status(500).json({
        error: msg
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PRISM server running on http://localhost:${PORT}`);
  });
}

startServer();

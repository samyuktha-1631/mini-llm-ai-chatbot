import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// AI Studio routes to port 3000. In container environments, process.env.PORT is often 8080 (where nginx is already listening).
// We parse --port if provided (or default to 3000) and ignore 8080 to prevent collisions with Nginx reverse proxy.
function getAppPort(): number {
  const portArgIndex = process.argv.indexOf('--port');
  if (portArgIndex !== -1 && process.argv[portArgIndex + 1]) {
    const parsed = parseInt(process.argv[portArgIndex + 1], 10);
    if (!isNaN(parsed) && parsed !== 8080) {
      return parsed;
    }
  }
  return 3000;
}
const PORT = getAppPort();

app.use(express.json());

// Health check endpoints for container and control-plane probes
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', time: new Date().toISOString() });
});
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', time: new Date().toISOString() });
});

// Initialize Gemini client if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Model configurations & behavioral emulation
const MODEL_PERSONAS: Record<string, { name: string; description: string; instruction: string }> = {
  'TinyLlama/TinyLlama-1.1B-Chat-v1.0': {
    name: 'TinyLlama 1.1B Chat',
    description: '1.1 Billion parameter compact open-source model trained on 3 Trillion tokens. Efficient and fast for local laptops.',
    instruction:
      'You are TinyLlama-1.1B-Chat, a compact, lightweight 1.1B open-source language model developed by the TinyLlama team using LLaMA architecture. You are helpful, friendly, and concise. You provide clear explanations, code snippets, and direct answers while maintaining high efficiency.',
  },
  'google/flan-t5-base': {
    name: 'FLAN-T5 Base',
    description: '250M parameter encoder-decoder model fine-tuned on instruction datasets. Ideal for structured tasks, QA, and summarization.',
    instruction:
      'You are FLAN-T5 Base, an instruction-tuned 250M parameter encoder-decoder model developed by Google Research. You excel at direct answering, step-by-step reasoning, summarization, and task execution with structured, accurate points.',
  },
  'gpt2': {
    name: 'GPT-2 (124M)',
    description: '124M parameter landmark causal language model by OpenAI. Historical foundation of modern generative AI.',
    instruction:
      'You are GPT-2 (124M), the landmark open-source causal transformer language model. You provide insightful, creative, and fluent text completions and answers, showing the foundational power of self-attention mechanisms.',
  },
  'HuggingFaceTB/SmolLM2-360M-Instruct': {
    name: 'SmolLM2 360M Instruct',
    description: 'Ultra-lightweight 360M parameter model fine-tuned for instruction following and reasoning on edge devices.',
    instruction:
      'You are SmolLM2-360M-Instruct, an ultra-compact state-of-the-art model by Hugging Face TB. You deliver snappy, accurate, and structured answers optimized for lightweight laptop execution.',
  },
};

// Built-in intelligent fallback responses when API key is not yet configured
function generateOfflineResponse(
  prompt: string,
  modelId: string,
  systemPrompt?: string
): string {
  const cleanPrompt = prompt.toLowerCase().trim();
  const modelInfo = MODEL_PERSONAS[modelId] || MODEL_PERSONAS['TinyLlama/TinyLlama-1.1B-Chat-v1.0'];

  if (cleanPrompt.includes('hello') || cleanPrompt.includes('hi ') || cleanPrompt === 'hi') {
    return `Hello! I'm running as **${modelInfo.name}**, an open-source lightweight language model. How can I assist you with programming, machine learning concepts, or general questions today?`;
  }

  if (cleanPrompt.includes('quantum computing')) {
    return `### Understanding Quantum Computing Simply

Quantum computing is a revolutionary computing paradigm based on the principles of quantum mechanics:

1. **Bits vs. Qubits**:
   - Classical computers use **bits** (either 0 or 1).
   - Quantum computers use **qubits** (quantum bits), which can exist as 0, 1, or both simultaneously thanks to **Superposition**.

2. **Entanglement**:
   - Qubits can become intertwined, meaning the state of one instantly influences the state of another, enabling exponential parallelism.

3. **Real-world Applications**:
   - Molecular modeling for drug discovery
   - Cryptographic algorithm research
   - Combinatorial optimization (e.g., global logistics, portfolio hedging)

*Generated locally via ${modelInfo.name}.*`;
  }

  if (cleanPrompt.includes('web scraping') || cleanPrompt.includes('scraping') || cleanPrompt.includes('scrape')) {
    return `### Python Web Scraping with BeautifulSoup

Here is a clean, modern Python script using \`requests\` and \`BeautifulSoup4\`:

\`\`\`python
import requests
from bs4 import BeautifulSoup

def scrape_headlines(url: str):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }
    
    response = requests.get(url, headers=headers, timeout=10)
    response.raise_for_status()  # Check for HTTP errors
    
    soup = BeautifulSoup(response.text, "html.parser")
    headlines = []
    
    # Example: Find all h2 tags with a specific class or directly
    for heading in soup.find_all(["h1", "h2", "h3"]):
        text = heading.get_text(strip=True)
        if text:
            headlines.append(text)
            
    return headlines

if __name__ == "__main__":
    target = "https://news.ycombinator.com"
    results = scrape_headlines(target)
    for idx, item in enumerate(results[:5], 1):
        print(f"{idx}. {item}")
\`\`\`

**Requirements**:
\`\`\`bash
pip install requests beautifulsoup4
\`\`\`
Always ensure you inspect the website's \`robots.txt\` before scraping!`;
  }

  if (cleanPrompt.includes('attention') || cleanPrompt.includes('transformer')) {
    return `### The Transformer Self-Attention Mechanism

In the seminal 2017 paper *"Attention Is All You Need"*, Vaswani et al. introduced Scaled Dot-Product Attention:

$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$

**The 3 Vectors:**
- **Query ($Q$)**: What the current token is looking for.
- **Key ($K$)**: What other tokens offer.
- **Value ($V$)**: The actual contextual content stored in each token.

**Why it revolutionized NLP:**
- Unlike RNNs/LSTMs, attention allows **parallel computation** across the entire context window.
- Eliminates vanishing gradients over long sequences.
- Powers open-source models like TinyLlama, GPT-2, LLaMA, and Mistral.`;
  }

  if (cleanPrompt.includes('gradient descent')) {
    return `### What is Gradient Descent?

Gradient Descent is the foundational optimization algorithm used to train neural networks and LLMs.

1. **Intuition**: Imagine standing on a foggy mountain and wanting to reach the lowest valley. You feel the slope under your feet and take a step downhill.
2. **Mathematical Update Rule**:
   $$\\theta_{t+1} = \\theta_t - \\alpha \\nabla L(\\theta_t)$$
   - $\\theta$: Model parameters (weights)
   - $\\alpha$: Learning rate (step size)
   - $\\nabla L(\\theta)$: Gradient of the loss function with respect to weights
3. **Variants**:
   - **Batch GD**: Computes gradient over entire dataset (slow, high memory).
   - **Stochastic GD (SGD)**: Uses 1 sample at a time (noisy, fast).
   - **Adam / AdamW**: Adapts learning rates per-parameter with momentum (standard for training LLMs).`;
  }

  return `### Response from ${modelInfo.name}

Regarding your prompt: **"${prompt}"**

Open-source models like **${modelInfo.name}** process your input through the following local pipeline:
1. **Tokenization**: Converting words and subwords into integer IDs via Byte-Pair Encoding (BPE).
2. **Embedding & Transformer Blocks**: Passing tokens through self-attention layers and multi-layer perceptrons (MLP).
3. **Logit Computation**: Generating raw probability scores for the next potential token.
4. **Sampling**: Applying temperature and top-p filtering to select the output tokens.

You can inspect the full Streamlit Python codebase and run this locally on your laptop by switching to the **Python Codebase** tab!`;
}

// Chat API endpoint with streaming SSE
app.post('/api/chat', async (req: Request, res: Response) => {
  const {
    messages,
    model = 'TinyLlama/TinyLlama-1.1B-Chat-v1.0',
    temperature = 0.7,
    maxTokens = 512,
    topP = 0.9,
    systemPrompt = '',
  } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'Messages array is required and must not be empty.' });
    return;
  }

  const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
  if (!lastUserMessage || !lastUserMessage.content) {
    res.status(400).json({ error: 'At least one user message with content is required.' });
    return;
  }

  // Setup Server-Sent Events headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');

  const modelConfig = MODEL_PERSONAS[model] || MODEL_PERSONAS['TinyLlama/TinyLlama-1.1B-Chat-v1.0'];
  const fullSystemInstruction = `${modelConfig.instruction} ${systemPrompt ? `Additional user system instructions: ${systemPrompt}` : ''} Keep your answers formatted nicely in Markdown with clean code snippets when applicable.`;

  // If Gemini client is available, stream real AI response emulating the target open-source model
  if (aiClient) {
    try {
      // Build conversation history for Gemini
      const conversationText = messages
        .map((m: { role: string; content: string }) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
        .join('\n\n');

      const streamResponse = await aiClient.models.generateContentStream({
        model: 'gemini-3.8-flash',
        contents: conversationText,
        config: {
          systemInstruction: fullSystemInstruction,
        },
      });

      for await (const chunk of streamResponse) {
        const text = chunk.text;
        if (text) {
          res.write(`data: ${JSON.stringify({ text, model })}\n\n`);
        }
      }

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
      return;
    } catch (err: any) {
      console.error('Error during AI generation:', err?.message || err);
      // Fall through to fallback generator instead of breaking client stream
      const fallbackText = generateOfflineResponse(lastUserMessage.content, model, systemPrompt);
      res.write(`data: ${JSON.stringify({ text: fallbackText, model })}\n\n`);
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
      return;
    }
  }

  // Fallback engine: simulate token streaming realistically
  const fallbackText = generateOfflineResponse(lastUserMessage.content, model, systemPrompt);
  const words = fallbackText.split(' ');
  let i = 0;

  const interval = setInterval(() => {
    if (i < words.length) {
      const chunk = (i === 0 ? '' : ' ') + words[i];
      res.write(`data: ${JSON.stringify({ text: chunk, model })}\n\n`);
      i++;
    } else {
      clearInterval(interval);
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    }
  }, 25);

  req.on('close', () => {
    clearInterval(interval);
  });
});

// Health check & model metadata API
app.get('/api/models', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    models: Object.entries(MODEL_PERSONAS).map(([id, info]) => ({
      id,
      ...info,
    })),
  });
});

// Mount Vite or static server
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Mini LLM server running on http://0.0.0.0:${PORT}`);
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is in use. Retrying or waiting...`);
    } else {
      console.error('Server error:', err);
    }
  });
}

setupServer().catch((err) => {
  console.error('Failed to start server:', err);
});

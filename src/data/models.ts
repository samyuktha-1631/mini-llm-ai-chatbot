import { ModelInfo } from '../types';

export const OPEN_SOURCE_MODELS: ModelInfo[] = [
  {
    id: 'TinyLlama/TinyLlama-1.1B-Chat-v1.0',
    name: 'TinyLlama 1.1B Chat',
    badge: 'Recommended',
    params: '1.1 Billion',
    hardware: '4GB RAM / 2GB VRAM',
    contextWindow: 2048,
    description: 'Trained on 3 Trillion tokens. Clean chat alignment, rapid token generation, and ideal for standard laptops.',
    category: 'CausalLM',
  },
  {
    id: 'google/flan-t5-base',
    name: 'FLAN-T5 Base',
    badge: 'Instruction',
    params: '250 Million',
    hardware: '2GB RAM / CPU friendly',
    contextWindow: 512,
    description: 'Google Research encoder-decoder model fine-tuned on 1,800+ instruction tasks. Precise and concise for QA.',
    category: 'Seq2SeqLM',
  },
  {
    id: 'gpt2',
    name: 'GPT-2 Base (124M)',
    badge: 'Lightweight',
    params: '124 Million',
    hardware: '1GB RAM / Runs anywhere',
    contextWindow: 1024,
    description: 'OpenAI landmark causal transformer. Ultra-lightweight, minimal memory footprint, and instant verification.',
    category: 'CausalLM',
  },
  {
    id: 'HuggingFaceTB/SmolLM2-360M-Instruct',
    name: 'SmolLM2 360M Instruct',
    badge: 'Modern Edge',
    params: '360 Million',
    hardware: '2GB RAM / Edge devices',
    contextWindow: 2048,
    description: 'Hugging Face compact model trained on high-quality synthetic datasets. Fast and agile instruction following.',
    category: 'CausalLM',
  },
];

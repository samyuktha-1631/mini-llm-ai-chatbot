export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  modelId?: string;
  tokensEstimated?: number;
  latencyMs?: number;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  messages: Message[];
  modelId: string;
}

export interface ModelInfo {
  id: string;
  name: string;
  badge: string;
  params: string;
  hardware: string;
  contextWindow: number;
  description: string;
  category: 'CausalLM' | 'Seq2SeqLM';
}

export interface GenerationSettings {
  temperature: number;
  maxTokens: number;
  topP: number;
  systemPrompt: string;
  emulatedHardware: 'cpu' | 'mps' | 'cuda';
}

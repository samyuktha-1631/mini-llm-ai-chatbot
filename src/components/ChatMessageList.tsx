import React, { useRef, useEffect } from 'react';
import { Bot, User, Copy, Check, RotateCw, Sparkles, Terminal, BookOpen, Layers } from 'lucide-react';
import { Message, ModelInfo } from '../types';

interface ChatMessageListProps {
  messages: Message[];
  isLoading: boolean;
  streamingMessage: string;
  selectedModel: ModelInfo;
  onSelectPrompt: (prompt: string) => void;
  onRegenerate: () => void;
}

const STARTER_PROMPTS = [
  {
    icon: Sparkles,
    title: 'Explain Quantum Computing',
    prompt: 'Explain quantum computing in simple terms for beginners.',
  },
  {
    icon: Terminal,
    title: 'Python Web Scraper',
    prompt: 'Write a clean Python script using requests and BeautifulSoup to scrape headlines.',
  },
  {
    icon: Layers,
    title: 'Self-Attention Mechanism',
    prompt: 'How does the Transformer self-attention mechanism work mathematically and intuitively?',
  },
  {
    icon: BookOpen,
    title: 'Gradient Descent',
    prompt: 'What is gradient descent in machine learning and how does Adam optimizer improve it?',
  },
];

export const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  isLoading,
  streamingMessage,
  selectedModel,
  onSelectPrompt,
  onRegenerate,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingMessage, isLoading]);

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper to format code blocks and basic markdown nicely
  const renderFormattedContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        const lang = lines[0].trim();
        const code = (lang ? lines.slice(1) : lines).join('\n');

        return (
          <div key={index} className="my-3 rounded-lg overflow-hidden border border-matcha-800/80 bg-matcha-950 text-cream-100 font-mono text-xs shadow-2xs">
            <div className="flex items-center justify-between px-3.5 py-1.5 bg-matcha-900 border-b border-matcha-800 text-[11px] text-matcha-300">
              <span className="font-semibold">{lang || 'python'}</span>
              <button
                onClick={() => handleCopy(code, `code-${index}`)}
                className="flex items-center gap-1 hover:text-strawberry-300 text-matcha-300 transition-colors"
                title="Copy code"
              >
                {copiedId === `code-${index}` ? (
                  <>
                    <Check className="w-3 h-3 text-strawberry-400" />
                    <span className="text-strawberry-400 text-[10px]">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span className="text-[10px]">Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3.5 overflow-x-auto leading-relaxed text-cream-100">{code}</pre>
          </div>
        );
      }

      // Render regular text with markdown-like paragraph formatting
      return (
        <div key={index} className="whitespace-pre-wrap leading-relaxed text-sm space-y-2">
          {part}
        </div>
      );
    });
  };

  // Empty State: Welcome Screen
  if (messages.length === 0 && !isLoading && !streamingMessage) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-3xl mx-auto select-none">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-strawberry-500 via-strawberry-400 to-matcha-600 text-white flex items-center justify-center mb-4 shadow-sm text-2xl">
          🍓
        </div>

        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-matcha-950 dark:text-cream-50 mb-2">
          Mini LLM &middot; Strawberry Matcha
        </h1>
        <p className="text-xs md:text-sm text-matcha-700 dark:text-matcha-300 max-w-md mb-8 leading-relaxed">
          Powered by pre-trained open-source weights ({selectedModel.name}). Running 100% on-device on your laptop. Select a prompt below or type your question.
        </p>

        {/* Starter Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full text-left">
          {STARTER_PROMPTS.map((card, idx) => {
            const Icon = card.icon;
            return (
              <button
                key={idx}
                onClick={() => onSelectPrompt(card.prompt)}
                className="p-3.5 rounded-xl border border-strawberry-200/80 dark:border-matcha-800 bg-white/90 dark:bg-matcha-900/60 hover:border-strawberry-400 dark:hover:border-matcha-600 hover:bg-strawberry-50/60 dark:hover:bg-matcha-850/60 transition-all hover:shadow-2xs group cursor-pointer text-left"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="w-3.5 h-3.5 text-matcha-600 dark:text-matcha-400 group-hover:text-strawberry-600 dark:group-hover:text-strawberry-400 transition-colors" />
                  <span className="text-xs font-semibold text-matcha-950 dark:text-cream-100">
                    {card.title}
                  </span>
                </div>
                <p className="text-[11px] text-matcha-600 dark:text-matcha-400 line-clamp-2 leading-relaxed">
                  {card.prompt}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6 max-w-4xl mx-auto w-full">
      {messages.map((message) => {
        const isUser = message.role === 'user';

        return (
          <div
            key={message.id}
            className={`flex items-start gap-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}
          >
            {/* Assistant Avatar */}
            {!isUser && (
              <div className="w-8 h-8 rounded-lg bg-matcha-700 dark:bg-matcha-800 text-cream-50 border border-matcha-600 dark:border-matcha-700 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                <Bot className="w-4 h-4 text-cream-100" />
              </div>
            )}

            {/* Bubble Content */}
            <div
              className={`relative max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 text-sm ${
                isUser
                  ? 'bg-gradient-to-br from-strawberry-500 to-strawberry-600 text-white dark:from-strawberry-600 dark:to-strawberry-700 rounded-br-xs shadow-xs'
                  : 'bg-white dark:bg-matcha-900/90 border border-strawberry-100 dark:border-matcha-800/90 text-matcha-950 dark:text-cream-100 rounded-bl-xs shadow-xs'
              }`}
            >
              {/* Header inside assistant message */}
              {!isUser && (
                <div className="flex items-center justify-between gap-4 pb-2 mb-2 border-b border-strawberry-100 dark:border-matcha-800 text-[11px] text-matcha-500 dark:text-matcha-400">
                  <span className="font-semibold text-strawberry-700 dark:text-strawberry-400">
                    {message.modelId || selectedModel.name}
                  </span>
                  <div className="flex items-center gap-2 font-mono">
                    {message.tokensEstimated && (
                      <span className="tabular-nums">~{message.tokensEstimated} tokens</span>
                    )}
                    {message.latencyMs && (
                      <span className="tabular-nums">· {(message.latencyMs / 1000).toFixed(1)}s</span>
                    )}
                  </div>
                </div>
              )}

              {/* Message Body */}
              <div className="prose prose-sm max-w-none text-xs md:text-sm leading-relaxed">
                {renderFormattedContent(message.content)}
              </div>

              {/* Bottom Actions for Assistant Message */}
              {!isUser && (
                <div className="flex items-center justify-end gap-1.5 pt-2 mt-2 border-t border-strawberry-100 dark:border-matcha-800 text-matcha-400 dark:text-matcha-500">
                  <button
                    onClick={() => handleCopy(message.content, message.id)}
                    className="p-1 rounded hover:text-strawberry-600 dark:hover:text-strawberry-300 hover:bg-strawberry-50 dark:hover:bg-matcha-850 transition-colors"
                    title="Copy message"
                  >
                    {copiedId === message.id ? (
                      <Check className="w-3.5 h-3.5 text-strawberry-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={onRegenerate}
                    className="p-1 rounded hover:text-strawberry-600 dark:hover:text-strawberry-300 hover:bg-strawberry-50 dark:hover:bg-matcha-850 transition-colors"
                    title="Regenerate response"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* User Avatar */}
            {isUser && (
              <div className="w-8 h-8 rounded-lg bg-strawberry-100 dark:bg-strawberry-950 text-strawberry-700 dark:text-strawberry-300 border border-strawberry-200 dark:border-strawberry-800 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        );
      })}

      {/* Real-time Streaming Message */}
      {streamingMessage && (
        <div className="flex items-start gap-3.5 justify-start">
          <div className="w-8 h-8 rounded-lg bg-matcha-700 dark:bg-matcha-800 text-cream-50 border border-matcha-600 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
            <Bot className="w-4 h-4 text-cream-100" />
          </div>

          <div className="relative max-w-[85%] md:max-w-[75%] rounded-2xl rounded-bl-xs px-4 py-3 bg-white dark:bg-matcha-900/90 border border-strawberry-200 dark:border-matcha-800 text-matcha-950 dark:text-cream-100 text-sm shadow-xs">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-strawberry-100 dark:border-matcha-800 text-[11px]">
              <span className="font-semibold text-strawberry-700 dark:text-strawberry-400">{selectedModel.name}</span>
              <span className="animate-pulse text-strawberry-600 dark:text-strawberry-400 font-mono text-[10px]">● streaming tokens...</span>
            </div>
            <div className="prose prose-sm max-w-none text-xs md:text-sm">
              {renderFormattedContent(streamingMessage)}
              <span className="inline-block w-2 h-4 ml-1 bg-strawberry-500 animate-pulse align-middle" />
            </div>
          </div>
        </div>
      )}

      {/* Loading Spinner Indicator */}
      {isLoading && !streamingMessage && (
        <div className="flex items-start gap-3.5 justify-start">
          <div className="w-8 h-8 rounded-lg bg-matcha-700 dark:bg-matcha-800 text-cream-50 border border-matcha-600 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
            <Bot className="w-4 h-4 text-cream-100" />
          </div>

          <div className="rounded-2xl rounded-bl-xs px-4 py-3 bg-white dark:bg-matcha-900/90 border border-strawberry-100 dark:border-matcha-800 text-matcha-700 dark:text-matcha-300 text-xs flex items-center gap-2.5 shadow-xs">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-strawberry-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-matcha-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-strawberry-500 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span>Evaluating prompt & loading model weights...</span>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};

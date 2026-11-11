import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Square, AlertCircle } from 'lucide-react';
import { ModelInfo } from '../types';

interface ChatInputAreaProps {
  onSendMessage: (prompt: string) => void;
  isLoading: boolean;
  onStopGeneration: () => void;
  errorMessage: string | null;
  onClearError: () => void;
  selectedModel: ModelInfo;
}

export const ChatInputArea: React.FC<ChatInputAreaProps> = ({
  onSendMessage,
  isLoading,
  onStopGeneration,
  errorMessage,
  onClearError,
  selectedModel,
}) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    onSendMessage(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Rough token estimation (~4 characters per token)
  const estimatedTokens = Math.ceil(input.length / 4);

  return (
    <div className="shrink-0 p-4 max-w-4xl mx-auto w-full">
      {/* Error Banner */}
      {errorMessage && (
        <div className="mb-3 px-3 py-2 bg-strawberry-50 dark:bg-strawberry-950/40 border border-strawberry-200 dark:border-strawberry-900/60 rounded-lg flex items-center justify-between text-xs text-strawberry-700 dark:text-strawberry-300">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-strawberry-500" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={onClearError}
            className="text-strawberry-500 hover:text-strawberry-700 dark:hover:text-strawberry-200 font-bold ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Input Capsule */}
      <div className="relative bg-white dark:bg-matcha-900 border border-strawberry-200/90 dark:border-matcha-700 focus-within:border-strawberry-400 dark:focus-within:border-matcha-500 rounded-2xl shadow-xs transition-all p-2">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Ask ${selectedModel.name} anything...`}
          rows={1}
          className="w-full bg-transparent resize-none text-sm text-matcha-950 dark:text-cream-50 placeholder-matcha-400/80 dark:placeholder-matcha-500 focus:outline-none px-2 py-1 max-h-44 leading-relaxed font-sans"
        />

        <div className="flex items-center justify-between pt-1 px-1 text-[11px] text-matcha-500 dark:text-matcha-400">
          <span className="font-mono">
            {input.length > 0 ? `~${estimatedTokens} tokens (${input.length} chars)` : 'Shift+Enter for newline'}
          </span>

          <div className="flex items-center gap-2">
            {isLoading ? (
              <button
                type="button"
                onClick={onStopGeneration}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-strawberry-600 hover:bg-strawberry-700 rounded-lg transition-colors shadow-2xs"
              >
                <Square className="w-3 h-3 fill-current" />
                <span>Stop</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={!input.trim()}
                className="p-1.5 rounded-lg bg-strawberry-500 hover:bg-strawberry-600 dark:bg-matcha-700 dark:hover:bg-matcha-600 text-white disabled:opacity-30 disabled:hover:bg-strawberry-500 dark:disabled:hover:bg-matcha-700 transition-all shadow-xs"
                title="Send message"
                aria-label="Send message"
              >
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="text-center mt-2 text-[10px] text-matcha-500 dark:text-matcha-400">
        Mini LLM &middot; Strawberry Matcha &middot; Runs pre-trained weights locally on laptop with PyTorch.
      </div>
    </div>
  );
};

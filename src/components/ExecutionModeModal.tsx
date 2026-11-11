import React from 'react';
import { ShieldCheck, HardDrive, Cpu, WifiOff, KeyRound, Check, X, ArrowRight } from 'lucide-react';

interface ExecutionModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCode: () => void;
}

export const ExecutionModeModal: React.FC<ExecutionModeModalProps> = ({
  isOpen,
  onClose,
  onOpenCode,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-matcha-950/70 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-xl bg-cream-50 dark:bg-matcha-900 border border-strawberry-200 dark:border-matcha-700 rounded-2xl shadow-2xl overflow-hidden text-matcha-950 dark:text-cream-50 font-sans">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-strawberry-100 dark:border-matcha-800 bg-white/70 dark:bg-matcha-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-strawberry-100 dark:bg-matcha-800 text-strawberry-600 dark:text-cream-100 flex items-center justify-center font-bold text-sm">
              🍓
            </div>
            <div>
              <h2 className="text-sm font-bold text-matcha-950 dark:text-cream-50">
                Runs On-Device (Zero API Keys)
              </h2>
              <p className="text-[11px] text-matcha-600 dark:text-matcha-400">
                Mini LLM &middot; Strawberry Matcha on-device architecture
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-matcha-400 hover:text-strawberry-600 dark:hover:text-strawberry-300 rounded-md transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-xs max-h-[75vh] overflow-y-auto">
          {/* Quick Answer Banner */}
          <div className="p-3.5 rounded-xl bg-matcha-50 dark:bg-matcha-950/70 border border-matcha-200/90 dark:border-matcha-700 space-y-1.5 shadow-2xs">
            <div className="flex items-center gap-2 text-matcha-900 dark:text-matcha-200 font-semibold text-xs">
              <Check className="w-4 h-4 text-matcha-600 dark:text-matcha-400" />
              <span>100% On-Device &middot; No API Key Needed</span>
            </div>
            <p className="text-[11px] text-matcha-700 dark:text-cream-200 leading-relaxed">
              The Python project code (<code>app.py</code> and <code>model_loader.py</code>) executes entirely on your laptop’s own hardware via <strong>PyTorch</strong> and <strong>Hugging Face Transformers</strong>. It does <em>not</em> connect to OpenAI, Anthropic, or any paid API.
            </p>
          </div>

          {/* Key Advantages Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl border border-strawberry-100 dark:border-matcha-800 bg-white dark:bg-matcha-950/60 space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-2 text-matcha-950 dark:text-cream-100 font-semibold">
                <WifiOff className="w-3.5 h-3.5 text-strawberry-500" />
                <span>Works 100% Offline</span>
              </div>
              <p className="text-[11px] text-matcha-600 dark:text-matcha-400 leading-relaxed">
                Weights are saved to <code>~/.cache/huggingface/</code>. Once downloaded, you can turn off Wi-Fi and prompts still generate locally.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-strawberry-100 dark:border-matcha-800 bg-white dark:bg-matcha-950/60 space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-2 text-matcha-950 dark:text-cream-100 font-semibold">
                <KeyRound className="w-3.5 h-3.5 text-matcha-600 dark:text-matcha-400" />
                <span>No Subscriptions or Keys</span>
              </div>
              <p className="text-[11px] text-matcha-600 dark:text-matcha-400 leading-relaxed">
                Open-source models (TinyLlama, GPT-2, FLAN-T5) are licensed under Apache 2.0 / MIT. No credit cards, tokens, or rate limits.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-strawberry-100 dark:border-matcha-800 bg-white dark:bg-matcha-950/60 space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-2 text-matcha-950 dark:text-cream-100 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-matcha-600 dark:text-matcha-400" />
                <span>Complete Privacy</span>
              </div>
              <p className="text-[11px] text-matcha-600 dark:text-matcha-400 leading-relaxed">
                Your chat messages and data never leave your computer's RAM/VRAM. No external server logs your queries.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-strawberry-100 dark:border-matcha-800 bg-white dark:bg-matcha-950/60 space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-2 text-matcha-950 dark:text-cream-100 font-semibold">
                <HardDrive className="w-3.5 h-3.5 text-strawberry-500" />
                <span>Hardware Acceleration</span>
              </div>
              <p className="text-[11px] text-matcha-600 dark:text-matcha-400 leading-relaxed">
                Automatically uses <strong>NVIDIA CUDA</strong> on Windows/Linux or <strong>Apple Silicon MPS</strong> on Mac, falling back to CPU.
              </p>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="border border-strawberry-200 dark:border-matcha-800 rounded-xl overflow-hidden shadow-2xs">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-matcha-100/60 dark:bg-matcha-950 font-semibold text-matcha-900 dark:text-cream-200 border-b border-strawberry-200 dark:border-matcha-800">
                <tr>
                  <th className="p-2.5">Feature</th>
                  <th className="p-2.5 text-strawberry-700 dark:text-strawberry-400 font-bold">Mini LLM (On-Device)</th>
                  <th className="p-2.5 text-matcha-500">Cloud API (OpenAI / Gemini)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-strawberry-100 dark:divide-matcha-800/80 bg-white dark:bg-matcha-900/60">
                <tr>
                  <td className="p-2.5 font-medium text-matcha-950 dark:text-cream-100">API Key Needed?</td>
                  <td className="p-2.5 font-semibold text-matcha-700 dark:text-matcha-300">NO (Zero keys)</td>
                  <td className="p-2.5 text-matcha-500">Yes (Paid or quota-limited)</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-matcha-950 dark:text-cream-100">Internet Required?</td>
                  <td className="p-2.5 text-matcha-800 dark:text-cream-200">Only once to download weights</td>
                  <td className="p-2.5 text-matcha-500">Always required</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-matcha-950 dark:text-cream-100">Where Weights Run</td>
                  <td className="p-2.5 text-matcha-800 dark:text-cream-200">Your laptop’s RAM/GPU</td>
                  <td className="p-2.5 text-matcha-500">Remote Cloud Servers</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-matcha-950 dark:text-cream-100">Data Privacy</td>
                  <td className="p-2.5 font-semibold text-strawberry-700 dark:text-strawberry-400">100% Private on laptop</td>
                  <td className="p-2.5 text-matcha-500">Sent over internet</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-strawberry-100 dark:border-matcha-800 bg-white/70 dark:bg-matcha-950/70 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onOpenCode();
            }}
            className="flex items-center gap-1.5 text-xs text-matcha-800 hover:text-strawberry-600 dark:text-matcha-300 dark:hover:text-strawberry-300 font-medium"
          >
            <span>Inspect Python code</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold bg-matcha-700 text-white hover:bg-matcha-800 dark:bg-strawberry-600 dark:hover:bg-strawberry-500 rounded-lg transition-colors shadow-2xs"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

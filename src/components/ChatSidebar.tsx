import React, { useState } from 'react';
import { Plus, Trash2, Sliders, ChevronDown, ChevronRight, MessageSquare, ShieldCheck, Cpu } from 'lucide-react';
import { ChatSession, GenerationSettings } from '../types';
import { OPEN_SOURCE_MODELS } from '../data/models';

interface ChatSidebarProps {
  isOpen: boolean;
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
  onClearCurrentChat: () => void;
  selectedModelId: string;
  onSelectModel: (modelId: string) => void;
  settings: GenerationSettings;
  onUpdateSettings: (newSettings: Partial<GenerationSettings>) => void;
  onOpenDeviceModal?: () => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  isOpen,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onClearCurrentChat,
  selectedModelId,
  onSelectModel,
  settings,
  onUpdateSettings,
  onOpenDeviceModal,
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const selectedModel = OPEN_SOURCE_MODELS.find((m) => m.id === selectedModelId) || OPEN_SOURCE_MODELS[0];

  if (!isOpen) return null;

  return (
    <aside className="w-72 md:w-80 h-[calc(100vh-3.5rem)] flex flex-col border-r border-strawberry-100 dark:border-matcha-800/80 bg-cream-50/70 dark:bg-matcha-950/95 shrink-0 text-matcha-950 dark:text-cream-100 z-10 select-none transition-colors">
      {/* Top CTA: New Chat */}
      <div className="p-3 border-b border-strawberry-100 dark:border-matcha-800/80">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-strawberry-500 to-strawberry-600 hover:from-strawberry-600 hover:to-strawberry-700 dark:from-matcha-700 dark:to-matcha-600 dark:hover:from-matcha-600 dark:hover:to-matcha-500 rounded-lg shadow-xs transition-all active:scale-[0.99]"
        >
          <span className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </span>
          <span className="text-[10px] font-mono text-white/80 bg-black/15 px-1.5 py-0.5 rounded">
            ⌘K
          </span>
        </button>
      </div>

      {/* Model Selection Card */}
      <div className="p-3 border-b border-strawberry-100 dark:border-matcha-800/80 space-y-2">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-matcha-700 dark:text-matcha-400 flex items-center justify-between">
          <span>Pre-Trained Model</span>
          <span className="text-[10px] text-strawberry-600 dark:text-strawberry-400 font-mono font-normal">local weights</span>
        </label>
        <select
          value={selectedModelId}
          onChange={(e) => onSelectModel(e.target.value)}
          className="w-full text-xs bg-white dark:bg-matcha-900 border border-strawberry-200/80 dark:border-matcha-700 rounded-md px-2.5 py-2 text-matcha-950 dark:text-cream-100 font-medium focus:outline-none focus:ring-1 focus:ring-strawberry-400 dark:focus:ring-matcha-500"
        >
          {OPEN_SOURCE_MODELS.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name} ({model.params})
            </option>
          ))}
        </select>

        {/* Model Spec Card */}
        <div className="bg-white/80 dark:bg-matcha-900/60 border border-strawberry-200/60 dark:border-matcha-800 rounded-md p-2.5 space-y-1.5 text-[11px]">
          <div className="flex items-center justify-between text-matcha-600 dark:text-matcha-400">
            <span>Architecture:</span>
            <span className="font-mono font-medium text-strawberry-700 dark:text-strawberry-300">{selectedModel.category}</span>
          </div>
          <div className="flex items-center justify-between text-matcha-600 dark:text-matcha-400">
            <span>Memory requirement:</span>
            <span className="font-mono font-medium text-matcha-900 dark:text-cream-100">{selectedModel.hardware}</span>
          </div>
          <div className="flex items-center justify-between text-matcha-600 dark:text-matcha-400">
            <span>Context window:</span>
            <span className="font-mono font-medium text-matcha-900 dark:text-cream-100">{selectedModel.contextWindow} tokens</span>
          </div>
          <p className="text-matcha-600 dark:text-matcha-300 pt-1 border-t border-strawberry-100 dark:border-matcha-800 leading-relaxed text-[11px]">
            {selectedModel.description}
          </p>
        </div>
      </div>

      {/* Sessions / Chat History List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        <div className="flex items-center justify-between px-1 mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-matcha-700 dark:text-matcha-400">
            Conversations
          </span>
          <span className="text-[10px] font-mono text-strawberry-600 dark:text-strawberry-400 tabular-nums">
            {sessions.length} saved
          </span>
        </div>

        {sessions.length === 0 ? (
          <div className="text-center py-8 text-matcha-400 dark:text-matcha-500 text-xs">
            No previous chats yet. Start a conversation!
          </div>
        ) : (
          sessions.map((session) => {
            const isActive = session.id === activeSessionId;
            return (
              <div
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className={`group flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer text-xs transition-colors ${
                  isActive
                    ? 'bg-strawberry-100/90 dark:bg-matcha-850 text-strawberry-900 dark:text-strawberry-200 font-semibold border border-strawberry-200 dark:border-matcha-700 shadow-2xs'
                    : 'text-matcha-800 dark:text-matcha-300 hover:bg-strawberry-50/70 dark:hover:bg-matcha-900 hover:text-strawberry-700 dark:hover:text-cream-100'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                  <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-strawberry-500' : 'text-matcha-400'}`} />
                  <span className="truncate">{session.title}</span>
                </div>
                {sessions.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-matcha-400 hover:text-strawberry-600 dark:hover:text-strawberry-400 rounded transition-all"
                    title="Delete session"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Model Hyperparameters Accordion */}
      <div className="border-t border-strawberry-100 dark:border-matcha-800/80">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-matcha-800 dark:text-matcha-300 hover:bg-strawberry-50/70 dark:hover:bg-matcha-900 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-strawberry-500 dark:text-strawberry-400" />
            <span>Generation Parameters</span>
          </span>
          {showSettings ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>

        {showSettings && (
          <div className="p-3 bg-white/70 dark:bg-matcha-900/50 border-t border-strawberry-100 dark:border-matcha-800/80 space-y-3 text-xs">
            {/* Temperature */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-matcha-700 dark:text-matcha-300">Temperature</span>
                <span className="font-mono tabular-nums text-strawberry-600 dark:text-strawberry-400 font-semibold">
                  {settings.temperature.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.5"
                step="0.05"
                value={settings.temperature}
                onChange={(e) => onUpdateSettings({ temperature: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-matcha-200 dark:bg-matcha-800 rounded-lg appearance-none cursor-pointer accent-strawberry-500 dark:accent-strawberry-400"
              />
              <div className="flex justify-between text-[9px] text-matcha-500 dark:text-matcha-400">
                <span>Precise (0.1)</span>
                <span>Creative (1.5)</span>
              </div>
            </div>

            {/* Max Tokens */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-matcha-700 dark:text-matcha-300">Max New Tokens</span>
                <span className="font-mono tabular-nums text-strawberry-600 dark:text-strawberry-400 font-semibold">
                  {settings.maxTokens}
                </span>
              </div>
              <input
                type="range"
                min="64"
                max="1024"
                step="64"
                value={settings.maxTokens}
                onChange={(e) => onUpdateSettings({ maxTokens: parseInt(e.target.value, 10) })}
                className="w-full h-1.5 bg-matcha-200 dark:bg-matcha-800 rounded-lg appearance-none cursor-pointer accent-matcha-600 dark:accent-matcha-400"
              />
            </div>

            {/* Top-P */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-matcha-700 dark:text-matcha-300">Top-P (Nucleus)</span>
                <span className="font-mono tabular-nums text-matcha-700 dark:text-matcha-300 font-semibold">
                  {settings.topP.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={settings.topP}
                onChange={(e) => onUpdateSettings({ topP: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-matcha-200 dark:bg-matcha-800 rounded-lg appearance-none cursor-pointer accent-strawberry-500 dark:accent-strawberry-400"
              />
            </div>

            {/* Emulated Hardware Speed */}
            <div className="space-y-1 pt-1 border-t border-strawberry-100 dark:border-matcha-800">
              <label className="text-[11px] text-matcha-700 dark:text-matcha-300 flex items-center gap-1.5">
                <Cpu className="w-3 h-3 text-matcha-600 dark:text-matcha-400" />
                <span>Target Hardware Acceleration</span>
              </label>
              <div className="grid grid-cols-3 gap-1 p-0.5 bg-matcha-100/70 dark:bg-matcha-900 rounded">
                {(['cpu', 'mps', 'cuda'] as const).map((hw) => (
                  <button
                    key={hw}
                    onClick={() => onUpdateSettings({ emulatedHardware: hw })}
                    className={`py-1 text-[10px] font-mono rounded transition-colors ${
                      settings.emulatedHardware === hw
                        ? 'bg-strawberry-500 dark:bg-matcha-700 font-bold text-white shadow-xs'
                        : 'text-matcha-700 hover:text-strawberry-700 dark:text-matcha-300 dark:hover:text-white'
                    }`}
                  >
                    {hw.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Footer Actions */}
      <div className="p-3 border-t border-strawberry-100 dark:border-matcha-800/80 bg-white/40 dark:bg-matcha-950/80 space-y-2">
        {showClearConfirm ? (
          <div className="bg-strawberry-50 dark:bg-strawberry-950/40 border border-strawberry-200 dark:border-strawberry-900/60 rounded-lg p-2.5 space-y-2">
            <p className="text-[11px] text-strawberry-700 dark:text-strawberry-300">
              Clear all messages in this conversation?
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onClearCurrentChat();
                  setShowClearConfirm(false);
                }}
                className="flex-1 py-1 text-[11px] font-semibold bg-strawberry-600 text-white rounded hover:bg-strawberry-700 transition-colors"
              >
                Yes, Clear
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-1 text-[11px] font-medium bg-matcha-100 dark:bg-matcha-800 text-matcha-800 dark:text-cream-200 rounded hover:bg-matcha-200 dark:hover:bg-matcha-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs text-matcha-700 dark:text-matcha-300 hover:text-strawberry-600 dark:hover:text-strawberry-300 hover:bg-strawberry-50 dark:hover:bg-matcha-900 rounded-md transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Current Chat</span>
          </button>
        )}

        {/* Clean hardware guarantee note */}
        <button
          onClick={onOpenDeviceModal}
          className="w-full flex items-center justify-between gap-1.5 text-[10px] text-matcha-600 hover:text-strawberry-700 dark:text-matcha-300 dark:hover:text-strawberry-300 px-2 py-1 rounded hover:bg-strawberry-50 dark:hover:bg-matcha-900 transition-colors text-left border border-transparent hover:border-strawberry-200 dark:hover:border-matcha-700"
          title="Click to learn how on-device execution works without API keys"
        >
          <div className="flex items-center gap-1.5 truncate">
            <ShieldCheck className="w-3.5 h-3.5 text-matcha-500 dark:text-matcha-400 shrink-0" />
            <span className="truncate font-medium">100% On-Device · No API Key</span>
          </div>
          <span className="text-[9px] text-strawberry-600 dark:text-strawberry-400 font-mono">Info &rarr;</span>
        </button>
      </div>
    </aside>
  );
};

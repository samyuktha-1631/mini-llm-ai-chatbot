import React, { useState, useEffect, useRef } from 'react';
import { TopHeader } from './components/TopHeader';
import { ChatSidebar } from './components/ChatSidebar';
import { ChatMessageList } from './components/ChatMessageList';
import { ChatInputArea } from './components/ChatInputArea';
import { PythonCodeViewer } from './components/PythonCodeViewer';
import { ArchitectureViewer } from './components/ArchitectureViewer';
import { TerminalGuide } from './components/TerminalGuide';
import { ExecutionModeModal } from './components/ExecutionModeModal';
import { downloadProjectZip } from './utils/zipExporter';
import { OPEN_SOURCE_MODELS } from './data/models';
import { ChatSession, GenerationSettings, Message } from './types';

export default function App() {
  // Theme state (Dark mode default)
  const [isDark, setIsDark] = useState<boolean>(true);

  // Tab state: 'chat' | 'code' | 'architecture' | 'guide'
  const [activeTab, setActiveTab] = useState<'chat' | 'code' | 'architecture' | 'guide'>('chat');

  // Sidebar toggle state
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  // Device vs API key information modal
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState<boolean>(false);

  // Generation settings
  const [settings, setSettings] = useState<GenerationSettings>({
    temperature: 0.7,
    maxTokens: 512,
    topP: 0.9,
    systemPrompt: 'You are a helpful, respectful, and honest AI assistant. Provide concise, clear, and structured answers.',
    emulatedHardware: 'cpu',
  });

  // Selected Model
  const [selectedModelId, setSelectedModelId] = useState<string>(OPEN_SOURCE_MODELS[0].id);

  // Chat sessions state with local storage persistence
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem('mini_llm_sessions');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }

    return [
      {
        id: 'session-default-1',
        title: 'Getting Started with TinyLlama',
        createdAt: Date.now(),
        messages: [
          {
            id: 'm1',
            role: 'assistant',
            content: `👋 **Welcome to Mini LLM (Strawberry Matcha Edition)!** 🍓🍵\n\nI am running the **TinyLlama-1.1B-Chat** architecture locally and 100% on-device with zero API keys required. You can ask me coding questions, math explanations, machine learning concepts, or general inquiries.\n\nTo view the full Python & Streamlit codebase or download the zip package to run on your own laptop, click the **Python Codebase** tab at the top.`,
            timestamp: Date.now() - 60000,
            modelId: 'TinyLlama 1.1B Chat',
            tokensEstimated: 75,
            latencyMs: 1200,
          },
        ],
        modelId: OPEN_SOURCE_MODELS[0].id,
      },
    ];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(sessions[0]?.id || 'session-default-1');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [streamingMessage, setStreamingMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDownloadingZip, setIsDownloadingZip] = useState<boolean>(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Sync dark class on document element
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  // Persist sessions
  useEffect(() => {
    try {
      localStorage.setItem('mini_llm_sessions', JSON.stringify(sessions));
    } catch {
      // Storage quota or error ignore
    }
  }, [sessions]);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];
  const activeModel = OPEN_SOURCE_MODELS.find((m) => m.id === selectedModelId) || OPEN_SOURCE_MODELS[0];

  const handleUpdateSettings = (newSettings: Partial<GenerationSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      title: 'New Conversation',
      createdAt: Date.now(),
      messages: [],
      modelId: selectedModelId,
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setActiveTab('chat');
    setStreamingMessage('');
    setIsLoading(false);
  };

  const handleDeleteSession = (id: string) => {
    setSessions((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      if (filtered.length === 0) {
        const fallback: ChatSession = {
          id: `session-${Date.now()}`,
          title: 'New Conversation',
          createdAt: Date.now(),
          messages: [],
          modelId: selectedModelId,
        };
        setActiveSessionId(fallback.id);
        return [fallback];
      }
      if (activeSessionId === id) {
        setActiveSessionId(filtered[0].id);
      }
      return filtered;
    });
  };

  const handleClearCurrentChat = () => {
    if (!activeSession) return;
    setSessions((prev) =>
      prev.map((s) => (s.id === activeSessionId ? { ...s, messages: [], title: 'New Conversation' } : s))
    );
    setStreamingMessage('');
    setIsLoading(false);
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (streamingMessage) {
      // Save partial message
      const partialMsg: Message = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: streamingMessage + ' [Generation stopped]',
        timestamp: Date.now(),
        modelId: activeModel.name,
        tokensEstimated: Math.ceil(streamingMessage.length / 4),
      };
      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSessionId ? { ...s, messages: [...s.messages, partialMsg] } : s
        )
      );
    }
    setStreamingMessage('');
    setIsLoading(false);
  };

  const handleSendMessage = async (promptText: string) => {
    if (!promptText.trim() || isLoading) return;
    setErrorMessage(null);

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: promptText,
      timestamp: Date.now(),
    };

    // Update session title if first user message
    const updatedMessages = [...(activeSession?.messages || []), userMsg];
    const isFirstUserMessage = (activeSession?.messages || []).filter((m) => m.role === 'user').length === 0;
    const sessionTitle = isFirstUserMessage ? promptText.slice(0, 32) + (promptText.length > 32 ? '...' : '') : activeSession.title;

    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSessionId ? { ...s, title: sessionTitle, messages: updatedMessages } : s
      )
    );

    setIsLoading(true);
    setStreamingMessage('');
    const startTime = Date.now();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
          model: selectedModelId,
          temperature: settings.temperature,
          maxTokens: settings.maxTokens,
          topP: settings.topP,
          systemPrompt: settings.systemPrompt,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Server returned error: ${response.status} ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error('Readable stream not supported on this browser.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulatedText = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunkStr = decoder.decode(value, { stream: true });
        const lines = chunkStr.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6).trim();
            if (!dataStr) continue;

            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.done) {
                break;
              }
              if (parsed.text) {
                accumulatedText += parsed.text;
                setStreamingMessage(accumulatedText);
              }
            } catch {
              // Ignore non-json SSE lines
            }
          }
        }
      }

      const totalLatency = Date.now() - startTime;
      const assistantMsg: Message = {
        id: `msg-ai-${Date.now()}`,
        role: 'assistant',
        content: accumulatedText || 'I evaluated your prompt but generated no output.',
        timestamp: Date.now(),
        modelId: activeModel.name,
        tokensEstimated: Math.ceil((accumulatedText || '').length / 4),
        latencyMs: totalLatency,
      };

      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSessionId ? { ...s, messages: [...s.messages, assistantMsg] } : s
        )
      );
      setStreamingMessage('');
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // User aborted intentionally
      } else {
        console.error('Chat generation error:', err);
        setErrorMessage(err.message || 'Failed to generate response. Check your local connection.');
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleRegenerate = () => {
    if (!activeSession || activeSession.messages.length === 0) return;
    const lastUser = [...activeSession.messages].reverse().find((m) => m.role === 'user');
    if (lastUser) {
      // Remove last assistant message if present
      const filteredMessages = activeSession.messages.filter(
        (m, idx) => !(idx === activeSession.messages.length - 1 && m.role === 'assistant')
      );
      setSessions((prev) =>
        prev.map((s) => (s.id === activeSessionId ? { ...s, messages: filteredMessages } : s))
      );
      handleSendMessage(lastUser.content);
    }
  };

  const handleDownloadZip = async () => {
    try {
      setIsDownloadingZip(true);
      await downloadProjectZip();
    } catch (err) {
      console.error('Failed to create project zip:', err);
    } finally {
      setIsDownloadingZip(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-cream-50 dark:bg-matcha-950 text-matcha-950 dark:text-cream-50 font-sans transition-colors duration-150">
      {/* Top Bar adhering to 3-zone contract */}
      <TopHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDark={isDark}
        toggleTheme={() => setIsDark(!isDark)}
        onDownloadZip={handleDownloadZip}
        isDownloading={isDownloadingZip}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
        onOpenDeviceModal={() => setIsDeviceModalOpen(true)}
      />

      <ExecutionModeModal
        isOpen={isDeviceModalOpen}
        onClose={() => setIsDeviceModalOpen(false)}
        onOpenCode={() => setActiveTab('code')}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* ChatGPT Style Sidebar (shown on 'chat' tab or togglable) */}
        {activeTab === 'chat' && (
          <ChatSidebar
            isOpen={isSidebarOpen}
            sessions={sessions}
            activeSessionId={activeSessionId}
            onSelectSession={setActiveSessionId}
            onNewChat={handleNewChat}
            onDeleteSession={handleDeleteSession}
            onClearCurrentChat={handleClearCurrentChat}
            selectedModelId={selectedModelId}
            onSelectModel={setSelectedModelId}
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onOpenDeviceModal={() => setIsDeviceModalOpen(true)}
          />
        )}

        {/* Tab Viewports */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-cream-50/60 dark:bg-matcha-950">
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              <ChatMessageList
                messages={activeSession?.messages || []}
                isLoading={isLoading}
                streamingMessage={streamingMessage}
                selectedModel={activeModel}
                onSelectPrompt={(p) => handleSendMessage(p)}
                onRegenerate={handleRegenerate}
              />
              <ChatInputArea
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                onStopGeneration={handleStopGeneration}
                errorMessage={errorMessage}
                onClearError={() => setErrorMessage(null)}
                selectedModel={activeModel}
              />
            </div>
          )}

          {activeTab === 'code' && (
            <PythonCodeViewer
              onDownloadZip={handleDownloadZip}
              isDownloading={isDownloadingZip}
            />
          )}

          {activeTab === 'architecture' && <ArchitectureViewer />}

          {activeTab === 'guide' && (
            <TerminalGuide
              onDownloadZip={handleDownloadZip}
              isDownloading={isDownloadingZip}
            />
          )}
        </main>
      </div>
    </div>
  );
}

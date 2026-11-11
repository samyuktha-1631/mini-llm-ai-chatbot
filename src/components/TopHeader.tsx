import React from 'react';
import { Download, Moon, Sun, Terminal, Code2, Cpu, MessageSquare } from 'lucide-react';

interface TopHeaderProps {
  activeTab: 'chat' | 'code' | 'architecture' | 'guide';
  setActiveTab: (tab: 'chat' | 'code' | 'architecture' | 'guide') => void;
  isDark: boolean;
  toggleTheme: () => void;
  onDownloadZip: () => void;
  isDownloading: boolean;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  onOpenDeviceModal: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  activeTab,
  setActiveTab,
  isDark,
  toggleTheme,
  onDownloadZip,
  isDownloading,
  onToggleSidebar,
  isSidebarOpen,
  onOpenDeviceModal,
}) => {
  return (
    <header className="h-14 border-b border-strawberry-100 dark:border-matcha-800/80 bg-cream-50/90 dark:bg-matcha-950/90 backdrop-blur-md px-4 md:px-6 flex items-center justify-between gap-8 shrink-0 select-none z-20 transition-colors">
      {/* Zone 1: Brand wordmark & Sidebar toggle */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 text-matcha-700 dark:text-matcha-300 hover:text-strawberry-600 dark:hover:text-strawberry-300 rounded-lg hover:bg-strawberry-50 dark:hover:bg-matcha-900 transition-colors"
          title={isSidebarOpen ? 'Collapse sidebar' : 'Open sidebar'}
          aria-label="Toggle sidebar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        </button>

        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('chat');
          }}
          className="font-bold text-base tracking-tight text-matcha-950 dark:text-cream-50 whitespace-nowrap flex items-center gap-2 group"
        >
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-strawberry-500 via-strawberry-400 to-matcha-600 text-white flex items-center justify-center text-xs font-mono font-bold shadow-xs group-hover:scale-105 transition-transform">
            🍓
          </div>
          <span className="flex items-center gap-1.5">
            <span>Mini LLM</span>
            <span className="text-[10px] font-mono font-medium text-strawberry-600 dark:text-strawberry-400 hidden sm:inline">
              matcha
            </span>
          </span>
        </a>

        {/* Unboxed On-Device status pill/indicator */}
        <button
          onClick={onOpenDeviceModal}
          className="hidden lg:flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-mono text-matcha-700 dark:text-matcha-300 bg-matcha-50 dark:bg-matcha-900/60 border border-matcha-200/80 dark:border-matcha-700/80 hover:bg-strawberry-50 dark:hover:bg-matcha-850 rounded-md transition-colors"
          title="Click to learn how on-device execution works without API keys"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-matcha-500 dark:bg-matcha-400 animate-pulse" />
          <span>On-Device · No API Key</span>
        </button>
      </div>

      {/* Zone 2: Clean 4 Nav Tabs (single-line, whitespace-nowrap) */}
      <nav className="hidden md:flex items-center gap-1 text-xs font-medium">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
            activeTab === 'chat'
              ? 'bg-strawberry-100/80 dark:bg-matcha-800 text-strawberry-800 dark:text-strawberry-200 font-semibold border border-strawberry-200 dark:border-matcha-700'
              : 'text-matcha-800 dark:text-matcha-300 hover:text-strawberry-600 dark:hover:text-strawberry-300 hover:bg-strawberry-50/60 dark:hover:bg-matcha-900/60'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 text-strawberry-500 dark:text-strawberry-400" />
          <span>Chat Studio</span>
        </button>

        <button
          onClick={() => setActiveTab('code')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
            activeTab === 'code'
              ? 'bg-strawberry-100/80 dark:bg-matcha-800 text-strawberry-800 dark:text-strawberry-200 font-semibold border border-strawberry-200 dark:border-matcha-700'
              : 'text-matcha-800 dark:text-matcha-300 hover:text-strawberry-600 dark:hover:text-strawberry-300 hover:bg-strawberry-50/60 dark:hover:bg-matcha-900/60'
          }`}
        >
          <Code2 className="w-3.5 h-3.5 text-matcha-600 dark:text-matcha-400" />
          <span>Python Codebase</span>
        </button>

        <button
          onClick={() => setActiveTab('architecture')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
            activeTab === 'architecture'
              ? 'bg-strawberry-100/80 dark:bg-matcha-800 text-strawberry-800 dark:text-strawberry-200 font-semibold border border-strawberry-200 dark:border-matcha-700'
              : 'text-matcha-800 dark:text-matcha-300 hover:text-strawberry-600 dark:hover:text-strawberry-300 hover:bg-strawberry-50/60 dark:hover:bg-matcha-900/60'
          }`}
        >
          <Cpu className="w-3.5 h-3.5 text-matcha-600 dark:text-matcha-400" />
          <span>Architecture & Math</span>
        </button>

        <button
          onClick={() => setActiveTab('guide')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
            activeTab === 'guide'
              ? 'bg-strawberry-100/80 dark:bg-matcha-800 text-strawberry-800 dark:text-strawberry-200 font-semibold border border-strawberry-200 dark:border-matcha-700'
              : 'text-matcha-800 dark:text-matcha-300 hover:text-strawberry-600 dark:hover:text-strawberry-300 hover:bg-strawberry-50/60 dark:hover:bg-matcha-900/60'
          }`}
        >
          <Terminal className="w-3.5 h-3.5 text-strawberry-500 dark:text-strawberry-400" />
          <span>Local Setup Guide</span>
        </button>
      </nav>

      {/* Zone 3: Primary Action + Theme toggle */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onOpenDeviceModal}
          className="flex lg:hidden items-center gap-1 px-2 py-1 text-[11px] font-mono text-matcha-700 dark:text-matcha-300 bg-matcha-50 dark:bg-matcha-900/80 rounded border border-matcha-200 dark:border-matcha-800"
        >
          <span>On-Device</span>
        </button>

        <button
          onClick={toggleTheme}
          className="p-2 text-matcha-700 dark:text-matcha-300 hover:text-strawberry-600 dark:hover:text-strawberry-300 rounded-lg hover:bg-strawberry-50 dark:hover:bg-matcha-900 transition-colors"
          title={isDark ? 'Switch to Light Milk Cream Mode' : 'Switch to Dark Roasted Matcha Mode'}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-4 h-4 text-strawberry-300" /> : <Moon className="w-4 h-4 text-matcha-700" />}
        </button>

        <button
          onClick={onDownloadZip}
          disabled={isDownloading}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-matcha-700 hover:bg-matcha-800 dark:bg-strawberry-600 dark:hover:bg-strawberry-500 rounded-lg transition-colors shadow-sm whitespace-nowrap disabled:opacity-60"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{isDownloading ? 'Bundling...' : 'Download Project (.zip)'}</span>
        </button>
      </div>
    </header>
  );
};

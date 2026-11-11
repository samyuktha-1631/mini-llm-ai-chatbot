import React, { useState } from 'react';
import { Copy, Check, Download, FileCode, FileText, Info } from 'lucide-react';
import { PYTHON_PROJECT_FILES } from '../data/pythonProjectFiles';

interface PythonCodeViewerProps {
  onDownloadZip: () => void;
  isDownloading: boolean;
}

export const PythonCodeViewer: React.FC<PythonCodeViewerProps> = ({
  onDownloadZip,
  isDownloading,
}) => {
  const [selectedFileName, setSelectedFileName] = useState<string>('app.py');
  const [copied, setCopied] = useState(false);

  const activeFile = PYTHON_PROJECT_FILES.find((f) => f.name === selectedFileName) || PYTHON_PROJECT_FILES[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingleFile = () => {
    const blob = new Blob([activeFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activeFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-3.5rem)] overflow-hidden bg-cream-50 dark:bg-matcha-950 text-matcha-950 dark:text-cream-50 transition-colors">
      {/* Left File Tree Navigation */}
      <div className="w-full md:w-72 border-b md:border-b-0 md:border-r border-strawberry-100 dark:border-matcha-800/80 bg-cream-100/60 dark:bg-matcha-950 p-4 shrink-0 flex flex-col select-none">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-matcha-700 dark:text-matcha-400">
            Project Files
          </span>
          <span className="text-[10px] font-mono text-strawberry-600 dark:text-strawberry-400">
            {PYTHON_PROJECT_FILES.length} files
          </span>
        </div>

        <div className="space-y-1 flex-1 overflow-y-auto">
          {PYTHON_PROJECT_FILES.map((file) => {
            const isSelected = file.name === selectedFileName;
            const isPy = file.name.endsWith('.py');
            return (
              <button
                key={file.name}
                onClick={() => setSelectedFileName(file.name)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono transition-colors text-left ${
                  isSelected
                    ? 'bg-strawberry-100 dark:bg-matcha-850 text-strawberry-900 dark:text-strawberry-200 font-semibold border border-strawberry-200 dark:border-matcha-700 shadow-2xs'
                    : 'text-matcha-700 dark:text-matcha-300 hover:bg-strawberry-50 dark:hover:bg-matcha-900 hover:text-strawberry-700'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {isPy ? (
                    <FileCode className="w-3.5 h-3.5 text-strawberry-500 shrink-0" />
                  ) : (
                    <FileText className="w-3.5 h-3.5 text-matcha-500 shrink-0" />
                  )}
                  <span className="truncate">{file.name}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Download Zip CTA in Sidebar */}
        <div className="pt-4 border-t border-strawberry-100 dark:border-matcha-800 mt-4 space-y-2">
          <button
            onClick={onDownloadZip}
            disabled={isDownloading}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-white bg-matcha-700 hover:bg-matcha-800 dark:bg-strawberry-600 dark:hover:bg-strawberry-500 rounded-lg transition-colors shadow-2xs disabled:opacity-60"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isDownloading ? 'Bundling Zip...' : 'Download Full Project (.zip)'}</span>
          </button>
          <p className="text-[10px] text-matcha-500 dark:text-matcha-400 text-center leading-tight">
            Contains all files structured and ready to run locally with Streamlit.
          </p>
        </div>
      </div>

      {/* Right Code Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 bg-matcha-950 text-cream-100 overflow-hidden">
        {/* Code Header Bar */}
        <div className="h-12 border-b border-matcha-800 bg-matcha-900/90 px-4 md:px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 truncate">
            <span className="font-mono text-xs font-semibold text-strawberry-300">
              {activeFile.path}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1 text-xs text-matcha-200 hover:text-white bg-matcha-800 hover:bg-matcha-700 rounded-md transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-strawberry-400" />
                  <span className="text-strawberry-400 text-xs">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadSingleFile}
              className="flex items-center gap-1.5 px-3 py-1 text-xs text-matcha-200 hover:text-white bg-matcha-800 hover:bg-matcha-700 rounded-md transition-colors"
              title="Download this file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          </div>
        </div>

        {/* File Description Banner */}
        <div className="px-4 md:px-6 py-2.5 bg-matcha-950/90 border-b border-matcha-850 flex items-start gap-2 text-xs text-matcha-300">
          <Info className="w-3.5 h-3.5 text-strawberry-400 shrink-0 mt-0.5" />
          <span>{activeFile.description}</span>
        </div>

        {/* Code Editor Area with Line Numbers */}
        <div className="flex-1 overflow-auto font-mono text-xs leading-relaxed p-4 md:p-6 bg-matcha-950 text-cream-100">
          <div className="flex">
            {/* Line Numbers */}
            <div className="pr-4 select-none text-matcha-600 text-right shrink-0 border-r border-matcha-850 font-mono">
              {activeFile.content.split('\n').map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            {/* Code Body */}
            <pre className="pl-4 overflow-x-auto whitespace-pre font-mono text-cream-100">
              {activeFile.content}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

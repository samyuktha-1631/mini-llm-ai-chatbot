import React, { useState } from 'react';
import { Copy, Check, Terminal, Play, CheckCircle2, AlertTriangle, Download } from 'lucide-react';

interface TerminalGuideProps {
  onDownloadZip: () => void;
  isDownloading: boolean;
}

interface Step {
  id: number;
  title: string;
  command: string;
  description: string;
  simulatedOutput: string;
}

const STEPS: Step[] = [
  {
    id: 1,
    title: 'Create Python Virtual Environment',
    command: 'python3 -m venv venv',
    description: 'Isolates project dependencies from your global system Python packages.',
    simulatedOutput: '$ python3 -m venv venv\nCreated virtual environment in /Users/developer/mini-llm-chatbot/venv',
  },
  {
    id: 2,
    title: 'Activate the Virtual Environment',
    command: 'source venv/bin/activate  # macOS / Linux\n# Windows: venv\\Scripts\\activate.bat',
    description: 'Directs your terminal shell to use the isolated Python binary and pip.',
    simulatedOutput: '$ source venv/bin/activate\n(venv) $ which python\n/Users/developer/mini-llm-chatbot/venv/bin/python',
  },
  {
    id: 3,
    title: 'Install Required Packages',
    command: 'pip install -r requirements.txt',
    description: 'Installs Streamlit, PyTorch, Hugging Face Transformers, and Accelerate.',
    simulatedOutput: `(venv) $ pip install -r requirements.txt
Collecting streamlit>=1.35.0
Collecting torch>=2.2.0
Collecting transformers>=4.40.0
Collecting accelerate>=0.28.0
Installing collected packages: torch, transformers, streamlit
Successfully installed torch-2.2.2 transformers-4.40.1 streamlit-1.35.0`,
  },
  {
    id: 4,
    title: 'Run Smoke Test Verification',
    command: 'python test_chatbot.py',
    description: 'Validates that PyTorch, tokenizer, and Hugging Face weights load and generate tokens without errors.',
    simulatedOutput: `==================================================
🤖 Mini LLM: Environment & Model Verification Test
==================================================

[1/4] Checking Python Version: 3.11.8... ✅
[2/4] Checking PyTorch & Compute Devices:
      - PyTorch Version: 2.2.2
      - Running on CPU (Universal mode) ✅
[3/4] Downloading / Loading lightweight test model 'gpt2'...
      - Model loaded successfully in 1.42s ✅
[4/4] Testing token generation with prompt: 'Artificial Intelligence is'...
      - Output: "Artificial Intelligence is rapidly transforming modern computational linguistics and..."
      - Generation took 1.10s (~22.7 tokens/sec) ✅

==================================================
🎉 ALL TESTS PASSED! Your environment is ready.
Launch the chatbot UI with: streamlit run app.py
==================================================`,
  },
  {
    id: 5,
    title: 'Launch the Streamlit Chatbot',
    command: 'streamlit run app.py',
    description: 'Starts the local Streamlit web server and opens the ChatGPT interface in your default browser.',
    simulatedOutput: `(venv) $ streamlit run app.py

  You can now view your Streamlit app in your browser.

  Local URL: http://localhost:8501
  Network URL: http://192.168.1.15:8501

Ready to accept prompts!`,
  },
];

export const TerminalGuide: React.FC<TerminalGuideProps> = ({
  onDownloadZip,
  isDownloading,
}) => {
  const [activeStepId, setActiveStepId] = useState<number>(1);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [terminalLogs, setTerminalLogs] = useState<string>(STEPS[0].simulatedOutput);

  const handleCopyCommand = (command: string, index: number) => {
    navigator.clipboard.writeText(command);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleRunSimulated = (step: Step) => {
    setActiveStepId(step.id);
    setTerminalLogs(step.simulatedOutput);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-cream-50 dark:bg-matcha-950 text-matcha-950 dark:text-cream-50 font-sans transition-colors">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-strawberry-100 dark:border-matcha-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-matcha-600 dark:text-matcha-400 mb-1">
              <span>🍵 LOCAL EXECUTION & TESTING</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-matcha-950 dark:text-cream-50 mb-1">
              Local Execution & Setup Guide
            </h1>
            <p className="text-xs md:text-sm text-matcha-700 dark:text-matcha-300">
              Run Mini LLM on your local laptop in 5 straightforward steps with zero API keys.
            </p>
          </div>

          <button
            onClick={onDownloadZip}
            disabled={isDownloading}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-matcha-700 hover:bg-matcha-800 dark:bg-strawberry-600 dark:hover:bg-strawberry-500 rounded-lg transition-colors shadow-2xs self-start md:self-auto shrink-0 disabled:opacity-60"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isDownloading ? 'Bundling...' : 'Download Project (.zip)'}</span>
          </button>
        </div>

        {/* Step-by-Step Flow */}
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-matcha-950 dark:text-cream-50">Execution Steps</h2>

          <div className="space-y-3">
            {STEPS.map((step) => {
              const isActive = step.id === activeStepId;
              return (
                <div
                  key={step.id}
                  className={`rounded-xl border p-4 transition-all ${
                    isActive
                      ? 'border-strawberry-300 dark:border-matcha-600 bg-white dark:bg-matcha-900/90 shadow-2xs'
                      : 'border-strawberry-100 dark:border-matcha-800 bg-white/70 dark:bg-matcha-900/40 hover:border-strawberry-200 dark:hover:border-matcha-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-strawberry-100 dark:bg-matcha-800 text-strawberry-700 dark:text-cream-200 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                        {step.id}
                      </span>
                      <h3 className="text-sm font-semibold text-matcha-950 dark:text-cream-100">{step.title}</h3>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => handleCopyCommand(step.command, step.id)}
                        className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-matcha-700 hover:text-strawberry-600 dark:text-matcha-300 dark:hover:text-white bg-strawberry-50 dark:bg-matcha-800 hover:bg-strawberry-100 dark:hover:bg-matcha-700 rounded transition-colors"
                        title="Copy command"
                      >
                        {copiedIndex === step.id ? (
                          <>
                            <Check className="w-3 h-3 text-strawberry-500" />
                            <span className="text-strawberry-600 text-[11px] font-semibold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span className="text-[11px]">Copy</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleRunSimulated(step)}
                        className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-white bg-matcha-600 hover:bg-matcha-700 dark:bg-matcha-700 dark:hover:bg-matcha-600 rounded transition-colors font-medium shadow-2xs"
                      >
                        <Play className="w-3 h-3 fill-current text-cream-100" />
                        <span className="text-[11px]">Simulate</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-matcha-700 dark:text-matcha-300 mb-2 leading-relaxed">{step.description}</p>

                  <div className="bg-matcha-950 rounded-lg p-2.5 font-mono text-xs text-strawberry-300 border border-matcha-800 overflow-x-auto whitespace-pre">
                    {step.command}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Terminal Preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-matcha-950 dark:text-cream-50 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-strawberry-500" />
              <span>Simulated Local Terminal Output</span>
            </h2>
            <span className="text-[11px] font-mono text-matcha-500 dark:text-matcha-400">Step {activeStepId} Active</span>
          </div>

          <div className="rounded-xl border border-matcha-800 bg-matcha-950 overflow-hidden font-mono text-xs shadow-md">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-matcha-900 border-b border-matcha-800">
              <span className="w-3 h-3 rounded-full bg-strawberry-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-matcha-400 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
              <span className="ml-2 text-matcha-300 text-[11px]">bash – strawberry-matcha terminal</span>
            </div>
            <pre className="p-4 overflow-x-auto text-cream-100 leading-relaxed font-mono whitespace-pre min-h-48">
              {terminalLogs}
            </pre>
          </div>
        </div>

        {/* Troubleshooting Accordion */}
        <div className="p-5 rounded-xl border border-strawberry-200/80 dark:border-matcha-800 bg-white/80 dark:bg-matcha-900/50 space-y-4 shadow-2xs">
          <h3 className="text-sm font-semibold text-matcha-950 dark:text-cream-50 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-strawberry-500" />
            <span>Common Local Issues & Solutions</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="border-b border-strawberry-100 dark:border-matcha-800/80 pb-3">
              <strong className="text-matcha-950 dark:text-cream-100 block mb-1">1. CUDA Out Of Memory (OOM)</strong>
              <p className="text-matcha-700 dark:text-matcha-300 leading-relaxed">
                If your GPU has less than 4GB VRAM, switch to <strong>GPT-2</strong> or <strong>FLAN-T5-Base</strong>, or reduce <code>max_new_tokens</code> to <code>128</code>. The loader will automatically fall back to CPU if GPU memory is completely exhausted.
              </p>
            </div>

            <div className="border-b border-strawberry-100 dark:border-matcha-800/80 pb-3">
              <strong className="text-matcha-950 dark:text-cream-100 block mb-1">2. Slow Generation on Older CPUs</strong>
              <p className="text-matcha-700 dark:text-matcha-300 leading-relaxed">
                Ensure you use <strong>SmolLM2-360M</strong> or <strong>GPT-2 (124M)</strong> on older quad-core CPUs. Generation will run at approximately 15-30 tokens/second on modern laptops.
              </p>
            </div>

            <div>
              <strong className="text-matcha-950 dark:text-cream-100 block mb-1">3. Model Download Caching</strong>
              <p className="text-matcha-700 dark:text-matcha-300 leading-relaxed">
                Hugging Face downloads model weights once into <code>~/.cache/huggingface/hub</code>. Subsequent launches load immediately from disk without consuming any internet bandwidth.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

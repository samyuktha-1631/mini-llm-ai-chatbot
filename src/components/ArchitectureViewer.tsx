import React from 'react';
import { ArrowRight, Cpu, Layers, MemoryStick, Sparkles, BookOpen, GitBranch } from 'lucide-react';
import { OPEN_SOURCE_MODELS } from '../data/models';

export const ArchitectureViewer: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-cream-50 dark:bg-matcha-950 text-matcha-950 dark:text-cream-50 font-sans transition-colors">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header Intro */}
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-strawberry-600 dark:text-strawberry-400 mb-1">
            <span>🍓 STRAWBERRY MATCHA ARCHITECTURE</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-matcha-950 dark:text-cream-50 mb-2">
            Mini LLM Architecture & Engineering Guide
          </h1>
          <p className="text-sm text-matcha-700 dark:text-matcha-300 max-w-2xl leading-relaxed">
            How open-source Large Language Models operate locally on consumer laptops using PyTorch, Hugging Face Transformers, and Streamlit.
          </p>
        </div>

        {/* Visual Pipeline Flow */}
        <section className="space-y-4">
          <h2 className="text-base font-semibold text-matcha-950 dark:text-cream-50 flex items-center gap-2">
            <Layers className="w-4 h-4 text-strawberry-500" />
            <span>End-to-End Inference Pipeline</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            {[
              {
                step: '01',
                title: 'User Input',
                subtitle: 'Streamlit UI',
                desc: 'Text captured via st.chat_input and appended to st.session_state.messages.',
              },
              {
                step: '02',
                title: 'Tokenization',
                subtitle: 'Hugging Face Tokenizer',
                desc: 'Converts raw string into token IDs and attention masks using Byte-Pair Encoding (BPE).',
              },
              {
                step: '03',
                title: 'Tensor Routing',
                subtitle: 'PyTorch to(device)',
                desc: 'Dispatches input tensors to GPU (CUDA), Apple Silicon (MPS), or fallback CPU.',
              },
              {
                step: '04',
                title: 'Transformer Core',
                subtitle: 'Multi-Head Attention',
                desc: 'Computes Query, Key, and Value matrices across stacked causal decoder layers.',
              },
              {
                step: '05',
                title: 'Logits & Sampling',
                subtitle: 'Temperature & Top-P',
                desc: 'Softmax computes vocabulary probability distribution; nucleus sampling picks next token.',
              },
              {
                step: '06',
                title: 'Streaming Decode',
                subtitle: 'TextIteratorStreamer',
                desc: 'Yields token strings in real-time background thread directly into st.chat_message.',
              },
            ].map((node, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-strawberry-200/80 dark:border-matcha-800 bg-white/90 dark:bg-matcha-900/60 flex flex-col justify-between space-y-2 relative shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between text-strawberry-600 dark:text-strawberry-400 font-mono text-xs mb-2">
                    <span className="font-bold">{node.step}</span>
                    {i < 5 && <ArrowRight className="w-3 h-3 text-matcha-400 hidden md:block" />}
                  </div>
                  <h3 className="text-xs font-bold text-matcha-950 dark:text-cream-50 mb-0.5">{node.title}</h3>
                  <span className="text-[10px] text-matcha-600 dark:text-matcha-400 font-mono block mb-2">{node.subtitle}</span>
                  <p className="text-[11px] text-matcha-700 dark:text-matcha-300 leading-relaxed">{node.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Deep Dive Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Why Pre-Trained Models? */}
          <div className="p-5 rounded-xl border border-strawberry-200/80 dark:border-matcha-800 bg-white/80 dark:bg-matcha-900/50 space-y-3 shadow-2xs">
            <h3 className="text-sm font-semibold text-matcha-950 dark:text-cream-50 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-strawberry-500" />
              <span>Why Use Pre-Trained Open-Source Models?</span>
            </h3>
            <p className="text-xs text-matcha-700 dark:text-matcha-300 leading-relaxed">
              Training an LLM from scratch requires billions of web documents, massive compute clusters (thousands of GPUs running for months), and millions of dollars.
            </p>
            <p className="text-xs text-matcha-700 dark:text-matcha-300 leading-relaxed">
              By using models like <strong>TinyLlama</strong> or <strong>FLAN-T5</strong>, we inherit pre-learned world knowledge, grammar, and reasoning capabilities instantly. The weights are freely distributed under permissive open licenses (Apache 2.0 / MIT) on the Hugging Face Hub.
            </p>
          </div>

          {/* Memory Math & Hardware Budget */}
          <div className="p-5 rounded-xl border border-strawberry-200/80 dark:border-matcha-800 bg-white/80 dark:bg-matcha-900/50 space-y-3 shadow-2xs">
            <h3 className="text-sm font-semibold text-matcha-950 dark:text-cream-50 flex items-center gap-2">
              <MemoryStick className="w-4 h-4 text-matcha-600 dark:text-matcha-400" />
              <span>Memory Requirements on Consumer Laptops</span>
            </h3>
            <p className="text-xs text-matcha-700 dark:text-matcha-300 leading-relaxed">
              The memory footprint of an LLM depends on the parameter count and numerical precision:
            </p>
            <div className="p-3 bg-matcha-950 rounded-lg font-mono text-[11px] text-cream-100 border border-matcha-800 space-y-1">
              <div>FP32 (32-bit): 4 bytes / param &rarr; 1.1B params &asymp; 4.4 GB</div>
              <div>FP16 (16-bit): 2 bytes / param &rarr; 1.1B params &asymp; 2.2 GB</div>
              <div>INT4 (4-bit): 0.5 bytes / param &rarr; 1.1B params &asymp; 0.6 GB</div>
            </div>
            <p className="text-xs text-matcha-700 dark:text-matcha-300 leading-relaxed">
              Our code automatically detects GPU/MPS and selects <code>torch.float16</code> to minimize memory usage, while using <code>torch.float32</code> on CPU to ensure maximum numerical stability.
            </p>
          </div>

          {/* Autoregressive Sampling Math */}
          <div className="p-5 rounded-xl border border-strawberry-200/80 dark:border-matcha-800 bg-white/80 dark:bg-matcha-900/50 space-y-3 shadow-2xs">
            <h3 className="text-sm font-semibold text-matcha-950 dark:text-cream-50 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-strawberry-500" />
              <span>Sampling Math: Temperature & Top-P</span>
            </h3>
            <p className="text-xs text-matcha-700 dark:text-matcha-300 leading-relaxed">
              During generation, the model predicts unnormalized logits $z_i$ for every token in its vocabulary. Temperature ($T$) rescales these logits before softmax:
            </p>
            <div className="p-3 bg-matcha-950 rounded-lg font-mono text-[11px] text-strawberry-300 border border-matcha-800">
              P(token_i) = exp(z_i / T) / &Sigma; exp(z_j / T)
            </div>
            <ul className="text-xs text-matcha-700 dark:text-matcha-300 space-y-1 list-disc list-inside leading-relaxed">
              <li><strong>Low Temperature (0.1 - 0.4)</strong>: Sharpens probabilities, picking predictable and factual tokens.</li>
              <li><strong>High Temperature (0.8 - 1.2)</strong>: Flattens probabilities, producing creative and diverse outputs.</li>
              <li><strong>Top-P (Nucleus Sampling)</strong>: Truncates candidate tokens to the smallest set whose cumulative probability reaches P (e.g., 0.9).</li>
            </ul>
          </div>

          {/* Streamlit Session State & Streaming */}
          <div className="p-5 rounded-xl border border-strawberry-200/80 dark:border-matcha-800 bg-white/80 dark:bg-matcha-900/50 space-y-3 shadow-2xs">
            <h3 className="text-sm font-semibold text-matcha-950 dark:text-cream-50 flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-matcha-600 dark:text-matcha-400" />
              <span>Streamlit State & Real-Time Streaming</span>
            </h3>
            <p className="text-xs text-matcha-700 dark:text-matcha-300 leading-relaxed">
              Streamlit normally re-runs the entire Python script on every user interaction. We solve two crucial challenges:
            </p>
            <ol className="text-xs text-matcha-700 dark:text-matcha-300 space-y-1.5 list-decimal list-inside leading-relaxed">
              <li>
                <strong>Model Caching (<code>@st.cache_resource</code>)</strong>: Prevents re-downloading or re-loading multi-gigabyte neural network weights on each prompt.
              </li>
              <li>
                <strong>Multi-threaded Streaming</strong>: Hugging Face’s <code>TextIteratorStreamer</code> runs generation in a background thread, yielding tokens to <code>st.chat_message</code> as they are computed.
              </li>
            </ol>
          </div>
        </div>

        {/* Model Comparison Matrix */}
        <section className="space-y-4">
          <h2 className="text-base font-semibold text-matcha-950 dark:text-cream-50 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-matcha-600 dark:text-matcha-400" />
            <span>Open-Source Model Comparison Matrix</span>
          </h2>

          <div className="overflow-x-auto rounded-xl border border-strawberry-200 dark:border-matcha-800 shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-matcha-100/70 dark:bg-matcha-900 text-matcha-900 dark:text-cream-200 border-b border-strawberry-200 dark:border-matcha-800">
                <tr>
                  <th className="p-3 font-semibold">Model</th>
                  <th className="p-3 font-semibold">Parameters</th>
                  <th className="p-3 font-semibold">Architecture</th>
                  <th className="p-3 font-semibold">Recommended Hardware</th>
                  <th className="p-3 font-semibold">Best Used For</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-strawberry-100 dark:divide-matcha-800/80 bg-white dark:bg-matcha-900/60 font-mono text-[11px]">
                {OPEN_SOURCE_MODELS.map((model) => (
                  <tr key={model.id} className="hover:bg-strawberry-50/50 dark:hover:bg-matcha-850/50 transition-colors">
                    <td className="p-3 font-sans font-medium text-matcha-950 dark:text-cream-100">{model.name}</td>
                    <td className="p-3 text-strawberry-700 dark:text-strawberry-300 tabular-nums">{model.params}</td>
                    <td className="p-3 text-matcha-600 dark:text-matcha-400">{model.category}</td>
                    <td className="p-3 text-matcha-800 dark:text-cream-200">{model.hardware}</td>
                    <td className="p-3 font-sans text-matcha-700 dark:text-matcha-300">{model.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

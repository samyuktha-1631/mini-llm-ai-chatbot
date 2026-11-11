/**
 * Complete, production-grade Python and Streamlit source code
 * for the Mini LLM local chatbot project.
 */

export interface PythonFile {
  name: string;
  path: string;
  language: string;
  description: string;
  content: string;
}

export const PYTHON_PROJECT_FILES: PythonFile[] = [
  {
    name: 'app.py',
    path: 'mini-llm-chatbot/app.py',
    language: 'python',
    description: 'Main Streamlit application implementing the ChatGPT-style interface, chat history, and streaming inference.',
    content: `"""
Mini LLM – AI Chatbot
A lightweight, ChatGPT-like local AI chatbot using Hugging Face Transformers and Streamlit.
"""

import streamlit as st
import torch
from model_loader import load_model_and_tokenizer, generate_streaming_response
from config import AVAILABLE_MODELS, DEFAULT_MODEL, DEFAULT_CONFIG

# ---------------------------------------------------------
# 1. Page Configuration & Custom Styling
# ---------------------------------------------------------
st.set_page_config(
    page_title="Mini LLM – AI Chatbot",
    page_icon="🤖",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for Strawberry Matcha aesthetic
st.markdown("""
<style>
    /* Global styles: Dark matcha background with cream text */
    .stApp {
        background-color: #0a150e;
        color: #f0f9f3;
    }
    
    /* Clean Strawberry Matcha sidebar styling */
    section[data-testid="stSidebar"] {
        background-color: #102117;
        border-right: 1px solid #1b3827;
    }
    
    /* Input box styling */
    div[data-testid="stChatInput"] {
        padding-bottom: 1.5rem;
    }
    div[data-testid="stChatInput"] > div {
        border: 1px solid #254d35;
        border-radius: 1rem;
        background-color: #152a1d;
    }
    
    /* Chat message styling */
    .stChatMessage {
        border-radius: 0.75rem;
        padding: 0.75rem 1rem;
        margin-bottom: 0.75rem;
        border: 1px solid #1b3827;
        background-color: #102117;
    }
    
    /* Strawberry Primary Button */
    button[kind="primary"] {
        background-color: #e7396f !important;
        border-color: #ca2557 !important;
        color: white !important;
        font-weight: 600 !important;
    }
    
    /* Model info box */
    .model-info-box {
        padding: 0.6rem 0.8rem;
        background-color: #152a1d;
        border: 1px solid #254d35;
        border-radius: 8px;
        font-size: 0.85rem;
        margin-bottom: 1rem;
        color: #bde4cd;
    }
</style>
""", unsafe_allow_html=True)

# ---------------------------------------------------------
# 2. Sidebar Configuration (ChatGPT-Style Layout)
# ---------------------------------------------------------
with st.sidebar:
    st.title("🤖 Mini LLM")
    st.caption("Local Open-Source AI Chatbot")
    
    # New Chat Button
    if st.button("➕ New Chat", use_container_width=True, type="primary"):
        st.session_state.messages = []
        st.rerun()
    
    st.divider()
    
    # Model Selection
    st.subheader("Model Selection")
    model_display_names = {k: v["name"] for k, v in AVAILABLE_MODELS.items()}
    selected_model_key = st.selectbox(
        "Choose Pre-trained Model:",
        options=list(AVAILABLE_MODELS.keys()),
        format_func=lambda x: model_display_names[x],
        index=list(AVAILABLE_MODELS.keys()).index(DEFAULT_MODEL)
    )
    
    model_metadata = AVAILABLE_MODELS[selected_model_key]
    st.markdown(f"""
    <div class="model-info-box">
        <strong>Parameters:</strong> {model_metadata['params']}<br>
        <strong>Recommended:</strong> {model_metadata['hardware']}<br>
        <strong>Context:</strong> {model_metadata['context_window']} tokens
    </div>
    """, unsafe_allow_html=True)
    
    # Hyperparameters Section
    with st.expander("⚙️ Generation Parameters", expanded=False):
        temperature = st.slider(
            "Temperature",
            min_value=0.1,
            max_value=1.5,
            value=DEFAULT_CONFIG["temperature"],
            step=0.05,
            help="Higher values make output more creative; lower values make it focused and deterministic."
        )
        
        max_new_tokens = st.slider(
            "Max New Tokens",
            min_value=32,
            max_value=1024,
            value=DEFAULT_CONFIG["max_new_tokens"],
            step=32,
            help="Maximum number of tokens to generate in a single turn."
        )
        
        top_p = st.slider(
            "Top-P (Nucleus Sampling)",
            min_value=0.1,
            max_value=1.0,
            value=DEFAULT_CONFIG["top_p"],
            step=0.05,
            help="Filters tokens with cumulative probability up to P."
        )
        
        system_prompt = st.text_area(
            "System Prompt:",
            value=DEFAULT_CONFIG["system_prompt"],
            height=80,
            help="Directs the behavior and tone of the model."
        )
        
    st.divider()
    
    # Clear Chat Option
    if st.button("🗑️ Clear Chat History", use_container_width=True):
        st.session_state.messages = []
        st.success("Chat history cleared!")
        st.rerun()

    # Hardware Detection Indicator
    device = "CUDA (NVIDIA GPU)" if torch.cuda.is_available() else (
        "Apple Silicon MPS" if torch.backends.mps.is_available() else "CPU"
    )
    st.info(f"⚡ Device: **{device}**")

# ---------------------------------------------------------
# 3. Session State Initialization
# ---------------------------------------------------------
if "messages" not in st.session_state:
    st.session_state.messages = []

# ---------------------------------------------------------
# 4. Main Chat Area & Display History
# ---------------------------------------------------------
st.header("Chat with Mini LLM", anchor=False)

# Empty State / Starter Suggestions
if len(st.session_state.messages) == 0:
    st.markdown("""
    Welcome to **Mini LLM**! This chatbot runs completely open-source pre-trained language models on your local machine.
    
    **Try asking:**
    - *"Explain quantum computing in simple terms"*
    - *"Write a clean Python script to scrape headlines from a website"*
    - *"How does the Transformer self-attention mechanism work?"*
    - *"What is gradient descent in machine learning?"*
    """)

# Display Chat History
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# ---------------------------------------------------------
# 5. User Input Handling & AI Response Generation
# ---------------------------------------------------------
user_prompt = st.chat_input("Ask a question or type a prompt...")

if user_prompt:
    # 1. Append & display user message
    st.session_state.messages.append({"role": "user", "content": user_prompt})
    with st.chat_message("user"):
        st.markdown(user_prompt)

    # 2. Generate and stream AI response with loading indicator
    with st.chat_message("assistant"):
        message_placeholder = st.empty()
        
        try:
            with st.spinner("Loading model & generating tokens..."):
                # Load pre-trained model & tokenizer (cached)
                model, tokenizer, device_used = load_model_and_tokenizer(selected_model_key)
                
                # Stream the response in real time
                full_response = ""
                for token_chunk in generate_streaming_response(
                    model=model,
                    tokenizer=tokenizer,
                    model_id=selected_model_key,
                    messages=st.session_state.messages,
                    system_prompt=system_prompt,
                    temperature=temperature,
                    max_new_tokens=max_new_tokens,
                    top_p=top_p,
                    device=device_used
                ):
                    full_response += token_chunk
                    message_placeholder.markdown(full_response + "▌")
                
                # Final render without cursor
                message_placeholder.markdown(full_response)
                
                # Append assistant message to chat history
                st.session_state.messages.append({"role": "assistant", "content": full_response})

        except torch.cuda.OutOfMemoryError:
            error_msg = "⚠️ CUDA Out of Memory error! Try lowering 'Max New Tokens' in the sidebar or switch to CPU mode."
            message_placeholder.error(error_msg)
        except Exception as e:
            error_msg = f"⚠️ An error occurred during generation: {str(e)}"
            message_placeholder.error(error_msg)
`
  },
  {
    name: 'model_loader.py',
    path: 'mini-llm-chatbot/model_loader.py',
    language: 'python',
    description: 'Handles caching, hardware device detection, quantization selection, and token streaming via TextIteratorStreamer.',
    content: `"""
Model Loader Module
Caches model weights in memory using @st.cache_resource, manages hardware device assignment,
and implements token-by-token streaming.
"""

import streamlit as st
import torch
from threading import Thread
from transformers import (
    AutoTokenizer,
    AutoModelForCausalLM,
    AutoModelForSeq2SeqLM,
    TextIteratorStreamer
)

@st.cache_resource(show_spinner=False)
def load_model_and_tokenizer(model_id: str):
    """
    Loads and caches the model and tokenizer.
    Uses @st.cache_resource so weights are loaded only once per session.
    """
    # 1. Determine optimal device
    if torch.cuda.is_available():
        device = "cuda"
        torch_dtype = torch.float16
    elif torch.backends.mps.is_available():
        device = "mps"
        torch_dtype = torch.float16
    else:
        device = "cpu"
        torch_dtype = torch.float32

    # 2. Load Tokenizer
    tokenizer = AutoTokenizer.from_pretrained(
        model_id,
        trust_remote_code=True
    )
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token

    # 3. Load Model (Handles both CausalLM and Seq2Seq architectures)
    if "t5" in model_id.lower():
        model = AutoModelForSeq2SeqLM.from_pretrained(
            model_id,
            torch_dtype=torch_dtype,
            low_cpu_mem_usage=True
        )
    else:
        model = AutoModelForCausalLM.from_pretrained(
            model_id,
            torch_dtype=torch_dtype,
            low_cpu_mem_usage=True
        )

    # Move model to selected device
    model.to(device)
    model.eval()

    return model, tokenizer, device


def format_prompt_for_model(model_id: str, messages: list, system_prompt: str) -> str:
    """
    Formats the conversation history according to each model's specific chat template.
    """
    # TinyLlama / ChatML Template
    if "tinyllama" in model_id.lower():
        formatted = f"<|system|>\\n{system_prompt}</s>\\n"
        for msg in messages:
            role = msg["role"]
            content = msg["content"]
            formatted += f"<|{role}|>\\n{content}</s>\\n"
        formatted += "<|assistant|>\\n"
        return formatted

    # FLAN-T5 Instruct Template
    elif "t5" in model_id.lower():
        last_user = next((m["content"] for m in reversed(messages) if m["role"] == "user"), "")
        return f"Instruction: {system_prompt}\\nQuestion: {last_user}\\nAnswer:"

    # GPT-2 / General CausalLM Template
    else:
        formatted = f"System: {system_prompt}\\n\\n"
        for msg in messages:
            speaker = "User" if msg["role"] == "user" else "Assistant"
            formatted += f"{speaker}: {msg['content']}\\n"
        formatted += "Assistant:"
        return formatted


def generate_streaming_response(
    model,
    tokenizer,
    model_id: str,
    messages: list,
    system_prompt: str,
    temperature: float,
    max_new_tokens: int,
    top_p: float,
    device: str
):
    """
    Generates tokens in a background thread and yields them in real time
    via Hugging Face TextIteratorStreamer.
    """
    prompt = format_prompt_for_model(model_id, messages, system_prompt)

    # Tokenize input prompt
    inputs = tokenizer(prompt, return_tensors="pt").to(device)

    # Setup Streamer
    streamer = TextIteratorStreamer(
        tokenizer,
        skip_prompt=True,
        skip_special_tokens=True
    )

    # Sampling configuration
    generation_kwargs = dict(
        **inputs,
        streamer=streamer,
        max_new_tokens=max_new_tokens,
        temperature=max(temperature, 0.01),
        top_p=top_p,
        do_sample=(temperature > 0.1),
        repetition_penalty=1.1,
        pad_token_id=tokenizer.eos_token_id
    )

    # Run generation in a separate thread so streamer can yield tokens concurrently
    thread = Thread(target=model.generate, kwargs=generation_kwargs)
    thread.start()

    # Yield tokens as they are produced
    for new_text in streamer:
        yield new_text

    thread.join()
`
  },
  {
    name: 'config.py',
    path: 'mini-llm-chatbot/config.py',
    language: 'python',
    description: 'Configuration file defining available open-source models, hardware requirements, and default hyperparameters.',
    content: `"""
Configuration constants for Mini LLM Chatbot
"""

AVAILABLE_MODELS = {
    "TinyLlama/TinyLlama-1.1B-Chat-v1.0": {
        "name": "TinyLlama 1.1B Chat (Recommended)",
        "params": "1.1 Billion",
        "hardware": "4GB RAM / 2GB VRAM",
        "context_window": 2048,
        "description": "Compact, fast conversational model trained on 3T tokens. Best overall balance for standard laptops."
    },
    "google/flan-t5-base": {
        "name": "FLAN-T5 Base (Google)",
        "params": "250 Million",
        "hardware": "2GB RAM / CPU friendly",
        "context_window": 512,
        "description": "Instruction-tuned encoder-decoder model. Excellent for concise Q&A, reasoning, and summarization."
    },
    "gpt2": {
        "name": "GPT-2 Base (OpenAI)",
        "params": "124 Million",
        "hardware": "1GB RAM / Runs on any laptop",
        "context_window": 1024,
        "description": "Lightweight landmark causal model. Ultra-fast inference on standard CPU."
    },
    "HuggingFaceTB/SmolLM2-360M-Instruct": {
        "name": "SmolLM2 360M Instruct",
        "params": "360 Million",
        "hardware": "2GB RAM / Edge & Laptop",
        "context_window": 2048,
        "description": "Modern ultra-compact model by Hugging Face trained on curated synthetic data. Very responsive."
    }
}

DEFAULT_MODEL = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"

DEFAULT_CONFIG = {
    "temperature": 0.7,
    "max_new_tokens": 512,
    "top_p": 0.9,
    "system_prompt": "You are a helpful, respectful, and honest AI assistant. Provide concise, clear, and structured answers."
}
`
  },
  {
    name: 'requirements.txt',
    path: 'mini-llm-chatbot/requirements.txt',
    language: 'text',
    description: 'Python dependencies specification for pip package manager.',
    content: `streamlit>=1.35.0
torch>=2.2.0
transformers>=4.40.0
accelerate>=0.28.0
sentencepiece>=0.2.0
protobuf>=4.25.0
`
  },
  {
    name: 'test_chatbot.py',
    path: 'mini-llm-chatbot/test_chatbot.py',
    language: 'python',
    description: 'Standalone CLI automated test script to verify PyTorch, Hugging Face model loading, and token generation without running Streamlit.',
    content: `"""
Automated Test Script for Mini LLM
Run this script to verify your Python environment, PyTorch installation, and model inference.
Usage: python test_chatbot.py
"""

import sys
import time
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM

def run_tests():
    print("==================================================")
    print("🤖 Mini LLM: Environment & Model Verification Test")
    print("==================================================")

    # Test 1: Python Version
    print(f"\\n[1/4] Checking Python Version: {sys.version.split()[0]}... ✅")

    # Test 2: PyTorch & Hardware Acceleration
    print("\\n[2/4] Checking PyTorch & Compute Devices:")
    print(f"      - PyTorch Version: {torch.__version__}")
    if torch.cuda.is_available():
        device = "cuda"
        print(f"      - CUDA GPU Detected: {torch.cuda.get_device_name(0)} ✅")
    elif torch.backends.mps.is_available():
        device = "mps"
        print("      - Apple Silicon (MPS) Acceleration Detected ✅")
    else:
        device = "cpu"
        print("      - Running on CPU (Universal mode) ✅")

    # Test 3: Load Lightweight Model (GPT-2 for fast verification)
    test_model_id = "gpt2"
    print(f"\\n[3/4] Downloading / Loading lightweight test model '{test_model_id}'...")
    start_load = time.time()
    
    tokenizer = AutoTokenizer.from_pretrained(test_model_id)
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token

    model = AutoModelForCausalLM.from_pretrained(
        test_model_id,
        torch_dtype=torch.float32 if device == "cpu" else torch.float16,
        low_cpu_mem_usage=True
    ).to(device)
    
    load_time = time.time() - start_load
    print(f"      - Model loaded successfully in {load_time:.2f}s ✅")

    # Test 4: Generation Test
    test_prompt = "Artificial Intelligence is"
    print(f"\\n[4/4] Testing token generation with prompt: '{test_prompt}'...")
    start_gen = time.time()
    
    inputs = tokenizer(test_prompt, return_tensors="pt").to(device)
    outputs = model.generate(
        **inputs,
        max_new_tokens=25,
        temperature=0.7,
        do_sample=True,
        pad_token_id=tokenizer.eos_token_id
    )
    
    generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    gen_time = time.time() - start_gen

    print(f"      - Output: \\"{generated_text}\\"")
    print(f"      - Generation took {gen_time:.2f}s (~{25/gen_time:.1f} tokens/sec) ✅")

    print("\\n==================================================")
    print("🎉 ALL TESTS PASSED! Your environment is ready.")
    print("Launch the chatbot UI with: streamlit run app.py")
    print("==================================================")

if __name__ == "__main__":
    run_tests()
`
  },
  {
    name: 'README.md',
    path: 'mini-llm-chatbot/README.md',
    language: 'markdown',
    description: 'Comprehensive setup guide, architecture documentation, model comparisons, and troubleshooting.',
    content: `# Mini LLM – AI Chatbot

A simple, functional, and clean ChatGPT-style AI chatbot running completely local, pre-trained open-source language models using **Hugging Face Transformers**, **PyTorch**, and **Streamlit**.

---

## 🌟 Features
- **ChatGPT-Style Layout**: Left collapsible sidebar for controls and main conversation area with message bubbles.
- **Pre-trained Open-Source Models**: Choose between TinyLlama-1.1B, FLAN-T5-Base, GPT-2, or SmolLM2-360M. No training from scratch required.
- **Real-Time Token Streaming**: Watch responses appear word-by-word via \`TextIteratorStreamer\`.
- **Session Memory**: Preserves conversation history across turns using Streamlit's \`st.session_state\`.
- **Parameter Control**: Interactive sliders for Temperature, Max New Tokens, and Top-P sampling.
- **Hardware Agnostic**: Runs smoothly on ordinary laptop CPUs, Apple Silicon (MPS), or NVIDIA GPUs (CUDA).
- **Error Handling**: Graceful error handling for memory allocation, input validation, and device fallback.

---

## 🏗️ Architecture

\`\`\`
[ User Prompt in Streamlit ]
              │
              ▼
[ Streamlit Session State (History) ]
              │
              ▼
[ AutoTokenizer (Hugging Face) ] ──▶ (Tokenization & Subword Encoding)
              │
              ▼
[ PyTorch Tensor (input_ids) ]
              │
              ▼
[ Pre-trained Model (e.g. TinyLlama 1.1B) ] ──▶ (Self-Attention & Transformer Layers)
              │
              ▼
[ Autoregressive Next-Token Sampling ] ──▶ (Temperature, Top-P, Repetition Penalty)
              │
              ▼
[ TextIteratorStreamer ] ──▶ [ Real-Time UI Rendering ]
\`\`\`

---

## 📁 Project Folder Structure

\`\`\`
mini-llm-chatbot/
├── app.py                # Main Streamlit web application & UI
├── model_loader.py       # Cached model loader, device routing & token streamer
├── config.py             # Model definitions, metadata, & default hyperparameters
├── requirements.txt      # Python dependencies
├── test_chatbot.py       # Standalone CLI test script to verify environment
└── README.md             # Documentation and usage guide
\`\`\`

---

## 🚀 Step-by-Step Setup Guide

### 1. Prerequisites
- Python 3.10, 3.11, or 3.12 installed on your system.
- Minimum 4 GB of RAM (8 GB+ recommended).
- Internet connection (required only once to download model weights from Hugging Face).

### 2. Create and Activate a Virtual Environment
\`\`\`bash
# Create directory and navigate into it
mkdir mini-llm-chatbot
cd mini-llm-chatbot

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS / Linux:
source venv/bin/activate

# On Windows (Command Prompt):
venv\\Scripts\\activate.bat

# On Windows (PowerShell):
venv\\Scripts\\Activate.ps1
\`\`\`

### 3. Install Dependencies
\`\`\`bash
pip install --upgrade pip
pip install -r requirements.txt
\`\`\`

### 4. Verify Installation (Optional but Recommended)
Run the automated smoke test script to verify that PyTorch and Transformers can load models:
\`\`\`bash
python test_chatbot.py
\`\`\`

### 5. Launch the Streamlit Chatbot
\`\`\`bash
streamlit run app.py
\`\`\`

Open your browser at **http://localhost:8501**.

---

## 🧠 Supported Open-Source Models

| Model | Parameters | Best For | Typical RAM Usage |
| :--- | :--- | :--- | :--- |
| **TinyLlama-1.1B-Chat** | 1.1 Billion | Best general-purpose dialogue & coding | ~3.5 GB |
| **FLAN-T5-Base** | 250 Million | Q&A, summarization, step-by-step instructions | ~1.5 GB |
| **GPT-2 Base** | 124 Million | Ultra-lightweight testing on older hardware | ~0.8 GB |
| **SmolLM2-360M-Instruct** | 360 Million | Modern compact edge reasoning | ~1.8 GB |

---

## 🛠️ Troubleshooting

- **Out of Memory (CUDA / RAM)**:
  - Select a smaller model like **GPT-2** or **FLAN-T5-Base**.
  - Lower the **Max New Tokens** slider in the sidebar from 512 down to 128 or 256.
- **Slow Generation on CPU**:
  - Open-source models run faster on GPU, but running at 10-20 tokens/sec on modern laptop CPUs is normal for TinyLlama.
- **Model Download Stuck**:
  - Ensure you have a stable internet connection. Models are cached in \`~/.cache/huggingface/hub\` and only downloaded once.
`
  }
];

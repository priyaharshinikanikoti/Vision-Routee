import React, { useState } from 'react';
import { 
  Bot, Sparkles, Send, X, CheckCircle2, 
  Key, RefreshCw, Radio, Zap, ShieldAlert
} from 'lucide-react';
import aiService from '../../services/aiService';
import audio from '../../services/audioService';

export const SUGGESTED_PROMPTS = [
  'Analyze emergency green corridor preemption for Ambulance AMB-104',
  'Recommend multi-agency protocol for LPG gas leak on Tanker TRUCK-312',
  'Assess Civil Lines flooded underpass and provide traffic diversion plan',
  'Evaluate cold-chain breach if vaccine temperature rises above 8°C'
];

export default function AIAssistantModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `👋 **Greetings! I am SMART TRANSIT AI**, powered by Groq's high-speed LLM inference.

I am connected to the live telemetry grid of **SMART TRANSIT COMMAND (SIH26222)**:
- 🚦 **24 Coordinated Traffic Signals** (V2I preemption active)
- 🚑 **Dynamic Green Corridors** (Ambulance AMB-104, Fire FIRE-22)
- 📡 **15+ IoT Hardware Sensors** (Pothole IMUs, Flood Gauges, WIM Overload, 77GHz Blind Spot Radar)
- 🚚 **Logistics Fleet & Cold-Chain Telemetry**

Click any suggested query below or type your operational command:`
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [showKeyConfig, setShowKeyConfig] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(aiService.getApiKey());

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputPrompt;
    if (!query.trim()) return;

    const newMessages = [...messages, { role: 'user', content: query }];
    setMessages(newMessages);
    setInputPrompt('');
    setLoading(true);
    audio.playAlertBeep();

    try {
      const reply = await aiService.askGroq(query);
      setMessages([...newMessages, { role: 'assistant', content: reply }]);
      audio.playSuccessChime();
    } catch (e) {
      setMessages([...newMessages, { role: 'assistant', content: `⚠️ Error from Groq AI: ${e.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveApiKey = () => {
    aiService.setApiKey(apiKeyInput);
    setShowKeyConfig(false);
    audio.playSuccessChime();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#091122] border border-cyan-500/70 rounded-2xl w-full max-w-3xl h-[650px] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="bg-[#0c162e] border-b border-cyan-900/60 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl text-white shadow-lg shadow-cyan-950">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-black text-white tracking-wide">
                  SMART TRANSIT AI COPILOT
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                  GROQ POWERED (qwen/qwen3.8-27b)
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Autonomous Traffic Engineering & Incident Response LLM
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowKeyConfig(!showKeyConfig)}
              className="p-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-400 hover:text-cyan-300 text-xs"
              title="Configure Groq API Key"
            >
              <Key className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* API Key Drawer */}
        {showKeyConfig && (
          <div className="bg-[#070e1c] border-b border-cyan-800/80 p-3.5 flex items-center justify-between gap-3 text-xs">
            <div className="flex-1">
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Groq API Key (Configured)
              </label>
              <input 
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                className="w-full bg-[#0d1830] border border-slate-700 rounded px-2.5 py-1 text-cyan-300 font-mono text-xs"
              />
            </div>
            <button
              onClick={handleSaveApiKey}
              className="mt-4 px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded text-xs"
            >
              Save Key
            </button>
          </div>
        )}

        {/* Message History */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className={`max-w-[85%] rounded-xl p-3.5 text-xs ${
                m.role === 'user' 
                  ? 'bg-cyan-700 text-white font-medium rounded-br-none' 
                  : 'bg-[#0f1b34] border border-cyan-900/60 text-slate-200 rounded-bl-none shadow-lg'
              }`}>
                <div className="whitespace-pre-wrap leading-relaxed">
                  {m.content}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-2 text-xs text-cyan-400 p-2 bg-[#0c162e] rounded-lg border border-cyan-900/40 w-fit">
              <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
              <span>Smart Transit AI is reasoning on Groq tensor cores...</span>
            </div>
          )}
        </div>

        {/* Suggested Quick Queries */}
        <div className="p-2.5 bg-[#0a1224] border-t border-slate-800/80 flex flex-wrap gap-1.5">
          {SUGGESTED_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              disabled={loading}
              className="text-[11px] bg-slate-900/90 hover:bg-cyan-950 text-slate-300 hover:text-cyan-200 px-2.5 py-1 rounded-full border border-slate-800 hover:border-cyan-700 transition-all truncate max-w-[320px]"
            >
              ✦ {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
          className="p-3.5 bg-[#0c162e] border-t border-cyan-900/60 flex items-center space-x-2"
        >
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Ask Smart Transit AI about emergency corridors, sensor data, or traffic triage..."
            disabled={loading}
            className="flex-1 bg-[#070e1c] border border-cyan-800/60 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
          />
          <button
            type="submit"
            disabled={loading || !inputPrompt.trim()}
            className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-lg shadow-cyan-950 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}

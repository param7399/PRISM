import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Globe,
  ExternalLink,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { usePrism } from '../../context/PrismContext';

interface GroundingSource {
  uri: string;
  title: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  modelUsed?: string;
  sources?: GroundingSource[];
}

export const CareerMentorChat: React.FC = () => {
  const { student, readiness } = usePrism();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [modelMode, setModelMode] = useState<'general' | 'fast' | 'complex'>('general');
  const [useSearch, setUseSearch] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'model',
      text: `Hi ${student.name}! I'm your PRISM Career Mentor. Right now your readiness for ${student.careerGoal} is ${readiness}%, with Python (82%) as your strongest skill and Machine Learning (45%) as your top gap. Ask me anything about what to learn or build next — or toggle Google Search to check live industry requirements.`
    }
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, isLoading]);

  const sendMessage = async (promptText?: string) => {
    const textToSend = (promptText ?? input).trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: textToSend
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    if (!promptText) setInput('');
    setErrorMsg('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedHistory.map((m) => ({ role: m.role, text: m.text })),
          studentContext: {
            name: student.name,
            college: student.college,
            degree: student.degree,
            branch: student.branch,
            year: student.year,
            careerGoal: student.careerGoal,
            readiness,
            skills: student.skills.map((s) => ({
              name: s.name,
              score: s.score,
              level: s.level
            })),
            projects: student.projects.map((p) => ({
              name: p.name,
              status: p.status
            }))
          },
          modelMode,
          useSearch
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Could not reach PRISM Career Mentor.');
      }

      const botMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: data.text,
        modelUsed: data.modelUsed,
        sources: data.sources
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Request failed.';
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'model',
        text: `Chat cleared. Your ${student.careerGoal} readiness is currently ${readiness}%. What should we figure out next?`
      }
    ]);
    setErrorMsg('');
  };

  const quickPrompts = [
    'How do I raise Machine Learning from 45% to 80%?',
    'What are live 2026 AI/ML intern requirements?',
    'How should I structure the AI Study Assistant RAG project?'
  ];

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white shadow-lg border border-slate-700 dark:border-blue-400/30 text-xs font-semibold transition-transform duration-150 hover:scale-[1.02]"
          aria-label="Open PRISM Career Mentor Chat"
        >
          <MessageSquare className="w-4 h-4 text-blue-400 dark:text-white" />
          <span>PRISM Mentor</span>
        </button>
      )}

      {/* Chat Drawer / Window */}
      {isOpen && (
        <div
          className="fixed bottom-4 right-4 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[560px] max-h-[82vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          role="dialog"
          aria-label="PRISM Career Mentor Chat"
        >
          {/* Header */}
          <div className="px-4 py-3.5 bg-slate-900 text-white flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
              <div className="min-w-0">
                <h2 className="text-sm font-bold truncate">PRISM Career Mentor</h2>
                <p className="text-[11px] text-slate-300 truncate">
                  Context-aware guidance for {student.name} ({readiness}% ready)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={handleResetChat}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                title="Clear conversation"
                aria-label="Clear conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Model Mode & Google Search Grounding Controls */}
          <div className="px-3.5 py-2 bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1">
              {(['fast', 'general', 'complex'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setModelMode(mode)}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    modelMode === mode
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {mode === 'fast' ? 'Fast' : mode === 'general' ? 'Balanced' : 'Deep Pro'}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setUseSearch((prev) => !prev)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors ${
                useSearch
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                  : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-700'
              }`}
              title="Ground answers with live Google Search"
            >
              <Globe className="w-3 h-3" />
              <span>{useSearch ? 'Google Search: ON' : 'Search: OFF'}</span>
            </button>
          </div>

          {/* Messages Thread */}
          <div
            ref={scrollRef}
            className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/40 dark:bg-slate-950/40"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-xs'
                  }`}
                >
                  {msg.text}

                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700 space-y-1">
                      <p className="text-[10px] font-mono text-slate-400">
                        Google Search Sources:
                      </p>
                      <div className="flex flex-col gap-1">
                        {msg.sources.slice(0, 3).map((src, i) => (
                          <a
                            key={`${src.uri}-${i}`}
                            href={src.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 hover:underline truncate"
                          >
                            <ExternalLink className="w-3 h-3 shrink-0" />
                            <span className="truncate">{src.title}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start">
                <div className="rounded-2xl px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-500">
                  {useSearch
                    ? 'Searching Google & analyzing your profile...'
                    : 'Looking at your skills & roadmap...'}
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300">
                {errorMsg}
              </div>
            )}
          </div>

          {/* Starter Prompts */}
          {messages.length <= 2 && (
            <div className="px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-1.5 overflow-x-auto">
              {quickPrompts.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => sendMessage(q)}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-500 whitespace-nowrap shrink-0"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask what to learn or build next..."
              className="flex-1 px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-600"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white transition-colors shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

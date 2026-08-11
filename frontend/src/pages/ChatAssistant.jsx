import React, { useState, useRef, useEffect, useCallback } from 'react';
import useAxios from '../hooks/useAxios';
import { useAuth } from '../context/AuthContext';
import { sendChatMessage } from '../services/chatbotService';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const ChatAssistant = () => {
  const api = useAxios();
  const { user } = useAuth();
  const displayName = user?.name || 'Doctor';

  const [messages, setMessages] = useState([
    { role: 'ai', content: `Hello, ${displayName} 👋 I am your AI Heart Care Assistant. I can help analyze patient data, suggest diagnostic questions, or summarize medical guidelines. How can I assist you today?` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMsgIdx, setSpeakingMsgIdx] = useState(null);
  const [autoSpeak, setAutoSpeak] = useState(false);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const transcriptRef = useRef('');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Pre-load voices
  useEffect(() => {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      window.speechSynthesis.cancel();
    };
  }, []);

  // ─── Voice Output (Text-to-Speech) ───────────────────────────────────────
  const speakText = useCallback((text, msgIdx) => {
    window.speechSynthesis.cancel();
    if (speakingMsgIdx === msgIdx) {
      setSpeakingMsgIdx(null);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    utterance.rate = 1;
    utterance.pitch = 1;
    const voices = window.speechSynthesis.getVoices();
    const preferred =
      voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('female')) ||
      voices.find(v => v.lang.startsWith('en-IN')) ||
      voices.find(v => v.lang.startsWith('en'));
    if (preferred) utterance.voice = preferred;
    utterance.onstart = () => setSpeakingMsgIdx(msgIdx);
    utterance.onend = () => setSpeakingMsgIdx(null);
    utterance.onerror = () => setSpeakingMsgIdx(null);
    window.speechSynthesis.speak(utterance);
  }, [speakingMsgIdx]);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    setSpeakingMsgIdx(null);
  }, []);

  // ─── Send Message ─────────────────────────────────────────────────────────
  const sendMessage = useCallback(async (text) => {
    const userMsg = text.trim();
    if (!userMsg) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);
    try {
      const response = await sendChatMessage(api, { message: userMsg });
      const aiReply = response.reply || response.message || 'I received your message.';
      setMessages(prev => {
        const newMessages = [...prev, { role: 'ai', content: aiReply }];
        if (autoSpeak) {
          setTimeout(() => speakText(aiReply, newMessages.length - 1), 300);
        }
        return newMessages;
      });
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I'm having trouble connecting right now. Please try again in a moment." }]);
    } finally {
      setLoading(false);
    }
  }, [api, autoSpeak, speakText]);

  // ─── Voice Input — auto-sends on speech end ───────────────────────────────
  const startListening = useCallback(() => {
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
      return;
    }
    transcriptRef.current = '';
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = true;
    recognition.continuous = false;
    recognitionRef.current = recognition;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setInput(transcript);
      transcriptRef.current = transcript;
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        alert('Microphone permission denied. Please allow microphone access in your browser settings.');
      }
      setIsListening(false);
      transcriptRef.current = '';
    };

    recognition.onend = () => {
      setIsListening(false);
      const finalText = transcriptRef.current.trim();
      if (finalText) {
        transcriptRef.current = '';
        sendMessage(finalText);
      }
    };

    recognition.start();
  }, [sendMessage]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) recognitionRef.current.stop();
  }, []);

  const toggleListening = () => {
    if (isListening) stopListening();
    else startListening();
  };

  const handleSend = () => {
    if (!input.trim()) return;
    if (isListening) stopListening();
    sendMessage(input);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickReplies = [
    'What are early signs of heart attacks?',
    'What diet limits cholesterol?',
    'Explain Thalassemia implications',
    'How to lower blood pressure?'
  ];

  return (
    <div className="flex-grow flex bg-gradient-to-br from-slate-50 via-white to-brand-50/20 h-[calc(100dvh-4rem)] overflow-hidden">
      <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full">

        {/* Header */}
        <div className="p-3 sm:p-4 md:p-5 border-b border-slate-200/60 bg-white/80 backdrop-blur-md z-10 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-white flex items-center justify-center text-base shadow-md">
                  <i className="fa-solid fa-robot"></i>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full shadow-sm"></div>
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-sm sm:text-base">AI Heart Care Assistant</h2>
                <p className="text-[11px] text-slate-400 font-medium">
                  {isListening ? (
                    <span className="text-red-500 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse inline-block"></span>
                      Listening...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block"></span>
                      Online · Ready to help
                    </span>
                  )}
                </p>
              </div>
            </div>

            <button
              onClick={() => { if (autoSpeak) stopSpeaking(); setAutoSpeak(prev => !prev); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                autoSpeak
                  ? 'bg-brand-100 text-brand-700 hover:bg-brand-200 shadow-sm'
                  : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
              }`}
              title={autoSpeak ? 'Auto-speak is ON' : 'Auto-speak is OFF'}
            >
              <i className={`fa-solid ${autoSpeak ? 'fa-volume-high' : 'fa-volume-xmark'} text-[10px]`}></i>
              <span className="hidden sm:inline">{autoSpeak ? 'Voice On' : 'Voice Off'}</span>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-5 flex flex-col">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
              {msg.role === 'ai' && (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white flex items-center justify-center shrink-0 mr-2 sm:mr-3 mt-1 shadow-sm">
                  <i className="fa-solid fa-robot text-[10px] sm:text-xs"></i>
                </div>
              )}

              <div className="flex flex-col gap-1 max-w-[88%] sm:max-w-[78%]">
                <div className={`rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 text-sm ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-brand-500 to-brand-600 text-white rounded-tr-sm shadow-md'
                    : 'bg-white border border-slate-100 text-slate-700 rounded-tl-sm shadow-sm'
                }`}>
                  <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                </div>

                {msg.role === 'ai' && (
                  <button
                    onClick={() => speakText(msg.content, idx)}
                    className={`self-start ml-1 flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-all ${
                      speakingMsgIdx === idx
                        ? 'bg-brand-100 text-brand-600'
                        : 'text-slate-300 hover:text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <i className={`fa-solid ${speakingMsgIdx === idx ? 'fa-stop' : 'fa-volume-up'}`}></i>
                    {speakingMsgIdx === idx ? 'Stop' : 'Listen'}
                  </button>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-200 text-slate-600 flex items-center justify-center shrink-0 ml-2 sm:ml-3 mt-1 shadow-sm">
                  <i className="fa-solid fa-user text-[10px] sm:text-xs"></i>
                </div>
              )}
            </div>
          ))}

          {/* Quick replies — first message only */}
          {messages.length === 1 && !loading && (
            <div className="flex flex-wrap gap-2 mt-2">
              {quickReplies.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-600 hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50/50 transition-all duration-200 shadow-sm"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Typing indicator */}
          {loading && (
            <div className="flex justify-start items-end animate-fade-in">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white flex items-center justify-center shrink-0 mr-2 sm:mr-3 shadow-sm">
                <i className="fa-solid fa-robot text-[10px] sm:text-xs"></i>
              </div>
              <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm flex gap-1.5 min-w-[80px] h-[52px] items-center">
                <div className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="shrink-0 w-full p-3 sm:p-4 md:p-5 bg-gradient-to-t from-slate-50 to-transparent border-t border-slate-200/40">
          <div className={`max-w-3xl mx-auto bg-white border rounded-2xl shadow-lg transition-all duration-200 ${
            isListening
              ? 'border-red-300 ring-2 ring-red-500/20 shadow-red-500/10'
              : 'border-slate-200 focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-400 shadow-slate-200/50'
          }`}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? '🎙️ Speak now...' : 'Ask about heart health, symptoms, or guidelines...'}
              className="w-full resize-none bg-transparent outline-none px-4 py-3 text-sm text-slate-800 placeholder-slate-400 min-h-[48px] max-h-28"
              rows={1}
            />
            <div className="flex justify-between items-center px-3 pb-2">
              <div className="flex gap-1.5">
                <button
                  onClick={toggleListening}
                  disabled={loading}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    isListening
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'text-slate-300 hover:text-slate-500 hover:bg-slate-50'
                  }`}
                  title={isListening ? 'Stop recording' : 'Start voice input'}
                >
                  <i className={`fa-solid ${isListening ? 'fa-stop' : 'fa-microphone'} text-xs`}></i>
                </button>
              </div>
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white flex items-center justify-center hover:from-brand-600 hover:to-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                <i className="fa-solid fa-paper-plane text-xs"></i>
              </button>
            </div>
          </div>
          <div className="text-center mt-2">
            <p className="text-[10px] text-slate-400">
              <i className="fa-solid fa-microphone mr-1"></i>
              Voice input & output supported · AI can make mistakes. Verify important medical information.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatAssistant;

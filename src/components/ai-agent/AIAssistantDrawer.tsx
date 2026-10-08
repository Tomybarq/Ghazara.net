import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Lightbulb
} from 'lucide-react';
import { generateCopilotAnswer, CopilotResponse } from '../../domain/copilot';
import { ActiveTab } from '../../types';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
  suggestedActions?: { label: string; tab?: ActiveTab }[];
}

export const AIAssistantDrawer: React.FC = () => {
  const { 
    isAIAgentOpen, 
    setIsAIAgentOpen, 
    setActiveTab,
    userDonations, 
    userCharities, 
    userMarketers, 
    userTargets, 
    userPayroll,
    currentUser 
  } = useApp();

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg_1',
      sender: 'assistant',
      text: `أهلاً بك يا ${currentUser.name}! أنا المساعد الذكي لمنظومة غزارة لإدارة مبيعات وتبرعات الجمعيات الخيرية. يمكنك سؤالي عن تحليل الإيرادات، أداء المسوقين، المستهدفات، والتقارير المالية المتاحة لصلاحياتك. كيف أساعدك اليوم؟`,
      time: 'الآن',
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isAIAgentOpen) return null;

  // Quick Questions based on Role
  const getQuickQuestions = () => {
    if (currentUser.role === 'charity_rep') {
      return [
        'كم إجمالي تبرعات الجمعية حتى الآن؟',
        'ما هي أعلى قنوات السداد لتبرعاتنا؟',
        'ما هي التوصيات لزيادة إيرادات الحملات؟'
      ];
    }
    if (currentUser.role === 'marketer') {
      return [
        'ما هي نسبة إنجازي من هدفي الشهري؟',
        'كم تبلغ عمولتي المحتسبة لشهر الحالي؟',
        'ما هي أكثر الجمعيات تحقيقاً للتبرعات لدي؟'
      ];
    }
    return [
      'من هو أفضل مسوق لهذا الشهر؟',
      'ما هي أعلى الجمعيات الخيرية تحصيلاً؟',
      'كم إجمالي العمولات وصافي مسير الرواتب؟',
      'ما هي أكثر وسائل الدفع استخداماً؟',
      'ما هي التوصيات لتنشيط المسوقين المتعثرين؟'
    ];
  };

  const quickQuestions = getQuickQuestions();

  const handleSend = (questionText?: string) => {
    const textToSend = questionText || input.trim();
    if (!textToSend) return;

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      time: new Date().toTimeString().substring(0, 5),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!questionText) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response: CopilotResponse = generateCopilotAnswer(textToSend, {
        currentUser,
        donations: userDonations,
        charities: userCharities,
        marketers: userMarketers,
        targets: userTargets,
        payroll: userPayroll,
      });

      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: `ai_${Date.now()}`,
          sender: 'assistant',
          text: response.text,
          time: new Date().toTimeString().substring(0, 5),
          suggestedActions: response.suggestedActions,
        }
      ]);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade-in flex justify-start">
      <div 
        className="fixed inset-0" 
        onClick={() => setIsAIAgentOpen(false)} 
      />
      <div className="relative w-full max-w-md md:max-w-lg bg-[#0E0E26] border-r border-[#6B21C8]/40 h-full flex flex-col shadow-2xl z-10 animate-fade-in">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-[#23234A] bg-gradient-to-l from-[#1B0B3B] to-[#0E0E26] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-[#6B21C8] to-[#FF6B2B] text-white shadow-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>مساعد غزارة الذكي للعمليات</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">AI Scoped</span>
              </h3>
              <p className="text-[11px] text-purple-200/80">تحليل لحظي مخصص لصلاحيات: {currentUser.name}</p>
            </div>
          </div>

          <button
            onClick={() => setIsAIAgentOpen(false)}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Question Chips */}
        <div className="p-3 bg-[#12122B] border-b border-[#23234A] overflow-x-auto">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1.5">
            <Lightbulb className="w-3 h-3 text-amber-400" />
            <span>أسئلة تحليلية مقترحة:</span>
          </div>
          <div className="flex gap-2">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="shrink-0 bg-[#1A1A3A] hover:bg-[#6B21C8]/30 border border-[#23234A] text-slate-200 text-xs px-2.5 py-1 rounded-lg transition-all"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Message Log */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 text-xs ${
                msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-ghazara-orange text-white'
                  : 'bg-[#6B21C8] text-white shadow-md'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-line shadow-md ${
                msg.sender === 'user'
                  ? 'bg-[#FF6B2B] text-white rounded-tl-none font-medium'
                  : 'bg-[#151538] text-slate-100 border border-[#23234A] rounded-tr-none'
              }`}>
                {msg.text}
                
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5 pt-2 border-t border-[#23234A]/80">
                    {msg.suggestedActions.map((action, aIdx) => (
                      <button
                        key={aIdx}
                        onClick={() => {
                          if (action.tab) {
                            setActiveTab(action.tab);
                            setIsAIAgentOpen(false);
                          }
                        }}
                        className="bg-[#6B21C8]/30 hover:bg-[#6B21C8] border border-[#6B21C8]/50 text-white text-[11px] px-2.5 py-1 rounded-lg transition-all"
                      >
                        {action.label} ↗
                      </button>
                    ))}
                  </div>
                )}

                <div className={`text-[10px] mt-1.5 ${msg.sender === 'user' ? 'text-orange-100' : 'text-slate-400'}`}>
                  {msg.time}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-purple-300 p-2">
              <Sparkles className="w-4 h-4 animate-spin text-ghazara-orange" />
              <span>جاري استخلاص وتحليل البيانات المتاحة لصلاحياتك...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-[#23234A] bg-[#12122B]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="اكتب استفسارك للذكاء الاصطناعي..."
              className="flex-1 bg-[#0A0A1A] border border-[#23234A] rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-ghazara-orange"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2.5 bg-gradient-to-r from-[#FF6B2B] to-[#EA580C] disabled:opacity-40 text-white rounded-xl transition-all shadow-md active:scale-95 shrink-0"
            >
              <Send className="w-4 h-4 rotate-180" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

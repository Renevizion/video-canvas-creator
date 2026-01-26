import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Sparkles, X, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import type { VideoPlan } from '@/types/video';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIEditChatProps {
  planId: string;
  currentPlan: VideoPlan;
  onPlanUpdate: (plan: VideoPlan) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const SUGGESTIONS = [
  "Change background to dark blue",
  "Make the text larger",
  "Add more animations",
  "Speed up the transitions",
  "Change colors to match my brand",
];

export const AIEditChat = ({ planId, currentPlan, onPlanUpdate, isOpen, onToggle }: AIEditChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (instruction: string) => {
    if (!instruction.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: instruction,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('edit-video-plan', {
        body: { planId, instruction, currentPlan },
      });

      if (error) throw error;

      if (data?.plan) {
        onPlanUpdate(data.plan);
        
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Done! I've updated the video based on your request. The preview should refresh automatically.`,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
        toast.success('Video updated!');
      }
    } catch (error) {
      console.error('Edit error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Sorry, I couldn't make that change. ${error instanceof Error ? error.message : 'Please try again.'}`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      toast.error('Failed to update video');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-primary to-accent hover:opacity-90 z-50"
        size="icon"
      >
        <Sparkles className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed right-4 bottom-4 w-96 h-[500px] glass-card rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary to-accent flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">AI Editor</h3>
            <p className="text-xs text-muted-foreground">Edit with natural language</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onToggle} className="h-8 w-8">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-sm text-muted-foreground mb-4">
              Tell me how you want to edit the video
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {SUGGESTIONS.slice(0, 3).map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => handleSubmit(suggestion)}
                  className="px-3 py-1.5 text-xs rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-md'
                      : 'bg-muted rounded-bl-md'
                  }`}
                >
                  {message.content}
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(input);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., Make the title bigger..."
            className="flex-1 px-4 py-2 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isLoading}
            className="rounded-xl"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </motion.div>
  );
};

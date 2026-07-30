import { create } from 'zustand';
import { Message } from '../types/api.types';

interface AIState {
  messages: Message[];
  isTyping: boolean;
  
  addMessage: (message: Message) => void;
  setIsTyping: (isTyping: boolean) => void;
  clearHistory: () => void;
}

export const useAIStore = create<AIState>((set) => ({
  messages: [
    {
      id: '1',
      content: 'Assalamu alaikum! I am the MIZAN AI Assistant. How can I help you with Islamic finance today?',
      role: 'assistant',
      timestamp: new Date().toISOString(),
    }
  ],
  isTyping: false,
  
  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message] 
  })),
  setIsTyping: (isTyping) => set({ isTyping }),
  clearHistory: () => set({ 
    messages: [{
      id: '1',
      content: 'Assalamu alaikum! I am the MIZAN AI Assistant. How can I help you with Islamic finance today?',
      role: 'assistant',
      timestamp: new Date().toISOString(),
    }] 
  }),
}));

import { useAIStore } from '../stores/ai.store';
import { aiService } from '../services/ai.service';
import { Message } from '../types/api.types';

export const useAI = () => {
  const store = useAIStore();

  const sendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date().toISOString(),
    };
    
    store.addMessage(userMessage);
    store.setIsTyping(true);
    
    try {
      const response = await aiService.sendMessage(content, store.messages);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        role: 'assistant',
        timestamp: new Date().toISOString(),
        sources: response.sources,
      };
      
      store.addMessage(aiMessage);
    } catch (error) {
      console.error('Failed to get AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'I apologize, but I am having trouble connecting right now. Please try again later.',
        role: 'assistant',
        timestamp: new Date().toISOString(),
      };
      store.addMessage(errorMessage);
    } finally {
      store.setIsTyping(false);
    }
  };

  return {
    ...store,
    sendMessage,
  };
};

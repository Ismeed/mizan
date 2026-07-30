export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
  sources?: Source[];
}

export interface Source {
  source: string;
  reference: string;
}

export interface AIResponse {
  content: string;
  sources?: Source[];
}

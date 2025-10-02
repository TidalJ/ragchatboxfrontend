import { create } from 'zustand';
import { Document } from '@/lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AppState {
  messages: Message[];
  documents: Document[];
  addMessage: (message: Message) => void;
  setDocuments: (documents: Document[]) => void;
}

export const useAppStore = create<AppState>((set) => ({
  messages: [],
  documents: [],
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setDocuments: (documents) => set({ documents }),
}));

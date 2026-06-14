'use client';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  media?: {
    type: 'image' | 'video' | 'audio' | 'dicom';
    url: string;
    name: string;
  }[];
}

export interface ChatSession {
  id: string;
  title: string;
  type: 'case' | 'general';
  messages: ChatMessage[];
  lastUpdated: number;
}

export interface UserProfile {
  name: string;
  specialty: string;
  preferences: {
    language: 'en' | 'ar';
    theme: 'dark' | 'light' | 'cyber';
  };
  longTermMemory: string[]; // AI builds this over time
}

const STORAGE_KEYS = {
  CHATS: 'neurocortex_chats',
  PROFILE: 'neurocortex_profile',
};

export const storage = {
  getChats: (): ChatSession[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.CHATS);
    if (!data) return [];
    try {
      const chats = JSON.parse(data);
      // Ensure existing chats have a type
      return chats.map((c: any) => ({
        ...c,
        type: c.type || 'case'
      }));
    } catch (e) {
      return [];
    }
  },
  saveChats: (chats: ChatSession[]) => {
    localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chats));
  },
  getProfile: (): UserProfile => {
    if (typeof window === 'undefined') return defaultProfile;
    const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return data ? JSON.parse(data) : defaultProfile;
  },
  saveProfile: (profile: UserProfile) => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  },
};

const defaultProfile: UserProfile = {
  name: 'Dr. Sterling',
  specialty: 'Neurosurgery',
  preferences: {
    language: 'en',
    theme: 'dark',
  },
  longTermMemory: [],
};

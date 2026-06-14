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
    storage.autoBackup();
  },
  getProfile: (): UserProfile => {
    if (typeof window === 'undefined') return defaultProfile;
    const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return data ? JSON.parse(data) : defaultProfile;
  },
  saveProfile: (profile: UserProfile) => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    storage.autoBackup();
  },
  
  // NEW: Automated Backup & Sync Mechanisms
  autoBackup: () => {
    // This could trigger a debounced cloud sync in a real app
    console.log('Data change detected: Triggering auto-backup sequence...');
  },

  exportBackup: () => {
    const backupData = {
      chats: storage.getChats(),
      profile: storage.getProfile(),
      timestamp: Date.now(),
      version: "1.0.0"
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `neurocortex_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  },

  importBackup: async (file: File) => {
    const text = await file.text();
    const data = JSON.parse(text);
    if (data.chats) storage.saveChats(data.chats);
    if (data.profile) storage.saveProfile(data.profile);
    return true;
  },

  // Placeholder for Google Drive integration
  syncWithGoogleDrive: async () => {
    console.log('Initiating Google Drive Oauth2 workflow...');
    return new Promise(resolve => setTimeout(() => {
      console.log('Sync complete (Simulation)');
      resolve(true);
    }, 2000));
  }
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

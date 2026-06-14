'use client';

import { redirect } from 'next/navigation';
import { storage } from '@/lib/storage';
import { useEffect } from 'react';

export default function ChatLandingPage() {
  useEffect(() => {
    const chats = storage.getChats();
    if (chats.length > 0) {
      redirect(`/dashboard/chat/${chats[0].id}`);
    } else {
      // Create first chat if none exist
      const newChat = {
        id: Math.random().toString(36).substring(7),
        title: "Initial Case Discussion",
        messages: [],
        lastUpdated: Date.now()
      };
      storage.saveChats([newChat]);
      redirect(`/dashboard/chat/${newChat.id}`);
    }
  }, []);

  return null;
}


"use client";

import type { Message } from '@/types';
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from './auth-context';
import { MANAGER_RECIPIENT_ID, MANAGER_RECIPIENT_NAME } from '@/lib/constants';

const MESSAGES_STORAGE_KEY = 'cafeTimeMessages';

interface MessagingContextType {
  messages: Message[];
  sendMessage: (content: string, recipientId: string, recipientName: string) => void;
  markMessageAsRead: (messageId: string) => void;
  getUnreadMessageCount: () => number;
  getMessagesForUser: () => Message[];
  getThreadsForUser: () => Record<string, Message[]>;
}

const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

export function MessagingProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    try {
      const storedMessages = localStorage.getItem(MESSAGES_STORAGE_KEY);
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
    } catch (error) {
      console.error("Failed to parse messages from localStorage", error);
      localStorage.removeItem(MESSAGES_STORAGE_KEY);
    }
  }, []);

  const saveMessages = useCallback((updatedMessages: Message[]) => {
    setMessages(updatedMessages);
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(updatedMessages));
  }, []);

  const sendMessage = useCallback((content: string, recipientId: string, recipientName: string) => {
    if (!user) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      senderName: user.name,
      recipientId,
      recipientName,
      content,
      timestamp: Date.now(),
      isRead: false,
      threadId: recipientId === MANAGER_RECIPIENT_ID ? `${user.id}_${MANAGER_RECIPIENT_ID}` : `${Math.min(parseInt(user.id), parseInt(recipientId))}_${Math.max(parseInt(user.id), parseInt(recipientId))}`
    };
    saveMessages([...messages, newMessage]);
  }, [user, messages, saveMessages]);

  const markMessageAsRead = useCallback((messageId: string) => {
    const updatedMessages = messages.map(msg =>
      msg.id === messageId && !msg.isRead ? { ...msg, isRead: true } : msg
    );
    if (messages.some(msg => msg.id === messageId && !msg.isRead)) {
        saveMessages(updatedMessages);
    }
  }, [messages, saveMessages]);
  
  const markThreadAsRead = useCallback((threadId: string) => {
    if (!user) return;
    const updatedMessages = messages.map(msg =>
      msg.threadId === threadId && msg.recipientId === user.id && !msg.isRead 
        ? { ...msg, isRead: true } 
        : msg
    );
    // Check if any message was actually updated to avoid unnecessary saves
    if (updatedMessages.some((msg, index) => msg.isRead !== messages[index].isRead)) {
      saveMessages(updatedMessages);
    }
  }, [user, messages, saveMessages]);


  const getMessagesForUser = useCallback(() => {
    if (!user) return [];
    return messages.filter(msg => 
      msg.senderId === user.id || 
      msg.recipientId === user.id ||
      (user.role === 'manager' && msg.recipientId === MANAGER_RECIPIENT_ID)
    ).sort((a, b) => b.timestamp - a.timestamp);
  }, [user, messages]);

  const getUnreadMessageCount = useCallback(() => {
    if (!user) return 0;
    return messages.filter(msg =>
      !msg.isRead &&
      (msg.recipientId === user.id || (user.role === 'manager' && msg.recipientId === MANAGER_RECIPIENT_ID))
    ).length;
  }, [user, messages]);
  
  const getThreadsForUser = useCallback(() => {
    if (!user) return {};
    const userMessages = getMessagesForUser();
    const threads: Record<string, Message[]> = {};

    userMessages.forEach(msg => {
      let currentThreadId = msg.threadId;
      if (!currentThreadId) { // Fallback for older messages or if threadId wasn't set
        if (msg.recipientId === MANAGER_RECIPIENT_ID && msg.senderId === user.id) { // Employee sent to manager
          currentThreadId = `${user.id}_${MANAGER_RECIPIENT_ID}`;
        } else if (msg.senderId === MANAGER_RECIPIENT_ID && msg.recipientId === user.id) { // Manager sent to employee (not typical in this setup)
           currentThreadId = `${MANAGER_RECIPIENT_ID}_${user.id}`; // This case needs careful handling
        } else if (user.role === 'manager' && msg.recipientId === MANAGER_RECIPIENT_ID) { // Manager viewing message employee sent to "Managers"
            currentThreadId = `${msg.senderId}_${MANAGER_RECIPIENT_ID}`;
        } else { // Direct message between two users (not managers_group)
            const otherUserId = msg.senderId === user.id ? msg.recipientId : msg.senderId;
            currentThreadId = `${Math.min(parseInt(user.id), parseInt(otherUserId))}_${Math.max(parseInt(user.id), parseInt(otherUserId))}`;
        }
      }
      
      if (currentThreadId) {
        if (!threads[currentThreadId]) {
          threads[currentThreadId] = [];
        }
        threads[currentThreadId].push(msg);
      }
    });
    // Sort messages within each thread by timestamp
    for (const threadId in threads) {
        threads[threadId].sort((a,b) => a.timestamp - b.timestamp);
    }
    return threads;
  }, [user, messages, getMessagesForUser]);


  return (
    <MessagingContext.Provider value={{ messages, sendMessage, markMessageAsRead, getUnreadMessageCount, getMessagesForUser, getThreadsForUser }}>
      {children}
    </MessagingContext.Provider>
  );
}

export function useMessaging() {
  const context = useContext(MessagingContext);
  if (context === undefined) {
    throw new Error('useMessaging must be used within a MessagingProvider');
  }
  return context;
}

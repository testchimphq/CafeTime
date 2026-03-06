
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useMessaging } from '@/contexts/messaging-context';
import { emitEvent } from '@/lib/testchimp';
import type { Message, MockSimpleUser } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, MessageSquare, Users, User } from 'lucide-react';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MANAGER_RECIPIENT_ID, MANAGER_RECIPIENT_NAME } from '@/lib/constants';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockSimpleEmployees } from '@/lib/mock-data'; // Updated import


export default function MessagesPage() {
  const { user } = useAuth();
  const { sendMessage, getThreadsForUser, markMessageAsRead } = useMessaging();
  const [newMessageContent, setNewMessageContent] = useState('');
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  
  // For managers to select a recipient when starting a new conversation
  const [managerSelectedRecipientId, setManagerSelectedRecipientId] = useState<string>('');

  const threads = useMemo(() => getThreadsForUser(), [getThreadsForUser]);

  // Determine initial active thread: first unread, or first overall
   useEffect(() => {
    if (!user) return;
    const threadEntries = Object.entries(threads);
    if (threadEntries.length > 0) {
      let initialThreadId: string | null = null;
      // Prioritize unread threads involving the current user as recipient
      const unreadThread = threadEntries.find(([threadId, messagesInThread]) => 
        messagesInThread.some(msg => !msg.isRead && (msg.recipientId === user.id || (user.role === 'manager' && msg.recipientId === MANAGER_RECIPIENT_ID && msg.senderId !== user.id)))
      );
      if (unreadThread) {
        initialThreadId = unreadThread[0];
      } else {
        let latestTimestamp = 0;
        threadEntries.forEach(([threadId, msgs]) => {
            const lastMsg = msgs[msgs.length -1];
            if(lastMsg.timestamp > latestTimestamp) {
                latestTimestamp = lastMsg.timestamp;
                initialThreadId = threadId;
            }
        });
      }
      if(initialThreadId) setActiveThreadId(initialThreadId);
    }
  }, [threads, user]);


  const handleSendMessage = () => {
    if (!newMessageContent.trim() || !user) return;

    let recipientId = '';
    let recipientName = '';
    let threadIdToSetActive = activeThreadId;

    if (user.role === 'employee') {
      recipientId = MANAGER_RECIPIENT_ID;
      recipientName = MANAGER_RECIPIENT_NAME;
      threadIdToSetActive = activeThreadId || `${user.id}_${MANAGER_RECIPIENT_ID}`;
    } else { // Manager is sending
      if (activeThreadId) { // Replying in an existing thread
        const currentThreadMessages = threads[activeThreadId];
        if (currentThreadMessages && currentThreadMessages.length > 0) {
          const otherParticipant = currentThreadMessages.find(msg => msg.senderId !== user.id || msg.recipientId !== user.id);
          if(otherParticipant) {
            recipientId = otherParticipant.senderId === user.id ? otherParticipant.recipientId : otherParticipant.senderId;
            recipientName = otherParticipant.senderId === user.id ? otherParticipant.recipientName : otherParticipant.senderName;
          } else { 
            console.error("Could not determine recipient in manager's reply");
            return;
          }
        }
      } else if (managerSelectedRecipientId) { // Manager starting new conversation
         const selectedEmp = mockSimpleEmployees.find(e => e.id === managerSelectedRecipientId);
         if (selectedEmp) {
            recipientId = selectedEmp.id;
            recipientName = selectedEmp.name;
            threadIdToSetActive = `${Math.min(parseInt(user.id), parseInt(recipientId))}_${Math.max(parseInt(user.id), parseInt(recipientId))}`;
         } else {
            console.error("Selected employee not found for new message.");
            return;
         }
      } else {
        console.error("No recipient selected for manager's message.");
        return;
      }
    }
    
    if (!recipientId || !recipientName) {
        console.error("Recipient ID or Name is missing.");
        return;
    }

    sendMessage(newMessageContent, recipientId, recipientName);
    emitEvent('send_message', { recipient_id: recipientId, recipient_name: recipientName });
    setNewMessageContent('');
    if(threadIdToSetActive && !activeThreadId) setActiveThreadId(threadIdToSetActive); 
    setManagerSelectedRecipientId(''); 
  };
  
  const handleThreadSelect = (threadId: string) => {
    setActiveThreadId(threadId);
    if (user && threads[threadId]) {
        threads[threadId].forEach(msg => {
            if ((msg.recipientId === user.id || (user.role === 'manager' && msg.recipientId === MANAGER_RECIPIENT_ID)) && !msg.isRead && msg.senderId !== user.id) {
                markMessageAsRead(msg.id);
            }
        });
    }
  };

  const getThreadDisplayName = (threadId: string): string => {
    if (!user || !threads[threadId] || threads[threadId].length === 0) return "Unknown Conversation";
    const firstMessage = threads[threadId][0];

    if (threadId.includes(MANAGER_RECIPIENT_ID)) {
      if (user.role === 'manager') {
        return firstMessage.senderId === user.id ? firstMessage.recipientName : firstMessage.senderName;
      } else {
        return MANAGER_RECIPIENT_NAME;
      }
    }
    
    const otherParticipantName = firstMessage.senderId === user.id ? firstMessage.recipientName : firstMessage.senderName;
    return otherParticipantName;
  };
  
  const getThreadAvatar = (threadId: string): { src?: string, fallback: string, hint?: string } => {
    if (!user || !threads[threadId] || threads[threadId].length === 0) return { fallback: '?', hint: 'unknown' };
    const firstMessage = threads[threadId][0];
    let nameForAvatar = "User";
    let hint = "user avatar";

    if (threadId.includes(MANAGER_RECIPIENT_ID)) {
      if (user.role === 'manager') {
        nameForAvatar = firstMessage.senderId === user.id ? firstMessage.recipientName : firstMessage.senderName;
        hint = `${nameForAvatar.split(' ')[0].toLowerCase()} avatar`;
      } else {
        nameForAvatar = MANAGER_RECIPIENT_NAME;
        hint = 'group avatar';
      }
    } else {
      nameForAvatar = firstMessage.senderId === user.id ? firstMessage.recipientName : firstMessage.senderName;
      hint = `${nameForAvatar.split(' ')[0].toLowerCase()} avatar`;
    }
    
    const initials = nameForAvatar?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
    return { src: `https://placehold.co/40x40.png?text=${initials}`, fallback: initials, hint: hint };
  };


  const sortedThreadEntries = Object.entries(threads).sort(([, msgsA], [, msgsB]) => {
    const lastMsgATime = msgsA.length > 0 ? msgsA[msgsA.length - 1].timestamp : 0;
    const lastMsgBTime = msgsB.length > 0 ? msgsB[msgsB.length - 1].timestamp : 0;
    return lastMsgBTime - lastMsgATime; 
  });
  
  const availableRecipients = mockSimpleEmployees.filter(emp => emp.id !== user?.id);


  if (!user) return <p>Loading user information...</p>;

  return (
    <div className="flex h-[calc(100vh-theme(spacing.16)-2*theme(spacing.6))]"> {/* Adjust height based on header and padding */}
      {/* Sidebar for threads */}
      <Card className="w-1/3 lg:w-1/4 mr-4 flex flex-col shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-xl"><MessageSquare className="mr-2 h-5 w-5 text-primary"/>Conversations</CardTitle>
        </CardHeader>
        <ScrollArea className="flex-grow">
          <CardContent className="p-0">
            {sortedThreadEntries.length === 0 && user.role === 'manager' && <p className="p-4 text-muted-foreground">No conversations yet.</p>}
            {sortedThreadEntries.length === 0 && user.role === 'employee' && 
              <Button
                  variant="ghost"
                  className={`w-full justify-start p-3 rounded-none h-auto ${!activeThreadId ? 'bg-muted' : ''}`}
                  onClick={() => setActiveThreadId(null)} // Allows "new message to manager" state
                >
                  <Avatar className="h-8 w-8 mr-3">
                    <AvatarImage src={`https://placehold.co/40x40.png?text=M`} alt={MANAGER_RECIPIENT_NAME} data-ai-hint="group avatar" />
                    <AvatarFallback>M</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="truncate">{MANAGER_RECIPIENT_NAME}</p>
                    <p className="text-xs text-muted-foreground truncate">Start a new conversation</p>
                  </div>
              </Button>
            }
            {sortedThreadEntries.map(([threadId, messagesInThread]) => {
              const lastMessage = messagesInThread[messagesInThread.length - 1];
              const isUnread = messagesInThread.some(msg => !msg.isRead && (msg.recipientId === user.id || (user.role === 'manager' && msg.recipientId === MANAGER_RECIPIENT_ID && msg.senderId !== user.id)));
              const avatar = getThreadAvatar(threadId);
              return (
                <Button
                  key={threadId}
                  variant="ghost"
                  className={`w-full justify-start p-3 rounded-none h-auto ${activeThreadId === threadId ? 'bg-muted' : ''} ${isUnread ? 'font-bold' : ''}`}
                  onClick={() => handleThreadSelect(threadId)}
                >
                  <Avatar className="h-8 w-8 mr-3">
                    <AvatarImage src={avatar.src} alt={getThreadDisplayName(threadId)} data-ai-hint={avatar.hint} />
                    <AvatarFallback>{avatar.fallback}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="truncate">{getThreadDisplayName(threadId)}</p>
                    {lastMessage && <p className="text-xs text-muted-foreground truncate">{lastMessage.senderId === user.id ? "You: " : ""}{lastMessage.content}</p>}
                  </div>
                  {isUnread && <span className="ml-auto h-2.5 w-2.5 rounded-full bg-primary shrink-0"></span>}
                </Button>
              );
            })}
          </CardContent>
        </ScrollArea>
         {user.role === 'manager' && (
          <CardFooter className="p-2 border-t">
            <Select onValueChange={(value) => { setManagerSelectedRecipientId(value); setActiveThreadId(null); }} value={managerSelectedRecipientId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Start new chat with employee..." />
              </SelectTrigger>
              <SelectContent>
                {availableRecipients.map(emp => (
                  <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardFooter>
        )}
      </Card>

      {/* Main chat area */}
      <Card className="flex-1 flex flex-col shadow-lg">
        {user.role === 'manager' && !activeThreadId && !managerSelectedRecipientId && (
          // Placeholder for manager when no conversation is selected or being started
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8">
            <MessageSquare size={64} className="mb-4" />
            <p className="text-xl">Select a conversation</p>
            <p>or start a new one with an employee.</p>
          </div>
        )}

        {(user.role === 'employee' || (user.role === 'manager' && (activeThreadId || managerSelectedRecipientId))) && (
          // This block is shown if:
          // 1. User is an employee (they can always message managers)
          // 2. User is a manager AND (they have an active thread OR they've selected a recipient for a new message)
          <>
            <CardHeader className="border-b">
              <CardTitle className="text-xl">
                {
                  user.role === 'employee' ? MANAGER_RECIPIENT_NAME : // Employee's view always targets/shows Managers
                  (activeThreadId ? getThreadDisplayName(activeThreadId) : // Manager viewing existing thread
                    (managerSelectedRecipientId ? (availableRecipients.find(e => e.id === managerSelectedRecipientId)?.name || "New Message") : "New Message") // Manager starting new chat
                  )
                }
              </CardTitle>
            </CardHeader>
            <ScrollArea className="flex-1 p-4 space-y-4 bg-muted/20">
              {activeThreadId && threads[activeThreadId]?.map(msg => (
                <div key={msg.id} className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-3 rounded-lg shadow ${msg.senderId === user.id ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
                    <p className="text-sm font-semibold">{msg.senderName} {msg.senderId !== user.id && msg.recipientId === MANAGER_RECIPIENT_ID && user.role ==='manager' ? `(to ${MANAGER_RECIPIENT_NAME})`: ""}</p>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    <p className="text-xs opacity-70 mt-1 text-right">{format(new Date(msg.timestamp), 'PPpp')}</p>
                  </div>
                </div>
              ))}
              {/* Placeholder for employee starting a new chat with managers */}
              {user.role === 'employee' && !activeThreadId && (!threads[`${user.id}_${MANAGER_RECIPIENT_ID}`] || threads[`${user.id}_${MANAGER_RECIPIENT_ID}`]?.length === 0) &&(
                 <div className="text-center text-muted-foreground py-8">
                    <MessageSquare size={32} className="mx-auto mb-2" />
                    <p>Send a message to {MANAGER_RECIPIENT_NAME}.</p>
                </div>
              )}
            </ScrollArea>
            <CardFooter className="p-4 border-t">
              <div className="flex w-full items-center space-x-2">
                <Textarea
                  placeholder={
                    user.role === 'employee' ? `Message ${MANAGER_RECIPIENT_NAME}...` :
                    (activeThreadId ? `Reply to ${getThreadDisplayName(activeThreadId)}...` :
                      (managerSelectedRecipientId ? `Message ${availableRecipients.find(e => e.id === managerSelectedRecipientId)?.name || "recipient"}...` : "Type your message...")
                    )
                  }
                  value={newMessageContent}
                  onChange={(e) => setNewMessageContent(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="flex-1 h-9 min-h-0 px-3 py-2 rounded-md resize-none"
                  rows={1}
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={!newMessageContent.trim() || (user.role === 'manager' && !activeThreadId && !managerSelectedRecipientId)}
                  size="sm"
                >
                  <Send className="h-4 w-4 mr-0 sm:mr-2" /> <span className="hidden sm:inline">Send</span>
                </Button>
              </div>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}

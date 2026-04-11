"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// ─── Interfaces ───────────────────────────────────────────────────────────────
export interface Message {
  id: string;
  role: "ai" | "user";
  content: string;
  timestamp: string;
}

export interface Chat {
  id: string;
  title: string;
  createdAt: number;
  messages: Message[];
}

interface ChatContextValue {
  chats: Chat[];
  activeChatId: string | null;
  activeChat: Chat | undefined;
  createNewChat: () => void;
  switchChat: (id: string) => void;
  sendMessage: (content: string) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────
const ChatContext = createContext<ChatContextValue | undefined>(undefined);

// ─── Provider Component ───────────────────────────────────────────────────────
export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const savedChats = localStorage.getItem("advertimus_chats");
    if (savedChats) {
      try {
        const parsed = JSON.parse(savedChats);
        setChats(parsed);
        if (parsed.length > 0) {
          setActiveChatId(parsed[0].id);
        }
      } catch (e) {
        console.error("Failed to parse chats from localStorage", e);
      }
    } else {
      // Create initial chat if none exists
      const newChat: Chat = {
        id: `chat-${Date.now()}`,
        title: "New conversation",
        createdAt: Date.now(),
        messages: [],
      };
      setChats([newChat]);
      setActiveChatId(newChat.id);
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage whenever chats change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("advertimus_chats", JSON.stringify(chats));
    }
  }, [chats, isLoaded]);

  // Derived active chat
  const activeChat = chats.find((c) => c.id === activeChatId);

  // ─── Actions ────────────────────────────────────────────────────────────────
  const createNewChat = () => {
    const newChat: Chat = {
      id: `chat-${Date.now()}`,
      title: "New conversation",
      createdAt: Date.now(),
      messages: [],
    };
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
  };

  const switchChat = (id: string) => {
    setActiveChatId(id);
  };

  const sendMessage = (content: string) => {
    if (!activeChatId) return;

    // 1. Create the user message
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      content,
      timestamp: "Just now",
    };

    setChats((prevChats) =>
      prevChats.map((chat) => {
        if (chat.id === activeChatId) {
          // If this is the first message, rename the chat title
          const newTitle = chat.messages.length === 0 ? content.slice(0, 30) + (content.length > 30 ? "..." : "") : chat.title;
          return {
            ...chat,
            title: newTitle,
            messages: [...chat.messages, userMsg],
          };
        }
        return chat;
      })
    );

    // 2. Simulate AI Response delay
    setTimeout(() => {
      const aiMsg: Message = {
        id: `a-${Date.now()}`,
        role: "ai",
        content: "Got it! Let me analyse that and prepare the best ad strategy for you. (This is a simulated AI response.)",
        timestamp: "Just now",
      };

      setChats((currentChats) =>
        currentChats.map((chat) => {
          if (chat.id === activeChatId) {
            return {
              ...chat,
              messages: [...chat.messages, aiMsg],
            };
          }
          return chat;
        })
      );
    }, 1800);
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        activeChatId,
        activeChat,
        createNewChat,
        switchChat,
        sendMessage,
      }}
    >
      {/* Don't render children until loaded to prevent hydration mismatch */}
      {isLoaded ? children : null}
    </ChatContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}

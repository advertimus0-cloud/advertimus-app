"use client";

import React from "react";

interface ChatAreaProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  isResultsOpen: boolean;
  onToggleResults: () => void;
}

export default function ChatArea({ isSidebarOpen, onToggleSidebar, isResultsOpen, onToggleResults }: ChatAreaProps) {
  return (
    <div className="w-full h-full flex flex-col bg-[#0a0a0a] items-center justify-center relative">
      <div className="absolute top-4 left-4 flex gap-2">
        <button onClick={onToggleSidebar} className="text-white bg-gray-800 px-3 py-1 rounded">
          Toggle Sidebar
        </button>
        <button onClick={onToggleResults} className="text-white bg-gray-800 px-3 py-1 rounded">
          Toggle Results
        </button>
      </div>
      <h2 className="text-white">ChatArea Placeholder</h2>
    </div>
  );
}

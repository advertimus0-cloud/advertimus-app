"use client";

import React from "react";
import Sidebar from "./Sidebar";
import ChatArea from "./ChatArea";
import ResultsPanel from "./ResultsPanel";
import { ChatProvider } from "../context/ChatContext";

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [isResultsOpen, setIsResultsOpen] = React.useState(true);

  return (
    <ChatProvider>
      <div className="flex w-full h-screen bg-black text-white">
        <div style={{ display: isSidebarOpen ? 'block' : 'none', width: '250px' }}>
          <Sidebar isCollapsed={!isSidebarOpen} />
        </div>
        
        <div className="flex-1 border-l border-r border-gray-800">
          <ChatArea 
            isSidebarOpen={isSidebarOpen} 
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
            isResultsOpen={isResultsOpen}
            onToggleResults={() => setIsResultsOpen(!isResultsOpen)}
          />
        </div>
        
        <div style={{ display: isResultsOpen ? 'block' : 'none', width: '300px' }}>
          <ResultsPanel />
        </div>
      </div>
    </ChatProvider>
  );
}

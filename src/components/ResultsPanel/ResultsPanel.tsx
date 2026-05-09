'use client'

import React from 'react';

interface ResultsPanelProps {
  isGenerating: boolean;
}

// Placeholder — full implementation (video player, image gallery, progress, score) coming in a later step
// This panel is ONLY rendered by MainLayout when showResults=true (i.e., after generation starts)
export function ResultsPanel({ isGenerating }: ResultsPanelProps) {
  return (
    <div className="h-full bg-background text-white flex flex-col p-4 border-t border-accent1/30 md:border-t-0 md:border-l">
      <p className="text-text-secondary text-sm">
        {isGenerating ? 'Generating...' : 'Results placeholder'}
      </p>
    </div>
  );
}

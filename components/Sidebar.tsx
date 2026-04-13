"use client";

import React from "react";

export default function Sidebar({ isCollapsed = false }: { isCollapsed?: boolean }) {
  return (
    <div className="w-full h-full bg-black border-r border-gray-800 flex flex-col p-4">
      <h2 className="text-white">Sidebar Placeholder</h2>
    </div>
  );
}

"use client";

import { Menu, X } from "lucide-react";
import { CURRENT_USER } from "@/types/capstone.constants";

interface TopbarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function Topbar({ sidebarOpen, onToggleSidebar }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100 px-6 py-3.5 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <h1 className="font-semibold text-gray-700 text-base">
          Hệ thống quản lý luận văn
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
          {CURRENT_USER.displayName.charAt(0)}
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold text-gray-700 leading-tight">
            Xin chào {CURRENT_USER.name}
          </p>
          <p className="text-xs text-gray-400">Happy day !</p>
        </div>
      </div>
    </header>
  );
}
"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  icon: React.ReactNode;
  title: string;
  colorClass: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  defaultOpen?: boolean;
  /** Hiển thị badge "Đã tự động điền" sau khi import Word */
  highlight?: boolean;
}

export function SectionCard({
  icon,
  title,
  colorClass,
  children,
  action,
  defaultOpen = true,
  highlight = false,
}: SectionCardProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className={cn(
        "bg-white rounded-2xl border shadow-sm overflow-hidden transition-all duration-300",
        highlight
          ? "border-orange-300 ring-2 ring-orange-100"
          : "border-gray-100"
      )}
    >
      {/* Header row */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0",
              colorClass
            )}
          >
            {icon}
          </div>
          <h2 className="font-semibold text-gray-700 text-base truncate">
            {title}
          </h2>
          {highlight && (
            <Badge className="shrink-0 bg-orange-100 text-orange-600 text-[10px] px-2 py-0.5 font-medium border-0">
              ✦ Đã tự động điền
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-2">
          {action}
          <button
            onClick={() => setOpen((o) => !o)}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            aria-label={open ? "Thu gọn" : "Mở rộng"}
          >
            {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {/* Body */}
      {open && <div className="px-6 pb-6">{children}</div>}
    </div>
  );
}
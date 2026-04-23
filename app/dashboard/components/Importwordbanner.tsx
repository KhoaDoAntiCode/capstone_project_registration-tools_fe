"use client";

import { useState, useRef, useCallback } from "react";
import { FileUp, Sparkles, Upload, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImportWordBannerProps {
  onImport: (file: File) => Promise<void>;
  imported: boolean;
  importedFileName: string;
  onReset: () => void;
}

export function ImportWordBanner({
  onImport,
  imported,
  importedFileName,
  onReset,
}: ImportWordBannerProps) {
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.name.match(/\.(doc|docx)$/i)) {
        setError("Chỉ hỗ trợ file .doc hoặc .docx");
        return;
      }
      setError(null);
      setLoading(true);
      try {
        await onImport(file);
      } catch {
        setError("Không thể đọc file. Vui lòng kiểm tra lại hoặc thử file khác.");
      } finally {
        setLoading(false);
      }
    },
    [onImport]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  // ── Success state ──────────────────────────────────────────────────────────
  if (imported) {
    return (
      <div className="rounded-2xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 flex items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center shrink-0">
            <CheckCircle2 size={20} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-green-700 text-sm">
              Import thành công!
            </p>
            <p className="text-xs text-green-600 mt-0.5 truncate">
              <span className="font-medium">{importedFileName}</span> —{" "}
              Thông tin đã được tự động điền. Kiểm tra lại trước khi submit.
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="border-green-300 text-green-700 hover:bg-green-100 shrink-0 text-xs"
        >
          <RefreshCw size={13} className="mr-1.5" />
          Import lại
        </Button>
      </div>
    );
  }

  // ── Drop zone ──────────────────────────────────────────────────────────────
  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => !loading && inputRef.current?.click()}
      className={cn(
        "relative rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer select-none",
        dragging
          ? "border-orange-400 bg-orange-50 scale-[1.01]"
          : "border-orange-200 bg-gradient-to-br from-orange-50/60 to-amber-50/40 hover:border-orange-300 hover:bg-orange-50/80"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".doc,.docx"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = ""; // reset để chọn lại cùng file
        }}
      />

      <div className="flex flex-col sm:flex-row items-center gap-5 px-6 py-5">
        {/* Icon */}
        <div className="relative shrink-0">
          <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center">
            {loading
              ? <div className="w-6 h-6 border-[3px] border-orange-400 border-t-transparent rounded-full animate-spin" />
              : <FileUp size={26} className="text-orange-500" />
            }
          </div>
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
            <Sparkles size={11} className="text-white" />
          </div>
        </div>

        {/* Text */}
        <div className="text-center sm:text-left flex-1">
          <p className="font-semibold text-gray-700 text-sm">
            {loading
              ? "Đang đọc file Word..."
              : "Import file Word để tự động điền thông tin"}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {loading ? (
              "Hệ thống đang phân tích nội dung, vui lòng chờ..."
            ) : (
              <>
                Kéo thả hoặc{" "}
                <span className="text-orange-600 font-medium underline underline-offset-2">
                  chọn file .doc / .docx
                </span>{" "}
                — API sẽ tự động đọc và điền vào tất cả các trường
              </>
            )}
          </p>
          {error && (
            <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
              <AlertCircle size={12} /> {error}
            </p>
          )}
        </div>

        {/* CTA */}
        <Button
          size="sm"
          disabled={loading}
          className="bg-orange-500 hover:bg-orange-600 text-white shrink-0 pointer-events-none px-4"
        >
          {loading ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Đang xử lý...
            </>
          ) : (
            <>
              <Upload size={13} className="mr-1.5" />
              Chọn file Word
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
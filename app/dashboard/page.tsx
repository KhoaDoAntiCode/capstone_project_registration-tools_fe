"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  LayoutDashboard,
  FileText,
  Users,
  Trash2,
  Plus,
  ChevronDown,
  ChevronUp,
  LogOut,
  Menu,
  X,
  CheckCircle2,
  AlertCircle,
  Upload,
  Search,
  FileUp,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Supervisor {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  title: string;
  isLocked?: boolean;
}

interface Student {
  id: string;
  fullName: string;
  studentId: string;
  phone: string;
  email: string;
  role: "Leader" | "Member";
}

interface TopicInfo {
  titleVi: string;
  titleEn: string;
  abbreviation: string;
  semester: string;
  profession: string;
  context: string;
  functionalRequirements: string;
  nonFunctionalRequirements: string;
  durationFrom: string;
  durationTo: string;
}

// ─── API Response Type ────────────────────────────────────────────────────────

interface ParseWordResponse {
  success: boolean;
  data: {
    detectedSemesterId: string | null;
    englishName: string | null;
    vietnameseName: string | null;
    abbreviation: string | null;
    durationFrom: string | null;
    durationTo: string | null;
    profession: string | null;
    context: string | null;
    functionalRequirements: string | null;
    nonFunctionalRequirements: string | null;
    supervisors: {
      id: string;
      fullName: string;
      phone: string | null;
      email: string;
      title: string;
      isPrimary: boolean;
      displayOrder: number;
    }[];
    students: {
      id: string;
      fullName: string;
      studentCode: string;
      phone: string;
      email: string;
      roleInGroup: string;
      displayOrder: number;
    }[];
  };
}

// ─── Constants ────────────────────────────────────────────────────────────────

// ✅ FIX: Không dùng CURRENT_USER ở module level nữa.
// INITIAL_SUPERVISOR chỉ là placeholder rỗng — sẽ được fill trong useEffect.
const INITIAL_SUPERVISOR: Supervisor = {
  id: "sv-locked",
  fullName: "",
  phone: "",
  email: "",
  title: "Mr",
  isLocked: true,
};

const EMPTY_TOPIC: TopicInfo = {
  titleVi: "",
  titleEn: "",
  abbreviation: "",
  semester: "",
  profession: "",
  context: "",
  functionalRequirements: "",
  nonFunctionalRequirements: "",
  durationFrom: "",
  durationTo: "",
};

const NAV_ITEMS = [
  { id: "overview", label: "Tổng quan", icon: LayoutDashboard },
  { id: "manage", label: "Quản lý đề tài", icon: FileText },
  { id: "council", label: "Hội đồng duyệt đề tài", icon: Users },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

// ✅ FIX: Hàm này chỉ được gọi ở runtime (trong useEffect / event handler),
// KHÔNG bao giờ gọi ở module level.
function getCurrentUser() {
  if (typeof window === "undefined") return null;
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

// ✅ FIX: Tạo initial supervisor từ localStorage — chỉ gọi ở runtime.
function createInitialSupervisor(): Supervisor {
  const user = getCurrentUser();
  return {
    id: "sv-locked",
    fullName: user?.fullName || "",
    phone: "",
    email: user?.email || "",
    title: "Mr",
    isLocked: true,
  };
}

// ─── Map API response → local state ──────────────────────────────────────────

function mapResponseToState(data: ParseWordResponse["data"]) {
  const supervisors: Supervisor[] = data.supervisors
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((sv, idx) => ({
      id: `sv-${idx}`,
      fullName: sv.fullName ?? "",
      phone: sv.phone ?? "",
      email: sv.email ?? "",
      title: sv.title?.match(/^(Mr|Ms|Dr|Prof)/i)?.[0] ?? "Mr",
      isLocked: sv.isPrimary,
    }));

  const students: Student[] = data.students
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((st, idx) => ({
      id: `st-${idx}`,
      fullName: st.fullName ?? "",
      studentId: st.studentCode ?? "",
      phone: st.phone ?? "",
      email: st.email ?? "",
      role: (st.roleInGroup === "Leader" ? "Leader" : "Member") as Student["role"],
    }));

  const topic: TopicInfo = {
    titleVi: data.vietnameseName ?? "",
    titleEn: data.englishName ?? "",
    abbreviation: data.abbreviation ?? "",
    semester: data.detectedSemesterId ?? "",
    profession: data.profession ?? "",
    context: data.context ?? "",
    functionalRequirements: data.functionalRequirements ?? "",
    nonFunctionalRequirements: data.nonFunctionalRequirements ?? "",
    durationFrom: data.durationFrom ?? "",
    durationTo: data.durationTo ?? "",
  };

  return { supervisors, students, topic };
}

// ─── Import Word Banner ───────────────────────────────────────────────────────

// ✅ FIX: Xóa useEffect sai scope (setSupervisors không tồn tại trong component này).
function ImportWordBanner({
  onImport,
  imported,
  importedFileName,
  onReset,
}: {
  onImport: (file: File) => Promise<void>;
  imported: boolean;
  importedFileName: string;
  onReset: () => void;
}) {
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.name.match(/\.docx$/i)) {
        setError("Chỉ hỗ trợ file .docx");
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

  // ── Success state ──
  if (imported) {
    return (
      <div className="rounded-2xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 flex items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center shrink-0">
            <CheckCircle2 size={20} className="text-white" />
          </div>
          <div>
            <p className="font-semibold text-green-700 text-sm">Import thành công!</p>
            <p className="text-xs text-green-600 mt-0.5">
              <span className="font-medium">{importedFileName}</span> — Thông tin đã được tự động điền vào form bên dưới. Kiểm tra lại trước khi submit.
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

  // ── Drop zone ──
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
          e.target.value = "";
        }}
      />
      <div className="flex flex-col sm:flex-row items-center gap-5 px-6 py-5">
        {/* Icon */}
        <div className="relative shrink-0">
          <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center">
            {loading
              ? <div className="w-6 h-6 border-3 border-orange-400 border-t-transparent rounded-full animate-spin" />
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
            {loading ? "Đang đọc file Word..." : "Import file Word để tự động điền thông tin"}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {loading
              ? "Hệ thống đang phân tích nội dung, vui lòng chờ..."
              : <>Kéo thả hoặc <span className="text-orange-600 font-medium underline underline-offset-2">chọn file .doc / .docx</span> — API sẽ tự động đọc và điền vào tất cả các trường</>
            }
          </p>
          {error && (
            <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
              <AlertCircle size={12} /> {error}
            </p>
          )}
        </div>

        {/* CTA button */}
        <Button
          size="sm"
          disabled={loading}
          className="bg-orange-500 hover:bg-orange-600 text-white shrink-0 pointer-events-none px-4"
        >
          {loading ? (
            <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />Đang xử lý...</>
          ) : (
            <><Upload size={13} className="mr-1.5" />Chọn file Word</>
          )}
        </Button>
      </div>
    </div>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────

function SectionCard({
  icon, title, colorClass, children, action, defaultOpen = true, highlight = false,
}: {
  icon: React.ReactNode;
  title: string;
  colorClass: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  defaultOpen?: boolean;
  highlight?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={cn(
      "bg-white rounded-2xl border shadow-sm overflow-hidden transition-all duration-300",
      highlight ? "border-orange-300 ring-2 ring-orange-100" : "border-gray-100"
    )}>
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className={cn("w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0", colorClass)}>
            {icon}
          </div>
          <h2 className="font-semibold text-gray-700 text-base">{title}</h2>
          {highlight && (
            <Badge className="bg-orange-100 text-orange-600 text-[10px] px-2 py-0.5 font-medium border-0">
              ✦ Đã tự động điền
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {action}
          <button onClick={() => setOpen((o) => !o)} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
            {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>
      {open && <div className="px-6 pb-6">{children}</div>}
    </div>
  );
}

// ─── Supervisor Section ───────────────────────────────────────────────────────

function SupervisorSection({ supervisors, setSupervisors, highlight }: {
  supervisors: Supervisor[];
  setSupervisors: React.Dispatch<React.SetStateAction<Supervisor[]>>;
  highlight: boolean;
}) {
  const add = () => {
    if (supervisors.length >= 2) return;
    setSupervisors((p) => [...p, { id: `sv-${Date.now()}`, fullName: "", phone: "", email: "", title: "Mr" }]);
  };
  const remove = (id: string) => setSupervisors((p) => p.filter((s) => s.id !== id));
  const update = (id: string, field: keyof Supervisor, val: string) =>
    setSupervisors((p) => p.map((s) => s.id === id ? { ...s, [field]: val } : s));

  return (
    <SectionCard
      icon={<FileText size={16} />}
      title="Thông tin Giảng viên hướng dẫn"
      colorClass="bg-orange-500"
      highlight={highlight}
      action={supervisors.length < 2 ? (
        <Button size="sm" onClick={add} className="bg-orange-500 hover:bg-orange-600 text-white text-xs h-8 px-3 rounded-lg">
          <Plus size={13} className="mr-1" /> Thêm GV
        </Button>
      ) : null}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {["Họ và tên *", "Số điện thoại", "Email *", "Danh xưng", "Xóa"].map((h) => (
                <th key={h} className="text-left text-gray-400 font-medium pb-3 pr-4 whitespace-nowrap text-xs">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {supervisors.map((sv) => (
              <tr key={sv.id}>
                <td className="py-3 pr-3">
                  <Input value={sv.fullName} disabled={sv.isLocked} onChange={(e) => update(sv.id, "fullName", e.target.value)} className="h-9 text-sm min-w-[180px] disabled:bg-gray-50 disabled:text-gray-500" placeholder="Họ và tên" />
                </td>
                <td className="py-3 pr-3">
                  <Input value={sv.phone} onChange={(e) => update(sv.id, "phone", e.target.value)} className="h-9 text-sm min-w-[130px]" placeholder="0xxxxxxxxx" />
                </td>
                <td className="py-3 pr-3">
                  <Input value={sv.email} disabled={sv.isLocked} onChange={(e) => update(sv.id, "email", e.target.value)} className="h-9 text-sm min-w-[180px] disabled:bg-gray-50 disabled:text-gray-500" placeholder="email@fpt.edu.vn" />
                </td>
                <td className="py-3 pr-3">
                  <Select value={sv.title} onValueChange={(v) => update(sv.id, "title", v)}>
                    <SelectTrigger className="h-9 text-sm w-[100px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Mr", "Ms", "Dr", "Prof"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </td>
                <td className="py-3">
                  {!sv.isLocked
                    ? <button onClick={() => remove(sv.id)} className="text-red-400 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                    : <Trash2 size={16} className="text-gray-200" />
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-gray-500 bg-gray-50 rounded-lg p-3 leading-relaxed">
        <strong>Lưu ý:</strong> Giảng viên đầu tiên là{" "}
        <span className="text-orange-600 font-semibold">{supervisors[0]?.fullName || "—"}</span> (tài khoản hiện tại) và không thể thay đổi.
        Số điện thoại và Danh xưng có thể chỉnh sửa nếu cần.
      </p>
    </SectionCard>
  );
}

// ─── Student Section ──────────────────────────────────────────────────────────

function StudentSection({ students, setStudents, highlight }: {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  highlight: boolean;
}) {
  const add = () => {
    if (students.length >= 5) return;
    setStudents((p) => [...p, { id: `st-${Date.now()}`, fullName: "", studentId: "", phone: "", email: "", role: p.length === 0 ? "Leader" : "Member" }]);
  };
  const remove = (id: string) => setStudents((p) => p.filter((s) => s.id !== id));
  const update = (id: string, field: keyof Student, val: string) =>
    setStudents((p) => p.map((s) => s.id === id ? { ...s, [field]: val } : s));

  return (
    <SectionCard
      icon={<Users size={16} />}
      title="Thông tin Nhóm sinh viên (0-5 người)"
      colorClass="bg-blue-500"
      highlight={highlight}
      action={students.length < 5 ? (
        <Button size="sm" onClick={add} className="bg-blue-500 hover:bg-blue-600 text-white text-xs h-8 px-3 rounded-lg">
          <Plus size={13} className="mr-1" /> Thêm SV
        </Button>
      ) : null}
    >
      {students.length === 0 ? (
        <div className="text-center py-8 text-gray-400 text-sm">
          <Users size={32} className="mx-auto mb-2 opacity-25" />
          <p>Số sinh viên hiện tại: <strong>0/5</strong></p>
          <p className="text-xs mt-1">Bạn có thể tạo đề tài không có sinh viên</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Họ và tên", "MSSV", "Số điện thoại", "Email", "Vai trò", "Xóa"].map((h) => (
                    <th key={h} className="text-left text-gray-400 font-medium pb-3 pr-4 whitespace-nowrap text-xs">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {students.map((st) => (
                  <tr key={st.id}>
                    <td className="py-3 pr-3"><Input value={st.fullName} onChange={(e) => update(st.id, "fullName", e.target.value)} className="h-9 text-sm min-w-[150px]" /></td>
                    <td className="py-3 pr-3"><Input value={st.studentId} onChange={(e) => update(st.id, "studentId", e.target.value)} className="h-9 text-sm w-[105px]" placeholder="SE000000" /></td>
                    <td className="py-3 pr-3"><Input value={st.phone} onChange={(e) => update(st.id, "phone", e.target.value)} className="h-9 text-sm w-[125px]" /></td>
                    <td className="py-3 pr-3"><Input value={st.email} onChange={(e) => update(st.id, "email", e.target.value)} className="h-9 text-sm min-w-[160px]" /></td>
                    <td className="py-3 pr-3">
                      <Select value={st.role} onValueChange={(v) => update(st.id, "role", v as Student["role"])}>
                        <SelectTrigger className="h-9 text-sm w-[100px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Leader">Leader</SelectItem>
                          <SelectItem value="Member">Member</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-3">
                      <button onClick={() => remove(st.id)} className="text-red-400 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-gray-400">Số sinh viên: <strong className="text-gray-600">{students.length}/5</strong></p>
        </>
      )}
    </SectionCard>
  );
}

// ─── Topic Info Section ───────────────────────────────────────────────────────

function TopicInfoSection({ topic, setTopic, highlight }: {
  topic: TopicInfo;
  setTopic: React.Dispatch<React.SetStateAction<TopicInfo>>;
  highlight: boolean;
}) {
  const set = (field: keyof TopicInfo, val: string) => setTopic((p) => ({ ...p, [field]: val }));

  return (
    <SectionCard
      icon={<FileText size={16} />}
      title="Thông tin Đề tài"
      colorClass="bg-green-500"
      defaultOpen={highlight}
      highlight={highlight}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-gray-500">Tên đề tài (Tiếng Việt) <span className="text-red-500">*</span></Label>
          <Input value={topic.titleVi} onChange={(e) => set("titleVi", e.target.value)} placeholder="Tên tiếng Việt" className="h-10" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-gray-500">Tên đề tài (Tiếng Anh) <span className="text-red-500">*</span></Label>
          <Input value={topic.titleEn} onChange={(e) => set("titleEn", e.target.value)} placeholder="English title" className="h-10" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-gray-500">Viết tắt (Abbreviation)</Label>
          <Input value={topic.abbreviation} onChange={(e) => set("abbreviation", e.target.value)} placeholder="AIEPTS" className="h-10" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-gray-500">Học kỳ <span className="text-red-500">*</span></Label>
          <Select value={topic.semester} onValueChange={(v) => set("semester", v)}>
            <SelectTrigger className="h-10"><SelectValue placeholder="Chọn học kỳ" /></SelectTrigger>
            <SelectContent>
              {["SP2025", "SU2025", "FA25", "SP2026", "SU2026", "FA2026"].map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-gray-500">Ngành nghề</Label>
          <Input value={topic.profession} onChange={(e) => set("profession", e.target.value)} placeholder="Software Engineer" className="h-10" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-gray-500">Thời gian thực hiện</Label>
          <div className="flex items-center gap-2">
            <Input type="date" value={topic.durationFrom} onChange={(e) => set("durationFrom", e.target.value)} className="h-10 flex-1" />
            <span className="text-gray-400 text-sm shrink-0">→</span>
            <Input type="date" value={topic.durationTo} onChange={(e) => set("durationTo", e.target.value)} className="h-10 flex-1" />
          </div>
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <Label className="text-xs font-medium text-gray-500">Bối cảnh / Context <span className="text-red-500">*</span></Label>
          <Textarea value={topic.context} onChange={(e) => set("context", e.target.value)} className="resize-none h-28 text-sm" placeholder="Mô tả bối cảnh và vấn đề cần giải quyết..." />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <Label className="text-xs font-medium text-gray-500">Yêu cầu chức năng (Functional Requirements)</Label>
          <Textarea value={topic.functionalRequirements} onChange={(e) => set("functionalRequirements", e.target.value)} className="resize-none h-28 text-sm" placeholder="Liệt kê các chức năng chính của hệ thống..." />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <Label className="text-xs font-medium text-gray-500">Yêu cầu phi chức năng (Non-Functional Requirements)</Label>
          <Textarea value={topic.nonFunctionalRequirements} onChange={(e) => set("nonFunctionalRequirements", e.target.value)} className="resize-none h-28 text-sm" placeholder="Hiệu năng, bảo mật, khả năng mở rộng..." />
        </div>
      </div>
    </SectionCard>
  );
}

// ─── Similarity Section ───────────────────────────────────────────────────────

function SimilaritySection() {
  const [file, setFile] = useState<File | null>(null);
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<{ score: number; status: "pass" | "fail" } | null>(null);

  const handleCheck = () => {
    if (!file) return;
    setChecking(true);
    setTimeout(() => {
      const score = Math.floor(Math.random() * 40);
      setResult({ score, status: score <= 30 ? "pass" : "fail" });
      setChecking(false);
    }, 2000);
  };

  return (
    <SectionCard icon={<Search size={16} />} title="Kiểm tra độ tương đồng" colorClass="bg-purple-500" defaultOpen={false}>
      <div className="space-y-4 mt-2">
        <p className="text-sm text-gray-500">Tải lên file đề cương (PDF/DOCX) để kiểm tra độ tương đồng. Tỷ lệ cho phép ≤ <strong>30%</strong>.</p>
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-purple-300 transition-colors">
          <input type="file" id="sim-file" accept=".pdf,.docx" onChange={(e) => { setFile(e.target.files?.[0] || null); setResult(null); }} className="hidden" />
          <label htmlFor="sim-file" className="cursor-pointer flex flex-col items-center gap-2">
            <Upload size={28} className="text-gray-300" />
            {file ? <p className="text-sm font-medium text-purple-600">{file.name}</p> : (
              <><p className="text-sm text-gray-500">Kéo thả hoặc <span className="text-purple-600 font-medium underline">chọn file</span></p><p className="text-xs text-gray-400">PDF, DOCX (tối đa 10MB)</p></>
            )}
          </label>
        </div>
        {file && (
          <Button onClick={handleCheck} disabled={checking} className="bg-purple-600 hover:bg-purple-700 text-white w-full">
            {checking
              ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />Đang kiểm tra...</>
              : <><Search size={15} className="mr-2" />Kiểm tra độ tương đồng</>
            }
          </Button>
        )}
        {result && (
          <div className={cn("rounded-xl p-4 flex items-center gap-4", result.status === "pass" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200")}>
            {result.status === "pass"
              ? <CheckCircle2 size={28} className="text-green-500 shrink-0" />
              : <AlertCircle size={28} className="text-red-500 shrink-0" />
            }
            <div>
              <p className={cn("font-semibold", result.status === "pass" ? "text-green-700" : "text-red-700")}>
                Độ tương đồng: {result.score}%{" "}
                <Badge className={result.status === "pass" ? "bg-green-100 text-green-700 ml-1 border-0" : "bg-red-100 text-red-700 ml-1 border-0"}>
                  {result.status === "pass" ? "Đạt yêu cầu" : "Vượt ngưỡng"}
                </Badge>
              </p>
              <p className="text-sm text-gray-500 mt-0.5">
                {result.status === "pass" ? "Đề tài đáp ứng yêu cầu về độ tương đồng." : "Vượt ngưỡng 30%. Vui lòng chỉnh sửa trước khi nộp."}
              </p>
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CreateCapstonePage() {
  const [activeNav, setActiveNav] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ✅ FIX: Khởi tạo với placeholder rỗng, useEffect sẽ fill từ localStorage
  const [supervisors, setSupervisors] = useState<Supervisor[]>([INITIAL_SUPERVISOR]);
  const [students, setStudents] = useState<Student[]>([]);
  const [topic, setTopic] = useState<TopicInfo>(EMPTY_TOPIC);
  const [currentUser, setCurrentUser] = useState<{ fullName?: string; email?: string } | null>(null);

  // ✅ FIX: Đọc localStorage an toàn trong useEffect (chỉ chạy trên client)
  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    setSupervisors([createInitialSupervisor()]);
  }, []);

  // Import state
  const [imported, setImported] = useState(false);
  const [importedFileName, setImportedFileName] = useState("");

  // Submit state
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // ── Word import handler ──
  const handleWordImport = useCallback(async (file: File) => {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("https://localhost:7148/api/projects/parse", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const json: ParseWordResponse = await res.json();
    if (!json.success) throw new Error("Parse failed");

    const { supervisors: svs, students: sts, topic: tp } = mapResponseToState(json.data);

    // ✅ FIX: Dùng createInitialSupervisor() thay vì INITIAL_SUPERVISOR constant
    const primarySv = createInitialSupervisor();
    const extraSvs = svs.filter((sv) => !sv.isLocked);
    setSupervisors([primarySv, ...extraSvs].slice(0, 2));
    setStudents(sts);
    setTopic(tp);
    setImported(true);
    setImportedFileName(file.name);
  }, []);

  // ✅ FIX: Dùng createInitialSupervisor() thay vì INITIAL_SUPERVISOR constant
  const handleReset = () => {
    setSupervisors([createInitialSupervisor()]);
    setStudents([]);
    setTopic(EMPTY_TOPIC);
    setImported(false);
    setImportedFileName("");
    setSubmitted(false);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn chưa đăng nhập");
      return;
    }

    setSubmitting(true);

    try {
      const body = {
        semesterId: topic.semester,
        englishName: topic.titleEn,
        vietnameseName: topic.titleVi,
        abbreviation: topic.abbreviation,

        isResearchProject: true,
        isEnterpriseProject: true,

        context: topic.context,
        proposedSolutions: "",
        functionalRequirements: topic.functionalRequirements,
        nonFunctionalRequirements: topic.nonFunctionalRequirements,

        theoryAndPractice: "",
        products: "",
        proposedTasks: "",
        className: "",

        durationFrom: topic.durationFrom,
        durationTo: topic.durationTo,

        profession: topic.profession,
        specialty: "",
        registerKind: "Lecturer",

        supervisors: supervisors.map((sv, index) => ({
          fullName: sv.fullName,
          phone: sv.phone,
          email: sv.email,
          title: sv.title,
          isPrimary: sv.isLocked ?? false,
          displayOrder: index,
        })),

        students: students.map((st, index) => ({
          fullName: st.fullName,
          studentCode: st.studentId,
          phone: st.phone,
          email: st.email,
          roleInGroup: st.role,
          displayOrder: index,
        })),
      };

      const res = await fetch("https://localhost:7148/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText);
      }

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("Submit thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* ── Sidebar ── */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 bg-white border-r border-gray-100 flex flex-col transition-all duration-300 shadow-sm",
        sidebarOpen ? "w-56" : "w-0 overflow-hidden"
      )}>
        <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">FPT</span>
          </div>
          <div>
            <p className="font-bold text-gray-800 text-sm leading-tight">FPT University</p>
            <p className="text-xs text-gray-400">Quản lý luận văn</p>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <button key={item.id} onClick={() => setActiveNav(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                activeNav === item.id
                  ? "bg-orange-50 text-orange-600"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              )}
            >
              <item.icon size={17} />
              <span>{item.label}</span>
              {activeNav === item.id && <ChevronDown size={14} className="ml-auto text-orange-400 -rotate-90" />}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-100">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all">
            <LogOut size={17} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className={cn("flex-1 flex flex-col transition-all duration-300", sidebarOpen ? "ml-56" : "ml-0")}>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-100 px-6 py-3.5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen((o) => !o)} className="text-gray-400 hover:text-gray-600 transition-colors">
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="font-semibold text-gray-700 text-base">Hệ thống quản lý luận văn</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {currentUser?.fullName?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-700 leading-tight">Xin chào {currentUser?.fullName || "User"}</p>
              <p className="text-xs text-gray-400">Happy day!</p>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-6 py-6 max-w-5xl mx-auto w-full">
          {/* Page title */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 rounded-2xl p-8 mb-5 text-center">
            <h2 className="text-3xl font-bold text-orange-600 mb-2">Form Đăng ký Đề tài Khóa luận</h2>
            <p className="text-gray-500 text-sm">Vui lòng điền đầy đủ thông tin để đăng ký đề tài khóa luận tốt nghiệp</p>
          </div>

          {/* ── Import Word Banner ── */}
          <ImportWordBanner
            onImport={handleWordImport}
            imported={imported}
            importedFileName={importedFileName}
            onReset={handleReset}
          />

          {/* Collapse all */}
          <div className="flex justify-end mt-4 mb-3">
            <button className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors">
              <ChevronUp size={13} /> Mở tất cả
            </button>
          </div>

          {/* Form sections */}
          <div className="space-y-4">
            <SupervisorSection supervisors={supervisors} setSupervisors={setSupervisors} highlight={imported} />
            <StudentSection students={students} setStudents={setStudents} highlight={imported} />
            <TopicInfoSection topic={topic} setTopic={setTopic} highlight={imported} />
            <SimilaritySection />
          </div>

          {/* Submit */}
          <div className="mt-8 flex justify-center">
            <Button
              onClick={handleSubmit}
              disabled={submitting || submitted}
              className={cn(
                "px-10 py-6 text-base font-semibold rounded-xl transition-all shadow-lg",
                submitted ? "bg-green-500 hover:bg-green-500" : "bg-orange-500 hover:bg-orange-600"
              )}
            >
              {submitting
                ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />Đang xử lý...</>
                : submitted
                ? <><CheckCircle2 size={18} className="mr-2" />Đã gửi thành công!</>
                : "Gửi thông tin & Tạo DOCX"
              }
            </Button>
          </div>

          <p className="text-center text-xs text-gray-400 mt-8 pb-6">
            © 2026 Software Engineering Ho Chi Minh - Hệ thống quản lý luận văn
          </p>
        </main>
      </div>
    </div>
  );
}
// ─── Domain Types ─────────────────────────────────────────────────────────────

export interface Supervisor {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  title: string;
  isLocked?: boolean;
}

export interface Student {
  id: string;
  fullName: string;
  studentId: string;
  phone: string;
  email: string;
  role: "Leader" | "Member";
}

export interface TopicInfo {
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

// ─── API Response Types (match với BE /api/capstone/parse-word) ───────────────

export interface ParseWordSupervisor {
  id: string;
  fullName: string;
  phone: string | null;
  email: string;
  title: string;
  isPrimary: boolean;
  displayOrder: number;
}

export interface ParseWordStudent {
  id: string;
  fullName: string;
  studentCode: string;
  phone: string;
  email: string;
  roleInGroup: string;
  displayOrder: number;
}

export interface ParseWordData {
  detectedSemesterId: string | null;
  englishName: string | null;
  vietnameseName: string | null;
  abbreviation: string | null;
  className: string | null;
  durationFrom: string | null;
  durationTo: string | null;
  profession: string | null;
  specialty: string | null;
  registerKind: string | null;
  context: string | null;
  proposedSolutions: string | null;
  functionalRequirements: string | null;
  nonFunctionalRequirements: string | null;
  supervisors: ParseWordSupervisor[];
  students: ParseWordStudent[];
}

export interface ParseWordResponse {
  success: boolean;
  message: string | null;
  data: ParseWordData;
  errors: string[] | null;
}
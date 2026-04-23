export interface Supervisor {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  title: string;
  isLocked?: boolean;
}
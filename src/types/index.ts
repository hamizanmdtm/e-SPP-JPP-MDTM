export type SectionType = 
  | 'Perancangan Bandar & Desa'
  | 'Kawalan Bangunan'
  | 'Projek & Kejuruteraan'
  | 'Pentadbiran & Penilaian';

export type MovementType = 
  | 'Lawatan Tapak'
  | 'Mesyuarat Luar'
  | 'Mesyuarat Dalaman'
  | 'Cuti Rehat'
  | 'Cuti Sakit'
  | 'Kursus / Latihan'
  | 'Tugas Rasmi (Outstation)';

export type StaffStatus = 'Di Pejabat' | 'Lawatan Tapak' | 'Mesyuarat' | 'Cuti' | 'Outstation';

export type VehicleType = 'Kereta' | '4WD / Pick-up' | 'Van' | 'Motosikal';
export type VehicleStatus = 'Tersedia' | 'Dalam Perjalanan' | 'Penyelenggaraan';

export type LetterCategory = 
  | 'Aduan Awam'
  | 'Permohonan Kebenaran Merancang'
  | 'Pelan Bangunan'
  | 'Jemputan Mesyuarat'
  | 'Pemberitahuan / Pekeliling'
  | 'Projek & Perolehan'
  | 'Lain-lain';

export type LetterType = 'Masuk' | 'Keluar';
export type LetterPriority = 'Biasa' | 'Segera' | 'Sangat Segera';
export type LetterStatus = 'Daftar Baru' | 'Diagihkan' | 'Dalam Tindakan' | 'Selesai' | 'Fail / Diarkibkan';

export type TaskPriority = 'Rendah' | 'Sederhana' | 'Tinggi' | 'Kritikal';
export type TaskStatus = 'Belum Mula' | 'Dalam Proses' | 'Menunggu Kelulusan' | 'Selesai';

export type ProjectHealth = 'Mengikut Jadual' | 'Bermasalah' | 'Lewat' | 'Selesai';

export interface Staff {
  id: string;
  name: string;
  position: string;
  grade: string;
  section: SectionType;
  phone: string;
  email: string;
  avatarUrl?: string;
  statusToday: StaffStatus;
}

export interface StaffMovement {
  id: string;
  staffId: string;
  staffName: string;
  section: SectionType;
  type: MovementType;
  destination: string;
  purpose: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  linkedVehicleId?: string;
  linkedLetterRef?: string;
  status: 'Meluluskan' | 'Diluluskan' | 'Selesai' | 'Dibatalkan';
  remarks?: string;
}

export interface Vehicle {
  id: string;
  plateNumber: string;
  model: string;
  type: VehicleType;
  status: VehicleStatus;
  currentOdometer: number;
  lastServiceDate: string;
  nextServiceDueDate: string;
  roadtaxExpiry: string;
  assignedDriver?: string;
}

export interface VehicleBooking {
  id: string;
  vehicleId: string;
  vehiclePlate: string;
  vehicleModel: string;
  staffId: string;
  staffName: string;
  purpose: string;
  destination: string;
  date: string;
  startTime: string;
  endTime: string;
  startOdometer?: number;
  endOdometer?: number;
  status: 'Menunggu' | 'Diluluskan' | 'Aktif' | 'Selesai' | 'Ditolak';
  linkedLetterRef?: string;
}

export interface OfficialLetter {
  id: string;
  refNumber: string; // e.g. MDTM/JPP/100-2/4(12)
  type: LetterType;
  dateReceivedSent: string;
  senderOrRecipient: string;
  subject: string;
  category: LetterCategory;
  priority: LetterPriority;
  status: LetterStatus;
  assignedStaffId?: string;
  assignedStaffName?: string;
  section: SectionType;
  actionRequired: string;
  dueDate: string; // SLA Deadline
  linkedVehicleBookingId?: string;
  linkedTaskId?: string;
  notes?: string;
}

export interface DailyTask {
  id: string;
  title: string;
  description: string;
  assignedStaffId: string;
  assignedStaffName: string;
  section: SectionType;
  priority: TaskPriority;
  status: TaskStatus;
  startDate: string;
  dueDate: string;
  progressPercent: number; // 0 - 100
  linkedLetterRef?: string;
  linkedProjectId?: string;
  commentsCount: number;
}

export interface Milestone {
  id: string;
  title: string;
  targetDate: string;
  status: 'Belum Mula' | 'Dalam Proses' | 'Selesai';
  completedDate?: string;
}

export interface ProjectMilestone {
  id: string;
  code: string;
  title: string;
  description: string;
  section: SectionType;
  leadStaffId: string;
  leadStaffName: string;
  budget?: string;
  startDate: string;
  endDate: string;
  health: ProjectHealth;
  overallProgress: number; // 0 - 100
  milestones: Milestone[];
  location?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'urgent' | 'success';
  timestamp: string;
  read: boolean;
  linkedModule?: 'movement' | 'vehicle' | 'letter' | 'task' | 'project';
  linkId?: string;
}

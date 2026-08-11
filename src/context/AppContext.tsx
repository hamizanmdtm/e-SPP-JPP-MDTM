import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Staff,
  StaffMovement,
  Vehicle,
  VehicleBooking,
  OfficialLetter,
  DailyTask,
  ProjectMilestone,
  NotificationItem,
  SectionType
} from '../types';
import {
  initialStaff,
  initialMovements,
  initialVehicles,
  initialVehicleBookings,
  initialLetters,
  initialTasks,
  initialProjects,
  initialNotifications
} from '../data/initialData';

interface AppContextType {
  // Current active user
  currentUser: Staff;
  setCurrentUser: (staff: Staff) => void;

  // Active view
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Data
  staffList: Staff[];
  movements: StaffMovement[];
  vehicles: Vehicle[];
  vehicleBookings: VehicleBooking[];
  letters: OfficialLetter[];
  tasks: DailyTask[];
  projects: ProjectMilestone[];
  notifications: NotificationItem[];

  // Modals
  isQuickActionOpen: boolean;
  setQuickActionOpen: (open: boolean) => void;
  isPrintModalOpen: boolean;
  setPrintModalOpen: (open: boolean) => void;

  // Handlers
  addMovement: (movement: Omit<StaffMovement, 'id'>) => void;
  updateMovementStatus: (id: string, status: StaffMovement['status']) => void;
  deleteMovement: (id: string) => void;

  addVehicleBooking: (booking: Omit<VehicleBooking, 'id'>) => void;
  updateBookingStatus: (id: string, status: VehicleBooking['status']) => void;

  addLetter: (letter: Omit<OfficialLetter, 'id'>) => void;
  updateLetterStatus: (id: string, status: OfficialLetter['status']) => void;

  addTask: (task: Omit<DailyTask, 'id' | 'commentsCount'>) => void;
  updateTaskStatus: (id: string, status: DailyTask['status'], progressPercent?: number) => void;
  deleteTask: (id: string) => void;

  addProject: (project: Omit<ProjectMilestone, 'id'>) => void;
  updateProjectProgress: (projectId: string, overallProgress: number, health: ProjectMilestone['health']) => void;
  toggleMilestone: (projectId: string, milestoneId: string) => void;

  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  resetToDefaultData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_PREFIX = 'mdtm_espp_v1_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isQuickActionOpen, setQuickActionOpen] = useState<boolean>(false);
  const [isPrintModalOpen, setPrintModalOpen] = useState<boolean>(false);

  // Initialize state with LocalStorage or Seed Data
  const [staffList, setStaffList] = useState<Staff[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + 'staff');
    return saved ? JSON.parse(saved) : initialStaff;
  });

  const [currentUser, setCurrentUser] = useState<Staff>(staffList[0] || initialStaff[0]);

  const [movements, setMovements] = useState<StaffMovement[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + 'movements');
    return saved ? JSON.parse(saved) : initialMovements;
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + 'vehicles');
    return saved ? JSON.parse(saved) : initialVehicles;
  });

  const [vehicleBookings, setVehicleBookings] = useState<VehicleBooking[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + 'vehicle_bookings');
    return saved ? JSON.parse(saved) : initialVehicleBookings;
  });

  const [letters, setLetters] = useState<OfficialLetter[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + 'letters');
    return saved ? JSON.parse(saved) : initialLetters;
  });

  const [tasks, setTasks] = useState<DailyTask[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + 'tasks');
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [projects, setProjects] = useState<ProjectMilestone[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + 'projects');
    return saved ? JSON.parse(saved) : initialProjects;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + 'notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'staff', JSON.stringify(staffList));
  }, [staffList]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'movements', JSON.stringify(movements));
  }, [movements]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'vehicle_bookings', JSON.stringify(vehicleBookings));
  }, [vehicleBookings]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'letters', JSON.stringify(letters));
  }, [letters]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Actions
  const addMovement = (newMvt: Omit<StaffMovement, 'id'>) => {
    const id = `MVT-2026-${String(movements.length + 1).padStart(3, '0')}`;
    const created: StaffMovement = { ...newMvt, id };
    setMovements((prev) => [created, ...prev]);

    // Add notification
    const ntf: NotificationItem = {
      id: `NTF-${Date.now()}`,
      title: 'Pergerakan Staf Baharu',
      message: `${newMvt.staffName} mencatat pergerakan (${newMvt.type}) ke ${newMvt.destination}.`,
      type: 'info',
      timestamp: 'Baru sahaja',
      read: false,
      linkedModule: 'movement',
      linkId: id
    };
    setNotifications((prev) => [ntf, ...prev]);

    // Update staff status if today
    const todayStr = new Date().toISOString().split('T')[0];
    if (newMvt.startDate <= todayStr && newMvt.endDate >= todayStr) {
      setStaffList((prev) =>
        prev.map((s) => {
          if (s.id === newMvt.staffId) {
            let status: Staff['statusToday'] = 'Di Pejabat';
            if (newMvt.type === 'Lawatan Tapak') status = 'Lawatan Tapak';
            else if (newMvt.type.includes('Mesyuarat')) status = 'Mesyuarat';
            else if (newMvt.type.includes('Cuti')) status = 'Cuti';
            else if (newMvt.type.includes('Outstation')) status = 'Outstation';
            return { ...s, statusToday: status };
          }
          return s;
        })
      );
    }
  };

  const updateMovementStatus = (id: string, status: StaffMovement['status']) => {
    setMovements((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
  };

  const deleteMovement = (id: string) => {
    setMovements((prev) => prev.filter((m) => m.id !== id));
  };

  const addVehicleBooking = (booking: Omit<VehicleBooking, 'id'>) => {
    const id = `VBK-2026-${String(vehicleBookings.length + 1).padStart(3, '0')}`;
    const created: VehicleBooking = { ...booking, id };
    setVehicleBookings((prev) => [created, ...prev]);

    // Update vehicle status
    setVehicles((prev) =>
      prev.map((v) => {
        if (v.id === booking.vehicleId) {
          return {
            ...v,
            status: 'Dalam Perjalanan',
            assignedDriver: booking.staffName
          };
        }
        return v;
      })
    );

    const ntf: NotificationItem = {
      id: `NTF-${Date.now()}`,
      title: 'Tempahan Kenderaan Baharu',
      message: `Permohonan tempahan kenderaan ${booking.vehiclePlate} oleh ${booking.staffName}.`,
      type: 'info',
      timestamp: 'Baru sahaja',
      read: false,
      linkedModule: 'vehicle',
      linkId: id
    };
    setNotifications((prev) => [ntf, ...prev]);
  };

  const updateBookingStatus = (id: string, status: VehicleBooking['status']) => {
    setVehicleBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
  };

  const addLetter = (letter: Omit<OfficialLetter, 'id'>) => {
    const id = `LTR-2026-${String(letters.length + 1).padStart(3, '0')}`;
    const created: OfficialLetter = { ...letter, id };
    setLetters((prev) => [created, ...prev]);

    const ntf: NotificationItem = {
      id: `NTF-${Date.now()}`,
      title: letter.type === 'Masuk' ? 'Surat Masuk Baharu' : 'Surat Keluar Didaftarkan',
      message: `${letter.refNumber}: ${letter.subject.slice(0, 50)}...`,
      type: letter.priority === 'Sangat Segera' ? 'urgent' : 'info',
      timestamp: 'Baru sahaja',
      read: false,
      linkedModule: 'letter',
      linkId: id
    };
    setNotifications((prev) => [ntf, ...prev]);
  };

  const updateLetterStatus = (id: string, status: OfficialLetter['status']) => {
    setLetters((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
  };

  const addTask = (task: Omit<DailyTask, 'id' | 'commentsCount'>) => {
    const id = `TSK-2026-${String(tasks.length + 1).padStart(3, '0')}`;
    const created: DailyTask = { ...task, id, commentsCount: 0 };
    setTasks((prev) => [created, ...prev]);

    const ntf: NotificationItem = {
      id: `NTF-${Date.now()}`,
      title: 'Tugasan Baharu Diagihkan',
      message: `Tugasan "${task.title}" telah diagihkan kepada ${task.assignedStaffName}.`,
      type: task.priority === 'Kritikal' ? 'urgent' : 'info',
      timestamp: 'Baru sahaja',
      read: false,
      linkedModule: 'task',
      linkId: id
    };
    setNotifications((prev) => [ntf, ...prev]);
  };

  const updateTaskStatus = (id: string, status: DailyTask['status'], progressPercent?: number) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const newProgress = progressPercent !== undefined ? progressPercent : status === 'Selesai' ? 100 : t.progressPercent;
          return { ...t, status, progressPercent: newProgress };
        }
        return t;
      })
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const addProject = (proj: Omit<ProjectMilestone, 'id'>) => {
    const id = `PRJ-2026-${String(projects.length + 1).padStart(2, '0')}`;
    const created: ProjectMilestone = { ...proj, id };
    setProjects((prev) => [created, ...prev]);
  };

  const updateProjectProgress = (projectId: string, overallProgress: number, health: ProjectMilestone['health']) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, overallProgress, health } : p))
    );
  };

  const toggleMilestone = (projectId: string, milestoneId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const updatedMilestones = p.milestones.map((m) => {
            if (m.id === milestoneId) {
              const newStatus = m.status === 'Selesai' ? 'Dalam Proses' : 'Selesai';
              return {
                ...m,
                status: newStatus as 'Dalam Proses' | 'Selesai',
                completedDate: newStatus === 'Selesai' ? new Date().toISOString().split('T')[0] : undefined
              };
            }
            return m;
          });

          // Calculate new overall progress
          const completedCount = updatedMilestones.filter((m) => m.status === 'Selesai').length;
          const progress = Math.round((completedCount / updatedMilestones.length) * 100);

          return {
            ...p,
            overallProgress: progress,
            milestones: updatedMilestones
          };
        }
        return p;
      })
    );
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const resetToDefaultData = () => {
    setStaffList(initialStaff);
    setCurrentUser(initialStaff[0]);
    setMovements(initialMovements);
    setVehicles(initialVehicles);
    setVehicleBookings(initialVehicleBookings);
    setLetters(initialLetters);
    setTasks(initialTasks);
    setProjects(initialProjects);
    setNotifications(initialNotifications);
    localStorage.clear();
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        activeTab,
        setActiveTab,
        staffList,
        movements,
        vehicles,
        vehicleBookings,
        letters,
        tasks,
        projects,
        notifications,
        isQuickActionOpen,
        setQuickActionOpen,
        isPrintModalOpen,
        setPrintModalOpen,
        addMovement,
        updateMovementStatus,
        deleteMovement,
        addVehicleBooking,
        updateBookingStatus,
        addLetter,
        updateLetterStatus,
        addTask,
        updateTaskStatus,
        deleteTask,
        addProject,
        updateProjectProgress,
        toggleMilestone,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        resetToDefaultData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

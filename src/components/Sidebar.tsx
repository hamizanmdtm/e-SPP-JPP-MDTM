import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  Car,
  Mail,
  CheckSquare,
  Milestone,
  Clock,
  Users,
  Building2,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, movements, vehicleBookings, letters, tasks, projects } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];

  // Counter badges
  const movementsToday = movements.filter((m) => m.startDate <= todayStr && m.endDate >= todayStr).length;
  const activeBookings = vehicleBookings.filter((b) => b.status === 'Aktif' || b.status === 'Menunggu').length;
  const pendingLetters = letters.filter((l) => l.status === 'Daftar Baru' || l.status === 'Dalam Tindakan').length;
  const urgentTasks = tasks.filter((t) => t.status !== 'Selesai' && (t.priority === 'Kritikal' || t.priority === 'Tinggi')).length;
  const activeProjects = projects.filter((p) => p.overallProgress < 100).length;

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Papan Pemuka',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'movements',
      label: 'Jadual Pergerakan Staf',
      icon: CalendarDays,
      badge: movementsToday > 0 ? `${movementsToday} Hari Ini` : null,
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    },
    {
      id: 'vehicles',
      label: 'Pergerakan Kenderaan',
      icon: Car,
      badge: activeBookings > 0 ? `${activeBookings} Tempahan` : null,
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    },
    {
      id: 'letters',
      label: 'Surat Keluar / Masuk',
      icon: Mail,
      badge: pendingLetters > 0 ? `${pendingLetters} Aktif` : null,
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    },
    {
      id: 'tasks',
      label: 'Tugasan Harian',
      icon: CheckSquare,
      badge: urgentTasks > 0 ? `${urgentTasks} Utama` : null,
      badgeColor: 'bg-red-500/10 text-red-400 border-red-500/20'
    },
    {
      id: 'milestones',
      label: 'Work Milestone',
      icon: Milestone,
      badge: activeProjects > 0 ? `${activeProjects} Projek` : null,
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    },
    {
      id: 'deadlines',
      label: 'Deadline Tugas & SLA',
      icon: Clock,
      badge: null
    },
    {
      id: 'directory',
      label: 'Direktori Staf MDTM',
      icon: Users,
      badge: null
    }
  ];

  return (
    <aside id="app-sidebar" className="w-full lg:w-56 bg-slate-900 p-3 sm:p-4 text-slate-300 flex-shrink-0 flex flex-col gap-1 shadow-md">
      
      {/* Menu Category Title */}
      <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-2 px-2 hidden lg:block">
        Menu Utama
      </div>

      {/* Navigation List */}
      <nav className="space-y-1 overflow-x-auto flex lg:flex-col lg:overflow-x-visible no-scrollbar w-full">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 lg:shrink ${
                isActive
                  ? 'bg-blue-600/10 text-blue-400 border-l-4 border-blue-500 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60 font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className="px-1.5 py-0.5 text-[10px] rounded font-bold bg-slate-800 text-slate-300 hidden lg:inline-block">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer System Info */}
      <div className="mt-auto pt-4 border-t border-slate-800 hidden lg:block text-[10px] text-slate-500 font-mono">
        <div className="flex items-center gap-1.5 text-slate-400 font-bold">
          <Building2 className="w-3.5 h-3.5 text-blue-500" />
          <span>MDTM Portal</span>
        </div>
        <p className="mt-1 italic text-[10px]">Versi 2.4.0-Stable</p>
      </div>

    </aside>
  );
};

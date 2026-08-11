import React, { useState } from 'react';
import {
  Clock,
  AlertTriangle,
  Calendar,
  CheckSquare,
  Mail,
  Milestone,
  Car,
  CheckCircle2,
  Filter,
  Search,
  Building
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export interface UnifiedDeadlineItem {
  id: string;
  sourceModule: 'Tugasan' | 'Surat SLA' | 'Milestone Projek' | 'Penyelenggaraan Kenderaan';
  title: string;
  assignedOrRef: string;
  dueDate: string; // YYYY-MM-DD
  isOverdue: boolean;
  isToday: boolean;
  isThisWeek: boolean;
  priorityOrStatus: string;
}

export const DeadlinesView: React.FC = () => {
  const { tasks, letters, projects, vehicles, setActiveTab } = useApp();
  const [filterCategory, setFilterCategory] = useState<string>('Semua');

  const todayStr = new Date().toISOString().split('T')[0];
  const nextWeekDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // Aggregate all items with deadlines
  const allDeadlines: UnifiedDeadlineItem[] = [];

  // 1. Tasks
  tasks.forEach((t) => {
    if (t.status !== 'Selesai') {
      allDeadlines.push({
        id: t.id,
        sourceModule: 'Tugasan',
        title: t.title,
        assignedOrRef: `Diagih: ${t.assignedStaffName}`,
        dueDate: t.dueDate,
        isOverdue: t.dueDate < todayStr,
        isToday: t.dueDate === todayStr,
        isThisWeek: t.dueDate >= todayStr && t.dueDate <= nextWeekDate,
        priorityOrStatus: t.priority
      });
    }
  });

  // 2. Letters SLA
  letters.forEach((l) => {
    if (l.status !== 'Selesai' && l.status !== 'Fail / Diarkibkan') {
      allDeadlines.push({
        id: l.id,
        sourceModule: 'Surat SLA',
        title: `Surat Ref: ${l.refNumber} - ${l.subject}`,
        assignedOrRef: `Pegawai: ${l.assignedStaffName || 'Belum Diagih'}`,
        dueDate: l.dueDate,
        isOverdue: l.dueDate < todayStr,
        isToday: l.dueDate === todayStr,
        isThisWeek: l.dueDate >= todayStr && l.dueDate <= nextWeekDate,
        priorityOrStatus: l.priority
      });
    }
  });

  // 3. Project Milestones
  projects.forEach((p) => {
    p.milestones.forEach((m) => {
      if (m.status !== 'Selesai') {
        allDeadlines.push({
          id: `${p.id}-${m.id}`,
          sourceModule: 'Milestone Projek',
          title: `[${p.code}] ${m.title}`,
          assignedOrRef: `Penyelarasan: ${p.leadStaffName}`,
          dueDate: m.targetDate,
          isOverdue: m.targetDate < todayStr,
          isToday: m.targetDate === todayStr,
          isThisWeek: m.targetDate >= todayStr && m.targetDate <= nextWeekDate,
          priorityOrStatus: p.health
        });
      }
    });
  });

  // 4. Vehicles
  vehicles.forEach((v) => {
    if (v.nextServiceDueDate <= nextWeekDate) {
      allDeadlines.push({
        id: `veh-svc-${v.id}`,
        sourceModule: 'Penyelenggaraan Kenderaan',
        title: `Tarikh Servis Kenderaan ${v.plateNumber} (${v.model})`,
        assignedOrRef: `Odometer: ${v.currentOdometer.toLocaleString()} KM`,
        dueDate: v.nextServiceDueDate,
        isOverdue: v.nextServiceDueDate < todayStr,
        isToday: v.nextServiceDueDate === todayStr,
        isThisWeek: true,
        priorityOrStatus: v.status
      });
    }
  });

  // Sort deadlines chronologically
  allDeadlines.sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const filtered = allDeadlines.filter((item) => {
    if (filterCategory === 'Overdue') return item.isOverdue;
    if (filterCategory === 'Today') return item.isToday;
    if (filterCategory === 'ThisWeek') return item.isThisWeek;
    if (filterCategory !== 'Semua') return item.sourceModule === filterCategory;
    return true;
  });

  const overdueCount = allDeadlines.filter((d) => d.isOverdue).length;
  const todayCount = allDeadlines.filter((d) => d.isToday).length;
  const thisWeekCount = allDeadlines.filter((d) => d.isThisWeek).length;

  return (
    <div id="deadlines-view" className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-slate-800">
            <Clock className="w-5 h-5 text-red-600" />
            <h2 className="text-lg font-bold">Peringatan Tarikh Akhir & SLA Tugas Jabatan</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Matriks pemantauan berpusat bagi semua tarikh akhir tugasan harian, SLA balasan surat rasmi, fasa milestone projek dan tempoh penyelenggaraan kenderaan.
          </p>
        </div>
      </div>

      {/* Summary Stat Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        
        <button
          onClick={() => setFilterCategory('Semua')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            filterCategory === 'Semua' ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] uppercase tracking-wider font-bold block opacity-75">Semua Peringatan</span>
          <span className="text-2xl font-extrabold mt-1 block">{allDeadlines.length}</span>
        </button>

        <button
          onClick={() => setFilterCategory('Overdue')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            filterCategory === 'Overdue' ? 'bg-red-600 text-white border-red-600 shadow-md' : 'bg-white text-slate-800 border-slate-200 hover:border-red-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider font-bold block opacity-75">Tunggak (Overdue)</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <span className="text-2xl font-extrabold text-red-600 mt-1 block">{overdueCount}</span>
        </button>

        <button
          onClick={() => setFilterCategory('Today')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            filterCategory === 'Today' ? 'bg-amber-600 text-white border-amber-600 shadow-md' : 'bg-white text-slate-800 border-slate-200 hover:border-amber-300'
          }`}
        >
          <span className="text-[10px] uppercase tracking-wider font-bold block opacity-75">Hari Ini</span>
          <span className="text-2xl font-extrabold text-amber-600 mt-1 block">{todayCount}</span>
        </button>

        <button
          onClick={() => setFilterCategory('ThisWeek')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            filterCategory === 'ThisWeek' ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-slate-800 border-slate-200 hover:border-blue-300'
          }`}
        >
          <span className="text-[10px] uppercase tracking-wider font-bold block opacity-75">Minggu Ini</span>
          <span className="text-2xl font-extrabold text-blue-600 mt-1 block">{thisWeekCount}</span>
        </button>

      </div>

      {/* Deadlines Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
            Senarai Peringatan Mengikut Urutan Masa ({filtered.length})
          </h3>
        </div>

        <div className="divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              Tiada peringatan tarikh akhir ditemui bagi kategori ini.
            </div>
          ) : (
            filtered.map((item) => {
              let moduleIcon = CheckSquare;
              let moduleBadge = 'bg-blue-100 text-blue-800';
              if (item.sourceModule === 'Surat SLA') {
                moduleIcon = Mail;
                moduleBadge = 'bg-amber-100 text-amber-800';
              } else if (item.sourceModule === 'Milestone Projek') {
                moduleIcon = Milestone;
                moduleBadge = 'bg-purple-100 text-purple-800';
              } else if (item.sourceModule === 'Penyelenggaraan Kenderaan') {
                moduleIcon = Car;
                moduleBadge = 'bg-emerald-100 text-emerald-800';
              }

              const Icon = moduleIcon;

              return (
                <div
                  key={item.id}
                  className={`p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    item.isOverdue ? 'bg-red-50/40' : ''
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${moduleBadge}`}>
                        {item.sourceModule}
                      </span>
                      {item.isOverdue && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-red-600 text-white flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          LEWAT (OVERDUE)
                        </span>
                      )}
                      {item.isToday && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-500 text-white">
                          HARI INI
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-slate-900 text-xs">{item.title}</h4>
                    <p className="text-[11px] text-slate-500">{item.assignedOrRef}</p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 self-end sm:self-center">
                    <div className="text-right font-mono">
                      <span className="text-xs font-bold text-slate-800 block">{item.dueDate}</span>
                      <span className="text-[10px] text-slate-400 font-sans">Keutamaan: {item.priorityOrStatus}</span>
                    </div>

                    <button
                      onClick={() => {
                        if (item.sourceModule === 'Tugasan') setActiveTab('tasks');
                        else if (item.sourceModule === 'Surat SLA') setActiveTab('letters');
                        else if (item.sourceModule === 'Milestone Projek') setActiveTab('milestones');
                        else if (item.sourceModule === 'Penyelenggaraan Kenderaan') setActiveTab('vehicles');
                      }}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold"
                    >
                      Buka Modul
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
};

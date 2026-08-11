import React from 'react';
import {
  Users,
  Car,
  Mail,
  CheckSquare,
  Milestone,
  AlertTriangle,
  ArrowRight,
  Plus,
  MapPin,
  Clock,
  Calendar,
  FileText,
  TrendingUp,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Building
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DashboardView: React.FC = () => {
  const {
    staffList,
    movements,
    vehicles,
    letters,
    tasks,
    projects,
    setActiveTab,
    setQuickActionOpen,
    setPrintModalOpen
  } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];

  // Calculated Stats
  const totalStaff = staffList.length;
  const staffActive = staffList.filter((s) => s.statusToday === 'Di Pejabat' || s.statusToday === 'Lawatan Tapak' || s.statusToday === 'Mesyuarat').length;
  const staffLeaveOrOut = staffList.filter((s) => s.statusToday === 'Cuti' || s.statusToday === 'Outstation').length;

  const totalVehicles = vehicles.length;
  const vehiclesAvailable = vehicles.filter((v) => v.status === 'Tersedia').length;
  const vehiclesInUse = vehicles.filter((v) => v.status === 'Dalam Perjalanan').length;

  const pendingLettersCount = letters.filter((l) => l.status !== 'Selesai' && l.status !== 'Fail / Diarkibkan').length;
  const dueTodayLettersCount = letters.filter((l) => l.dueDate === todayStr && l.status !== 'Selesai').length;

  const avgProjectProgress = Math.round(
    projects.reduce((acc, p) => acc + p.overallProgress, 0) / (projects.length || 1)
  );

  const todayMovements = movements.filter((m) => m.startDate <= todayStr && m.endDate >= todayStr);

  return (
    <div id="dashboard-view" className="space-y-4">
      
      {/* 4 Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Staf Bertugas */}
        <div
          onClick={() => setActiveTab('movements')}
          className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all cursor-pointer"
        >
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Staf Bertugas</div>
            <div className="text-3xl font-black text-slate-900 mt-1">
              {staffActive.toString().padStart(2, '0')} / {totalStaff.toString().padStart(2, '0')}
            </div>
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-3">
            {staffLeaveOrOut} Cuti / Outstation hari ini
          </div>
        </div>

        {/* Metric 2: Kenderaan Tersedia */}
        <div
          onClick={() => setActiveTab('vehicles')}
          className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all cursor-pointer"
        >
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kenderaan Tersedia</div>
            <div className="text-3xl font-black text-blue-600 mt-1">
              {vehiclesAvailable.toString().padStart(2, '0')} / {totalVehicles.toString().padStart(2, '0')}
            </div>
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-3">
            {vehiclesInUse} Unit sedang digunakan (Tapak)
          </div>
        </div>

        {/* Metric 3: Surat Perlu Tindakan */}
        <div
          onClick={() => setActiveTab('letters')}
          className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all cursor-pointer"
        >
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Surat Perlu Tindakan</div>
            <div className="text-3xl font-black text-red-500 mt-1">
              {pendingLettersCount.toString().padStart(2, '0')}
            </div>
          </div>
          <div className="text-[11px] text-red-500 font-bold mt-3">
            {dueTodayLettersCount > 0 ? `${dueTodayLettersCount} Surat tamat tempoh harini` : 'Pemantauan SLA aktif'}
          </div>
        </div>

        {/* Metric 4: Milestone Projek */}
        <div
          onClick={() => setActiveTab('milestones')}
          className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all cursor-pointer"
        >
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Milestone Projek</div>
            <div className="text-3xl font-black text-slate-900 mt-1">{avgProjectProgress}%</div>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${avgProjectProgress}%` }}></div>
          </div>
        </div>

      </div>

      {/* Middle Grid: Staff Movement Table & Mail Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column (8 cols): Jadual Pergerakan Staf */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white">
            <h3 className="font-bold text-slate-800 text-sm">Jadual Pergerakan Staf Hari Ini</h3>
            <button
              onClick={() => setActiveTab('movements')}
              className="text-[10px] bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded font-bold text-slate-600 transition-colors uppercase tracking-wider"
            >
              LIHAT SEMUA
            </button>
          </div>

          <div className="p-2 overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold">
                <tr>
                  <th className="px-3 py-2">Nama Staf</th>
                  <th className="px-3 py-2">Tujuan / Aktiviti</th>
                  <th className="px-3 py-2">Masa</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {todayMovements.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-3 py-6 text-center text-slate-400 text-xs">
                      Tiada aktiviti luar dicatatkan hari ini. Semua staf berada di pejabat.
                    </td>
                  </tr>
                ) : (
                  todayMovements.map((mvt) => {
                    let badgeClass = 'bg-yellow-100 text-yellow-700';
                    if (mvt.type === 'Mesyuarat') badgeClass = 'bg-blue-100 text-blue-700';
                    else if (mvt.type === 'Cuti') badgeClass = 'bg-red-100 text-red-700';
                    else if (mvt.type === 'Outstation') badgeClass = 'bg-purple-100 text-purple-700';

                    return (
                      <tr key={mvt.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-3 py-2.5 font-bold text-slate-800">{mvt.staffName}</td>
                        <td className="px-3 py-2.5 text-slate-700">
                          <div>{mvt.purpose}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{mvt.destination}</div>
                        </td>
                        <td className="px-3 py-2.5 text-slate-500 font-mono">{mvt.startTime} - {mvt.endTime}</td>
                        <td className="px-3 py-2.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${badgeClass}`}>
                            {mvt.type}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column (4 cols): Log Surat Keluar Masuk */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col p-4 justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-800 text-sm">Log Surat Keluar Masuk</h3>
              <button
                onClick={() => setActiveTab('letters')}
                className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase"
              >
                Arsip Surat
              </button>
            </div>

            <div className="space-y-3">
              {letters.slice(0, 4).map((ltr) => {
                let borderStyle = 'border-slate-300';
                let tagColor = 'text-slate-500';
                if (ltr.priority === 'Sangat Segera') {
                  borderStyle = 'border-red-500';
                  tagColor = 'text-red-500';
                } else if (ltr.priority === 'Segera') {
                  borderStyle = 'border-amber-500';
                  tagColor = 'text-amber-600';
                } else if (ltr.type === 'Surat Masuk') {
                  borderStyle = 'border-blue-400';
                  tagColor = 'text-blue-500';
                }

                return (
                  <div key={ltr.id} className={`flex gap-3 border-l-2 ${borderStyle} pl-3 py-1`}>
                    <div className="w-full">
                      <div className={`text-[10px] font-bold ${tagColor} uppercase tracking-wider flex justify-between`}>
                        <span>{ltr.type} - {ltr.priority}</span>
                        <span className="font-mono">{ltr.refNumber}</span>
                      </div>
                      <div className="text-xs font-bold text-slate-800 truncate mt-0.5">{ltr.subject}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Tarikh SLA: {ltr.dueDate} | Pegawai: {ltr.assignedStaffName || 'Pentadbiran'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Row: Status Pengurusan Kenderaan Jabatan (Real-time) */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-4 flex flex-col">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 text-sm">Status Pengurusan Kenderaan Jabatan (Real-time)</h3>
          <button
            onClick={() => setActiveTab('vehicles')}
            className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase"
          >
            Pengurusan Logistik
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {vehicles.map((v) => {
            let badgeStyle = 'bg-green-100 text-green-700';
            if (v.status === 'Dalam Perjalanan') badgeStyle = 'bg-red-100 text-red-700';
            else if (v.status === 'Penyelenggaraan') badgeStyle = 'bg-yellow-100 text-yellow-700';

            return (
              <div key={v.id} className="bg-slate-50 p-3.5 rounded-lg border border-slate-100 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <div className="font-bold text-xs text-slate-900 font-mono">{v.plateNumber} ({v.model})</div>
                    <span className={`text-[9px] ${badgeStyle} px-1.5 py-0.5 rounded uppercase font-bold shrink-0`}>
                      {v.status === 'Dalam Perjalanan' ? 'Sedang Diguna' : v.status}
                    </span>
                  </div>
                  <div className="mt-2 text-[10px] text-slate-500">
                    Pemandu / Pegawai: <strong>{v.assignedDriver || 'Belum Diagih'}</strong><br />
                    Odometer: <span className="font-mono">{v.currentOdometer.toLocaleString()} KM</span>
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px] font-semibold text-slate-500 flex justify-between">
                  <span>Servis Seterusnya:</span>
                  <span className="font-mono text-slate-700">{v.nextServiceDueDate}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

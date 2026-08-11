import React, { useState } from 'react';
import {
  Users,
  Search,
  Phone,
  Mail,
  Building,
  UserCheck,
  CalendarDays,
  CheckSquare,
  MapPin,
  Briefcase
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SectionType } from '../types';

export const StaffDirectoryView: React.FC = () => {
  const { staffList, movements, tasks } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('Semua');

  const sections: SectionType[] = [
    'Perancangan Bandar & Desa',
    'Kawalan Bangunan',
    'Projek & Kejuruteraan',
    'Pentadbiran & Penilaian'
  ];

  const filteredStaff = staffList.filter((stf) => {
    const matchesSearch =
      stf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stf.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stf.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSection = selectedSection === 'Semua' || stf.section === selectedSection;

    return matchesSearch && matchesSection;
  });

  return (
    <div id="staff-directory-view" className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-slate-800">
            <Users className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold">Direktori Staf & Pegawai Jabatan MDTM</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Senarai lengkap warga Jabatan Perancangan & Pembangunan Majlis Daerah Tanah Merah mengikut seksyen dan kedudukan jawatan.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama pegawai, jawatan, e-mel..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
          />
        </div>

        <select
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none w-full md:w-auto"
        >
          <option value="Semua">Semua Seksyen</option>
          {sections.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map((stf) => {
          const staffTasksCount = tasks.filter((t) => t.assignedStaffId === stf.id && t.status !== 'Selesai').length;
          const staffMovementsCount = movements.filter((m) => m.staffId === stf.id).length;

          let badgeStyle = 'bg-emerald-100 text-emerald-800 border-emerald-200';
          if (stf.statusToday === 'Lawatan Tapak') badgeStyle = 'bg-blue-100 text-blue-800 border-blue-200';
          else if (stf.statusToday === 'Mesyuarat') badgeStyle = 'bg-amber-100 text-amber-800 border-amber-200';
          else if (stf.statusToday === 'Cuti') badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200';

          return (
            <div
              key={stf.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all space-y-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-sm shadow-sm shrink-0">
                    {stf.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-xs leading-snug">{stf.name}</h3>
                    <p className="text-[10px] text-slate-500 font-medium">{stf.position}</p>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border shrink-0 ${badgeStyle}`}>
                  {stf.statusToday}
                </span>
              </div>

              {/* Details */}
              <div className="p-3 bg-slate-50 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600 text-[11px]">
                  <span>Seksyen:</span>
                  <span className="font-semibold text-slate-800">{stf.section}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 text-[11px]">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" /> Telefon:
                  </span>
                  <span className="font-mono font-bold text-slate-800">{stf.phone}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 text-[11px]">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-slate-400" /> E-mel:
                  </span>
                  <span className="font-mono text-slate-700 text-[10px] truncate max-w-[150px]">{stf.email}</span>
                </div>
              </div>

              {/* Statistics */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <CheckSquare className="w-3.5 h-3.5 text-red-600" />
                  <strong>{staffTasksCount}</strong> Tugasan Aktif
                </span>
                <span className="flex items-center gap-1">
                  <CalendarDays className="w-3.5 h-3.5 text-amber-600" />
                  <strong>{staffMovementsCount}</strong> Rekod Pergerakan
                </span>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};

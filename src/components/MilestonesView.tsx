import React, { useState } from 'react';
import {
  Milestone,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MapPin,
  User,
  DollarSign,
  TrendingUp,
  Building,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProjectHealth, SectionType } from '../types';

export const MilestonesView: React.FC = () => {
  const { projects, toggleMilestone, addProject, staffList } = useApp();
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(projects[0]?.id || null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // New Project Form State
  const [formCode, setFormCode] = useState('MDTM-PRJ-' + (projects.length + 1));
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formSection, setFormSection] = useState<SectionType>('Perancangan Bandar & Desa');
  const [formLeadStaffId, setFormLeadStaffId] = useState(staffList[0]?.id || '');
  const [formBudget, setFormBudget] = useState('RM 250,000.00');
  const [formStartDate, setFormStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [formEndDate, setFormEndDate] = useState(
    new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [formLocation, setFormLocation] = useState('Bandar Tanah Merah');

  const handleAddProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const stf = staffList.find((s) => s.id === formLeadStaffId);

    addProject({
      code: formCode,
      title: formTitle,
      description: formDescription,
      section: formSection,
      leadStaffId: stf?.id || staffList[0].id,
      leadStaffName: stf?.name || staffList[0].name,
      budget: formBudget,
      startDate: formStartDate,
      endDate: formEndDate,
      health: 'Mengikut Jadual',
      overallProgress: 0,
      location: formLocation,
      milestones: [
        { id: 'M1', title: 'Fasa 1: Kelulusan Rekabentuk & Ukur Tapak', targetDate: formStartDate, status: 'Dalam Proses' },
        { id: 'M2', title: 'Fasa 2: Perolehan & Tender Kontraktor', targetDate: formStartDate, status: 'Belum Mula' },
        { id: 'M3', title: 'Fasa 3: Pelaksanaan Fizikal Tapak', targetDate: formEndDate, status: 'Belum Mula' },
        { id: 'M4', title: 'Fasa 4: Pemeriksaan Akhir & Penyerahan', targetDate: formEndDate, status: 'Belum Mula' }
      ]
    });

    setIsNewModalOpen(false);
    setFormTitle('');
    setFormDescription('');
  };

  return (
    <div id="milestones-view" className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-slate-800">
            <Milestone className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-bold">Work Milestone & Pemantauan Projek</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Penjejakan status pembangunan fizikal, perancangan spatial, fasa milestone dan prestasi perbelanjaan projek MDTM.
          </p>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Daftar Projek Baharu
        </button>
      </div>

      {/* Projects Cards List */}
      <div className="space-y-4">
        {projects.map((prj) => {
          const isExpanded = expandedProjectId === prj.id;
          let healthBadge = 'bg-emerald-100 text-emerald-800 border-emerald-200';
          if (prj.health === 'Bermasalah') healthBadge = 'bg-red-100 text-red-800 border-red-200 font-bold';
          else if (prj.health === 'Lewat') healthBadge = 'bg-amber-100 text-amber-800 border-amber-200';

          return (
            <div
              key={prj.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all"
            >
              {/* Card Summary Header */}
              <div
                onClick={() => setExpandedProjectId(isExpanded ? null : prj.id)}
                className="p-5 cursor-pointer hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold bg-slate-900 text-white px-2 py-0.5 rounded">
                      {prj.code}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {prj.section}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${healthBadge}`}>
                      {prj.health}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base">{prj.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-1">{prj.description}</p>
                </div>

                {/* Progress Bar & Toggle */}
                <div className="flex items-center gap-6 shrink-0">
                  <div className="text-right space-y-1 w-36">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-500 font-sans">Kemajuan:</span>
                      <span className="text-purple-700 font-mono text-sm">{prj.overallProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 h-full rounded-full transition-all"
                        style={{ width: `${prj.overallProgress}%` }}
                      ></div>
                    </div>
                  </div>

                  <button className="p-2 text-slate-400 hover:text-slate-800 rounded-lg">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Expanded Milestones & Details */}
              {isExpanded && (
                <div className="p-5 bg-slate-50/70 border-t border-slate-100 space-y-4 text-xs">
                  
                  {/* Metadata Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-white rounded-xl border border-slate-200 font-mono">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">Pegawai Penyelaras</span>
                      <span className="font-bold text-slate-800 font-sans">{prj.leadStaffName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">Anggaran Peruntukan / Bajet</span>
                      <span className="font-bold text-emerald-700">{prj.budget || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">Lokasi Pembangunan</span>
                      <span className="font-bold text-slate-800 font-sans flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-600" />
                        {prj.location}
                      </span>
                    </div>
                  </div>

                  {/* Milestones Checklist Timeline */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] text-slate-600">
                      Senarai Milestone & Fasa Kerja ({prj.milestones.filter((m) => m.status === 'Selesai').length} / {prj.milestones.length} Selesai)
                    </h4>

                    <div className="space-y-2">
                      {prj.milestones.map((m) => {
                        const isDone = m.status === 'Selesai';

                        return (
                          <div
                            key={m.id}
                            onClick={() => toggleMilestone(prj.id, m.id)}
                            className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                              isDone ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900' : 'bg-white border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                                  isDone ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                                }`}
                              >
                                {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                              </div>
                              <span className={`font-semibold ${isDone ? 'line-through opacity-80' : 'text-slate-800'}`}>
                                {m.title}
                              </span>
                            </div>

                            <div className="text-right font-mono text-[11px] shrink-0">
                              <span className="text-slate-500">Sasaran: <strong>{m.targetDate}</strong></span>
                              {m.completedDate && (
                                <span className="text-emerald-700 block text-[10px]">
                                  Selesai: {m.completedDate}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal: Add Project */}
      {isNewModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Daftar Projek / Milestone Baharu</h3>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProjectSubmit} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kod Projek</label>
                  <input
                    type="text"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Seksyen Pertanggungjawaban</label>
                  <select
                    value={formSection}
                    onChange={(e) => setFormSection(e.target.value as SectionType)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800"
                  >
                    <option value="Perancangan Bandar & Desa">Perancangan Bandar & Desa</option>
                    <option value="Kawalan Bangunan">Kawalan Bangunan</option>
                    <option value="Projek & Kejuruteraan">Projek & Kejuruteraan</option>
                    <option value="Pentadbiran & Penilaian">Pentadbiran & Penilaian</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Projek / Program</label>
                <input
                  type="text"
                  placeholder="Projek Naiktaraf Pasar Awam, Rancangan Tempatan..."
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Keterangan & Wawasan Projek</label>
                <textarea
                  rows={2}
                  placeholder="Skop kerja, objektif utama pembangunan..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pegawai Penyelaras</label>
                  <select
                    value={formLeadStaffId}
                    onChange={(e) => setFormLeadStaffId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800"
                  >
                    {staffList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.position})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Anggaran Bajet</label>
                  <input
                    type="text"
                    value={formBudget}
                    onChange={(e) => setFormBudget(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tarikh Mula</label>
                  <input
                    type="date"
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tarikh Sasaran Penyiapan</label>
                  <input
                    type="date"
                    value={formEndDate}
                    onChange={(e) => setFormEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Lokasi Pembangunan</label>
                <input
                  type="text"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-md"
                >
                  Daftar Projek
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

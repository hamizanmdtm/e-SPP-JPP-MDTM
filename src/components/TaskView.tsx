import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  User,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  FileText,
  List,
  Kanban,
  Trash2,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DailyTask, SectionType, TaskPriority, TaskStatus } from '../types';

export const TaskView: React.FC = () => {
  const {
    tasks,
    addTask,
    updateTaskStatus,
    deleteTask,
    staffList,
    letters,
    projects
  } = useApp();

  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('Semua');
  const [selectedStaff, setSelectedStaff] = useState<string>('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Task Form state
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formAssignedStaffId, setFormAssignedStaffId] = useState(staffList[0]?.id || '');
  const [formPriority, setFormPriority] = useState<TaskPriority>('Tinggi');
  const [formStartDate, setFormStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [formDueDate, setFormDueDate] = useState(
    new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [formLetterRef, setFormLetterRef] = useState('');

  const priorities: TaskPriority[] = ['Rendah', 'Sederhana', 'Tinggi', 'Kritikal'];
  const kanbanColumns: { status: TaskStatus; label: string; color: string }[] = [
    { status: 'Belum Mula', label: 'Belum Mula', color: 'border-slate-300 text-slate-700 bg-slate-100' },
    { status: 'Dalam Proses', label: 'Dalam Proses', color: 'border-blue-400 text-blue-700 bg-blue-50' },
    { status: 'Menunggu Kelulusan', label: 'Menunggu Kelulusan', color: 'border-amber-400 text-amber-700 bg-amber-50' },
    { status: 'Selesai', label: 'Selesai', color: 'border-emerald-400 text-emerald-700 bg-emerald-50' }
  ];

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = selectedPriority === 'Semua' || t.priority === selectedPriority;
    const matchesStaff = selectedStaff === 'Semua' || t.assignedStaffId === selectedStaff;

    return matchesSearch && matchesPriority && matchesStaff;
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const stf = staffList.find((s) => s.id === formAssignedStaffId);
    if (!stf) return;

    addTask({
      title: formTitle,
      description: formDescription,
      assignedStaffId: stf.id,
      assignedStaffName: stf.name,
      section: stf.section,
      priority: formPriority,
      status: 'Belum Mula',
      startDate: formStartDate,
      dueDate: formDueDate,
      progressPercent: 0,
      linkedLetterRef: formLetterRef || undefined
    });

    setIsModalOpen(false);
    setFormTitle('');
    setFormDescription('');
    setFormLetterRef('');
  };

  return (
    <div id="tasks-view" className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-slate-800">
            <CheckSquare className="w-5 h-5 text-red-600" />
            <h2 className="text-lg font-bold">Tugasan Harian & Agihan Kerja</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pengurusan tugasan harian pegawai, keutamaan kerja, status pelaksanaan dan pemantauan tarikh akhir (deadline).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'kanban' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              Papan Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              Senarai Rekod
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Tambah Tugasan
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari tajuk tugasan, pegawai..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedStaff}
            onChange={(e) => setSelectedStaff(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none"
          >
            <option value="Semua">Semua Pegawai Diagih</option>
            {staffList.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none"
          >
            <option value="Semua">Semua Keutamaan</option>
            {priorities.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* KANBAN BOARD VIEW */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kanbanColumns.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.status);

            return (
              <div key={col.status} className="bg-slate-100/70 p-3.5 rounded-2xl border border-slate-200 space-y-3">
                <div className={`p-2.5 rounded-xl border font-bold text-xs flex items-center justify-between ${col.color}`}>
                  <span>{col.label}</span>
                  <span className="px-2 py-0.5 rounded-full bg-white text-slate-900 font-mono text-[10px] shadow-xs">
                    {colTasks.length}
                  </span>
                </div>

                <div className="space-y-3 min-h-[350px]">
                  {colTasks.length === 0 ? (
                    <div className="h-28 border border-dashed border-slate-300 rounded-xl flex items-center justify-center text-[11px] text-slate-400">
                      Tiada tugasan
                    </div>
                  ) : (
                    colTasks.map((t) => {
                      let priorityBadge = 'bg-slate-100 text-slate-700';
                      if (t.priority === 'Kritikal') priorityBadge = 'bg-red-100 text-red-800 border-red-200 font-bold';
                      else if (t.priority === 'Tinggi') priorityBadge = 'bg-amber-100 text-amber-800 border-amber-200';

                      return (
                        <div
                          key={t.id}
                          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-2.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className={`px-2 py-0.5 rounded text-[10px] border ${priorityBadge}`}>
                              {t.priority}
                            </span>
                            <span className="text-[10px] text-red-600 font-semibold font-mono flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {t.dueDate}
                            </span>
                          </div>

                          <h4 className="font-bold text-slate-900 text-xs leading-snug">{t.title}</h4>
                          <p className="text-[11px] text-slate-500 line-clamp-2">{t.description}</p>

                          {/* Progress slider / bar */}
                          <div className="space-y-1 pt-1">
                            <div className="flex items-center justify-between text-[10px] text-slate-500">
                              <span>Kemajuan:</span>
                              <span className="font-bold text-slate-800">{t.progressPercent}%</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              step="10"
                              value={t.progressPercent}
                              onChange={(e) => {
                                const val = parseInt(e.target.value);
                                const newStatus = val === 100 ? 'Selesai' : val > 0 ? 'Dalam Proses' : 'Belum Mula';
                                updateTaskStatus(t.id, newStatus, val);
                              }}
                              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                            />
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                            <div className="truncate max-w-[130px]">
                              <span className="font-semibold text-slate-800 block truncate">{t.assignedStaffName}</span>
                              <span className="text-[9px] text-slate-400">{t.section}</span>
                            </div>

                            <button
                              onClick={() => deleteTask(t.id)}
                              className="p-1 text-slate-300 hover:text-red-600 transition-colors"
                              title="Padam Tugasan"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* LIST VIEW */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-900 text-slate-200 uppercase text-[10px] tracking-wider font-bold">
              <tr>
                <th className="px-4 py-3">Tajuk Tugasan & Perihal</th>
                <th className="px-4 py-3">Pegawai Diagih</th>
                <th className="px-4 py-3">Keutamaan</th>
                <th className="px-4 py-3">Kemajuan</th>
                <th className="px-4 py-3">Tarikh Akhir (Deadline)</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTasks.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-bold text-slate-900 block">{t.title}</span>
                    <span className="text-[10px] text-slate-500 truncate max-w-sm block">{t.description}</span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-800">
                    {t.assignedStaffName}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 border border-slate-200">
                      {t.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-amber-600">
                    {t.progressPercent}%
                  </td>
                  <td className="px-4 py-3 font-mono text-red-600 font-semibold">
                    {t.dueDate}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                      {t.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => deleteTask(t.id)}
                      className="p-1 text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal: Add Task */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Agihkan Tugasan Harian Baharu</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tajuk Tugasan</label>
                <input
                  type="text"
                  placeholder="Contoh: Menyediakan laporan semakan pelan..."
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Perihal & Arahan Tugasan</label>
                <textarea
                  rows={2}
                  placeholder="Maklumat teknikal, skop tugas, hasil yang diharapkan..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pegawai Diagih</label>
                  <select
                    value={formAssignedStaffId}
                    onChange={(e) => setFormAssignedStaffId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800"
                  >
                    {staffList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.position})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Keutamaan (Priority)</label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as TaskPriority)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800"
                  >
                    {priorities.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
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
                  <label className="block font-bold text-slate-700 mb-1">Tarikh Akhir (Deadline)</label>
                  <input
                    type="date"
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">No. Rujukan Surat Berkaitan (Jika Ada)</label>
                <input
                  type="text"
                  placeholder="MDTM/JPP/200-4/12(08)"
                  value={formLetterRef}
                  onChange={(e) => setFormLetterRef(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold rounded-xl shadow-md"
                >
                  Agih Tugasan
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

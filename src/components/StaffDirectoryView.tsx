import React, { useState } from 'react';
import {
  Users,
  Search,
  Phone,
  Mail,
  CalendarDays,
  CheckSquare,
  Plus,
  Edit2,
  Trash2,
  X,
  UserCheck,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SectionType, Staff, StaffStatus } from '../types';

export const StaffDirectoryView: React.FC = () => {
  const { staffList, movements, tasks, addStaff, updateStaff, deleteStaff } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('Semua');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    grade: '',
    section: 'Perancangan Bandar & Desa' as SectionType,
    phone: '',
    email: '',
    statusToday: 'Di Pejabat' as StaffStatus
  });

  const sections: SectionType[] = [
    'Perancangan Bandar & Desa',
    'Kawalan Bangunan',
    'Projek & Kejuruteraan',
    'Pentadbiran & Penilaian'
  ];

  const statusOptions: StaffStatus[] = [
    'Di Pejabat',
    'Lawatan Tapak',
    'Mesyuarat',
    'Cuti',
    'Outstation'
  ];

  const handleOpenAdd = () => {
    setEditingStaff(null);
    setFormData({
      name: '',
      position: '',
      grade: 'J41',
      section: 'Perancangan Bandar & Desa',
      phone: '09-955 1234',
      email: '',
      statusToday: 'Di Pejabat'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (stf: Staff) => {
    setEditingStaff(stf);
    setFormData({
      name: stf.name,
      position: stf.position,
      grade: stf.grade,
      section: stf.section,
      phone: stf.phone,
      email: stf.email,
      statusToday: stf.statusToday
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingStaff) {
      updateStaff(editingStaff.id, formData);
    } else {
      addStaff(formData);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Adakah anda pasti mahu memadam staf ${name}?`)) {
      deleteStaff(id);
      setIsModalOpen(false);
    }
  };

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
            <h2 className="text-lg font-bold">Direktori & Pengurusan Penama / Staf</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pengurusan maklumat warga Jabatan Perancangan & Pembangunan MDTM. Boleh tambah, ubah nama, jawatan, atau gred staf.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all shrink-0 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Penama / Staf Baharu</span>
        </button>
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
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none w-full md:w-auto font-medium"
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
          else if (stf.statusToday === 'Outstation') badgeStyle = 'bg-purple-100 text-purple-800 border-purple-200';

          return (
            <div
              key={stf.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-sm shadow-sm shrink-0">
                      {stf.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-slate-900 text-xs leading-snug">{stf.name}</h3>
                        <span className="text-[10px] text-slate-400 font-mono font-bold">({stf.grade})</span>
                      </div>
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

              {/* Action Button */}
              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => handleOpenEdit(stf)}
                  className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Ubah Penama / Maklumat</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Add / Edit Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  {editingStaff ? 'Kemaskini Penama / Staf' : 'Daftar Penama / Staf Baharu'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Penuh Pegawai / Staf <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Encik Ahmad Zaki Bin Ismail"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Jawatan
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Pegawai Perancang Bandar"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Gred Jawatan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: J41 / N29 / H11"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Seksyen Jabatan
                </label>
                <select
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value as SectionType })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-medium"
                >
                  {sections.map((sec) => (
                    <option key={sec} value={sec}>
                      {sec}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    No. Telefon
                  </label>
                  <input
                    type="text"
                    placeholder="019-XXX XXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    E-mel Rasmi
                  </label>
                  <input
                    type="email"
                    placeholder="nama@kelantan.gov.my"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Status Hari Ini
                </label>
                <select
                  value={formData.statusToday}
                  onChange={(e) => setFormData({ ...formData, statusToday: e.target.value as StaffStatus })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                >
                  {statusOptions.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                {editingStaff ? (
                  <button
                    type="button"
                    onClick={() => handleDelete(editingStaff.id, editingStaff.name)}
                    className="px-3 py-2 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Padam Staf</span>
                  </button>
                ) : (
                  <div></div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                  >
                    {editingStaff ? 'Kemaskini' : 'Simpan'}
                  </button>
                </div>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

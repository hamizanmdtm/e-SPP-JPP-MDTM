import React, { useState } from 'react';
import {
  Mail,
  Plus,
  Search,
  Filter,
  FileText,
  User,
  Clock,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Send,
  Inbox,
  Link,
  Car,
  CheckSquare,
  Building
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LetterCategory, LetterPriority, LetterStatus, LetterType, SectionType } from '../types';

export const LetterView: React.FC = () => {
  const {
    letters,
    addLetter,
    updateLetterStatus,
    staffList,
    addTask,
    addMovement,
    vehicles,
    addVehicleBooking
  } = useApp();

  const [activeTab, setActiveTab] = useState<LetterType | 'Semua'>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua');
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // Form State
  const [formType, setFormType] = useState<LetterType>('Masuk');
  const [formRefNumber, setFormRefNumber] = useState('MDTM/JPP/200-4/12(' + (letters.length + 1) + ')');
  const [formSenderRecipient, setFormSenderRecipient] = useState('');
  const [formSubject, setFormSubject] = useState('');
  const [formCategory, setFormCategory] = useState<LetterCategory>('Pelan Bangunan');
  const [formPriority, setFormPriority] = useState<LetterPriority>('Segera');
  const [formAssignedStaffId, setFormAssignedStaffId] = useState(staffList[0]?.id || '');
  const [formSection, setFormSection] = useState<SectionType>('Kawalan Bangunan');
  const [formActionRequired, setFormActionRequired] = useState('');
  const [formDueDate, setFormDueDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [formNotes, setFormNotes] = useState('');

  const categories: LetterCategory[] = [
    'Aduan Awam',
    'Permohonan Kebenaran Merancang',
    'Pelan Bangunan',
    'Jemputan Mesyuarat',
    'Pemberitahuan / Pekeliling',
    'Projek & Perolehan',
    'Lain-lain'
  ];

  const statuses: LetterStatus[] = [
    'Daftar Baru',
    'Diagihkan',
    'Dalam Tindakan',
    'Selesai',
    'Fail / Diarkibkan'
  ];

  // Filter letters
  const filteredLetters = letters.filter((l) => {
    const matchesTab = activeTab === 'Semua' || l.type === activeTab;
    const matchesSearch =
      l.refNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.senderOrRecipient.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'Semua' || l.status === selectedStatus;

    return matchesTab && matchesSearch && matchesStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const stf = staffList.find((s) => s.id === formAssignedStaffId);

    addLetter({
      refNumber: formRefNumber,
      type: formType,
      dateReceivedSent: new Date().toISOString().split('T')[0],
      senderOrRecipient: formSenderRecipient,
      subject: formSubject,
      category: formCategory,
      priority: formPriority,
      status: 'Diagihkan',
      assignedStaffId: stf?.id,
      assignedStaffName: stf?.name,
      section: formSection,
      actionRequired: formActionRequired,
      dueDate: formDueDate,
      notes: formNotes
    });

    setIsRegisterOpen(false);
    setFormSenderRecipient('');
    setFormSubject('');
    setFormActionRequired('');
    setFormNotes('');
  };

  // Quick Action: Convert letter directly to task
  const handleCreateTaskFromLetter = (letter: typeof letters[0]) => {
    addTask({
      title: `Tindakan Surat: ${letter.refNumber}`,
      description: `${letter.subject}\n\nTindakan Diperlukan: ${letter.actionRequired}`,
      assignedStaffId: letter.assignedStaffId || staffList[0].id,
      assignedStaffName: letter.assignedStaffName || staffList[0].name,
      section: letter.section,
      priority: letter.priority === 'Sangat Segera' ? 'Kritikal' : letter.priority === 'Segera' ? 'Tinggi' : 'Sederhana',
      status: 'Belum Mula',
      startDate: new Date().toISOString().split('T')[0],
      dueDate: letter.dueDate,
      progressPercent: 0,
      linkedLetterRef: letter.refNumber
    });
    alert(`Tugasan baharu telah dicipta berdasarkan Surat No. ${letter.refNumber}`);
  };

  return (
    <div id="letters-registry-view" className="space-y-6">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-slate-800">
            <Mail className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-bold">Surat Keluar & Masuk Jabatan</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Daftar berpusat rekod surat rasmi, kelulusan permohonan, aduan awam, agihan tugas pegawai dan SLA maklum balas.
          </p>
        </div>

        <button
          onClick={() => setIsRegisterOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Daftar Surat Baharu
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        
        {/* Type Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs w-full md:w-auto">
          <button
            onClick={() => setActiveTab('Semua')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'Semua' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua ({letters.length})
          </button>
          <button
            onClick={() => setActiveTab('Masuk')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 transition-all ${
              activeTab === 'Masuk' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            Surat Masuk ({letters.filter((l) => l.type === 'Masuk').length})
          </button>
          <button
            onClick={() => setActiveTab('Keluar')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 transition-all ${
              activeTab === 'Keluar' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            Surat Keluar ({letters.filter((l) => l.type === 'Keluar').length})
          </button>
        </div>

        {/* Search & Status Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari No. Rujukan, Tajuk, Pengirim..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none"
          >
            <option value="Semua">Semua Status</option>
            {statuses.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Letters Registry Cards / Table */}
      <div className="space-y-4">
        {filteredLetters.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
            Tiada rekod surat ditemui bagi kriteria carian ini.
          </div>
        ) : (
          filteredLetters.map((ltr) => {
            let priorityStyle = 'bg-slate-100 text-slate-700 border-slate-200';
            if (ltr.priority === 'Sangat Segera') priorityStyle = 'bg-red-100 text-red-800 border-red-200 font-bold';
            else if (ltr.priority === 'Segera') priorityStyle = 'bg-amber-100 text-amber-800 border-amber-200';

            return (
              <div
                key={ltr.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-amber-300 transition-all space-y-3"
              >
                {/* Top Row: Ref & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-extrabold px-2.5 py-1 rounded-lg bg-slate-900 text-white">
                      {ltr.refNumber}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        ltr.type === 'Masuk' ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-blue-50 text-blue-800 border-blue-200'
                      }`}
                    >
                      Surat {ltr.type}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      {ltr.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] border ${priorityStyle}`}>
                      {ltr.priority}
                    </span>
                  </div>

                  {/* Status Dropdown / Badge */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-slate-500">Status:</span>
                    <select
                      value={ltr.status}
                      onChange={(e) => updateLetterStatus(ltr.id, e.target.value as LetterStatus)}
                      className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none"
                    >
                      {statuses.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Middle: Subject & Sender */}
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 text-sm">{ltr.subject}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                    <span>
                      {ltr.type === 'Masuk' ? 'Daripada:' : 'Kepada:'}{' '}
                      <strong className="text-slate-800">{ltr.senderOrRecipient}</strong>
                    </span>
                    <span>
                      Tarikh: <strong className="text-slate-800">{ltr.dateReceivedSent}</strong>
                    </span>
                    <span>
                      SLA Matlamat: <strong className="text-red-600">{ltr.dueDate}</strong>
                    </span>
                  </div>
                </div>

                {/* Action Required & Assigned Officer */}
                <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 text-xs space-y-1">
                  <p className="text-slate-700">
                    <strong className="text-slate-900">Tindakan Diperlukan:</strong> {ltr.actionRequired}
                  </p>
                  {ltr.notes && <p className="text-slate-500 text-[11px] italic">Nota: {ltr.notes}</p>}
                </div>

                {/* Footer Controls & Integration Triggers */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Pegawai Bertanggungjawab:</span>
                    <span className="font-bold text-slate-800">{ltr.assignedStaffName || 'Belum Diagih'}</span>
                    <span className="text-slate-400">({ltr.section})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCreateTaskFromLetter(ltr)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold text-[11px] flex items-center gap-1 transition-all"
                    >
                      <CheckSquare className="w-3.5 h-3.5 text-amber-400" />
                      Jana Tugasan
                    </button>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Modal: Register New Letter */}
      {isRegisterOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Daftar Surat Keluar / Masuk Baharu</h3>
              <button
                onClick={() => setIsRegisterOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jenis Surat</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as LetterType)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800"
                  >
                    <option value="Masuk">Surat Masuk</option>
                    <option value="Keluar">Surat Keluar</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Keutamaan (Priority)</label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as LetterPriority)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800"
                  >
                    <option value="Biasa">Biasa</option>
                    <option value="Segera">Segera</option>
                    <option value="Sangat Segera">Sangat Segera</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">No. Rujukan Surat</label>
                <input
                  type="text"
                  placeholder="MDTM/JPP/100-2/4(12)"
                  value={formRefNumber}
                  onChange={(e) => setFormRefNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {formType === 'Masuk' ? 'Agensi / Pengirim Surat' : 'Penerima Surat'}
                </label>
                <input
                  type="text"
                  placeholder="Contoh: PLANMalaysia, Syarikat Bina Perkasa, Orang Awam..."
                  value={formSenderRecipient}
                  onChange={(e) => setFormSenderRecipient(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tajuk / Perihal Surat</label>
                <textarea
                  rows={2}
                  placeholder="Tajuk lengkap permohonan, aduan atau pekeliling..."
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kategori Surat</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as LetterCategory)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Seksyen Diagih</label>
                  <select
                    value={formSection}
                    onChange={(e) => setFormSection(e.target.value as SectionType)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800"
                  >
                    <option value="Kawalan Bangunan">Kawalan Bangunan</option>
                    <option value="Perancangan Bandar & Desa">Perancangan Bandar & Desa</option>
                    <option value="Projek & Kejuruteraan">Projek & Kejuruteraan</option>
                    <option value="Pentadbiran & Penilaian">Pentadbiran & Penilaian</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Pegawai Diagih (Assigned Officer)</label>
                <select
                  value={formAssignedStaffId}
                  onChange={(e) => setFormAssignedStaffId(e.target.value)}
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
                <label className="block font-bold text-slate-700 mb-1">Tindakan Diperlukan</label>
                <input
                  type="text"
                  placeholder="Lawatan tapak, kemaskini pelan, sediakan draf surat jawapan..."
                  value={formActionRequired}
                  onChange={(e) => setFormActionRequired(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tarikh Akhir SLA Maklum Balas</label>
                <input
                  type="date"
                  value={formDueDate}
                  onChange={(e) => setFormDueDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRegisterOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl shadow-md"
                >
                  Daftar Surat
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

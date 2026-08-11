import React, { useState } from 'react';
import {
  CalendarDays,
  Plus,
  Search,
  Filter,
  MapPin,
  Clock,
  Car,
  FileText,
  User,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Trash2,
  Building
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MovementType, SectionType } from '../types';

export const StaffMovementView: React.FC = () => {
  const {
    movements,
    addMovement,
    updateMovementStatus,
    deleteMovement,
    staffList,
    vehicles,
    addVehicleBooking
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('Semua');
  const [selectedType, setSelectedType] = useState<string>('Semua');
  const [isFormOpen, setIsFormOpen] = useState(false);

  // New Movement Form state
  const [formStaffId, setFormStaffId] = useState(staffList[0]?.id || '');
  const [formType, setFormType] = useState<MovementType>('Lawatan Tapak');
  const [formDestination, setFormDestination] = useState('');
  const [formPurpose, setFormPurpose] = useState('');
  const [formStartDate, setFormStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [formEndDate, setFormEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [formStartTime, setFormStartTime] = useState('09:00');
  const [formEndTime, setFormEndTime] = useState('13:00');
  const [formNeedVehicle, setFormNeedVehicle] = useState(false);
  const [formVehicleId, setFormVehicleId] = useState(vehicles[0]?.id || '');
  const [formLetterRef, setFormLetterRef] = useState('');
  const [formRemarks, setFormRemarks] = useState('');

  const sections: SectionType[] = [
    'Perancangan Bandar & Desa',
    'Kawalan Bangunan',
    'Projek & Kejuruteraan',
    'Pentadbiran & Penilaian'
  ];

  const movementTypes: MovementType[] = [
    'Lawatan Tapak',
    'Mesyuarat Luar',
    'Mesyuarat Dalaman',
    'Cuti Rehat',
    'Cuti Sakit',
    'Kursus / Latihan',
    'Tugas Rasmi (Outstation)'
  ];

  // Filter movements
  const filteredMovements = movements.filter((m) => {
    const matchesSearch =
      m.staffName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.purpose.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSection = selectedSection === 'Semua' || m.section === selectedSection;
    const matchesType = selectedType === 'Semua' || m.type === selectedType;

    return matchesSearch && matchesSection && matchesType;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedStaff = staffList.find((s) => s.id === formStaffId);
    if (!selectedStaff) return;

    let linkedVehicleId: string | undefined = undefined;

    // If vehicle requested, automatically create vehicle booking!
    if (formNeedVehicle && formVehicleId) {
      const veh = vehicles.find((v) => v.id === formVehicleId);
      if (veh) {
        linkedVehicleId = veh.id;
        addVehicleBooking({
          vehicleId: veh.id,
          vehiclePlate: veh.plateNumber,
          vehicleModel: veh.model,
          staffId: selectedStaff.id,
          staffName: selectedStaff.name,
          purpose: `${formType}: ${formPurpose}`,
          destination: formDestination,
          date: formStartDate,
          startTime: formStartTime,
          endTime: formEndTime,
          status: 'Diluluskan',
          linkedLetterRef: formLetterRef
        });
      }
    }

    addMovement({
      staffId: selectedStaff.id,
      staffName: selectedStaff.name,
      section: selectedStaff.section,
      type: formType,
      destination: formDestination,
      purpose: formPurpose,
      startDate: formStartDate,
      endDate: formEndDate,
      startTime: formStartTime,
      endTime: formEndTime,
      linkedVehicleId: linkedVehicleId,
      linkedLetterRef: formLetterRef || undefined,
      status: 'Diluluskan',
      remarks: formRemarks
    });

    setIsFormOpen(false);
    // Reset form
    setFormDestination('');
    setFormPurpose('');
    setFormRemarks('');
    setFormLetterRef('');
    setFormNeedVehicle(false);
  };

  return (
    <div id="movement-schedule-view" className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-slate-800">
            <CalendarDays className="w-5 h-5 text-red-600" />
            <h2 className="text-lg font-bold">Jadual Pergerakan Staf</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Rekod lengkap pergerakan staf bagi lawatan tapak, mesyuarat, cuti rehat, dan tugas rasmi luar pejabat.
          </p>
        </div>

        <button
          onClick={() => setIsFormOpen(true)}
          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-xs transition-all flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Tambah Rekod Pergerakan
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama staf, lokasi, tujuan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
          />
        </div>

        {/* Section & Type Selectors */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none"
          >
            <option value="Semua">Semua Seksyen</option>
            {sections.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none"
          >
            <option value="Semua">Semua Jenis Pergerakan</option>
            {movementTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Movement List Table & Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-900 text-slate-200 uppercase text-[10px] tracking-wider font-bold">
              <tr>
                <th className="px-4 py-3">Nama Pegawai / Staf</th>
                <th className="px-4 py-3">Seksyen</th>
                <th className="px-4 py-3">Jenis Pergerakan</th>
                <th className="px-4 py-3">Lokasi / Destinasi</th>
                <th className="px-4 py-3">Tujuan / Catatan</th>
                <th className="px-4 py-3">Tarikh & Masa</th>
                <th className="px-4 py-3">Pautan Kenderaan / Surat</th>
                <th className="px-4 py-3 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMovements.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                    Tiada rekod pergerakan dijumpai.
                  </td>
                </tr>
              ) : (
                filteredMovements.map((m) => {
                  let badgeColor = 'bg-blue-100 text-blue-800 border-blue-200';
                  if (m.type.includes('Cuti')) badgeColor = 'bg-slate-100 text-slate-700 border-slate-200';
                  else if (m.type.includes('Mesyuarat')) badgeColor = 'bg-amber-100 text-amber-800 border-amber-200';
                  else if (m.type.includes('Outstation')) badgeColor = 'bg-purple-100 text-purple-800 border-purple-200';

                  return (
                    <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-bold text-slate-900">
                        {m.staffName}
                      </td>
                      <td className="px-4 py-3 text-slate-600 font-medium">
                        {m.section}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badgeColor}`}>
                          {m.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 font-semibold text-slate-800">
                          <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          {m.destination}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 max-w-xs truncate">
                        {m.purpose}
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] whitespace-nowrap">
                        <div className="font-semibold text-slate-800">{m.startDate}</div>
                        <div className="text-slate-500 text-[10px]">{m.startTime} - {m.endTime}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          {m.linkedVehicleId && (
                            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded text-[10px] font-semibold">
                              <Car className="w-3 h-3" />
                              Kenderaan Teragih
                            </span>
                          )}
                          {m.linkedLetterRef && (
                            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded text-[10px] font-semibold">
                              <FileText className="w-3 h-3" />
                              {m.linkedLetterRef}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => deleteMovement(m.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                          title="Padam Rekod"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form: Add Movement */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Catat Pergerakan Staf Baharu</h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Select Staff */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Pegawai / Staf</label>
                <select
                  value={formStaffId}
                  onChange={(e) => setFormStaffId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800"
                  required
                >
                  {staffList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.position})
                    </option>
                  ))}
                </select>
              </div>

              {/* Movement Type */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Jenis Pergerakan</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as MovementType)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800"
                  required
                >
                  {movementTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Destination */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Destinasi / Lokasi</label>
                <input
                  type="text"
                  placeholder="Contoh: Mukim Kusial, PLANMalaysia Kota Bharu, etc."
                  value={formDestination}
                  onChange={(e) => setFormDestination(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800"
                  required
                />
              </div>

              {/* Purpose */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tujuan / Perihal Tugas</label>
                <textarea
                  rows={2}
                  placeholder="Pemeriksaan tapak, mesyuarat jawatankuasa, dll..."
                  value={formPurpose}
                  onChange={(e) => setFormPurpose(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800"
                  required
                />
              </div>

              {/* Dates & Times */}
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
                  <label className="block font-bold text-slate-700 mb-1">Tarikh Tamat</label>
                  <input
                    type="date"
                    value={formEndDate}
                    onChange={(e) => setFormEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Masa Mula</label>
                  <input
                    type="time"
                    value={formStartTime}
                    onChange={(e) => setFormStartTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Masa Tamat</label>
                  <input
                    type="time"
                    value={formEndTime}
                    onChange={(e) => setFormEndTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800"
                    required
                  />
                </div>
              </div>

              {/* Link Vehicle Option */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="flex items-center gap-2 font-bold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formNeedVehicle}
                    onChange={(e) => setFormNeedVehicle(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                  <span>Memerlukan Kenderaan Jabatan?</span>
                </label>

                {formNeedVehicle && (
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Pilih Kenderaan</label>
                    <select
                      value={formVehicleId}
                      onChange={(e) => setFormVehicleId(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                    >
                      {vehicles.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.plateNumber} - {v.model} ({v.status})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Linked Letter Ref */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">No. Rujukan Surat (Jika ada)</label>
                <input
                  type="text"
                  placeholder="Contoh: MDTM/JPP/200-4/12(08)"
                  value={formLetterRef}
                  onChange={(e) => setFormLetterRef(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-xs transition-all"
                >
                  Simpan Pergerakan
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

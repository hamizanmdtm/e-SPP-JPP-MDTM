import React, { useState } from 'react';
import {
  Car,
  Plus,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  Gauge,
  FileText,
  MapPin,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VehicleStatus, VehicleType } from '../types';

export const VehicleView: React.FC = () => {
  const {
    vehicles,
    vehicleBookings,
    addVehicleBooking,
    updateBookingStatus,
    staffList,
    letters
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'inventory' | 'bookings'>('bookings');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Form State for Booking
  const [formVehicleId, setFormVehicleId] = useState(vehicles[0]?.id || '');
  const [formStaffId, setFormStaffId] = useState(staffList[0]?.id || '');
  const [formPurpose, setFormPurpose] = useState('');
  const [formDestination, setFormDestination] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formStartTime, setFormStartTime] = useState('09:00');
  const [formEndTime, setFormEndTime] = useState('13:00');
  const [formLetterRef, setFormLetterRef] = useState('');

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const veh = vehicles.find((v) => v.id === formVehicleId);
    const stf = staffList.find((s) => s.id === formStaffId);

    if (!veh || !stf) return;

    addVehicleBooking({
      vehicleId: veh.id,
      vehiclePlate: veh.plateNumber,
      vehicleModel: veh.model,
      staffId: stf.id,
      staffName: stf.name,
      purpose: formPurpose,
      destination: formDestination,
      date: formDate,
      startTime: formStartTime,
      endTime: formEndTime,
      status: 'Diluluskan',
      linkedLetterRef: formLetterRef || undefined
    });

    setIsBookingModalOpen(false);
    setFormPurpose('');
    setFormDestination('');
    setFormLetterRef('');
  };

  return (
    <div id="vehicle-management-view" className="space-y-6">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-slate-800">
            <Car className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold">Pergerakan & Tempahan Kenderaan Jabatan</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pengurusan logistik kenderaan rasmi Jabatan Perancangan & Pembangunan MDTM, tempahan pergerakan tapak & takwim penyelenggaraan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs">
            <button
              onClick={() => setActiveSubTab('bookings')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeSubTab === 'bookings' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Jadual Tempahan ({vehicleBookings.length})
            </button>
            <button
              onClick={() => setActiveSubTab('inventory')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeSubTab === 'inventory' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Senarai Kenderaan ({vehicles.length})
            </button>
          </div>

          <button
            onClick={() => setIsBookingModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Tempah Kenderaan
          </button>
        </div>
      </div>

      {/* Fleet Status Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {vehicles.map((v) => {
          let statusBadge = 'bg-emerald-100 text-emerald-800 border-emerald-200';
          if (v.status === 'Dalam Perjalanan') statusBadge = 'bg-blue-100 text-blue-800 border-blue-200';
          else if (v.status === 'Penyelenggaraan') statusBadge = 'bg-purple-100 text-purple-800 border-purple-200';

          return (
            <div key={v.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-extrabold text-slate-900">{v.plateNumber}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${statusBadge}`}>
                  {v.status}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-700">{v.model}</p>
              
              <div className="pt-2 border-t border-slate-100 space-y-1 text-[11px] text-slate-500 font-mono">
                <div className="flex items-center justify-between">
                  <span>Odometer:</span>
                  <span className="font-bold text-slate-800">{v.currentOdometer.toLocaleString()} km</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Cukai Jalan:</span>
                  <span className="text-slate-700">{v.roadtaxExpiry}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* SUB-TAB 1: BOOKING SCHEDULE */}
      {activeSubTab === 'bookings' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
              Rekod & Takwim Tempahan Kenderaan
            </h3>
            <span className="text-xs text-slate-500 font-medium">Terintegrasi dengan Pergerakan Staf</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-900 text-slate-200 uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="px-4 py-3">No. Pendaftaran & Model</th>
                  <th className="px-4 py-3">Pemohon / Pemandu</th>
                  <th className="px-4 py-3">Destinasi & Tujuan</th>
                  <th className="px-4 py-3">Tarikh & Masa</th>
                  <th className="px-4 py-3">Pautan Surat Kebenaran</th>
                  <th className="px-4 py-3">Status Tempahan</th>
                  <th className="px-4 py-3 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vehicleBookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                      Tiada permohonan tempahan kenderaan.
                    </td>
                  </tr>
                ) : (
                  vehicleBookings.map((bk) => (
                    <tr key={bk.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono">
                        <span className="font-bold text-slate-900 block">{bk.vehiclePlate}</span>
                        <span className="text-[10px] text-slate-500">{bk.vehicleModel}</span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-800">
                        {bk.staffName}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 font-semibold text-slate-800">
                          <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          {bk.destination}
                        </div>
                        <p className="text-[11px] text-slate-500 truncate max-w-xs">{bk.purpose}</p>
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] whitespace-nowrap">
                        <div className="font-semibold text-slate-800">{bk.date}</div>
                        <div className="text-slate-500 text-[10px]">{bk.startTime} - {bk.endTime}</div>
                      </td>
                      <td className="px-4 py-3">
                        {bk.linkedLetterRef ? (
                          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded text-[10px] font-semibold">
                            <FileText className="w-3 h-3" />
                            {bk.linkedLetterRef}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[10px] italic">Tiada Pautan Surat</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                            bk.status === 'Aktif'
                              ? 'bg-blue-100 text-blue-800 border-blue-200'
                              : bk.status === 'Diluluskan'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                              : bk.status === 'Selesai'
                              ? 'bg-slate-100 text-slate-700 border-slate-200'
                              : 'bg-amber-100 text-amber-800 border-amber-200'
                          }`}
                        >
                          {bk.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {bk.status !== 'Selesai' && (
                          <button
                            onClick={() => updateBookingStatus(bk.id, 'Selesai')}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-bold"
                          >
                            Tanda Selesai
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: INVENTORY & MAINTENANCE */}
      {activeSubTab === 'inventory' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
            Inventori Penuh & Log Penyelenggaraan Kenderaan Jabatan
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vehicles.map((v) => (
              <div key={v.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Car className="w-5 h-5 text-slate-700" />
                    <div>
                      <span className="font-mono text-base font-bold text-slate-900 block leading-tight">{v.plateNumber}</span>
                      <span className="text-xs text-slate-500 font-medium">{v.model} ({v.type})</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-slate-900 text-white">
                    {v.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200 font-mono">
                  <div className="bg-white p-2 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-sans">Odometer Semasa</span>
                    <span className="font-bold text-slate-800">{v.currentOdometer.toLocaleString()} KM</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-sans">Servis Akan Datang</span>
                    <span className="font-bold text-amber-600">{v.nextServiceDueDate}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Cukai Jalan: <strong className="text-slate-800">{v.roadtaxExpiry}</strong></span>
                  <span>Servis Terakhir: <strong className="text-slate-800">{v.lastServiceDate}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Add Vehicle Booking */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Borang Tempahan Kenderaan Jabatan</h3>
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-slate-700 mb-1">Pilih Kenderaan</label>
                <select
                  value={formVehicleId}
                  onChange={(e) => setFormVehicleId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800"
                  required
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.plateNumber} - {v.model} ({v.status})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Pemohon / Pemandu</label>
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

              <div>
                <label className="block font-bold text-slate-700 mb-1">Destinasi / Lokasi Lawatan</label>
                <input
                  type="text"
                  placeholder="Mukim Kusial, Kota Bharu, Dataran Tanah Merah..."
                  value={formDestination}
                  onChange={(e) => setFormDestination(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tujuan Tempahan</label>
                <textarea
                  rows={2}
                  placeholder="Lawatan tapak kawasan pembinaan, mesyuarat luaran..."
                  value={formPurpose}
                  onChange={(e) => setFormPurpose(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tarikh</label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800"
                    required
                  />
                </div>
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

              <div>
                <label className="block font-bold text-slate-700 mb-1">Pautan Surat Kebenaran / Arahan (Jika Ada)</label>
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
                  onClick={() => setIsBookingModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md"
                >
                  Sahkan Tempahan
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

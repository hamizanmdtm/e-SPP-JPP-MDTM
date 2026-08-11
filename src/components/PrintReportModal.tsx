import React from 'react';
import { Printer, X, Building, Calendar, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PrintReportModal: React.FC = () => {
  const { isPrintModalOpen, setPrintModalOpen, movements, staffList, vehicles, letters, tasks } = useApp();

  if (!isPrintModalOpen) return null;

  const todayFormatted = new Date().toLocaleDateString('ms-MY', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Modal Top Control Bar (Hidden on print) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm">Pratonton Laporan Pergerakan & Pentadbiran Harian MDTM</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              Cetak Dokumentasi
            </button>
            <button
              onClick={() => setPrintModalOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Content */}
        <div className="p-8 overflow-y-auto space-y-6 text-slate-800 text-xs font-sans print:p-0">
          
          {/* Header Surat MDTM */}
          <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
            <div className="w-12 h-12 mx-auto rounded-lg bg-red-700 text-white font-bold flex items-center justify-center text-sm shadow-md mb-2">
              MDTM
            </div>
            <h1 className="text-base font-extrabold uppercase tracking-wide text-slate-900">
              MAJLIS DAERAH TANAH MERAH
            </h1>
            <h2 className="text-sm font-bold text-slate-700 uppercase">
              JABATAN PERANCANGAN DAN PEMBANGUNAN
            </h2>
            <p className="text-[11px] font-semibold text-slate-500">
              PENYATA PERGERAKAN STAF, KENDERAAN & RINGKASAN TUGASAN HARIAN
            </p>
            <p className="text-xs font-mono font-bold text-red-700 pt-1">
              TARIKH CETAKAN: {todayFormatted}
            </p>
          </div>

          {/* Section 1: Staff Movement Today */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-300 pb-1">
              1. Jadual Pergerakan Staf Hari Ini ({movements.length})
            </h3>
            <table className="w-full text-left text-[11px] border border-slate-300">
              <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                <tr>
                  <th className="p-2 border-r border-slate-300">Nama Pegawai / Staf</th>
                  <th className="p-2 border-r border-slate-300">Seksyen</th>
                  <th className="p-2 border-r border-slate-300">Jenis</th>
                  <th className="p-2 border-r border-slate-300">Destinasi / Lokasi</th>
                  <th className="p-2 border-r border-slate-300">Masa</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {movements.map((m) => (
                  <tr key={m.id}>
                    <td className="p-2 border-r border-slate-300 font-bold">{m.staffName}</td>
                    <td className="p-2 border-r border-slate-300">{m.section}</td>
                    <td className="p-2 border-r border-slate-300 font-semibold">{m.type}</td>
                    <td className="p-2 border-r border-slate-300">{m.destination}</td>
                    <td className="p-2 border-r border-slate-300 font-mono">{m.startTime} - {m.endTime}</td>
                    <td className="p-2 font-semibold">{m.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section 2: Active Vehicles */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-300 pb-1">
              2. Status & Pergerakan Kenderaan Jabatan
            </h3>
            <table className="w-full text-left text-[11px] border border-slate-300">
              <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                <tr>
                  <th className="p-2 border-r border-slate-300">No. Pendaftaran</th>
                  <th className="p-2 border-r border-slate-300">Model Kenderaan</th>
                  <th className="p-2 border-r border-slate-300">Pemandu / Pegawai</th>
                  <th className="p-2 border-r border-slate-300">Odometer Semasa</th>
                  <th className="p-2">Status Semasa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {vehicles.map((v) => (
                  <tr key={v.id}>
                    <td className="p-2 border-r border-slate-300 font-mono font-bold">{v.plateNumber}</td>
                    <td className="p-2 border-r border-slate-300">{v.model}</td>
                    <td className="p-2 border-r border-slate-300">{v.assignedDriver || '-'}</td>
                    <td className="p-2 border-r border-slate-300 font-mono">{v.currentOdometer.toLocaleString()} KM</td>
                    <td className="p-2 font-semibold">{v.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section 3: Priority Letters & Tasks */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-300 pb-1">
              3. Ringkasan Surat Memerlukan Tindakan Segera ({letters.filter((l) => l.priority !== 'Biasa').length})
            </h3>
            <div className="space-y-1">
              {letters.map((l) => (
                <div key={l.id} className="p-2 border border-slate-200 rounded flex justify-between">
                  <div>
                    <span className="font-mono font-bold mr-2 text-slate-900">{l.refNumber}</span>
                    <span className="font-semibold text-slate-800">{l.subject}</span>
                  </div>
                  <div className="font-mono text-[10px] text-red-700 font-bold">
                    SLA: {l.dueDate}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Signatures Footer */}
          <div className="pt-12 grid grid-cols-2 gap-8 text-center text-[11px] font-semibold">
            <div>
              <p className="mb-12">Disediakan Oleh:</p>
              <p className="border-t border-slate-400 pt-1 font-bold">Pembantu Tadbir / Pegawai Bertugas</p>
              <p className="text-[10px] text-slate-500 font-normal">Jabatan Perancangan & Pembangunan MDTM</p>
            </div>
            <div>
              <p className="mb-12">Disahkan Oleh:</p>
              <p className="border-t border-slate-400 pt-1 font-bold">Ketua Jabatan Perancangan & Pembangunan</p>
              <p className="text-[10px] text-slate-500 font-normal">Majlis Daerah Tanah Merah</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

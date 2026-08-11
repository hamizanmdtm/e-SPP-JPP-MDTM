import React, { useState } from 'react';
import {
  CalendarDays,
  Car,
  Mail,
  CheckSquare,
  X,
  PlusCircle,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const QuickActionModal: React.FC = () => {
  const { isQuickActionOpen, setQuickActionOpen, setActiveTab } = useApp();

  if (!isQuickActionOpen) return null;

  const quickActions = [
    {
      id: 'movements',
      title: 'Jadual Pergerakan Staf',
      desc: 'Catat cuti, mesyuarat luar, lawatan tapak atau outstation pegawai.',
      icon: CalendarDays,
      color: 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200'
    },
    {
      id: 'vehicles',
      title: 'Tempahan Kenderaan Jabatan',
      desc: 'Tempah kereta Proton X70, Hilux, Van atau log penyelenggaraan.',
      icon: Car,
      color: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
    },
    {
      id: 'letters',
      title: 'Daftar Surat Masuk / Keluar',
      desc: 'Daftarkan No. Rujukan surat rasmi, aduan awam dan SLA maklum balas.',
      icon: Mail,
      color: 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200'
    },
    {
      id: 'tasks',
      title: 'Agihkan Tugasan Harian',
      desc: 'Tugaskan arahan kerja harian kepada pegawai mengikut seksyen.',
      icon: CheckSquare,
      color: 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200'
    }
  ];

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Pusat Pendaftaran Pantas</h3>
            <p className="text-xs text-slate-500">Pilih modul yang ingin anda tambah rekod baharu</p>
          </div>
          <button
            onClick={() => setQuickActionOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {quickActions.map((act) => {
            const Icon = act.icon;

            return (
              <button
                key={act.id}
                onClick={() => {
                  setQuickActionOpen(false);
                  setActiveTab(act.id);
                }}
                className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between gap-3 ${act.color}`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-xs shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs leading-snug">{act.title}</h4>
                    <p className="text-[11px] opacity-80 mt-0.5">{act.desc}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};

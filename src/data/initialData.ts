import {
  Staff,
  StaffMovement,
  Vehicle,
  VehicleBooking,
  OfficialLetter,
  DailyTask,
  ProjectMilestone,
  NotificationItem
} from '../types';

export const initialStaff: Staff[] = [
  {
    id: 'STF-001',
    name: 'Encik Ahmad Razali bin Mahmud',
    position: 'Pegawai Perancang Bandar & Desa (J44)',
    grade: 'J44',
    section: 'Perancangan Bandar & Desa',
    phone: '019-981 2345',
    email: 'razali.mdtm@kelantan.gov.my',
    statusToday: 'Di Pejabat'
  },
  {
    id: 'STF-002',
    name: 'Puan Noraini binti Sulaiman',
    position: 'Penolong Pegawai Seni Bina (JA36)',
    grade: 'JA36',
    section: 'Kawalan Bangunan',
    phone: '013-922 8810',
    email: 'noraini.mdtm@kelantan.gov.my',
    statusToday: 'Lawatan Tapak'
  },
  {
    id: 'STF-003',
    name: 'Ir. Mohd Faizal bin Che Omar',
    position: 'Jurutera Daerah (J41)',
    grade: 'J41',
    section: 'Projek & Kejuruteraan',
    phone: '017-910 5432',
    email: 'faizal.mdtm@kelantan.gov.my',
    statusToday: 'Di Pejabat'
  },
  {
    id: 'STF-004',
    name: 'Puan Siti Zubaidah binti Hassan',
    position: 'Penolong Pegawai Penilaian (W32)',
    grade: 'W32',
    section: 'Pentadbiran & Penilaian',
    phone: '019-933 1122',
    email: 'zubaidah.mdtm@kelantan.gov.my',
    statusToday: 'Mesyuarat'
  },
  {
    id: 'STF-005',
    name: 'Encik Muhammad Hafiz bin Ismail',
    position: 'Pelukis Pelan (JA29)',
    grade: 'JA29',
    section: 'Perancangan Bandar & Desa',
    phone: '011-1234 5678',
    email: 'hafiz.mdtm@kelantan.gov.my',
    statusToday: 'Di Pejabat'
  },
  {
    id: 'STF-006',
    name: 'Encik Nik Wan Azman bin Nik Mat',
    position: 'Pembantu Tadbir (N19)',
    grade: 'N19',
    section: 'Pentadbiran & Penilaian',
    phone: '018-901 2233',
    email: 'azman.mdtm@kelantan.gov.my',
    statusToday: 'Di Pejabat'
  },
  {
    id: 'STF-007',
    name: 'Encik Ridzuan bin Mustapha',
    position: 'Penolong Pegawai Perancang Bandar (JA29)',
    grade: 'JA29',
    section: 'Kawalan Bangunan',
    phone: '014-889 7766',
    email: 'ridzuan.mdtm@kelantan.gov.my',
    statusToday: 'Cuti'
  }
];

// Current date string helpers
const today = new Date().toISOString().split('T')[0];

export const initialMovements: StaffMovement[] = [
  {
    id: 'MVT-2026-001',
    staffId: 'STF-002',
    staffName: 'Puan Noraini binti Sulaiman',
    section: 'Kawalan Bangunan',
    type: 'Lawatan Tapak',
    destination: 'Mukim Kusial & Bandar Tanah Merah',
    purpose: 'Pemeriksaan Struktur Bangunan & Sijil Perakuan Siap dan Mematuhi (CCC)',
    startDate: today,
    endDate: today,
    startTime: '09:00',
    endTime: '13:00',
    linkedVehicleId: 'VEH-002',
    linkedLetterRef: 'MDTM/JPP/200-4/12(08)',
    status: 'Diluluskan',
    remarks: 'Pemeriksaan bersama pegawai bomba dan Syabas/Air Kelantan'
  },
  {
    id: 'MVT-2026-002',
    staffId: 'STF-004',
    staffName: 'Puan Siti Zubaidah binti Hassan',
    section: 'Pentadbiran & Penilaian',
    type: 'Mesyuarat Luar',
    destination: 'Pejabat Tanah dan Jajahan Tanah Merah',
    purpose: 'Mesyuarat Jawatankuasa Pengambilan Tanah dan Nilaian Semula Jajahan',
    startDate: today,
    endDate: today,
    startTime: '10:00',
    endTime: '12:30',
    linkedVehicleId: 'VEH-001',
    linkedLetterRef: 'MDTM/JPP/100-1/2(15)',
    status: 'Diluluskan',
    remarks: 'Pembentangan senarai nilaian premis perniagaan baharu'
  },
  {
    id: 'MVT-2026-003',
    staffId: 'STF-007',
    staffName: 'Encik Ridzuan bin Mustapha',
    section: 'Kawalan Bangunan',
    type: 'Cuti Rehat',
    destination: 'Rumah / Urusan Keluarga',
    purpose: 'Cuti Rehat Tahunan',
    startDate: today,
    endDate: today,
    startTime: '08:00',
    endTime: '17:00',
    status: 'Diluluskan',
    remarks: 'Tugas diambil alih sementara oleh En. Hafiz'
  },
  {
    id: 'MVT-2026-004',
    staffId: 'STF-001',
    staffName: 'Encik Ahmad Razali bin Mahmud',
    section: 'Perancangan Bandar & Desa',
    type: 'Tugas Rasmi (Outstation)',
    destination: 'PLANMalaysia Kelantan, Kota Bharu',
    purpose: 'Bengkel Draf Final Rancangan Tempatan MDTM 2035',
    startDate: '2026-08-14',
    endDate: '2026-08-15',
    startTime: '08:30',
    endTime: '17:00',
    linkedVehicleId: 'VEH-001',
    linkedLetterRef: 'MDTM/JPP/100-3/1(04)',
    status: 'Diluluskan',
    remarks: 'Penyerahan dokumen draf terkini kepada Pengarah PLANMalaysia'
  }
];

export const initialVehicles: Vehicle[] = [
  {
    id: 'VEH-001',
    plateNumber: 'DDA 8821',
    model: 'Proton X70 Executive 1.8L',
    type: 'Kereta',
    status: 'Dalam Perjalanan',
    currentOdometer: 42150,
    lastServiceDate: '2026-06-15',
    nextServiceDueDate: '2026-09-15',
    roadtaxExpiry: '2026-11-20',
    assignedDriver: 'Puan Siti Zubaidah binti Hassan'
  },
  {
    id: 'VEH-002',
    plateNumber: 'DDB 4490',
    model: 'Toyota Hilux Double Cab 2.4D',
    type: '4WD / Pick-up',
    status: 'Dalam Perjalanan',
    currentOdometer: 89400,
    lastServiceDate: '2026-05-10',
    nextServiceDueDate: '2026-08-25',
    roadtaxExpiry: '2026-10-12',
    assignedDriver: 'Puan Noraini binti Sulaiman'
  },
  {
    id: 'VEH-003',
    plateNumber: 'DDC 1209',
    model: 'Isuzu D-Max 3.0 4x4',
    type: '4WD / Pick-up',
    status: 'Tersedia',
    currentOdometer: 61200,
    lastServiceDate: '2026-07-02',
    nextServiceDueDate: '2026-10-02',
    roadtaxExpiry: '2027-01-15'
  },
  {
    id: 'VEH-004',
    plateNumber: 'DDD 7070',
    model: 'Nissan NV200 Panel Van',
    type: 'Van',
    status: 'Penyelenggaraan',
    currentOdometer: 112300,
    lastServiceDate: '2026-08-01',
    nextServiceDueDate: '2026-11-01',
    roadtaxExpiry: '2026-09-01'
  }
];

export const initialVehicleBookings: VehicleBooking[] = [
  {
    id: 'VBK-2026-001',
    vehicleId: 'VEH-002',
    vehiclePlate: 'DDB 4490',
    vehicleModel: 'Toyota Hilux Double Cab 2.4D',
    staffId: 'STF-002',
    staffName: 'Puan Noraini binti Sulaiman',
    purpose: 'Lawatan Tapak Kawalan Bangunan & CCC',
    destination: 'Mukim Kusial & Bandar Tanah Merah',
    date: today,
    startTime: '09:00',
    endTime: '13:00',
    startOdometer: 89380,
    status: 'Aktif',
    linkedLetterRef: 'MDTM/JPP/200-4/12(08)'
  },
  {
    id: 'VBK-2026-002',
    vehicleId: 'VEH-001',
    vehiclePlate: 'DDA 8821',
    vehicleModel: 'Proton X70 Executive 1.8L',
    staffId: 'STF-004',
    staffName: 'Puan Siti Zubaidah binti Hassan',
    purpose: 'Mesyuarat Pengambilan Tanah di PTJ',
    destination: 'Pejabat Tanah dan Jajahan Tanah Merah',
    date: today,
    startTime: '10:00',
    endTime: '12:30',
    startOdometer: 42135,
    status: 'Aktif',
    linkedLetterRef: 'MDTM/JPP/100-1/2(15)'
  },
  {
    id: 'VBK-2026-003',
    vehicleId: 'VEH-001',
    vehiclePlate: 'DDA 8821',
    vehicleModel: 'Proton X70 Executive 1.8L',
    staffId: 'STF-001',
    staffName: 'Encik Ahmad Razali bin Mahmud',
    purpose: 'Bengkel Draf Final RT MDTM 2035',
    destination: 'PLANMalaysia Kelantan, Kota Bharu',
    date: '2026-08-14',
    startTime: '08:30',
    endTime: '17:00',
    status: 'Diluluskan',
    linkedLetterRef: 'MDTM/JPP/100-3/1(04)'
  }
];

export const initialLetters: OfficialLetter[] = [
  {
    id: 'LTR-2026-001',
    refNumber: 'MDTM/JPP/200-4/12(08)',
    type: 'Masuk',
    dateReceivedSent: today,
    senderOrRecipient: 'Syarikat Bina Perkasa Sdn Bhd',
    subject: 'Permohonan Pemeriksaan Tapak untuk Sijil Perakuan Siap dan Mematuhi (CCC) Lot 4881, Mukim Kusial',
    category: 'Pelan Bangunan',
    priority: 'Sangat Segera',
    status: 'Dalam Tindakan',
    assignedStaffId: 'STF-002',
    assignedStaffName: 'Puan Noraini binti Sulaiman',
    section: 'Kawalan Bangunan',
    actionRequired: 'Lakukan lawatan tapak dan sediakan ulasan teknikal kelulusan CCC dalam tempoh 5 hari bekerja.',
    dueDate: '2026-08-15',
    linkedVehicleBookingId: 'VBK-2026-001',
    linkedTaskId: 'TSK-2026-001',
    notes: 'Pemohon menyatakan binaan fizikal telah siap 100%'
  },
  {
    id: 'LTR-2026-002',
    refNumber: 'MDTM/JPP/100-1/2(15)',
    type: 'Masuk',
    dateReceivedSent: '2026-08-08',
    senderOrRecipient: 'Pejabat Tanah dan Jajahan Tanah Merah',
    subject: 'Jemputan Mesyuarat Jawatankuasa Pengambilan Tanah Bil. 3/2026',
    category: 'Jemputan Mesyuarat',
    priority: 'Segera',
    status: 'Dalam Tindakan',
    assignedStaffId: 'STF-004',
    assignedStaffName: 'Puan Siti Zubaidah binti Hassan',
    section: 'Pentadbiran & Penilaian',
    actionRequired: 'Hadir mesyuarat dan bawa draf cadangan penilaian semula cukai pentaksiran kawasan baharu.',
    dueDate: today,
    linkedVehicleBookingId: 'VBK-2026-002',
    notes: 'Surat rasmi disemak oleh YBhg. Yang Dipertua MDTM'
  },
  {
    id: 'LTR-2026-003',
    refNumber: 'MDTM/JPP/100-3/1(04)',
    type: 'Keluar',
    dateReceivedSent: '2026-08-07',
    senderOrRecipient: 'Pengarah PLANMalaysia Negeri Kelantan',
    subject: 'Penyerahan Maklum Balas Draf Laporan Publisiti Rancangan Tempatan MDTM 2035 (Pengubahsuaian)',
    category: 'Permohonan Kebenaran Merancang',
    priority: 'Biasa',
    status: 'Selesai',
    assignedStaffId: 'STF-001',
    assignedStaffName: 'Encik Ahmad Razali bin Mahmud',
    section: 'Perancangan Bandar & Desa',
    actionRequired: 'Draf surat jawapan rasmi berserta lampiran minit mesyuarat jawatankuasa khas.',
    dueDate: '2026-08-12',
    linkedTaskId: 'TSK-2026-002'
  },
  {
    id: 'LTR-2026-004',
    refNumber: 'MDTM/JPP/400-2/1(19)',
    type: 'Masuk',
    dateReceivedSent: '2026-08-09',
    senderOrRecipient: 'Persatuan Penduduk Taman Harmoni, Tanah Merah',
    subject: 'Aduan Awam Mengenai Binaan Struktur Tanpa Kelulusan Di Atas Rizab Jalan Taman Harmoni',
    category: 'Aduan Awam',
    priority: 'Sangat Segera',
    status: 'Daftar Baru',
    assignedStaffId: 'STF-003',
    assignedStaffName: 'Ir. Mohd Faizal bin Che Omar',
    section: 'Kawalan Bangunan',
    actionRequired: 'Keluarkan Notis Sitaan / Henti Kerja Seksyen 70 Akta 133 jika tidak memenuhi syarat.',
    dueDate: '2026-08-13',
    linkedTaskId: 'TSK-2026-003'
  }
];

export const initialTasks: DailyTask[] = [
  {
    id: 'TSK-2026-001',
    title: 'Sediakan Laporan Semakan CCC Lot 4881 Mukim Kusial',
    description: 'Menyediakan ulasan teknikal dan borang sokongan CCC berdasarkan pemeriksaan tapak bersama agensi teknikal.',
    assignedStaffId: 'STF-002',
    assignedStaffName: 'Puan Noraini binti Sulaiman',
    section: 'Kawalan Bangunan',
    priority: 'Kritikal',
    status: 'Dalam Proses',
    startDate: today,
    dueDate: '2026-08-15',
    progressPercent: 60,
    linkedLetterRef: 'MDTM/JPP/200-4/12(08)',
    commentsCount: 3
  },
  {
    id: 'TSK-2026-002',
    title: 'Kemaskini Pelan Spatial Zon Guna Tanah RT MDTM 2035',
    description: 'Menyesuaikan pengezonan kawasan perindustrian baharu Bukit Bunga mengikut ketetapan minit mesyuarat perancangan.',
    assignedStaffId: 'STF-005',
    assignedStaffName: 'Encik Muhammad Hafiz bin Ismail',
    section: 'Perancangan Bandar & Desa',
    priority: 'Tinggi',
    status: 'Dalam Proses',
    startDate: '2026-08-05',
    dueDate: '2026-08-16',
    progressPercent: 80,
    linkedLetterRef: 'MDTM/JPP/100-3/1(04)',
    commentsCount: 5
  },
  {
    id: 'TSK-2026-003',
    title: 'Siasatan Tapak Aduan Binaan Haram Taman Harmoni',
    description: 'Menjalankan siasatan mengejut, mengambil gambar fizikal, dan menyediakan draf Notis Akta 133.',
    assignedStaffId: 'STF-003',
    assignedStaffName: 'Ir. Mohd Faizal bin Che Omar',
    section: 'Kawalan Bangunan',
    priority: 'Kritikal',
    status: 'Belum Mula',
    startDate: today,
    dueDate: '2026-08-12',
    progressPercent: 0,
    linkedLetterRef: 'MDTM/JPP/400-2/1(19)',
    commentsCount: 1
  },
  {
    id: 'TSK-2026-004',
    title: 'Penyediaan Penyata Tunggakan Cukai Nilaian Premis Komersial',
    description: 'Semakan maklumat pemilik dan penyediaan Notis E untuk premis perniagaan di Bandar Baharu Tanah Merah.',
    assignedStaffId: 'STF-006',
    assignedStaffName: 'Encik Nik Wan Azman bin Nik Mat',
    section: 'Pentadbiran & Penilaian',
    priority: 'Sederhana',
    status: 'Dalam Proses',
    startDate: '2026-08-01',
    dueDate: '2026-08-20',
    progressPercent: 45,
    commentsCount: 2
  },
  {
    id: 'TSK-2026-005',
    title: 'Semakan Rekabentuk Pelan Struktur Pasar Berek 12',
    description: 'Menyemak kelulusan jurutera bertauliah untuk aspek beban dan pengudaraan semula jadi.',
    assignedStaffId: 'STF-003',
    assignedStaffName: 'Ir. Mohd Faizal bin Che Omar',
    section: 'Projek & Kejuruteraan',
    priority: 'Tinggi',
    status: 'Selesai',
    startDate: '2026-08-01',
    dueDate: '2026-08-08',
    progressPercent: 100,
    commentsCount: 4
  }
];

export const initialProjects: ProjectMilestone[] = [
  {
    id: 'PRJ-2026-01',
    code: 'MDTM-RT2035',
    title: 'Rancangan Tempatan Majlis Daerah Tanah Merah 2035 (Pengubahsuaian)',
    description: 'Wawasan pembangunan fizikal dan penstrukturan semula guna tanah daerah Tanah Merah merangkumi Pusat Bandar, Bukit Bunga & Guillemard.',
    section: 'Perancangan Bandar & Desa',
    leadStaffId: 'STF-001',
    leadStaffName: 'Encik Ahmad Razali bin Mahmud',
    budget: 'RM 450,000.00',
    startDate: '2026-01-15',
    endDate: '2026-11-30',
    health: 'Mengikut Jadual',
    overallProgress: 70,
    location: 'Seluruh Jajahan Tanah Merah',
    milestones: [
      { id: 'M1', title: 'Laporan Pendahuluan & Profil Daerah', targetDate: '2026-03-01', status: 'Selesai', completedDate: '2026-02-28' },
      { id: 'M2', title: 'Program Publisiti & Penyertaan Awam', targetDate: '2026-05-15', status: 'Selesai', completedDate: '2026-05-20' },
      { id: 'M3', title: 'Siasatan Tempatan & Pendengaran Bantahan', targetDate: '2026-07-30', status: 'Selesai', completedDate: '2026-07-28' },
      { id: 'M4', title: 'Penyediaan Draf Final & Peta Cadangan', targetDate: '2026-08-30', status: 'Dalam Proses' },
      { id: 'M5', title: 'Kelulusan Pihak Berkuasa Negeri (PBN) & Warta', targetDate: '2026-11-15', status: 'Belum Mula' }
    ]
  },
  {
    id: 'PRJ-2026-02',
    code: 'MDTM-PB12',
    title: 'Projek Naiktaraf & Rekonstruksi Pasar Awam Berek 12',
    description: 'Pembinaan semula gerai penjaja moden, laluan pejalan kaki mesra OKU, sistem saliran perparitan berpusat, dan kawasan parkir kenderaan.',
    section: 'Projek & Kejuruteraan',
    leadStaffId: 'STF-003',
    leadStaffName: 'Ir. Mohd Faizal bin Che Omar',
    budget: 'RM 1,200,000.00',
    startDate: '2026-03-01',
    endDate: '2026-10-15',
    health: 'Bermasalah',
    overallProgress: 55,
    location: 'Berek 12, Bandar Tanah Merah',
    milestones: [
      { id: 'M1', title: 'Kelulusan Pelan Kejuruteraan & Ukur Aras', targetDate: '2026-04-10', status: 'Selesai', completedDate: '2026-04-15' },
      { id: 'M2', title: 'Sebut Harga & Perolehan Kontraktor', targetDate: '2026-05-30', status: 'Selesai', completedDate: '2026-06-10' },
      { id: 'M3', title: 'Pembersihan Tapak & Kerja Sub-Struktur', targetDate: '2026-07-15', status: 'Selesai', completedDate: '2026-07-22' },
      { id: 'M4', title: 'Kerja Bumbung & Kerangka Keluli', targetDate: '2026-08-20', status: 'Dalam Proses' },
      { id: 'M5', title: 'Pemasangan Elektrikal & Penyerahan Kunci', targetDate: '2026-10-10', status: 'Belum Mula' }
    ]
  },
  {
    id: 'PRJ-2026-03',
    code: 'MDTM-LND04',
    title: 'Projek Indah Bandar & Pembangunan Laman Dataran Tanah Merah',
    description: 'Pembangunan zon rekreasi keluarga, menara jam ikonik, pencahayaan LED taman, dan penanaman pokok hiasan tempatan.',
    section: 'Perancangan Bandar & Desa',
    leadStaffId: 'STF-005',
    leadStaffName: 'Encik Muhammad Hafiz bin Ismail',
    budget: 'RM 320,000.00',
    startDate: '2026-05-01',
    endDate: '2026-12-20',
    health: 'Mengikut Jadual',
    overallProgress: 40,
    location: 'Dataran Tanah Merah',
    milestones: [
      { id: 'M1', title: 'Rekabentuk Konsep Landskap & Kelulusan AJK', targetDate: '2026-06-01', status: 'Selesai', completedDate: '2026-05-28' },
      { id: 'M2', title: 'Penyediaan Tapak & Penanaman Pokok Utama', targetDate: '2026-08-10', status: 'Selesai', completedDate: '2026-08-08' },
      { id: 'M3', title: 'Pemasangan Menara Jam & Pencahayaan LED', targetDate: '2026-09-30', status: 'Dalam Proses' },
      { id: 'M4', title: 'Ujian Pencahayaan & Penyiapan Akhir', targetDate: '2026-12-01', status: 'Belum Mula' }
    ]
  }
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'NTF-001',
    title: 'Aduan Awam Kritikal Received',
    message: 'Surat Aduan No. MDTM/JPP/400-2/1(19) memerlukan tindakan siasatan segera dalam tempoh 3 hari.',
    type: 'urgent',
    timestamp: '10 minit yang lalu',
    read: false,
    linkedModule: 'letter',
    linkId: 'LTR-2026-004'
  },
  {
    id: 'NTF-002',
    title: 'Tempahan Kenderaan Aktif',
    message: 'Toyota Hilux (DDB 4490) sedang digunakan oleh Pn. Noraini untuk Lawatan Tapak di Mukim Kusial.',
    type: 'info',
    timestamp: '1 jam yang lalu',
    read: false,
    linkedModule: 'vehicle',
    linkId: 'VEH-002'
  },
  {
    id: 'NTF-003',
    title: 'Tarikh Akhir Tugasan Mendekati',
    message: 'Tugasan "Siasatan Tapak Aduan Binaan Haram" oleh Ir. Mohd Faizal mencapai tarikh akhir pada 12 Ogos 2026.',
    type: 'warning',
    timestamp: '3 jam yang lalu',
    read: true,
    linkedModule: 'task',
    linkId: 'TSK-2026-003'
  }
];

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { StaffMovementView } from './components/StaffMovementView';
import { VehicleView } from './components/VehicleView';
import { LetterView } from './components/LetterView';
import { TaskView } from './components/TaskView';
import { MilestonesView } from './components/MilestonesView';
import { DeadlinesView } from './components/DeadlinesView';
import { StaffDirectoryView } from './components/StaffDirectoryView';
import { PrintReportModal } from './components/PrintReportModal';
import { QuickActionModal } from './components/QuickActionModal';

const AppContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-800 font-sans flex flex-col antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Navigation Header */}
      <Header />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto">
        
        {/* Left Sidebar Navigation */}
        <Sidebar />

        {/* Center Main View Area */}
        <main id="main-content" className="flex-1 p-3 sm:p-4 lg:p-5 overflow-y-auto">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'movements' && <StaffMovementView />}
          {activeTab === 'vehicles' && <VehicleView />}
          {activeTab === 'letters' && <LetterView />}
          {activeTab === 'tasks' && <TaskView />}
          {activeTab === 'milestones' && <MilestonesView />}
          {activeTab === 'deadlines' && <DeadlinesView />}
          {activeTab === 'directory' && <StaffDirectoryView />}
        </main>

      </div>

      {/* Global Modals */}
      <PrintReportModal />
      <QuickActionModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

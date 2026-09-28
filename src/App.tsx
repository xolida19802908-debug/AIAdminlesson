import React, { useState } from 'react';
import { AppProvider, useApp, ViewType } from './context/AppContext';
import { Topbar } from './components/layout/Topbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { ToastContainer } from './components/common/Toast';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { AIAssistantDrawer } from './components/ai/AIAssistantDrawer';

// Modals
import { AddAppointmentModal } from './components/modals/AddAppointmentModal';
import { AddClientModal } from './components/modals/AddClientModal';
import { AddTransactionModal } from './components/modals/AddTransactionModal';
import { AddTaskModal } from './components/modals/AddTaskModal';
import { ClientProfileDrawer } from './components/modals/ClientProfileDrawer';

// Views
import { DashboardView } from './views/DashboardView';
import { AppointmentsView } from './views/AppointmentsView';
import { ClientsView } from './views/ClientsView';
import { ServicesView } from './views/ServicesView';
import { FinanceView } from './views/FinanceView';
import { AnalyticsView } from './views/AnalyticsView';
import { TasksView } from './views/TasksView';
import { NotificationsView } from './views/NotificationsView';
import { SettingsView } from './views/SettingsView';
import { LandingPage } from './views/LandingPage';
import { OnboardingWizard } from './views/OnboardingWizard';
import { AuthModal } from './views/AuthModal';

const AppContent: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    selectedClientId,
    setSelectedClientId,
  } = useApp();

  // Modals state
  const [isAddAppointmentOpen, setIsAddAppointmentOpen] = useState(false);
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // If on public landing page
  if (currentView === 'landing') {
    return (
      <>
        <LandingPage
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onOpenDemo={() => setCurrentView('dashboard')}
          onOpenOnboarding={() => setIsOnboardingOpen(true)}
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={() => setCurrentView('dashboard')}
        />
        {isOnboardingOpen && (
          <OnboardingWizard
            onComplete={() => {
              setIsOnboardingOpen(false);
              setCurrentView('dashboard');
            }}
          />
        )}
        <ToastContainer />
      </>
    );
  }

  // If user opened onboarding explicitly
  if (isOnboardingOpen) {
    return (
      <>
        <OnboardingWizard
          onComplete={() => {
            setIsOnboardingOpen(false);
            setCurrentView('dashboard');
          }}
        />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="flex min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 selection:bg-indigo-500/20 selection:text-indigo-600 transition-colors">
      {/* Collapsible Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar navigation */}
        <Topbar />

        {/* Dynamic View Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-20 md:pb-8">
          {currentView === 'dashboard' && (
            <DashboardView
              onOpenAddAppointment={() => setIsAddAppointmentOpen(true)}
              onOpenAddClient={() => setIsAddClientOpen(true)}
              onOpenAddTransaction={() => setIsAddTransactionOpen(true)}
            />
          )}

          {currentView === 'appointments' && (
            <AppointmentsView
              onOpenAddAppointment={() => setIsAddAppointmentOpen(true)}
            />
          )}

          {currentView === 'clients' && (
            <ClientsView
              onOpenAddClient={() => setIsAddClientOpen(true)}
              onOpenClientProfile={(id) => setSelectedClientId(id)}
            />
          )}

          {currentView === 'services' && <ServicesView />}

          {currentView === 'finance' && (
            <FinanceView
              onOpenAddTransaction={() => setIsAddTransactionOpen(true)}
            />
          )}

          {currentView === 'analytics' && <AnalyticsView />}

          {currentView === 'tasks' && (
            <TasksView onOpenAddTask={() => setIsAddTaskOpen(true)} />
          )}

          {currentView === 'notifications' && <NotificationsView />}

          {currentView === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Global AI Assistant Drawer */}
      <AIAssistantDrawer
        onOpenAddAppointment={() => setIsAddAppointmentOpen(true)}
        onOpenAddClient={() => setIsAddClientOpen(true)}
      />

      {/* Global Search / Command Palette (Ctrl+K) */}
      <GlobalSearchModal
        onOpenAddAppointment={() => setIsAddAppointmentOpen(true)}
        onOpenAddClient={() => setIsAddClientOpen(true)}
        onOpenAddTransaction={() => setIsAddTransactionOpen(true)}
      />

      {/* Modals & Drawers */}
      <AddAppointmentModal
        isOpen={isAddAppointmentOpen}
        onClose={() => setIsAddAppointmentOpen(false)}
      />

      <AddClientModal
        isOpen={isAddClientOpen}
        onClose={() => setIsAddClientOpen(false)}
      />

      <AddTransactionModal
        isOpen={isAddTransactionOpen}
        onClose={() => setIsAddTransactionOpen(false)}
      />

      <AddTaskModal
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
      />

      <ClientProfileDrawer
        clientId={selectedClientId}
        onClose={() => setSelectedClientId(undefined)}
        onBookAppointment={(cId) => {
          setSelectedClientId(undefined);
          setIsAddAppointmentOpen(true);
        }}
      />

      {/* Auth Modal for sign in / switch account */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => setCurrentView('dashboard')}
      />

      {/* Global Toast Alerts */}
      <ToastContainer />
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

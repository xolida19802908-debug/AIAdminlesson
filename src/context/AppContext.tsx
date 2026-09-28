import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  AIMessage,
  Appointment,
  AppointmentStatus,
  BusinessSettings,
  Client,
  CurrencyCode,
  LanguageCode,
  NotificationItem,
  PaymentStatus,
  ProfessionConfig,
  ProfessionId,
  Service,
  Task,
  ThemeMode,
  Transaction,
  AIInsight,
} from '../types';
import { PROFESSIONS } from '../data/professions';
import {
  initialAppointments,
  initialClients,
  initialInsights,
  initialNotifications,
  initialServices,
  initialSettings,
  initialTasks,
  initialTransactions,
  todayStr,
} from '../data/initialData';
import { aiService } from '../services/aiService';
import { formatCurrency } from '../utils/formatters';

export interface ToastMessage {
  id: string;
  title: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export type ViewType =
  | 'dashboard'
  | 'appointments'
  | 'clients'
  | 'services'
  | 'finance'
  | 'analytics'
  | 'tasks'
  | 'notifications'
  | 'settings'
  | 'landing';

interface AppContextType {
  // State
  settings: BusinessSettings;
  profession: ProfessionConfig;
  currentView: ViewType;
  clients: Client[];
  appointments: Appointment[];
  services: Service[];
  transactions: Transaction[];
  tasks: Task[];
  notifications: NotificationItem[];
  insights: AIInsight[];
  chatMessages: AIMessage[];
  isAIAssistantOpen: boolean;
  isGlobalSearchOpen: boolean;
  isAIThinking: boolean;
  activeClientFilter?: string;
  activeAppointmentFilter?: string;
  toasts: ToastMessage[];
  isAuthenticated: boolean;
  selectedClientId?: string;

  // Setters & Nav
  setCurrentView: (view: ViewType) => void;
  setIsAIAssistantOpen: (open: boolean) => void;
  setIsGlobalSearchOpen: (open: boolean) => void;
  setSelectedClientId: (id?: string) => void;
  setActiveClientFilter: (filter?: string) => void;
  setActiveAppointmentFilter: (filter?: string) => void;
  setProfession: (id: ProfessionId, resetServices?: boolean) => void;
  setTheme: (theme: ThemeMode) => void;
  setCurrency: (curr: CurrencyCode) => void;
  setLanguage: (lang: LanguageCode) => void;
  updateSettings: (newSettings: Partial<BusinessSettings>) => void;
  setIsAuthenticated: (auth: boolean) => void;

  // Actions
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'totalVisits' | 'totalSpent'>) => Client;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;

  addAppointment: (apt: Omit<Appointment, 'id'>) => Appointment;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  updatePaymentStatus: (id: string, paymentStatus: PaymentStatus) => void;
  rescheduleAppointment: (id: string, date: string, startTime: string, endTime: string) => void;
  cancelAppointment: (id: string) => void;

  addService: (service: Omit<Service, 'id'>) => Service;
  updateService: (id: string, updates: Partial<Service>) => void;
  deleteService: (id: string) => void;

  addTransaction: (tx: Omit<Transaction, 'id'>) => Transaction;
  deleteTransaction: (id: string) => void;

  addTask: (task: Omit<Task, 'id'>) => Task;
  toggleTaskStatus: (id: string) => void;
  deleteTask: (id: string) => void;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;

  dismissInsight: (id: string) => void;
  sendChatMessage: (text: string) => Promise<void>;
  handleAIQuickAction: (action: string, payload?: unknown) => void;
  showToast: (title: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  dismissToast: (id: string) => void;

  // Helpers
  formatMoney: (amount: number) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage or fallback
  const [settings, setSettings] = useState<BusinessSettings>(() => {
    try {
      const saved = localStorage.getItem('ai_admin_settings');
      return saved ? JSON.parse(saved) : initialSettings;
    } catch {
      return initialSettings;
    }
  });

  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState<boolean>(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState<boolean>(false);
  const [isAIThinking, setIsAIThinking] = useState<boolean>(false);
  const [selectedClientId, setSelectedClientId] = useState<string | undefined>();
  const [activeClientFilter, setActiveClientFilter] = useState<string | undefined>();
  const [activeAppointmentFilter, setActiveAppointmentFilter] = useState<string | undefined>();
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [clients, setClients] = useState<Client[]>(() => {
    try {
      const saved = localStorage.getItem('ai_admin_clients');
      return saved ? JSON.parse(saved) : initialClients;
    } catch {
      return initialClients;
    }
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem('ai_admin_apts');
      return saved ? JSON.parse(saved) : initialAppointments;
    } catch {
      return initialAppointments;
    }
  });

  const [services, setServices] = useState<Service[]>(() => {
    try {
      const saved = localStorage.getItem('ai_admin_services');
      return saved ? JSON.parse(saved) : initialServices;
    } catch {
      return initialServices;
    }
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('ai_admin_tx');
      return saved ? JSON.parse(saved) : initialTransactions;
    } catch {
      return initialTransactions;
    }
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('ai_admin_tasks');
      return saved ? JSON.parse(saved) : initialTasks;
    } catch {
      return initialTasks;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('ai_admin_notifs');
      return saved ? JSON.parse(saved) : initialNotifications;
    } catch {
      return initialNotifications;
    }
  });

  const [insights, setInsights] = useState<AIInsight[]>(() => {
    try {
      const saved = localStorage.getItem('ai_admin_insights');
      return saved ? JSON.parse(saved) : initialInsights;
    } catch {
      return initialInsights;
    }
  });

  const profession = useMemo(() => {
    return PROFESSIONS[settings.profession] || PROFESSIONS.barber;
  }, [settings.profession]);

  const [chatMessages, setChatMessages] = useState<AIMessage[]>([
    {
      id: 'ai-initial',
      sender: 'ai',
      text: `Good morning, ${settings.ownerName}! 👋\n\nI analyzed your business operations today:\n• 📅 **8 appointments today**\n• 💰 **720,000 UZS expected revenue**\n• ⚠️ **3 unconfirmed appointments**\n• 👥 **3 clients haven't returned in 30+ days**\n\nHow can I help you optimize your schedule and earnings today?`,
      timestamp: '09:00',
      quickActions: [
        { label: "Today's summary", action: 'ask_today_summary' },
        { label: 'Revenue analysis', action: 'ask_revenue' },
        { label: 'Find inactive clients', action: 'ask_inactive' },
        { label: 'Show unpaid invoices', action: 'ask_unpaid' },
        { label: 'Create appointment', action: 'open_add_appointment' },
      ],
    },
  ]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ai_admin_settings', JSON.stringify(settings));
    } catch {}
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem('ai_admin_clients', JSON.stringify(clients));
    } catch {}
  }, [clients]);

  useEffect(() => {
    try {
      localStorage.setItem('ai_admin_apts', JSON.stringify(appointments));
    } catch {}
  }, [appointments]);

  useEffect(() => {
    try {
      localStorage.setItem('ai_admin_services', JSON.stringify(services));
    } catch {}
  }, [services]);

  useEffect(() => {
    try {
      localStorage.setItem('ai_admin_tx', JSON.stringify(transactions));
    } catch {}
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem('ai_admin_tasks', JSON.stringify(tasks));
    } catch {}
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem('ai_admin_notifs', JSON.stringify(notifications));
    } catch {}
  }, [notifications]);

  // Apply theme class to document
  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      if (settings.theme === 'dark') {
        root.classList.add('dark');
      } else if (settings.theme === 'light') {
        root.classList.remove('dark');
      } else {
        // System
        if (mediaQuery.matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    };

    applyTheme();
    mediaQuery.addEventListener('change', applyTheme);
    return () => mediaQuery.removeEventListener('change', applyTheme);
  }, [settings.theme]);

  // Toast helper
  const showToast = (title: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, title, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Profession switcher
  const setProfession = (newProfId: ProfessionId, resetServices = false) => {
    const targetConfig = PROFESSIONS[newProfId] || PROFESSIONS.barber;
    setSettings((prev) => ({
      ...prev,
      profession: newProfId,
    }));

    if (resetServices) {
      const generatedServices: Service[] = targetConfig.defaultServices.map((ds, idx) => ({
        id: `srv-${newProfId}-${idx + 1}`,
        name: ds.name,
        price: ds.priceUZS,
        durationMinutes: ds.durationMinutes,
        category: ds.category,
        description: ds.description,
        active: true,
      }));
      setServices(generatedServices);
    }

    showToast(`Profession updated to ${targetConfig.name}`, 'info');
  };

  const setTheme = (theme: ThemeMode) => {
    setSettings((prev) => ({ ...prev, theme }));
    showToast(`Theme switched to ${theme}`, 'info');
  };

  const setCurrency = (currency: CurrencyCode) => {
    setSettings((prev) => ({ ...prev, currency }));
    showToast(`Currency set to ${currency}`, 'info');
  };

  const setLanguage = (language: LanguageCode) => {
    setSettings((prev) => ({ ...prev, language }));
    showToast(`Language set to ${language.toUpperCase()}`, 'info');
  };

  const updateSettings = (newSettings: Partial<BusinessSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Settings saved successfully', 'success');
  };

  // Client actions
  const addClient = (data: Omit<Client, 'id' | 'createdAt' | 'totalVisits' | 'totalSpent'>) => {
    const newClient: Client = {
      ...data,
      id: `cl-${Date.now()}`,
      createdAt: todayStr,
      totalVisits: 0,
      totalSpent: 0,
      outstandingBalance: data.outstandingBalance || 0,
      tags: data.tags || ['New Client'],
    };
    setClients((prev) => [newClient, ...prev]);
    showToast(`${profession.clientLabel.singular} "${newClient.name}" added`, 'success');
    return newClient;
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    showToast('Client profile updated', 'success');
  };

  const deleteClient = (id: string) => {
    const cl = clients.find((c) => c.id === id);
    setClients((prev) => prev.filter((c) => c.id !== id));
    showToast(`${cl?.name || 'Client'} removed`, 'info');
  };

  // Appointment actions
  const addAppointment = (aptData: Omit<Appointment, 'id'>) => {
    const newApt: Appointment = {
      ...aptData,
      id: `apt-${Date.now()}`,
    };
    setAppointments((prev) => [newApt, ...prev]);

    // If marked paid upon creation, record income transaction automatically
    if (newApt.paymentStatus === 'paid') {
      const newTx: Transaction = {
        id: `tx-${Date.now()}`,
        type: 'income',
        amount: newApt.price,
        category: newApt.serviceName,
        description: `${newApt.clientName} - ${newApt.serviceName}`,
        date: newApt.date,
        clientId: newApt.clientId,
        appointmentId: newApt.id,
      };
      setTransactions((prev) => [newTx, ...prev]);
    }

    showToast(
      `${profession.appointmentLabel.singular} booked for ${newApt.clientName} on ${newApt.date} at ${newApt.startTime}`,
      'success'
    );
    return newApt;
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          // If marked completed and was unpaid, check payment
          return { ...a, status };
        }
        return a;
      })
    );
    showToast(`Status updated to ${status.toUpperCase()}`, 'info');
  };

  const updatePaymentStatus = (id: string, paymentStatus: PaymentStatus) => {
    const apt = appointments.find((a) => a.id === id);
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, paymentStatus } : a))
    );

    if (paymentStatus === 'paid' && apt) {
      const newTx: Transaction = {
        id: `tx-${Date.now()}`,
        type: 'income',
        amount: apt.price,
        category: apt.serviceName,
        description: `Payment received: ${apt.clientName} - ${apt.serviceName}`,
        date: apt.date,
        clientId: apt.clientId,
        appointmentId: apt.id,
      };
      setTransactions((prev) => [newTx, ...prev]);
      showToast(`Payment of ${formatCurrency(apt.price, settings.currency)} recorded`, 'success');
    } else {
      showToast(`Payment marked as ${paymentStatus}`, 'info');
    }
  };

  const rescheduleAppointment = (id: string, date: string, startTime: string, endTime: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, date, startTime, endTime, status: 'confirmed' } : a))
    );
    showToast(`Rescheduled to ${date} at ${startTime}`, 'success');
  };

  const cancelAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a))
    );
    showToast('Appointment cancelled', 'warning');
  };

  // Service actions
  const addService = (data: Omit<Service, 'id'>) => {
    const newService: Service = {
      ...data,
      id: `srv-${Date.now()}`,
    };
    setServices((prev) => [...prev, newService]);
    showToast(`Service "${newService.name}" created`, 'success');
    return newService;
  };

  const updateService = (id: string, updates: Partial<Service>) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    showToast('Service details updated', 'success');
  };

  const deleteService = (id: string) => {
    const srv = services.find((s) => s.id === id);
    setServices((prev) => prev.filter((s) => s.id !== id));
    showToast(`Service "${srv?.name || ''}" removed`, 'info');
  };

  // Transactions
  const addTransaction = (txData: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...txData,
      id: `tx-${Date.now()}`,
    };
    setTransactions((prev) => [newTx, ...prev]);
    showToast(
      `${newTx.type === 'income' ? 'Income' : 'Expense'} of ${formatCurrency(newTx.amount, settings.currency)} added`,
      'success'
    );
    return newTx;
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    showToast('Transaction removed', 'info');
  };

  // Tasks
  const addTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: `tsk-${Date.now()}`,
    };
    setTasks((prev) => [newTask, ...prev]);
    showToast('Task created', 'success');
    return newTask;
  };

  const toggleTaskStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    showToast('Task removed', 'info');
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const dismissInsight = (id: string) => {
    setInsights((prev) => prev.filter((i) => i.id !== id));
  };

  // AI chat integration
  const sendChatMessage = async (text: string) => {
    const userMsg: AIMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsAIThinking(true);

    try {
      const response = await aiService.processUserMessage(text, {
        settings,
        profession,
        clients,
        appointments,
        services,
        transactions,
        todayStr,
      });

      setChatMessages((prev) => [...prev, response]);
    } catch {
      showToast('AI Administrator could not complete request', 'error');
    } finally {
      setIsAIThinking(false);
    }
  };

  const handleAIQuickAction = (action: string) => {
    if (action === 'ask_today_summary') {
      sendChatMessage('What appointments do I have today?');
    } else if (action === 'ask_revenue') {
      sendChatMessage('How much did I earn this month?');
    } else if (action === 'ask_inactive') {
      sendChatMessage('Show me clients who haven\'t returned for 30 days');
    } else if (action === 'ask_unpaid') {
      sendChatMessage('How much money is still unpaid?');
    } else if (action === 'navigate_appointments') {
      setCurrentView('appointments');
      setIsAIAssistantOpen(false);
    } else if (action === 'navigate_clients') {
      setCurrentView('clients');
      setIsAIAssistantOpen(false);
    } else if (action === 'navigate_finance') {
      setCurrentView('finance');
      setIsAIAssistantOpen(false);
    } else if (action === 'navigate_analytics') {
      setCurrentView('analytics');
      setIsAIAssistantOpen(false);
    } else if (action === 'navigate_tasks') {
      setCurrentView('tasks');
      setIsAIAssistantOpen(false);
    } else if (action === 'navigate_services') {
      setCurrentView('services');
      setIsAIAssistantOpen(false);
    } else if (action === 'filter_inactive_clients') {
      setActiveClientFilter('inactive');
      setCurrentView('clients');
      setIsAIAssistantOpen(false);
    } else if (action === 'filter_unpaid_clients') {
      setActiveClientFilter('unpaid');
      setCurrentView('clients');
      setIsAIAssistantOpen(false);
    } else if (action === 'filter_pending_appointments') {
      setActiveAppointmentFilter('pending');
      setCurrentView('appointments');
      setIsAIAssistantOpen(false);
    } else if (action === 'create_followup_task') {
      addTask({
        title: 'Reach out to inactive regular clients with VIP promo',
        dueDate: todayStr,
        priority: 'high',
        status: 'pending',
        category: 'follow-up',
        aiSuggested: true,
      });
      showToast('Follow-up task created in Tasks', 'success');
    }
  };

  const formatMoney = (amount: number) => {
    return formatCurrency(amount, settings.currency);
  };

  return (
    <AppContext.Provider
      value={{
        settings,
        profession,
        currentView,
        clients,
        appointments,
        services,
        transactions,
        tasks,
        notifications,
        insights,
        chatMessages,
        isAIAssistantOpen,
        isGlobalSearchOpen,
        isAIThinking,
        activeClientFilter,
        activeAppointmentFilter,
        toasts,
        isAuthenticated,
        selectedClientId,
        setCurrentView,
        setIsAIAssistantOpen,
        setIsGlobalSearchOpen,
        setSelectedClientId,
        setActiveClientFilter,
        setActiveAppointmentFilter,
        setProfession,
        setTheme,
        setCurrency,
        setLanguage,
        updateSettings,
        setIsAuthenticated,
        addClient,
        updateClient,
        deleteClient,
        addAppointment,
        updateAppointmentStatus,
        updatePaymentStatus,
        rescheduleAppointment,
        cancelAppointment,
        addService,
        updateService,
        deleteService,
        addTransaction,
        deleteTransaction,
        addTask,
        toggleTaskStatus,
        deleteTask,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        dismissInsight,
        sendChatMessage,
        handleAIQuickAction,
        showToast,
        dismissToast,
        formatMoney,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

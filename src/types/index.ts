export type ProfessionId =
  | 'barber'
  | 'beauty'
  | 'dentist'
  | 'doctor'
  | 'technician'
  | 'tutor'
  | 'photographer'
  | 'freelancer'
  | 'auto'
  | 'trainer'
  | 'cleaner'
  | 'consultant'
  | 'other';

export type CurrencyCode = 'UZS' | 'USD' | 'EUR' | 'RUB';
export type LanguageCode = 'uz' | 'en' | 'ru';
export type ThemeMode = 'light' | 'dark' | 'system';

export interface ProfessionConfig {
  id: ProfessionId;
  name: string;
  icon: string;
  clientLabel: { singular: string; plural: string };
  appointmentLabel: { singular: string; plural: string };
  serviceLabel: { singular: string; plural: string };
  metricsLabel: string;
  description: string;
  defaultServices: Array<{
    name: string;
    priceUZS: number;
    durationMinutes: number;
    category: string;
    description: string;
  }>;
  aiSuggestedFocus: string[];
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
  tags: string[];
  createdAt: string;
  lastVisit: string;
  totalVisits: number;
  totalSpent: number;
  outstandingBalance: number;
  avatar?: string;
  favoriteService?: string;
}

export type AppointmentStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled' | 'no-show';
export type PaymentStatus = 'paid' | 'unpaid' | 'partial';

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  serviceId: string;
  serviceName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  durationMinutes: number;
  price: number;
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  notes?: string;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  durationMinutes: number;
  category: string;
  description: string;
  active: boolean;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  clientId?: string;
  appointmentId?: string;
}

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed';
  category: 'follow-up' | 'call' | 'reminder' | 'supplies' | 'project' | 'other';
  aiSuggested?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'appointment' | 'warning' | 'payment' | 'milestone' | 'slot';
  read: boolean;
  timestamp: string;
  actionTarget?: string;
}

export interface AIInsight {
  id: string;
  type: 'opportunity' | 'warning' | 'trend' | 'client';
  title: string;
  description: string;
  actionText?: string;
  actionType?: 'view_clients' | 'send_reminder' | 'create_appointment' | 'view_analytics' | 'open_schedule';
}

export interface AIMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  quickActions?: Array<{ label: string; action: string; payload?: unknown }>;
  dataCard?: {
    type: 'summary' | 'clients' | 'revenue' | 'slots';
    title: string;
    items: Array<{ label: string; value: string; hint?: string }>;
  };
}

export interface BusinessSettings {
  ownerName: string;
  businessName: string;
  profession: ProfessionId;
  currency: CurrencyCode;
  language: LanguageCode;
  theme: ThemeMode;
  workingDays: string[];
  workingHoursStart: string;
  workingHoursEnd: string;
  slotDurationMinutes: number;
  aiTone: 'proactive' | 'concise' | 'detailed';
  notificationsEnabled: boolean;
}

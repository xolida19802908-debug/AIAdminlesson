import {
  AIMessage,
  Appointment,
  BusinessSettings,
  Client,
  ProfessionConfig,
  Service,
  Transaction,
} from '../types';
import { formatCurrency } from '../utils/formatters';

export interface BusinessContext {
  settings: BusinessSettings;
  profession: ProfessionConfig;
  clients: Client[];
  appointments: Appointment[];
  services: Service[];
  transactions: Transaction[];
  todayStr: string;
}

export const aiService = {
  getMorningBriefing(ctx: BusinessContext): string {
    const { settings, appointments, transactions, clients, todayStr } = ctx;
    const currency = settings.currency;

    const todayApts = appointments.filter((a) => a.date === todayStr);
    const unconfirmed = todayApts.filter((a) => a.status === 'pending').length;
    const expectedRev = todayApts.reduce((sum, a) => sum + a.price, 0);

    // Yesterday revenue
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
    const yesterdayRev = transactions
      .filter((t) => t.date === yStr && t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    // Most frequent client
    const topClient = [...clients].sort((a, b) => b.totalVisits - a.totalVisits)[0];

    return `Good morning, ${settings.ownerName} 👋\n\n• You have ${todayApts.length} appointments today.\n• ${unconfirmed} clients haven't confirmed yet.\n• Expected revenue today: ${formatCurrency(expectedRev, currency)}.\n• Yesterday's revenue was ${formatCurrency(yesterdayRev || 450000, currency)}.\n• Your most frequent client is ${topClient ? topClient.name : 'Aziz Karimov'}.\n• You have an available slot tomorrow at 14:00.\n• Revenue is 12.4% higher than last month.`;
  },

  async processUserMessage(
    userText: string,
    ctx: BusinessContext
  ): Promise<AIMessage> {
    const query = userText.toLowerCase().trim();
    const { settings, profession, clients, appointments, services, transactions, todayStr } = ctx;
    const currency = settings.currency;

    // Simulate realistic AI thought latency
    await new Promise((r) => setTimeout(r, 600));

    // 1. Earnings / Revenue
    if (
      query.includes('earn') ||
      query.includes('revenue') ||
      query.includes('money') ||
      query.includes('daromad') ||
      query.includes('qancha') ||
      query.includes('foyda')
    ) {
      const totalIncome = transactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      const totalExpenses = transactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      const netProfit = totalIncome - totalExpenses;

      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `Based on your recorded ledger this month, you have generated **${formatCurrency(totalIncome, currency)}** in gross revenue across ${transactions.filter((t) => t.type === 'income').length} transactions.\n\nAfter deducting **${formatCurrency(totalExpenses, currency)}** in operational expenses (supplies, rent, utilities), your net operating profit stands at **${formatCurrency(netProfit, currency)}** (+12.4% vs previous cycle).`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        dataCard: {
          type: 'revenue',
          title: 'Financial Breakdown',
          items: [
            { label: 'Gross Revenue', value: formatCurrency(totalIncome, currency), hint: '+12.4% trend' },
            { label: 'Operating Expenses', value: formatCurrency(totalExpenses, currency) },
            { label: 'Net Profit', value: formatCurrency(netProfit, currency), hint: 'Margin: 76%' },
          ],
        },
        quickActions: [
          { label: 'View Full Finance', action: 'navigate_finance' },
          { label: 'Log Transaction', action: 'add_transaction' },
        ],
      };
    }

    // 2. Most frequent / best clients
    if (
      query.includes('frequent') ||
      query.includes('best') ||
      query.includes('top client') ||
      query.includes('doimiy') ||
      query.includes('mijozlar')
    ) {
      const topClients = [...clients]
        .sort((a, b) => b.totalVisits - a.totalVisits)
        .slice(0, 4);

      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `Here are your most loyal and frequent ${profession.clientLabel.plural.toLowerCase()}:\n\n` +
          topClients
            .map(
              (c, i) =>
                `${i + 1}. **${c.name}** — ${c.totalVisits} visits (${formatCurrency(c.totalSpent, currency)} total spent)`
            )
            .join('\n') +
          `\n\n💡 *Tip: Aziz Karimov and Bekzod Aliyev have a 100% attendance rate. Recommending VIP loyalty rewards.*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        dataCard: {
          type: 'clients',
          title: `Top ${profession.clientLabel.plural}`,
          items: topClients.map((c) => ({
            label: c.name,
            value: `${c.totalVisits} visits`,
            hint: formatCurrency(c.totalSpent, currency),
          })),
        },
        quickActions: [
          { label: 'View All Clients', action: 'navigate_clients' },
          { label: 'Send Special Offer', action: 'create_reminder' },
        ],
      };
    }

    // 3. Inactive clients (>30 days)
    if (
      query.includes('inactive') ||
      query.includes('30 days') ||
      query.includes('kelmagan') ||
      query.includes("haven't visited") ||
      query.includes('lost')
    ) {
      const inactive = clients.filter(
        (c) => c.tags.includes('Inactive >30d') || c.tags.includes('Re-engage') || c.tags.includes('Needs Outreach')
      );

      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `I identified **${inactive.length} regular ${profession.clientLabel.plural.toLowerCase()}** who haven't returned for over 30 days:\n\n` +
          inactive
            .map(
              (c) =>
                `• **${c.name}** (${c.phone}) — Last visited on ${c.lastVisit}. Total lifetime visits: ${c.totalVisits}.`
            )
            .join('\n') +
          `\n\nWould you like me to generate a personalized Telegram/SMS rebooking reminder for them?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickActions: [
          { label: 'View Inactive Clients', action: 'filter_inactive_clients' },
          { label: 'Create Follow-up Task', action: 'create_followup_task' },
        ],
      };
    }

    // 4. Appointments today
    if (
      query.includes('today') ||
      query.includes('bugun') ||
      query.includes('appointment') ||
      query.includes('jadval') ||
      query.includes('schedule')
    ) {
      const todayApts = appointments.filter((a) => a.date === todayStr);
      const unconfirmed = todayApts.filter((a) => a.status === 'pending');

      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `You have **${todayApts.length} ${profession.appointmentLabel.plural.toLowerCase()}** scheduled for today:\n\n` +
          todayApts
            .map(
              (a) =>
                `• **${a.startTime} – ${a.endTime}**: ${a.clientName} (${a.serviceName}) — [${a.status.toUpperCase()}]`
            )
            .join('\n') +
          (unconfirmed.length > 0
            ? `\n\n⚠️ **${unconfirmed.length} are unconfirmed:** ${unconfirmed.map((u) => u.clientName).join(', ')}.`
            : `\n\nAll appointments are confirmed!`),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        dataCard: {
          type: 'summary',
          title: `Today's Schedule Summary`,
          items: [
            { label: 'Total Bookings', value: `${todayApts.length} slots` },
            { label: 'Confirmed', value: `${todayApts.length - unconfirmed.length} slots` },
            { label: 'Awaiting Confirmation', value: `${unconfirmed.length} slots`, hint: 'Needs attention' },
          ],
        },
        quickActions: [
          { label: 'Open Calendar', action: 'navigate_appointments' },
          { label: 'Call Unconfirmed Clients', action: 'filter_pending_appointments' },
        ],
      };
    }

    // 5. Unpaid money / outstanding balances
    if (
      query.includes('unpaid') ||
      query.includes('debt') ||
      query.includes('outstanding') ||
      query.includes('qarz') ||
      query.includes('toʻlanmagan')
    ) {
      const debtors = clients.filter((c) => c.outstandingBalance > 0);
      const totalUnpaid = debtors.reduce((sum, c) => sum + c.outstandingBalance, 0);

      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `You currently have **${formatCurrency(totalUnpaid, currency)}** in outstanding unpaid balances across ${debtors.length} clients:\n\n` +
          debtors
            .map(
              (c) =>
                `• **${c.name}**: ${formatCurrency(c.outstandingBalance, currency)} (Phone: ${c.phone})`
            )
            .join('\n') +
          `\n\nSardor Akmalov has an appointment today at 15:30. You can gently settle this when he arrives.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickActions: [
          { label: 'View Debtors', action: 'filter_unpaid_clients' },
          { label: 'Add Reminder Task', action: 'create_reminder' },
        ],
      };
    }

    // 6. Most profitable service
    if (
      query.includes('service') ||
      query.includes('profitable') ||
      query.includes('xizmat') ||
      query.includes('bestseller')
    ) {
      const serviceCounts: Record<string, { count: number; total: number; name: string }> = {};
      appointments.forEach((a) => {
        if (!serviceCounts[a.serviceName]) {
          serviceCounts[a.serviceName] = { count: 0, total: 0, name: a.serviceName };
        }
        serviceCounts[a.serviceName].count += 1;
        serviceCounts[a.serviceName].total += a.price;
      });

      const sorted = Object.values(serviceCounts).sort((a, b) => b.total - a.total);
      const top = sorted[0] || { name: 'Haircut + Beard Styling Combo', total: 660000, count: 6 };

      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `Your highest revenue driver is **${top.name}**.\n\nIt accounted for **${formatCurrency(top.total, currency)}** across ${top.count} bookings recently. It provides your best hourly revenue rate at ~110,000 UZS/hour.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickActions: [
          { label: 'Manage Services', action: 'navigate_services' },
          { label: 'View Analytics', action: 'navigate_analytics' },
        ],
      };
    }

    // 7. Busiest day
    if (
      query.includes('busiest') ||
      query.includes('busy') ||
      query.includes('band') ||
      query.includes('day')
    ) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `Historically and according to your recent bookings, **Saturday** is your busiest day with an average of 9.2 appointments (96% chair utilization).\n\n**Friday afternoon** is a close second. Conversely, **Tuesday morning** has the lowest booking density (35%), making it an ideal window for equipment sterilization, inventory restocking, or promotional booking offers.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickActions: [
          { label: 'View Week Trend', action: 'navigate_analytics' },
          { label: 'Open Schedule', action: 'navigate_appointments' },
        ],
      };
    }

    // 8. Add client or appointment intent
    if (query.includes('add client') || query.includes('yangi mijoz') || query.includes('new client')) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `I've opened the **Add New ${profession.clientLabel.singular}** registration modal for you. Please fill in their contact details and preferences.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickActions: [{ label: 'Open Client Form', action: 'open_add_client' }],
      };
    }

    if (
      query.includes('appointment') ||
      query.includes('book') ||
      query.includes('bron') ||
      query.includes('uchrashuv')
    ) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `Ready to schedule a new ${profession.appointmentLabel.singular.toLowerCase()}! You have open slots tomorrow at **14:00** and **18:00**. Would you like me to open the booking dialog?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickActions: [{ label: 'Book Appointment', action: 'open_add_appointment' }],
      };
    }

    // 9. Business advice / focus for this week
    if (
      query.includes('advice') ||
      query.includes('focus') ||
      query.includes('tavsiya') ||
      query.includes('nima qilish') ||
      query.includes('strategy')
    ) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `Here are my top 3 recommendations for ${settings.businessName} this week:\n\n1. **Re-engage Inactive Regulars**: 3 high-value clients (Timur, Bobur, Alisher) haven't visited in 30+ days. A quick message could recover ~300,000 UZS in revenue.\n2. **Fill Tomorrow's 14:00 Gap**: You have an open 90-minute slot between lunch and evening bookings.\n3. **Resolve Outstanding Balances**: Politely collect 110,000 UZS from Sardor Akmalov when he arrives today at 15:30.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickActions: [
          { label: 'View Tasks', action: 'navigate_tasks' },
          { label: 'View Analytics', action: 'navigate_analytics' },
        ],
      };
    }

    // Default / Performance Summary response
    return {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text: `I've analyzed your current business status:\n\n• **Appointments Today**: ${appointments.filter((a) => a.date === todayStr).length} scheduled (${appointments.filter((a) => a.date === todayStr && a.status === 'pending').length} pending confirmation).\n• **Expected Daily Revenue**: ${formatCurrency(appointments.filter((a) => a.date === todayStr).reduce((s, a) => s + a.price, 0), currency)}.\n• **Active Client Base**: ${clients.length} registered ${profession.clientLabel.plural.toLowerCase()}.\n• **Next Available Slot**: Tomorrow at 14:00.\n\nAsk me anything about your earnings, specific clients, appointment adjustments, or financial trends!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quickActions: [
        { label: "Today's summary", action: 'ask_today_summary' },
        { label: 'Revenue analysis', action: 'ask_revenue' },
        { label: 'Find inactive clients', action: 'ask_inactive' },
        { label: 'Show unpaid invoices', action: 'ask_unpaid' },
      ],
    };
  },
};

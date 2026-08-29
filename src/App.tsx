import React, { useState, useEffect } from 'react';
import { PageId, Contact, ActivityLog, BatchItem, SystemSettings } from './types';
import {
  initialContacts,
  initialActivityLogs,
  initialBatchItems,
  defaultSettings,
} from './data/mockData';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { ContactsView } from './components/contacts/ContactsView';
import { BatchProcessingView } from './components/batch/BatchProcessingView';
import { SettingsView } from './components/settings/SettingsView';
import { ReportsView } from './components/reports/ReportsView';
import { SearchModal } from './components/modals/SearchModal';
import { HelpModal } from './components/modals/HelpModal';
import { ExportModal } from './components/modals/ExportModal';
import { ConfirmDialog } from './components/ui/ConfirmDialog';
import { ToastProvider, useToast } from './components/ui/Toast';
import { motion, AnimatePresence } from 'motion/react';

const AppContent: React.FC = () => {
  const { showToast } = useToast();

  // Navigation State
  const [activePage, setActivePage] = useState<PageId>('dashboard');

  // Application Data States
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [activities, setActivities] = useState<ActivityLog[]>(initialActivityLogs);
  const [batchItems, setBatchItems] = useState<BatchItem[]>(initialBatchItems);
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings);

  // Batch Processing State
  const [batchProgress, setBatchProgress] = useState(68);
  const [isBatchRunning, setIsBatchRunning] = useState(true);

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  // Keyboard shortcut listener (Ctrl+K / ⌘K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers for Contacts
  const handleAddContact = (newContactData: Omit<Contact, 'id' | 'createdAt'>) => {
    const newContact: Contact = {
      ...newContactData,
      id: `c-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setContacts((prev) => [newContact, ...prev]);

    // Log Activity
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      action: `افزودن مخاطب جدید (${newContact.name})`,
      user: { name: 'امیررضا هدایتی' },
      time: 'لحظاتی پیش',
      status: 'success',
      details: `شماره ${newContact.phone} در گروه ${newContact.group} ثبت شد.`,
    };
    setActivities((prev) => [newLog, ...prev]);
  };

  const handleUpdateContact = (updatedContact: Contact) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === updatedContact.id ? updatedContact : c))
    );

    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      action: `ویرایش اطلاعات مخاطب (${updatedContact.name})`,
      user: { name: 'امیررضا هدایتی' },
      time: 'هم‌اکنون',
      status: 'success',
    };
    setActivities((prev) => [newLog, ...prev]);
  };

  const handleDeleteContact = (id: string) => {
    const target = contacts.find((c) => c.id === id);
    setContacts((prev) => prev.filter((c) => c.id !== id));

    if (target) {
      const newLog: ActivityLog = {
        id: `log-${Date.now()}`,
        action: `حذف مخاطب (${target.name})`,
        user: { name: 'امیررضا هدایتی' },
        time: 'هم‌اکنون',
        status: 'failed',
      };
      setActivities((prev) => [newLog, ...prev]);
    }
  };

  const handleDeleteMultipleContacts = (ids: string[]) => {
    setContacts((prev) => prev.filter((c) => !ids.includes(c.id)));
  };

  const handleToggleBatch = () => {
    setIsBatchRunning((prev) => !prev);
    showToast({
      type: 'info',
      title: isBatchRunning ? 'پردازش موقتاً متوقف شد' : 'پردازش آغاز شد',
      message: isBatchRunning
        ? 'می‌توانید در هر زمان آن را از سر بگیرید.'
        : 'رکوردهای در صف پردازش قرار گرفتند.',
    });
  };

  const handleLogout = () => {
    setIsLogoutConfirmOpen(false);
    showToast({
      type: 'info',
      title: 'خروج از حساب کاربری',
      message: 'نشست کاری شما با موفقیت بسته شد.',
    });
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-[#191c21] font-sans antialiased selection:bg-[#00488d] selection:text-white" dir="rtl">
      {/* Fixed Sidebar */}
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        onOpenAddModal={() => {
          setActivePage('contacts');
        }}
        onLogoutClick={() => setIsLogoutConfirmOpen(true)}
        totalContactsCount={contacts.length}
        batchProcessingActive={isBatchRunning}
      />

      {/* Fixed Header */}
      <Header
        activePage={activePage}
        onNavigate={setActivePage}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onLogoutClick={() => setIsLogoutConfirmOpen(true)}
      />

      {/* Main Page Content Area */}
      <main className="mr-[260px] pt-16 min-h-screen p-6 md:p-8 transition-all">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              {activePage === 'dashboard' && (
                <DashboardView
                  onNavigate={setActivePage}
                  activities={activities.slice(0, 6)}
                  totalContacts={contacts.length + 124445}
                  batchProgress={batchProgress}
                  isBatchRunning={isBatchRunning}
                  onToggleBatch={handleToggleBatch}
                />
              )}

              {activePage === 'contacts' && (
                <ContactsView
                  contacts={contacts}
                  onAddContact={handleAddContact}
                  onUpdateContact={handleUpdateContact}
                  onDeleteContact={handleDeleteContact}
                  onDeleteMultiple={handleDeleteMultipleContacts}
                />
              )}

              {activePage === 'batch' && (
                <BatchProcessingView
                  batchItems={batchItems}
                  onUpdateBatchItems={setBatchItems}
                />
              )}

              {activePage === 'settings' && (
                <SettingsView
                  settings={settings}
                  onSaveSettings={setSettings}
                />
              )}

              {activePage === 'reports' && (
                <ReportsView activities={activities} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Global Modals & Dialogs */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={setActivePage}
        contacts={contacts}
      />

      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />

      <ConfirmDialog
        isOpen={isLogoutConfirmOpen}
        onClose={() => setIsLogoutConfirmOpen(false)}
        onConfirm={handleLogout}
        title="خروج از سامانه"
        message="آیا برای خروج از حساب کاربری اطمینان دارید؟ تغییرات ذخیره‌نشده ممکن است از دست بروند."
        confirmLabel="خروج نهایی"
        variant="danger"
      />
    </div>
  );
};

export function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { Search, Users, LayoutDashboard, Layers, Settings, BarChart3, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PageId, Contact } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: PageId) => void;
  contacts: Contact[];
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  contacts,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // Handled in parent
      }
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickPages = [
    { id: 'dashboard' as PageId, name: 'داشبورد خلاصه وضعیت', icon: LayoutDashboard },
    { id: 'contacts' as PageId, name: 'مدیریت مخاطبین', icon: Users },
    { id: 'batch' as PageId, name: 'پردازش دسته‌ای ۱۰۰ نفره', icon: Layers },
    { id: 'settings' as PageId, name: 'تنظیمات و امنیت سیستم', icon: Settings },
    { id: 'reports' as PageId, name: 'گزارش‌ها و لاگ‌ها', icon: BarChart3 },
  ];

  const filteredPages = quickPages.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  const filteredContacts = contacts
    .filter(
      (c) =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.phone.includes(query) ||
        (c.email && c.email.toLowerCase().includes(query.toLowerCase()))
    )
    .slice(0, 5);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl border border-[#cbd5e1] overflow-hidden z-10">
        {/* Search Bar Input */}
        <div className="flex items-center px-4 border-b border-[#e2e8f0]">
          <Search className="w-5 h-5 text-[#727783] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجو در تمام بخش‌ها، مخاطبین و تنظیمات..."
            className="w-full h-14 px-3 text-sm text-[#191c21] outline-none placeholder:text-[#727783]"
          />
          <button
            onClick={onClose}
            className="p-1 rounded text-[#727783] hover:text-[#191c21]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-3 max-h-96 overflow-y-auto space-y-4">
          {/* Pages */}
          {filteredPages.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-[#727783] px-3 mb-1">
                صفحات و بخش‌ها
              </p>
              <div className="space-y-1">
                {filteredPages.map((page) => {
                  const Icon = page.icon;
                  return (
                    <button
                      key={page.id}
                      onClick={() => {
                        onNavigate(page.id);
                        onClose();
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-[#191c21] hover:bg-[#f1f5f9] hover:text-[#00488d] transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-[#727783]" />
                        <span>{page.name}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[#cbd5e1]" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Contacts */}
          {filteredContacts.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-[#727783] px-3 mb-1">
                مخاطبین
              </p>
              <div className="space-y-1">
                {filteredContacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => {
                      onNavigate('contacts');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-[#191c21] hover:bg-[#f1f5f9] transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-[#d6e3ff] text-[#00488d] text-[10px] flex items-center justify-center font-bold">
                        {contact.initials}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#191c21]">{contact.name}</p>
                        <p className="text-[10px] text-[#727783] font-mono" dir="ltr">
                          {contact.phone}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-[#505f76]">
                      {contact.group}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredPages.length === 0 && filteredContacts.length === 0 && (
            <div className="py-8 text-center text-xs text-[#727783]">
              موردی مطابق با جستجوی شما یافت نشد.
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-[#f8fafc] border-t border-[#e2e8f0] flex items-center justify-between text-[11px] text-[#727783]">
          <span>جهت انتخاب از کلیدهای جهت‌نما یا کلیک استفاده کنید</span>
          <kbd className="bg-white px-1.5 py-0.5 rounded border border-[#cbd5e1]">ESC</kbd>
        </div>
      </div>
    </div>
  );
};

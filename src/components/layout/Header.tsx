import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, HelpCircle, Download, Check, AlertTriangle, Info, Clock, LogOut, Settings, User } from 'lucide-react';
import { PageId } from '../../types';
import { Button } from '../ui/Button';

interface HeaderProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  onOpenHelp: () => void;
  onOpenExport: () => void;
  onOpenSearch: () => void;
  onLogoutClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activePage,
  onNavigate,
  onOpenHelp,
  onOpenExport,
  onOpenSearch,
  onLogoutClick,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const notifications = [
    {
      id: 1,
      title: 'پردازش دسته‌ای تکمیل شد',
      desc: '۸۵ مخاطب با موفقیت در سیستم ثبت شدند.',
      time: '۵ دقیقه پیش',
      type: 'success',
      read: false,
    },
    {
      id: 2,
      title: 'هشدار محدودیت سامانه پیامک',
      desc: 'اعتبار پیامک باقی‌مانده کمتر از ۱,۰۰۰ پیام است.',
      time: '۴۵ دقیقه پیش',
      type: 'warning',
      read: false,
    },
    {
      id: 3,
      title: 'تهیه نسخه پشتیبان ابری',
      desc: 'بکاپ روزانه دیتابیس با موفقیت ثبت شد.',
      time: 'دیروز ۲۱:۰۰',
      type: 'info',
      read: true,
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-[260px] h-16 bg-white border-b border-[#e2e8f0] shadow-xs z-30 flex items-center justify-between px-6 transition-all duration-200">
      {/* Right Side in RTL (Brand Title + Search Input) */}
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-black text-[#00488d] tracking-tight">
          سامانه مدیریت فارسی
        </h1>

        {/* Global Search Bar */}
        <div
          onClick={onOpenSearch}
          className="relative hidden sm:flex items-center cursor-pointer group"
        >
          <Search className="w-4 h-4 text-[#727783] absolute right-3 pointer-events-none group-hover:text-[#00488d] transition-colors" />
          <input
            type="text"
            readOnly
            placeholder="جستجوی سریع مخاطبین، گزارش‌ها... (Ctrl+K)"
            className="h-9 pr-9 pl-12 bg-[#f1f5f9] hover:bg-[#e2e8f0]/80 rounded-lg text-xs text-[#191c21] w-64 md:w-80 cursor-pointer border border-transparent focus:outline-none transition-all placeholder:text-[#727783]"
          />
          <kbd className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] bg-white border border-[#cbd5e1] rounded px-1.5 py-0.5 text-[#505f76] font-mono">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Left Side in RTL (Actions, Notifications, User) */}
      <div className="flex items-center gap-3">
        {/* Help Button */}
        <button
          onClick={onOpenHelp}
          className="text-xs font-medium text-[#505f76] hover:text-[#00488d] hover:bg-[#f1f5f9] px-2.5 py-1.5 rounded-md transition-colors flex items-center gap-1.5"
        >
          <HelpCircle className="w-4 h-4 text-[#727783]" />
          <span className="hidden sm:inline">راهنما</span>
        </button>

        {/* Export CTA Button */}
        <Button
          variant="primary"
          size="sm"
          onClick={onOpenExport}
          icon={<Download className="w-3.5 h-3.5" />}
          className="rounded-lg shadow-xs"
        >
          ثبت خروجی
        </Button>

        <div className="h-5 w-px bg-[#e2e8f0] mx-1" />

        {/* Notification Bell Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-[#505f76] hover:text-[#00488d] hover:bg-[#f1f5f9] rounded-lg transition-colors"
            title="اعلان‌ها"
            aria-label="اعلان‌ها"
          >
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ba1a1a] rounded-full ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-[#e2e8f0] p-0 overflow-hidden z-50 text-right">
              <div className="px-4 py-3 bg-[#f8fafc] border-b border-[#e2e8f0] flex items-center justify-between">
                <span className="text-xs font-bold text-[#191c21]">مرکز اعلان‌ها</span>
                <span className="text-[10px] bg-[#d6e3ff] text-[#00488d] px-2 py-0.5 rounded-full font-medium">
                  ۲ خوانده نشده
                </span>
              </div>
              <div className="divide-y divide-[#f1f5f9] max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3.5 hover:bg-[#f8fafc] transition-colors cursor-pointer ${
                      !n.read ? 'bg-blue-50/30' : ''
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      {n.type === 'success' && (
                        <Check className="w-4 h-4 text-[#137333] shrink-0 mt-0.5" />
                      )}
                      {n.type === 'warning' && (
                        <AlertTriangle className="w-4 h-4 text-[#d97706] shrink-0 mt-0.5" />
                      )}
                      {n.type === 'info' && (
                        <Info className="w-4 h-4 text-[#00488d] shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-[#191c21]">{n.title}</p>
                        <p className="text-[11px] text-[#505f76] mt-0.5 leading-relaxed">{n.desc}</p>
                        <span className="text-[10px] text-[#727783] flex items-center gap-1 mt-1.5">
                          <Clock className="w-3 h-3" />
                          {n.time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t border-[#e2e8f0] bg-[#f8fafc] text-center">
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-[#00488d] font-medium hover:underline"
                >
                  علامت‌گذاری همه به عنوان خوانده‌شده
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar & Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-[#f1f5f9] transition-colors"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwlzc-WdSyB6-en5R1FHQpLGEq6_PiI2EYZkxAVx7EYGV_Nj-Q5Udosk9kTNaVW0Z5NNCQH-zT1F6YZ5XUAihSgZGQ_okFcSzd_NCp-dH8enop8vaQ0opw5zJnI78Nd0DUcTOF-CC0HE7HoYqf55zDrbybnQUj1qzWgmPsaeL1lvcBgbOt7LGRQBGNdHgHSGohx3dVIE0xQoRkGRjZk1p_quqLqm_btVU1fwmKkSlWnT5cYL6369R_"
              alt="مدیر سیستم"
              className="w-8 h-8 rounded-full object-cover border border-[#cbd5e1]"
            />
          </button>

          {showUserMenu && (
            <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-[#e2e8f0] py-1.5 overflow-hidden z-50 text-right">
              <div className="px-4 py-2.5 border-b border-[#e2e8f0] bg-[#f8fafc]">
                <p className="text-xs font-bold text-[#191c21]">امیررضا هدایتی</p>
                <p className="text-[11px] text-[#505f76] mt-0.5">مدیر ارشد سامانه</p>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    onNavigate('settings');
                    setShowUserMenu(false);
                  }}
                  className="w-full text-right px-4 py-2 text-xs text-[#505f76] hover:bg-[#f1f5f9] hover:text-[#00488d] flex items-center gap-2"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>تنظیمات حساب کاربری</span>
                </button>
                <button
                  onClick={() => {
                    onOpenHelp();
                    setShowUserMenu(false);
                  }}
                  className="w-full text-right px-4 py-2 text-xs text-[#505f76] hover:bg-[#f1f5f9] hover:text-[#00488d] flex items-center gap-2"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>راهنمای دسترسی‌ها</span>
                </button>
              </div>
              <div className="border-t border-[#e2e8f0] pt-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onLogoutClick();
                  }}
                  className="w-full text-right px-4 py-2 text-xs text-[#ba1a1a] hover:bg-rose-50 flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>خروج از حساب</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

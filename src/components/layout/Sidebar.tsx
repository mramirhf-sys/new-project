import React from 'react';
import {
  LayoutDashboard,
  Users,
  Layers,
  Settings,
  BarChart3,
  Plus,
  LogOut,
  Building2,
} from 'lucide-react';
import { PageId } from '../../types';

interface SidebarProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  onOpenAddModal: () => void;
  onLogoutClick: () => void;
  totalContactsCount: number;
  batchProcessingActive: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onNavigate,
  onOpenAddModal,
  onLogoutClick,
  totalContactsCount,
  batchProcessingActive,
}) => {
  const menuItems = [
    {
      id: 'dashboard' as PageId,
      label: 'داشبورد',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'contacts' as PageId,
      label: 'مدیریت مخاطبین',
      icon: Users,
      badge: totalContactsCount > 0 ? totalContactsCount.toLocaleString('fa-IR') : null,
    },
    {
      id: 'batch' as PageId,
      label: 'پردازش دسته‌ای',
      icon: Layers,
      badge: batchProcessingActive ? 'در حال اجرا' : null,
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'settings' as PageId,
      label: 'تنظیمات سیستم',
      icon: Settings,
      badge: null,
    },
    {
      id: 'reports' as PageId,
      label: 'گزارش‌ها',
      icon: BarChart3,
      badge: null,
    },
  ];

  return (
    <aside
      className="fixed top-0 right-0 h-screen w-[260px] bg-white border-l border-[#e2e8f0] flex flex-col py-6 z-40 select-none shadow-xs"
      aria-label="منوی اصلی"
    >
      {/* Brand Header */}
      <div className="px-6 mb-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#00488d] text-white flex items-center justify-center shadow-xs">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#00488d] leading-tight">
              سیستم مدیریت مرکزی
            </h2>
            <p className="text-[11px] text-[#505f76] mt-0.5 font-medium">
              نسخه سازمانی ۱.۰
            </p>
          </div>
        </div>

        {/* Primary CTA Button */}
        <button
          onClick={onOpenAddModal}
          className="w-full h-10 bg-[#00488d] text-white rounded-lg hover:bg-[#00386d] active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2 text-xs font-semibold shadow-xs ring-1 ring-inset ring-[#00488d]/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>افزودن مورد جدید</span>
        </button>
      </div>

      {/* Nav Menu Items */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer group ${
                isActive
                  ? 'bg-[#d6e3ff] text-[#00488d] font-bold border-r-4 border-[#00488d] shadow-xs'
                  : 'text-[#505f76] hover:bg-[#f1f5f9] hover:text-[#191c21] border-r-4 border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4.5 h-4.5 transition-colors ${
                    isActive
                      ? 'text-[#00488d]'
                      : 'text-[#727783] group-hover:text-[#00488d]'
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    item.badgeColor || 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="px-3 mt-auto pt-4 border-t border-[#e2e8f0]">
        <button
          onClick={onLogoutClick}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium text-[#ba1a1a] hover:bg-rose-50 transition-colors cursor-pointer group"
        >
          <LogOut className="w-4.5 h-4.5 text-[#ba1a1a] group-hover:-translate-x-0.5 transition-transform" />
          <span>خروج از سامانه</span>
        </button>
      </div>
    </aside>
  );
};

import React, { useState } from 'react';
import {
  BarChart3,
  Calendar,
  Download,
  FileSpreadsheet,
  FileText,
  Filter,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Users,
  Search,
} from 'lucide-react';
import { ActivityLog } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';

interface ReportsViewProps {
  activities: ActivityLog[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ activities }) => {
  const { showToast } = useToast();
  const [timeRange, setTimeRange] = useState<'today' | '7days' | '30days' | 'year'>('7days');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = activities.filter((act) => {
    const matchesSearch =
      act.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || act.status === filterType;
    return matchesSearch && matchesType;
  });

  const handleDownloadReport = (format: 'pdf' | 'excel' | 'csv') => {
    showToast({
      type: 'success',
      title: `گزارش ${format.toUpperCase()} ایجاد شد`,
      message: 'فایل خلاصه گزارش با موفقیت دانلود شد.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-xs">
        <div>
          <h2 className="text-2xl font-bold text-[#191c21]">گزارش‌ها و لاگ‌های سیستمی</h2>
          <p className="text-sm text-[#505f76] mt-1">
            بررسی جامع عملکرد سیستم، آمار پردازش‌ها و رخدادهای امنیتی
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="md"
            onClick={() => handleDownloadReport('excel')}
            icon={<FileSpreadsheet className="w-4 h-4 text-[#137333]" />}
          >
            خروجی اکسل
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={() => handleDownloadReport('pdf')}
            icon={<Download className="w-4 h-4" />}
          >
            دریافت گزارش جامع (PDF)
          </Button>
        </div>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#505f76]">تعداد کل پردازش‌ها</span>
            <span className="text-xs font-bold text-[#137333] bg-emerald-50 px-2 py-0.5 rounded-full">
              +۱۸٪ این ماه
            </span>
          </div>
          <p className="text-2xl font-bold text-[#191c21] font-mono">۲,۴۵۰</p>
          <p className="text-[11px] text-[#727783] mt-1">شامل دسته‌های ۱۰۰ و ۵۰۰ نفره</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#505f76]">میانگین زمان اجرای هر دسته</span>
            <span className="text-xs font-bold text-[#00488d] bg-blue-50 px-2 py-0.5 rounded-full">
              بهینه
            </span>
          </div>
          <p className="text-2xl font-bold text-[#191c21] font-mono">۳.۸ ثانیه</p>
          <p className="text-[11px] text-[#727783] mt-1">به ازای هر ۱۰۰ رکورد با تاییدیه دوطرفه</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#505f76]">ضریب سلامت سرورها</span>
            <span className="text-xs font-bold text-[#137333] bg-emerald-50 px-2 py-0.5 rounded-full">
              ۹۹.۹٪ Uptime
            </span>
          </div>
          <p className="text-2xl font-bold text-[#191c21] font-mono">۱۰۰٪</p>
          <p className="text-[11px] text-[#727783] mt-1">بدون قطعی در ۳۰ روز گذشته</p>
        </div>
      </div>

      {/* Filter Toolbar & Detailed Logs Table */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-xs overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#e2e8f0] bg-[#f8fafc] flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-[#727783] absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="جستجو در لاگ‌ها..."
                className="h-9 pr-9 pl-3 bg-white border border-[#cbd5e1] rounded-lg text-xs text-[#191c21] focus:ring-2 focus:ring-[#00488d] outline-none w-56"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="h-9 pr-3 pl-8 bg-white border border-[#cbd5e1] rounded-lg text-xs text-[#505f76] font-medium outline-none focus:ring-2 focus:ring-[#00488d]"
            >
              <option value="all">همه وضعیت‌ها</option>
              <option value="success">فقط موفق‌ها</option>
              <option value="failed">فقط خطاها</option>
            </select>
          </div>

          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-[#cbd5e1] text-xs">
            <button
              onClick={() => setTimeRange('today')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                timeRange === 'today' ? 'bg-[#00488d] text-white font-bold' : 'text-[#505f76]'
              }`}
            >
              امروز
            </button>
            <button
              onClick={() => setTimeRange('7days')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                timeRange === '7days' ? 'bg-[#00488d] text-white font-bold' : 'text-[#505f76]'
              }`}
            >
              ۷ روز گذشته
            </button>
            <button
              onClick={() => setTimeRange('30days')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                timeRange === '30days' ? 'bg-[#00488d] text-white font-bold' : 'text-[#505f76]'
              }`}
            >
              ۳۰ روز گذشته
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-[#f1f5f9] text-xs font-semibold text-[#505f76] border-b border-[#e2e8f0]">
              <tr>
                <th className="py-3 px-6">عنوان رخداد و عملیات</th>
                <th className="py-3 px-6">مجری</th>
                <th className="py-3 px-6">جزئیات فنی</th>
                <th className="py-3 px-6">زمان</th>
                <th className="py-3 px-6">وضعیت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] text-xs text-[#191c21]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#f0f9ff] transition-colors h-14">
                  <td className="py-3 px-6 font-semibold text-[#191c21]">{log.action}</td>
                  <td className="py-3 px-6 text-[#505f76]">{log.user.name}</td>
                  <td className="py-3 px-6 text-[#727783]">{log.details || 'تکمیل بدون خطا'}</td>
                  <td className="py-3 px-6 text-[#505f76] whitespace-nowrap">{log.time}</td>
                  <td className="py-3 px-6">
                    <Badge status={log.status} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

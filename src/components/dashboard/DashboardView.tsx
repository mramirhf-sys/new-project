import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  History,
  RefreshCw,
  Clock,
  ArrowUpRight,
  Pause,
  Play,
  Layers,
} from 'lucide-react';
import { ActivityLog, PageId } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface DashboardViewProps {
  onNavigate: (page: PageId) => void;
  activities: ActivityLog[];
  totalContacts: number;
  batchProgress: number;
  isBatchRunning: boolean;
  onToggleBatch: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  activities,
  totalContacts,
  batchProgress,
  isBatchRunning,
  onToggleBatch,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdatedText, setLastUpdatedText] = useState('هم‌اکنون');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdatedText('چند ثانیه پیش');
    }, 600);
  };

  // Circular progress calculations for SVG
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (batchProgress / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-xs">
        <div>
          <h2 className="text-2xl font-bold text-[#191c21]">داشبورد خلاصه وضعیت</h2>
          <p className="text-sm text-[#505f76] mt-1">
            مروری بر عملکرد سیستم و وظایف جاری در ۲۴ ساعت گذشته.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-[#505f76] flex items-center gap-1.5 bg-[#f8fafc] px-3 py-1.5 rounded-lg border border-[#e2e8f0]">
            <Clock className="w-3.5 h-3.5 text-[#727783]" />
            <span>آخرین بروزرسانی: {lastUpdatedText}</span>
          </span>

          <button
            onClick={handleRefresh}
            title="بروزرسانی داده‌ها"
            className="p-2 rounded-lg border border-[#e2e8f0] hover:bg-[#f1f5f9] text-[#00488d] transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 4 Bento Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Contacts */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 shadow-xs relative overflow-hidden group hover:border-[#00488d] transition-all">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#00488d]" />
          <div className="flex justify-between items-start mb-3">
            <div className="w-11 h-11 rounded-lg bg-[#00488d] text-white flex items-center justify-center shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold bg-[#e6f4ea] text-[#137333] px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3" />
              ۱۲٪+
            </span>
          </div>
          <div>
            <h3 className="text-xs font-medium text-[#505f76] mb-1">کل مخاطبین سامانه</h3>
            <p className="text-2xl font-bold text-[#191c21] tracking-tight">
              {totalContacts.toLocaleString('fa-IR')}
            </p>
          </div>
        </div>

        {/* Card 2: Success Rate */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 shadow-xs relative overflow-hidden group hover:border-[#137333] transition-all">
          <div className="flex justify-between items-start mb-3">
            <div className="w-11 h-11 rounded-lg bg-[#e6f4ea] text-[#137333] flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold bg-[#e6f4ea] text-[#137333] px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3" />
              ۳.۵٪+
            </span>
          </div>
          <div>
            <h3 className="text-xs font-medium text-[#505f76] mb-1">نرخ موفقیت عملیات</h3>
            <p className="text-2xl font-bold text-[#191c21] tracking-tight">۹۸.۲٪</p>
          </div>
        </div>

        {/* Card 3: Failed Tasks */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 shadow-xs relative overflow-hidden group hover:border-[#ba1a1a] transition-all">
          <div className="flex justify-between items-start mb-3">
            <div className="w-11 h-11 rounded-lg bg-[#fee2e2] text-[#991b1b] flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold bg-[#fee2e2] text-[#991b1b] px-2 py-0.5 rounded-full">
              <TrendingDown className="w-3 h-3" />
              ۱.۲٪-
            </span>
          </div>
          <div>
            <h3 className="text-xs font-medium text-[#505f76] mb-1">وظایف ناموفق</h3>
            <p className="text-2xl font-bold text-[#191c21] tracking-tight">۴۳</p>
          </div>
        </div>

        {/* Card 4: System Health */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 shadow-xs relative overflow-hidden group hover:border-[#00488d] transition-all bg-gradient-to-br from-white to-[#f8fafc]">
          <div className="flex justify-between items-start mb-3">
            <div className="w-11 h-11 rounded-lg bg-[#d0e1fb] text-[#00488d] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold bg-[#e2e8f0] text-[#334155] px-2 py-0.5 rounded-full">
              پایدار
            </span>
          </div>
          <div>
            <h3 className="text-xs font-medium text-[#505f76] mb-1">سلامت و پایداری سیستم</h3>
            <p className="text-2xl font-bold text-[#191c21] tracking-tight">عالی</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid (Recent Activity 2-cols + Batch Processing 1-col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left in RTL: Recent Activities (Spans 2 columns) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#e2e8f0] shadow-xs flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-[#e2e8f0] bg-[#f8fafc] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <History className="w-4.5 h-4.5 text-[#00488d]" />
              <h3 className="text-base font-bold text-[#191c21]">خلاصه فعالیت‌های اخیر</h3>
            </div>
            <button
              onClick={() => onNavigate('reports')}
              className="text-xs font-semibold text-[#00488d] hover:underline flex items-center gap-1"
            >
              <span>مشاهده همه لاگ‌ها</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-right">
              <thead className="bg-[#f1f5f9] text-xs font-semibold text-[#505f76] border-b border-[#e2e8f0]">
                <tr>
                  <th className="py-3 px-6">عملیات</th>
                  <th className="py-3 px-6">کاربر / مجری</th>
                  <th className="py-3 px-6">زمان ثبت</th>
                  <th className="py-3 px-6">وضعیت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9] text-xs text-[#191c21]">
                {activities.map((act) => (
                  <tr
                    key={act.id}
                    className="hover:bg-[#f0f9ff] transition-colors h-12"
                  >
                    <td className="py-3 px-6 font-medium text-[#191c21]">
                      {act.action}
                    </td>
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-2">
                        {act.user.avatar ? (
                          <img
                            src={act.user.avatar}
                            alt={act.user.name}
                            className="w-6 h-6 rounded-full object-cover border border-[#cbd5e1]"
                          />
                        ) : (
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              act.user.isSystem
                                ? 'bg-[#00488d] text-white'
                                : 'bg-[#e2e8f0] text-[#334155]'
                            }`}
                          >
                            {act.user.isSystem ? 'S' : act.user.name.charAt(0)}
                          </div>
                        )}
                        <span className="text-[#505f76]">{act.user.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-[#505f76] whitespace-nowrap">
                      {act.time}
                    </td>
                    <td className="py-3 px-6">
                      <Badge
                        status={
                          act.status === 'success'
                            ? 'success'
                            : act.status === 'failed'
                            ? 'failed'
                            : 'processing'
                        }
                        label={
                          act.status === 'success'
                            ? 'موفق'
                            : act.status === 'failed'
                            ? 'خطا'
                            : 'در حال پردازش'
                        }
                        size="sm"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right in RTL: Batch Processing Status (Spans 1 column) */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-[#e2e8f0] shadow-xs flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-[#e2e8f0] bg-[#f8fafc] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Layers className="w-4.5 h-4.5 text-[#00488d]" />
              <h3 className="text-base font-bold text-[#191c21]">وضعیت پردازش دسته‌ای</h3>
            </div>
            <button
              onClick={() => onNavigate('batch')}
              className="text-xs text-[#00488d] font-semibold hover:underline"
            >
              صفحه پردازش
            </button>
          </div>

          <div className="p-6 flex-1 flex flex-col items-center justify-center text-center">
            {/* Animated Circular Gauge */}
            <div className="relative w-36 h-36 mb-4 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                {/* Background track */}
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="8"
                />
                {/* Progress track */}
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="none"
                  stroke="#00488d"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-500 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-[#00488d] font-mono">
                  {batchProgress}٪
                </span>
                <span className="text-[11px] text-[#505f76] font-medium">
                  {isBatchRunning ? 'در حال انجام' : 'متوقف شده'}
                </span>
              </div>
            </div>

            <h4 className="text-sm font-bold text-[#191c21] mb-1">
              به‌روزرسانی ساختار داده
            </h4>
            <p className="text-xs text-[#505f76] mb-4">
              لطفاً تا پایان عملیات تب مرورگر را نبندید.
            </p>

            <div className="w-full bg-[#f1f5f9] rounded-lg p-3 flex items-center justify-between text-xs mb-4 border border-[#e2e8f0]">
              <span className="text-[#505f76] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#727783]" />
                زمان باقی‌مانده:
              </span>
              <span className="font-semibold text-[#191c21]">
                {isBatchRunning ? 'حدود ۴ دقیقه' : 'متوقف'}
              </span>
            </div>

            <Button
              variant={isBatchRunning ? 'secondary' : 'primary'}
              size="md"
              onClick={onToggleBatch}
              icon={isBatchRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              className="w-full"
            >
              {isBatchRunning ? 'توقف موقت عملیات' : 'ادامه پردازش'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

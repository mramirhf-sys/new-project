import React, { useState, useEffect, useRef } from 'react';
import {
  Layers,
  Play,
  Pause,
  RotateCcw,
  XCircle,
  Download,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Clock,
  UserCheck,
  ShieldAlert,
  Zap,
  Activity,
} from 'lucide-react';
import { BatchItem, BatchItemStatus } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { useToast } from '../ui/Toast';

interface BatchProcessingViewProps {
  batchItems: BatchItem[];
  onUpdateBatchItems: (items: BatchItem[]) => void;
}

export const BatchProcessingView: React.FC<BatchProcessingViewProps> = ({
  batchItems,
  onUpdateBatchItems,
}) => {
  const { showToast } = useToast();

  // Processing Simulation State
  const [isRunning, setIsRunning] = useState(true);
  const [progress, setProgress] = useState(85);
  const [totalCount] = useState(100);
  const [currentBatchNumber] = useState(1);
  const [speed, setSpeed] = useState<number>(1);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);

  // Live item simulation interval
  const timerRef = useRef<number | null>(null);

  // Compute stat breakdown from items or scaled numbers
  const stats = {
    total: 100,
    processing: isRunning ? 25 : 0,
    success: 60,
    failed: 5,
    alreadyMember: 10,
    rateLimited: 0,
  };

  useEffect(() => {
    if (isRunning && progress < 100) {
      timerRef.current = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsRunning(false);
            showToast({
              type: 'success',
              title: 'پردازش دسته ۱۰۰ نفره به اتمام رسید',
              message: 'تمام رکوردها بررسی و پردازش شدند.',
            });
            return 100;
          }
          return prev + 1;
        });
      }, 1500 / speed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, progress, speed, showToast]);

  const handleToggleRun = () => {
    setIsRunning(!isRunning);
    showToast({
      type: 'info',
      title: isRunning ? 'پردازش موقتاً متوقف شد' : 'پردازش از سر گرفته شد',
      message: isRunning ? 'عملیات در انتظار تایید شماست.' : 'ارسال درخواست‌ها ادامه دارد.',
    });
  };

  const handleResetBatch = () => {
    setProgress(0);
    setIsRunning(true);
    showToast({
      type: 'info',
      title: 'پردازش بازنشانی شد',
      message: 'شروع مجدد پردازش از اولین رکورد.',
    });
  };

  const handleCancelBatch = () => {
    setIsRunning(false);
    setIsCancelConfirmOpen(false);
    showToast({
      type: 'warning',
      title: 'پردازش دسته‌ای لغو شد',
      message: 'عملیات متوقف و رکوردهای در انتظار لغو شدند.',
    });
  };

  const handleRetryFailed = () => {
    showToast({
      type: 'info',
      title: 'تلاش مجدد برای رکوردهای ناموفق',
      message: 'تعداد ۵ رکورد خطادار مجدداً به صف پردازش منتقل شدند.',
    });
  };

  const handleExportLog = () => {
    const logData = [
      'شناسه,نام,شناسه کاربری,عملیات,وضعیت,زمان ثبت',
      ...batchItems.map(
        (item) =>
          `${item.id},"${item.name}","${item.identifier}","${item.action}","${item.status}","${item.updatedAt}"`
      ),
    ].join('\n');

    const blob = new Blob(['\uFEFF' + logData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `batch-processing-log-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    showToast({
      type: 'success',
      title: 'خروجی لاگ دانلود شد',
      message: 'فایل گزارش کامل پردازش ذخیره گردید.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-[#191c21]">پردازش دسته‌ای مخاطبین</h2>
            <span className="text-xs bg-[#d6e3ff] text-[#00488d] px-2.5 py-0.5 rounded-full font-bold">
              دسته جاری: شماره ۱ (از ۵)
            </span>
          </div>
          <p className="text-sm text-[#505f76] mt-1">
            در حال پردازش لیست ۱۰۰ نفره مخاطبین با تخصیص دسترسی و اعتبارسنجی خودکار...
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="danger"
            size="md"
            onClick={() => setIsCancelConfirmOpen(true)}
            icon={<XCircle className="w-4 h-4" />}
          >
            لغو
          </Button>

          <Button
            variant={isRunning ? 'secondary' : 'primary'}
            size="md"
            onClick={handleToggleRun}
            icon={isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          >
            {isRunning ? 'توقف پردازش' : 'ادامه پردازش'}
          </Button>

          <Button
            variant="outline"
            size="md"
            onClick={handleExportLog}
            icon={<Download className="w-4 h-4" />}
          >
            خروجی لاگ
          </Button>
        </div>
      </div>

      {/* Master Progress Card */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-xs flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#00488d] text-white flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <span className="text-base font-bold text-[#00488d]">پیشرفت کلی فرآیند</span>
              <p className="text-xs text-[#505f76]">
                دسته بعدی: ۱۰۰ مخاطب بخش بازاریابی (در صف انتظار)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-[#f1f5f9] px-2 py-1 rounded-lg border border-[#cbd5e1] text-xs">
              <Zap className="w-3.5 h-3.5 text-[#d97706]" />
              <span>سرعت:</span>
              <button
                onClick={() => setSpeed(1)}
                className={`px-1.5 py-0.5 rounded ${
                  speed === 1 ? 'bg-[#00488d] text-white' : 'text-[#505f76]'
                }`}
              >
                1x
              </button>
              <button
                onClick={() => setSpeed(2)}
                className={`px-1.5 py-0.5 rounded ${
                  speed === 2 ? 'bg-[#00488d] text-white' : 'text-[#505f76]'
                }`}
              >
                2x
              </button>
              <button
                onClick={() => setSpeed(5)}
                className={`px-1.5 py-0.5 rounded ${
                  speed === 5 ? 'bg-[#00488d] text-white' : 'text-[#505f76]'
                }`}
              >
                5x
              </button>
            </div>
            <span className="text-2xl font-black text-[#191c21] font-mono">{progress}٪</span>
          </div>
        </div>

        {/* Striped Animated Bar */}
        <div className="w-full bg-[#e2e8f0] rounded-full h-4 overflow-hidden border border-[#cbd5e1]">
          <div
            className="bg-[#00488d] h-full progress-bar-striped transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-xs text-[#505f76]">
          <span>پردازش بر اساس قوانین تعیین‌شده بدون ایجاد بار اضافی روی سرور</span>
          <span dir="ltr" className="font-mono font-medium">
            {progress} / 100 Processed
          </span>
        </div>
      </div>

      {/* 6-Card Stats Grid (Bento Style matching Image 7) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Total */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 shadow-xs flex flex-col items-center justify-center gap-1 text-center">
          <span className="text-xs font-semibold text-[#505f76]">تعداد کل</span>
          <span className="text-2xl font-black text-[#191c21] font-mono">{stats.total}</span>
        </div>

        {/* Processing */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 shadow-xs flex flex-col items-center justify-center gap-1 text-center">
          <span className="text-xs font-semibold text-[#505f76] flex items-center gap-1">
            <RefreshCw
              className={`w-3 h-3 text-[#00488d] ${isRunning ? 'animate-spin' : ''}`}
            />
            در حال پردازش
          </span>
          <span className="text-2xl font-black text-[#00488d] font-mono">
            {isRunning ? stats.processing : 0}
          </span>
        </div>

        {/* Success */}
        <div className="bg-white border border-[#e2e8f0] border-b-4 border-b-[#10b981] rounded-xl p-4 shadow-xs flex flex-col items-center justify-center gap-1 text-center">
          <span className="text-xs font-semibold text-[#505f76]">موفقیت‌آمیز</span>
          <div className="flex items-center gap-1.5">
            <span className="text-2xl font-black text-[#191c21] font-mono">{stats.success}</span>
            <span className="bg-emerald-100 text-[#047857] px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-0.5">
              <CheckCircle2 className="w-2.5 h-2.5" />
              موفق
            </span>
          </div>
        </div>

        {/* Failed */}
        <div className="bg-rose-50/50 border border-rose-200 border-b-4 border-b-[#ba1a1a] rounded-xl p-4 shadow-xs flex flex-col items-center justify-center gap-1 text-center">
          <span className="text-xs font-semibold text-[#ba1a1a]">خطا / ناموفق</span>
          <div className="flex items-center gap-1.5">
            <span className="text-2xl font-black text-[#ba1a1a] font-mono">{stats.failed}</span>
            <button
              onClick={handleRetryFailed}
              className="bg-[#fee2e2] text-[#ba1a1a] hover:bg-rose-200 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-0.5 transition-colors"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              تلاش مجدد
            </button>
          </div>
        </div>

        {/* Already member */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 shadow-xs flex flex-col items-center justify-center gap-1 text-center">
          <span className="text-xs font-semibold text-[#505f76] flex items-center gap-1">
            <UserCheck className="w-3 h-3 text-[#0369a1]" />
            عضو قبلی
          </span>
          <span className="text-2xl font-black text-[#191c21] font-mono">
            {stats.alreadyMember}
          </span>
        </div>

        {/* Rate limited */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 shadow-xs flex flex-col items-center justify-center gap-1 text-center opacity-80">
          <span className="text-xs font-semibold text-[#505f76] flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-[#727783]" />
            محدودیت نرخ
          </span>
          <span className="text-2xl font-black text-[#505f76] font-mono">
            {stats.rateLimited}
          </span>
        </div>
      </div>

      {/* Real-time Activity Table Container */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-xs flex flex-col overflow-hidden">
        {/* Table Header toolbar */}
        <div className="bg-[#f1f5f9] px-6 py-3.5 border-b border-[#e2e8f0] flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-[#191c21]">وضعیت لحظه‌ای رکوردهای پردازش</h3>
            <span className="text-[11px] text-[#505f76]">(نمایش ۱۰ رویداد اخیر)</span>
          </div>
          <span className="text-xs text-[#505f76] flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#137333] pulse-glow inline-block" />
            بروزرسانی زنده
          </span>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-white border-b border-[#e2e8f0] text-xs font-semibold text-[#505f76]">
              <tr>
                <th className="py-3 px-6">ردیف</th>
                <th className="py-3 px-6">نام / شناسه</th>
                <th className="py-3 px-6">شماره تماس / ایمیل</th>
                <th className="py-3 px-6">عملیات</th>
                <th className="py-3 px-6">وضعیت</th>
                <th className="py-3 px-6">زمان بروزرسانی</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] text-xs text-[#191c21]">
              {/* Row 1: Success */}
              <tr className="hover:bg-[#f0f9ff] transition-colors h-13">
                <td className="py-3 px-6 text-[#505f76] font-mono">۸۵</td>
                <td className="py-3 px-6 font-semibold text-[#191c21]">علی محمدی</td>
                <td className="py-3 px-6 text-[#505f76] font-mono" dir="ltr">
                  +98 912 345 6789
                </td>
                <td className="py-3 px-6 text-[#505f76]">ثبت نام اولیه</td>
                <td className="py-3 px-6">
                  <Badge status="success" label="موفق" size="sm" />
                </td>
                <td className="py-3 px-6 text-[#727783] font-mono">۱۰:۴۲:۱۵</td>
              </tr>

              {/* Row 2: Failed */}
              <tr className="hover:bg-[#f0f9ff] transition-colors h-13">
                <td className="py-3 px-6 text-[#505f76] font-mono">۸۶</td>
                <td className="py-3 px-6 font-semibold text-[#191c21]">زهرا احمدی</td>
                <td className="py-3 px-6 text-[#505f76] font-mono" dir="ltr">
                  zahra.ah@example.com
                </td>
                <td className="py-3 px-6 text-[#505f76]">بروزرسانی پروفایل</td>
                <td className="py-3 px-6">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#fee2e2] text-[#991b1b] border border-[#ef4444]/20">
                    <AlertTriangle className="w-3 h-3 text-[#991b1b]" />
                    فرمت نامعتبر شماره
                  </span>
                </td>
                <td className="py-3 px-6 text-[#727783] font-mono">۱۰:۴۲:۱۶</td>
              </tr>

              {/* Row 3: Processing */}
              <tr className="hover:bg-[#f0f9ff] transition-colors h-13 bg-blue-50/20">
                <td className="py-3 px-6 text-[#505f76] font-mono">۸۷</td>
                <td className="py-3 px-6 font-semibold text-[#191c21]">شرکت توسعه پارس</td>
                <td className="py-3 px-6 text-[#505f76] font-mono" dir="ltr">
                  021-88888888
                </td>
                <td className="py-3 px-6 text-[#505f76]">افزودن به لیست</td>
                <td className="py-3 px-6">
                  <Badge status="processing" size="sm" />
                </td>
                <td className="py-3 px-6 text-[#727783] font-mono">--:--:--</td>
              </tr>

              {/* Row 4: Already Member */}
              <tr className="hover:bg-[#f0f9ff] transition-colors h-13">
                <td className="py-3 px-6 text-[#505f76] font-mono">۸۸</td>
                <td className="py-3 px-6 font-semibold text-[#191c21]">رضا کمالی</td>
                <td className="py-3 px-6 text-[#505f76] font-mono" dir="ltr">
                  0912 444 3322
                </td>
                <td className="py-3 px-6 text-[#505f76]">تخصیص سطح دسترسی</td>
                <td className="py-3 px-6">
                  <Badge status="already_member" label="عضو قبلی" size="sm" />
                </td>
                <td className="py-3 px-6 text-[#727783] font-mono">۱۰:۴۱:۵۸</td>
              </tr>

              {/* Skeleton Rows representing upcoming batch queues */}
              <tr className="h-13 opacity-60">
                <td className="py-3 px-6">
                  <div className="h-3.5 bg-slate-200 rounded w-6 pulse-glow" />
                </td>
                <td className="py-3 px-6">
                  <div className="h-3.5 bg-slate-200 rounded w-24 pulse-glow" />
                </td>
                <td className="py-3 px-6">
                  <div className="h-3.5 bg-slate-200 rounded w-32 pulse-glow" />
                </td>
                <td className="py-3 px-6">
                  <div className="h-3.5 bg-slate-200 rounded w-20 pulse-glow" />
                </td>
                <td className="py-3 px-6">
                  <div className="h-5 bg-slate-200 rounded-full w-20 pulse-glow" />
                </td>
                <td className="py-3 px-6">
                  <div className="h-3.5 bg-slate-200 rounded w-16 pulse-glow" />
                </td>
              </tr>
              <tr className="h-13 opacity-40">
                <td className="py-3 px-6">
                  <div className="h-3.5 bg-slate-200 rounded w-6 pulse-glow" />
                </td>
                <td className="py-3 px-6">
                  <div className="h-3.5 bg-slate-200 rounded w-20 pulse-glow" />
                </td>
                <td className="py-3 px-6">
                  <div className="h-3.5 bg-slate-200 rounded w-28 pulse-glow" />
                </td>
                <td className="py-3 px-6">
                  <div className="h-3.5 bg-slate-200 rounded w-24 pulse-glow" />
                </td>
                <td className="py-3 px-6">
                  <div className="h-5 bg-slate-200 rounded-full w-20 pulse-glow" />
                </td>
                <td className="py-3 px-6">
                  <div className="h-3.5 bg-slate-200 rounded w-16 pulse-glow" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="bg-[#f8fafc] px-6 py-3 border-t border-[#e2e8f0] flex justify-between items-center text-xs text-[#505f76]">
          <span>پردازش بر روی سرورهای اختصاصی پایدار انجام می‌گیرد.</span>
          <button
            onClick={handleResetBatch}
            className="text-[#00488d] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>شروع دوباره شبیه‌سازی</span>
          </button>
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isCancelConfirmOpen}
        onClose={() => setIsCancelConfirmOpen(false)}
        onConfirm={handleCancelBatch}
        title="لغو عملیات پردازش دسته‌ای"
        message="آیا از لغو این فرآیند مطمئن هستید؟ رکوردهای باقی‌مانده پردازش نخواهند شد و لاگ تا همین مرحله ثبت می‌گردد."
        confirmLabel="لغو فرآیند"
        variant="danger"
      />
    </div>
  );
};

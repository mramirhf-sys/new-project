import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileText, Database, Check } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useToast();
  const [selectedFormat, setSelectedFormat] = useState<'excel' | 'csv' | 'json'>('excel');
  const [includeLogs, setIncludeLogs] = useState(true);
  const [includeSettings, setIncludeSettings] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      onClose();
      showToast({
        type: 'success',
        title: 'خروجی داده‌ها با موفقیت ثبت شد',
        message: `فایل بسته سازمانی در قالب ${selectedFormat.toUpperCase()} آماده و دریافت گردید.`,
      });
    }, 600);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="ثبت خروجی سازمانی"
      subtitle="انتخاب قالب و محدوده داده‌ها جهت دریافت خروجی استاندارد"
      icon={<Download className="w-5 h-5 text-[#00488d]" />}
      maxWidth="md"
      footer={
        <>
          <Button variant="ghost" size="md" onClick={onClose} disabled={isExporting}>
            انصراف
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleExport}
            isLoading={isExporting}
            icon={<Download className="w-4 h-4" />}
          >
            تولید و دریافت خروجی
          </Button>
        </>
      }
    >
      <div className="space-y-4 text-right">
        <div>
          <label className="block text-xs font-semibold text-[#191c21] mb-2">
            قالب خروجی مورد نظر:
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => setSelectedFormat('excel')}
              className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                selectedFormat === 'excel'
                  ? 'border-[#00488d] bg-blue-50/50 text-[#00488d] ring-1 ring-[#00488d]'
                  : 'border-[#cbd5e1] hover:bg-[#f8fafc] text-[#505f76]'
              }`}
            >
              <FileSpreadsheet className="w-6 h-6 mx-auto mb-1 text-[#137333]" />
              <span className="text-xs font-bold block">اکسل (.xlsx)</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedFormat('csv')}
              className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                selectedFormat === 'csv'
                  ? 'border-[#00488d] bg-blue-50/50 text-[#00488d] ring-1 ring-[#00488d]'
                  : 'border-[#cbd5e1] hover:bg-[#f8fafc] text-[#505f76]'
              }`}
            >
              <FileText className="w-6 h-6 mx-auto mb-1 text-[#00488d]" />
              <span className="text-xs font-bold block">متن (.csv)</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedFormat('json')}
              className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                selectedFormat === 'json'
                  ? 'border-[#00488d] bg-blue-50/50 text-[#00488d] ring-1 ring-[#00488d]'
                  : 'border-[#cbd5e1] hover:bg-[#f8fafc] text-[#505f76]'
              }`}
            >
              <Database className="w-6 h-6 mx-auto mb-1 text-[#d97706]" />
              <span className="text-xs font-bold block">داده ساختاریافته (.json)</span>
            </button>
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t border-[#e2e8f0]">
          <label className="block text-xs font-semibold text-[#191c21] mb-1">
            داده‌های الحاقی:
          </label>
          <label className="flex items-center gap-2 text-xs text-[#505f76] cursor-pointer">
            <input
              type="checkbox"
              checked={includeLogs}
              onChange={(e) => setIncludeLogs(e.target.checked)}
              className="rounded border-[#cbd5e1] text-[#00488d] focus:ring-[#00488d]"
            />
            <span>شامل تمامی گزارشات فعالیت‌های ۲۴ ساعت گذشته</span>
          </label>
          <label className="flex items-center gap-2 text-xs text-[#505f76] cursor-pointer">
            <input
              type="checkbox"
              checked={includeSettings}
              onChange={(e) => setIncludeSettings(e.target.checked)}
              className="rounded border-[#cbd5e1] text-[#00488d] focus:ring-[#00488d]"
            />
            <span>شامل فایل پیکربندی تنظیمات سیستم</span>
          </label>
        </div>
      </div>
    </Modal>
  );
};

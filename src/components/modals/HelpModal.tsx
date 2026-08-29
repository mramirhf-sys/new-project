import React from 'react';
import { HelpCircle, BookOpen, Shield, Layers, Users, PhoneCall } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="راهنما و راهنمای کاربری سامانه"
      subtitle="آشنایی با قابلیت‌ها، ساختار داده و میانبرهای نرم‌افزار"
      icon={<HelpCircle className="w-5 h-5 text-[#00488d]" />}
      maxWidth="lg"
      footer={
        <Button variant="primary" size="md" onClick={onClose}>
          متوجه شدم
        </Button>
      }
    >
      <div className="space-y-4 text-xs text-[#505f76] leading-relaxed text-right">
        <div className="p-3.5 bg-[#f8fafc] rounded-xl border border-[#e2e8f0]">
          <h4 className="font-bold text-[#191c21] flex items-center gap-2 mb-1.5 text-sm">
            <Users className="w-4 h-4 text-[#00488d]" />
            ۱. مدیریت مخاطبین
          </h4>
          <p>
            در این بخش می‌توانید مخاطبین سازمانی را ثبت، ویرایش، دسته‌بندی و فیلتر کنید. تمامی
            شماره‌های همراه با الگوی استاندارد ایران (<span className="font-mono">09...</span>)
            اعتبارسنجی می‌شوند.
          </p>
        </div>

        <div className="p-3.5 bg-[#f8fafc] rounded-xl border border-[#e2e8f0]">
          <h4 className="font-bold text-[#191c21] flex items-center gap-2 mb-1.5 text-sm">
            <Layers className="w-4 h-4 text-[#00488d]" />
            ۲. پردازش دسته‌ای ۱۰۰ نفره
          </h4>
          <p>
            سیستم وظایف سنگین را در بسته‌های ۱۰۰ تایی به صورت خودکار زمان‌بندی و تفکیک می‌نماید. شما
            می‌توانید وضعیت‌های موفق، ناموفق، عضو قبلی و در حال پردازش را به صورت زنده رصد کنید.
          </p>
        </div>

        <div className="p-3.5 bg-[#f8fafc] rounded-xl border border-[#e2e8f0]">
          <h4 className="font-bold text-[#191c21] flex items-center gap-2 mb-1.5 text-sm">
            <Shield className="w-4 h-4 text-[#00488d]" />
            ۳. امنیت و پشتیبان‌گیری
          </h4>
          <p>
            امکان فعال‌سازی تایید هویت دو مرحله‌ای (2FA)، محدودسازی IP و زمان‌بندی تهیه نسخه پشتیبان
            از تب تنظیمات در دسترس است.
          </p>
        </div>

        <div className="p-3 bg-blue-50/50 rounded-lg border border-[#00488d]/20 text-[#00488d] flex items-center gap-2">
          <PhoneCall className="w-4 h-4 shrink-0" />
          <span>
            پشتیبانی تلفنی سازمانی: <strong className="font-mono">021-88880000</strong> (داخلی ۱۰۲)
          </span>
        </div>
      </div>
    </Modal>
  );
};

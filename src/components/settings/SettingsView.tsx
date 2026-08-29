import React, { useState } from 'react';
import {
  Sliders,
  Shield,
  Puzzle,
  Bell,
  Save,
  RotateCcw,
  Check,
  AlertTriangle,
  Lock,
  Key,
  Globe,
  Send,
  HelpCircle,
  Clock,
} from 'lucide-react';
import { SystemSettings } from '../../types';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';

interface SettingsViewProps {
  settings: SystemSettings;
  onSaveSettings: (settings: SystemSettings) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings: initialSettings,
  onSaveSettings,
}) => {
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<SystemSettings>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);

  // Phone validation error state (as shown in Image 5)
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const steps = [
    { id: 1, title: 'عمومی', icon: Sliders, desc: 'اطلاعات پایه و منطقه‌ای' },
    { id: 2, title: 'امنیتی', icon: Shield, desc: 'احراز هویت و دسترسی‌ها' },
    { id: 3, title: 'یکپارچه‌سازی‌ها', icon: Puzzle, desc: 'سرویس پیامک و وب‌هوک' },
    { id: 4, title: 'اعلان‌ها', icon: Bell, desc: 'پیام‌ها و هشدارهای سیستم' },
  ];

  const handlePhoneChange = (val: string) => {
    setFormData({
      ...formData,
      general: { ...formData.general, supportPhone: val },
    });

    const clean = val.replace(/\s+/g, '');
    if (!clean) {
      setPhoneError('شماره تماس الزامی است');
    } else if (!/^09\d{9}$/.test(clean) && !/^\+989\d{9}$/.test(clean)) {
      setPhoneError('لطفاً شماره همراه معتبر ۱۱ رقمی وارد کنید (مثال: 09121234567)');
    } else {
      setPhoneError(null);
    }
  };

  const handleSave = () => {
    if (phoneError) {
      showToast({
        type: 'error',
        title: 'خطا در ثبت فرم',
        message: 'لطفاً ابتدا خطاهای اعتبارسنجی را برطرف کنید.',
      });
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      onSaveSettings(formData);
      setIsSaving(false);
      showToast({
        type: 'success',
        title: 'تنظیمات با موفقیت ذخیره شد',
        message: 'تغییرات فوراً بر روی تمامی بخش‌های سامانه اعمال گردید.',
      });
    }, 500);
  };

  const handleReset = () => {
    setFormData(initialSettings);
    setPhoneError(null);
    showToast({
      type: 'info',
      title: 'تنظیمات بازنشانی شد',
      message: 'مقادیر فرم به حالت پیش‌فرض بازگشتند.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-xs">
        <div>
          <h2 className="text-2xl font-bold text-[#191c21]">تنظیمات سیستم</h2>
          <p className="text-sm text-[#505f76] mt-1">
            پیکربندی تنظیمات کلی، امنیتی و یکپارچه‌سازی‌های سیستم.
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-[#00488d]">
            مرحله {currentStep.toLocaleString('fa-IR')} از ۴
          </span>
          <div className="w-28 h-2 bg-[#e2e8f0] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#00488d] rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Multi-step Layout Grid */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Step Navigation Sidebar */}
        <aside className="w-full lg:w-64 shrink-0 bg-white rounded-xl border border-[#e2e8f0] p-2.5 shadow-xs sticky top-24">
          <nav className="flex flex-col gap-1.5">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isPast = currentStep > step.id;

              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(step.id)}
                  className={`w-full text-right flex items-center justify-between p-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#d6e3ff] text-[#00488d] font-bold border-r-4 border-[#00488d] shadow-xs'
                      : 'text-[#505f76] hover:bg-[#f1f5f9] hover:text-[#191c21] border-r-4 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4.5 h-4.5 ${
                        isActive ? 'text-[#00488d]' : 'text-[#727783]'
                      }`}
                    />
                    <div>
                      <p className="font-semibold">{step.title}</p>
                      <p className="text-[10px] text-[#727783]">{step.desc}</p>
                    </div>
                  </div>

                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      isActive
                        ? 'bg-[#00488d] text-white'
                        : isPast
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'border border-[#cbd5e1] text-[#727783]'
                    }`}
                  >
                    {isPast ? <Check className="w-3 h-3" /> : step.id.toLocaleString('fa-IR')}
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Form Content Area */}
        <div className="flex-1 w-full bg-white rounded-xl border border-[#e2e8f0] shadow-xs overflow-hidden flex flex-col">
          {/* Step 1: General Settings */}
          {currentStep === 1 && (
            <div>
              <div className="p-6 border-b border-[#e2e8f0] bg-[#f8fafc]">
                <h3 className="text-lg font-bold text-[#191c21] flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-[#00488d]" />
                  تنظیمات عمومی
                </h3>
                <p className="text-xs text-[#505f76] mt-1">
                  اطلاعات پایه سیستم و شناسنامه سازمانی را وارد کنید.
                </p>
              </div>

              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-[#191c21] border-b border-[#e2e8f0] pb-2">
                    اطلاعات پایه
                  </h4>

                  {/* Org Name */}
                  <div>
                    <label className="block text-xs font-semibold text-[#191c21] mb-1.5">
                      نام سازمان <span className="text-[#ba1a1a]">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.general.orgName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          general: { ...formData.general, orgName: e.target.value },
                        })
                      }
                      className="w-full h-10 px-3.5 rounded-lg border border-[#cbd5e1] text-xs text-[#191c21] bg-white focus:ring-2 focus:ring-[#00488d] outline-none"
                    />
                    <p className="text-[11px] text-[#727783] mt-1">
                      این نام در تمامی گزارشات، فاکتورها و پیامک‌ها نمایش داده می‌شود.
                    </p>
                  </div>

                  {/* Support Phone with Error State */}
                  <div>
                    <label className="block text-xs font-semibold text-[#191c21] mb-1.5">
                      شماره تماس پشتیبانی <span className="text-[#ba1a1a]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        dir="ltr"
                        value={formData.general.supportPhone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        className={`w-full h-10 pr-4 pl-10 rounded-lg border text-xs text-[#191c21] outline-none font-mono ${
                          phoneError
                            ? 'border-[#ba1a1a] bg-rose-50/20 focus:ring-2 focus:ring-[#ba1a1a]'
                            : 'border-[#cbd5e1] bg-white focus:ring-2 focus:ring-[#00488d]'
                        }`}
                      />
                      {phoneError && (
                        <AlertTriangle className="w-4 h-4 text-[#ba1a1a] absolute left-3 top-1/2 -translate-y-1/2" />
                      )}
                    </div>
                    {phoneError && (
                      <p className="text-[11px] text-[#ba1a1a] flex items-center gap-1 mt-1 font-medium">
                        <span>{phoneError}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Regional Config */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-[#191c21] border-b border-[#e2e8f0] pb-2">
                    پیکربندی منطقه‌ای
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#191c21] mb-1.5">
                        منطقه زمانی
                      </label>
                      <select
                        value={formData.general.timezone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            general: { ...formData.general, timezone: e.target.value },
                          })
                        }
                        className="w-full h-10 px-3 rounded-lg border border-[#cbd5e1] text-xs text-[#191c21] bg-white focus:ring-2 focus:ring-[#00488d] outline-none cursor-pointer"
                      >
                        <option value="Asia/Tehran">تهران (Asia/Tehran) +03:30</option>
                        <option value="Asia/Dubai">دبی (Asia/Dubai) +04:00</option>
                        <option value="Europe/Istanbul">استانبول (Europe/Istanbul) +03:00</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#191c21] mb-1.5">
                        زبان پیش‌فرض سیستم
                      </label>
                      <select
                        value={formData.general.language}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            general: { ...formData.general, language: e.target.value },
                          })
                        }
                        className="w-full h-10 px-3 rounded-lg border border-[#cbd5e1] text-xs text-[#191c21] bg-white focus:ring-2 focus:ring-[#00488d] outline-none cursor-pointer"
                      >
                        <option value="fa">فارسی (Persian)</option>
                        <option value="en">انگلیسی (English)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Advanced Features (Toggles) */}
                <div className="space-y-3 bg-[#f8fafc] p-4 rounded-xl border border-[#e2e8f0]">
                  <h4 className="text-xs font-bold text-[#191c21] mb-2">قابلیت‌های پیشرفته</h4>

                  {/* Toggle 1: Maintenance Mode */}
                  <div className="flex items-center justify-between py-2 border-b border-[#e2e8f0]">
                    <div>
                      <p className="text-xs font-semibold text-[#191c21]">حالت تعمیر و نگهداری</p>
                      <p className="text-[11px] text-[#505f76]">
                        جلوگیری از ورود کاربران عادی در زمان به‌روزرسانی.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.general.maintenanceMode}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            general: {
                              ...formData.general,
                              maintenanceMode: e.target.checked,
                            },
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-[#cbd5e1] peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00488d]"></div>
                    </label>
                  </div>

                  {/* Toggle 2: Auto Backup */}
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-xs font-semibold text-[#191c21]">پشتیبان‌گیری خودکار</p>
                      <p className="text-[11px] text-[#505f76]">
                        تهیه نسخه پشتیبان از دیتابیس به صورت روزانه ساعت ۲۱:۰۰.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.general.autoBackup}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            general: {
                              ...formData.general,
                              autoBackup: e.target.checked,
                            },
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-[#cbd5e1] peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00488d]"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Security Settings */}
          {currentStep === 2 && (
            <div>
              <div className="p-6 border-b border-[#e2e8f0] bg-[#f8fafc]">
                <h3 className="text-lg font-bold text-[#191c21] flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#00488d]" />
                  تنظیمات امنیتی و دسترسی‌ها
                </h3>
                <p className="text-xs text-[#505f76] mt-1">
                  پیکربندی ورود دو مرحله‌ای، طول عمر نشست‌ها و سیاست رمز عبور.
                </p>
              </div>

              <div className="p-6 space-y-5">
                {/* 2FA Toggle */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-[#e2e8f0] bg-[#f8fafc]">
                  <div>
                    <p className="text-xs font-bold text-[#191c21]">
                      احراز هویت دو مرحله‌ای (2FA)
                    </p>
                    <p className="text-[11px] text-[#505f76] mt-0.5">
                      ارسال کد تایید به شماره همراه مدیران هنگام ورود به پنل
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.security.twoFactorAuth}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          security: { ...formData.security, twoFactorAuth: e.target.checked },
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#cbd5e1] rounded-full peer peer-checked:after:-translate-x-full peer-checked:bg-[#00488d] after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>

                {/* Session Timeout */}
                <div>
                  <label className="block text-xs font-semibold text-[#191c21] mb-1.5">
                    مدت زمان انقضای نشست کاری (دقیقه)
                  </label>
                  <select
                    value={formData.security.sessionTimeoutMinutes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        security: {
                          ...formData.security,
                          sessionTimeoutMinutes: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full h-10 px-3 rounded-lg border border-[#cbd5e1] text-xs text-[#191c21] bg-white focus:ring-2 focus:ring-[#00488d] outline-none"
                  >
                    <option value={15}>۱۵ دقیقه (حداکثر امنیت)</option>
                    <option value={30}>۳۰ دقیقه (پیش‌فرض)</option>
                    <option value={60}>۶۰ دقیقه</option>
                    <option value={120}>۲ ساعت</option>
                  </select>
                </div>

                {/* IP Whitelist */}
                <div>
                  <label className="block text-xs font-semibold text-[#191c21] mb-1.5">
                    فهرست مجاز آدرس‌های IP (اختیاری)
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={formData.security.ipWhitelist}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        security: { ...formData.security, ipWhitelist: e.target.value },
                      })
                    }
                    placeholder="192.168.1.1, 10.0.0.1"
                    className="w-full h-10 px-3 rounded-lg border border-[#cbd5e1] text-xs text-[#191c21] bg-white focus:ring-2 focus:ring-[#00488d] outline-none font-mono"
                  />
                  <p className="text-[11px] text-[#727783] mt-1">
                    در صورت وارد کردن IP، ورود تنها از این شبکه‌ها امکان‌پذیر خواهد بود.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Integrations */}
          {currentStep === 3 && (
            <div>
              <div className="p-6 border-b border-[#e2e8f0] bg-[#f8fafc]">
                <h3 className="text-lg font-bold text-[#191c21] flex items-center gap-2">
                  <Puzzle className="w-5 h-5 text-[#00488d]" />
                  یکپارچه‌سازی‌ها و وب‌هوک
                </h3>
                <p className="text-xs text-[#505f76] mt-1">
                  اتصال سامانه به درگاه پیامک سازمانی و همگام‌سازی ابری اکسل.
                </p>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#191c21] mb-1.5">
                    کلید دسترسی وب‌سرویس پیامک (API Key)
                  </label>
                  <input
                    type="password"
                    dir="ltr"
                    value={formData.integrations.smsApiKey}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        integrations: { ...formData.integrations, smsApiKey: e.target.value },
                      })
                    }
                    className="w-full h-10 px-3 rounded-lg border border-[#cbd5e1] text-xs text-[#191c21] bg-white focus:ring-2 focus:ring-[#00488d] outline-none font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#191c21] mb-1.5">
                      شماره خط فرستنده اختصاصی
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={formData.integrations.smsSenderNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          integrations: {
                            ...formData.integrations,
                            smsSenderNumber: e.target.value,
                          },
                        })
                      }
                      className="w-full h-10 px-3 rounded-lg border border-[#cbd5e1] text-xs text-[#191c21] bg-white focus:ring-2 focus:ring-[#00488d] outline-none font-mono"
                    />
                  </div>

                  <div className="flex items-end">
                    <Button
                      variant="secondary"
                      size="md"
                      className="w-full"
                      onClick={() =>
                        showToast({
                          type: 'success',
                          title: 'اتصال به سامانه پیامک برقرار است',
                          message: 'اعتبار حساب: ۲۴,۵۰۰ پیامک فعال',
                        })
                      }
                    >
                      تست اتصال پیامک
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#191c21] mb-1.5">
                    آدرس وب‌هوک رویدادها (Webhook URL)
                  </label>
                  <input
                    type="url"
                    dir="ltr"
                    value={formData.integrations.webhookUrl}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        integrations: { ...formData.integrations, webhookUrl: e.target.value },
                      })
                    }
                    className="w-full h-10 px-3 rounded-lg border border-[#cbd5e1] text-xs text-[#191c21] bg-white focus:ring-2 focus:ring-[#00488d] outline-none font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Notifications */}
          {currentStep === 4 && (
            <div>
              <div className="p-6 border-b border-[#e2e8f0] bg-[#f8fafc]">
                <h3 className="text-lg font-bold text-[#191c21] flex items-center gap-2">
                  <Bell className="w-5 h-5 text-[#00488d]" />
                  تنظیمات اطلاع‌رسانی و هشدارها
                </h3>
                <p className="text-xs text-[#505f76] mt-1">
                  پیکربندی هشدارهای فوری پردازش دسته‌ای و گزارش‌های روزانه.
                </p>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#191c21] mb-1.5">
                    ایمیل مدیر جهت دریافت گزارش‌های بحرانی
                  </label>
                  <input
                    type="email"
                    dir="ltr"
                    value={formData.notifications.adminEmail}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        notifications: {
                          ...formData.notifications,
                          adminEmail: e.target.value,
                        },
                      })
                    }
                    className="w-full h-10 px-3 rounded-lg border border-[#cbd5e1] text-xs text-[#191c21] bg-white focus:ring-2 focus:ring-[#00488d] outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#191c21] mb-1.5">
                    شناسه ربات یا کانال تلگرام جهت اعلان
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={formData.notifications.telegramChatId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        notifications: {
                          ...formData.notifications,
                          telegramChatId: e.target.value,
                        },
                      })
                    }
                    className="w-full h-10 px-3 rounded-lg border border-[#cbd5e1] text-xs text-[#191c21] bg-white focus:ring-2 focus:ring-[#00488d] outline-none font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="p-4 border-t border-[#e2e8f0] bg-[#f8fafc] flex items-center justify-between gap-3 mt-auto">
            <Button variant="ghost" size="md" onClick={handleReset}>
              <RotateCcw className="w-4 h-4" />
              بازنشانی مقادیر
            </Button>

            <div className="flex items-center gap-2">
              {currentStep > 1 && (
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setCurrentStep((s) => s - 1)}
                >
                  مرحله قبلی
                </Button>
              )}

              {currentStep < 4 ? (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setCurrentStep((s) => s + 1)}
                >
                  مرحله بعدی
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  isLoading={isSaving}
                  onClick={handleSave}
                  icon={<Save className="w-4 h-4" />}
                >
                  ذخیره تمامی تغییرات
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

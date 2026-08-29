import React from 'react';
import { ContactStatus, BatchItemStatus } from '../../types';
import { CheckCircle2, AlertCircle, Clock, Ban, RefreshCw, UserCheck, ShieldAlert } from 'lucide-react';

interface BadgeProps {
  status?: ContactStatus | BatchItemStatus | 'success' | 'failed' | 'processing' | 'stable';
  label?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ status, label, className = '', size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  if (status === 'active' || status === 'success') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-medium bg-[#e6f4ea] text-[#137333] border border-[#137333]/20 rounded-full ${sizeClasses} ${className}`}
      >
        <CheckCircle2 className="w-3 h-3 text-[#137333]" />
        <span>{label || (status === 'active' ? 'فعال' : 'موفق')}</span>
      </span>
    );
  }

  if (status === 'failed' || status === 'rate_limited') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-medium bg-[#fee2e2] text-[#991b1b] border border-[#ef4444]/20 rounded-full ${sizeClasses} ${className}`}
      >
        {status === 'rate_limited' ? (
          <ShieldAlert className="w-3 h-3 text-[#991b1b]" />
        ) : (
          <AlertCircle className="w-3 h-3 text-[#991b1b]" />
        )}
        <span>{label || (status === 'rate_limited' ? 'محدودیت نرخ' : 'خطا')}</span>
      </span>
    );
  }

  if (status === 'pending') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-medium bg-[#fef3c7] text-[#92400e] border border-[#f59e0b]/20 rounded-full ${sizeClasses} ${className}`}
      >
        <Clock className="w-3 h-3 text-[#92400e]" />
        <span>{label || 'در انتظار تایید'}</span>
      </span>
    );
  }

  if (status === 'inactive') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-medium bg-[#f1f5f9] text-[#475569] border border-[#cbd5e1] rounded-full ${sizeClasses} ${className}`}
      >
        <Ban className="w-3 h-3 text-[#475569]" />
        <span>{label || 'غیرفعال'}</span>
      </span>
    );
  }

  if (status === 'already_member') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-medium bg-[#e0f2fe] text-[#0369a1] border border-[#38bdf8]/30 rounded-full ${sizeClasses} ${className}`}
      >
        <UserCheck className="w-3 h-3 text-[#0369a1]" />
        <span>{label || 'عضو قبلی'}</span>
      </span>
    );
  }

  if (status === 'processing') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-medium bg-[#dbeafe] text-[#1d4ed8] border border-[#3b82f6]/30 rounded-full ${sizeClasses} ${className}`}
      >
        <RefreshCw className="w-3 h-3 text-[#1d4ed8] animate-spin" />
        <span>{label || 'در حال پردازش...'}</span>
      </span>
    );
  }

  if (status === 'stable') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-medium bg-[#e2e8f0] text-[#334155] rounded-full ${sizeClasses} ${className}`}
      >
        <span>{label || 'پایدار'}</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium bg-[#f1f5f9] text-[#334155] border border-[#cbd5e1] rounded-full ${sizeClasses} ${className}`}
    >
      {label}
    </span>
  );
};

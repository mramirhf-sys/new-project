export type PageId = 'dashboard' | 'contacts' | 'batch' | 'settings' | 'reports';

export type ContactStatus = 'active' | 'pending' | 'inactive';

export type ContactGroup = 'مشتریان ویژه' | 'تامین‌کنندگان' | 'کارمندان' | 'شرکای تجاری' | 'مشتریان عادی';

export interface Contact {
  id: string;
  name: string;
  avatar?: string;
  initials: string;
  phone: string;
  email?: string;
  group: ContactGroup;
  status: ContactStatus;
  lastActivity: string;
  notes?: string;
  createdAt: string;
}

export type BatchItemStatus = 'success' | 'failed' | 'processing' | 'pending' | 'already_member' | 'rate_limited';

export interface BatchItem {
  id: number;
  name: string;
  identifier: string; // phone or email
  action: string;
  status: BatchItemStatus;
  updatedAt: string;
  errorMessage?: string;
  details?: string;
}

export interface BatchSession {
  id: string;
  title: string;
  total: number;
  processed: number;
  successCount: number;
  failedCount: number;
  processingCount: number;
  alreadyMemberCount: number;
  rateLimitedCount: number;
  pendingCount: number;
  isRunning: boolean;
  isPaused: boolean;
  currentStepDescription: string;
  estimatedRemainingMinutes: number;
  items: BatchItem[];
}

export interface ActivityLog {
  id: string;
  action: string;
  user: {
    name: string;
    avatar?: string;
    isSystem?: boolean;
  };
  time: string;
  status: 'success' | 'failed' | 'processing';
  details?: string;
}

export interface SystemSettings {
  general: {
    orgName: string;
    supportPhone: string;
    timezone: string;
    language: string;
    maintenanceMode: boolean;
    autoBackup: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeoutMinutes: number;
    strongPasswordPolicy: boolean;
    ipWhitelist: string;
  };
  integrations: {
    smsApiKey: string;
    smsSenderNumber: string;
    webhookUrl: string;
    autoSyncExcel: boolean;
  };
  notifications: {
    emailAlerts: boolean;
    adminEmail: string;
    notifyOnBatchFail: boolean;
    telegramAlerts: boolean;
    telegramChatId: string;
  };
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'primary';
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'تایید',
  cancelLabel = 'انصراف',
  variant = 'danger',
  isLoading = false,
}) => {
  const icon =
    variant === 'danger' ? (
      <AlertTriangle className="w-5 h-5 text-[#ba1a1a]" />
    ) : variant === 'warning' ? (
      <AlertTriangle className="w-5 h-5 text-[#d97706]" />
    ) : (
      <Info className="w-5 h-5 text-[#00488d]" />
    );

  const confirmVariant = variant === 'danger' ? 'danger' : 'primary';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      icon={icon}
      maxWidth="sm"
      footer={
        <>
          <Button variant="ghost" size="md" onClick={onClose} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button
            variant={confirmVariant}
            size="md"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="text-sm text-[#505f76] leading-relaxed py-1">{message}</div>
    </Modal>
  );
};

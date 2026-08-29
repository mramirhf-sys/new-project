import React, { useState, useMemo } from 'react';
import {
  Search,
  UserPlus,
  Filter,
  ArrowUpDown,
  Edit2,
  Trash2,
  Phone,
  Mail,
  ChevronRight,
  ChevronLeft,
  FileSpreadsheet,
  Download,
  Users,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import { Contact, ContactGroup, ContactStatus } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { EmptyState } from '../ui/EmptyState';
import { useToast } from '../ui/Toast';

interface ContactsViewProps {
  contacts: Contact[];
  onAddContact: (contact: Omit<Contact, 'id' | 'createdAt'>) => void;
  onUpdateContact: (contact: Contact) => void;
  onDeleteContact: (id: string) => void;
  onDeleteMultiple: (ids: string[]) => void;
}

export const ContactsView: React.FC<ContactsViewProps> = ({
  contacts,
  onAddContact,
  onUpdateContact,
  onDeleteContact,
  onDeleteMultiple,
}) => {
  const { showToast } = useToast();

  // Search, Filters & Sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'name' | 'activity'>('newest');

  // Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // States: Skeleton loading preview & Empty state preview
  const [isLoading, setIsLoading] = useState(false);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [deletingContactId, setDeletingContactId] = useState<string | null>(null);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    group: 'مشتریان ویژه' as ContactGroup,
    status: 'active' as ContactStatus,
    notes: '',
  });
  const [formErrors, setFormErrors] = useState<{ name?: string; phone?: string }>({});

  const validateForm = () => {
    const errors: { name?: string; phone?: string } = {};
    if (!formData.name.trim()) {
      errors.name = 'لطفاً نام و نام خانوادگی را وارد کنید';
    }
    const cleanPhone = formData.phone.replace(/\s+/g, '');
    if (!cleanPhone) {
      errors.phone = 'شماره تماس الزامی است';
    } else if (!/^09\d{9}$/.test(cleanPhone) && !/^\+989\d{9}$/.test(cleanPhone)) {
      errors.phone = 'شماره تماس باید با 09 شروع شده و ۱۱ رقم باشد (مثال: 09123456789)';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      group: 'مشتریان ویژه',
      status: 'active',
      notes: '',
    });
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (contact: Contact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      phone: contact.phone,
      email: contact.email || '',
      group: contact.group,
      status: contact.status,
      notes: contact.notes || '',
    });
    setFormErrors({});
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingContact) {
      onUpdateContact({
        ...editingContact,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        group: formData.group,
        status: formData.status,
        notes: formData.notes,
      });
      showToast({
        type: 'success',
        title: 'مخاطب با موفقیت ویرایش شد',
        message: `اطلاعات ${formData.name} بروزرسانی گردید.`,
      });
      setEditingContact(null);
    } else {
      const names = formData.name.split(' ');
      const initials =
        names.length > 1
          ? `${names[0].charAt(0)}‌${names[1].charAt(0)}`
          : formData.name.slice(0, 2);

      onAddContact({
        name: formData.name,
        initials,
        phone: formData.phone,
        email: formData.email,
        group: formData.group,
        status: formData.status,
        lastActivity: 'هم‌اکنون',
        notes: formData.notes,
      });
      showToast({
        type: 'success',
        title: 'مخاطب جدید افزوده شد',
        message: `${formData.name} به فهرست مخاطبین اضافه گردید.`,
      });
      setIsAddModalOpen(false);
    }
  };

  // Filter and sort logic
  const filteredContacts = useMemo(() => {
    return contacts.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.includes(searchTerm) ||
        (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesGroup = selectedGroup === 'all' || c.group === selectedGroup;
      const matchesStatus = selectedStatus === 'all' || c.status === selectedStatus;

      return matchesSearch && matchesGroup && matchesStatus;
    });
  }, [contacts, searchTerm, selectedGroup, selectedStatus]);

  const sortedContacts = useMemo(() => {
    return [...filteredContacts].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name, 'fa');
      if (sortBy === 'activity') return a.lastActivity.localeCompare(b.lastActivity, 'fa');
      return 0; // Default order
    });
  }, [filteredContacts, sortBy]);

  // Paginated contacts
  const totalPages = Math.max(1, Math.ceil(sortedContacts.length / rowsPerPage));
  const paginatedContacts = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sortedContacts.slice(start, start + rowsPerPage);
  }, [sortedContacts, currentPage, rowsPerPage]);

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedContacts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedContacts.map((c) => c.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkDeleteConfirm = () => {
    onDeleteMultiple(selectedIds);
    showToast({
      type: 'success',
      title: 'حذف گروهی انجام شد',
      message: `${selectedIds.length} مخاطب با موفقیت حذف شدند.`,
    });
    setSelectedIds([]);
    setIsBulkDeleteOpen(false);
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      'نام,شماره تماس,گروه,وضعیت,ایمیل\n' +
      contacts
        .map((c) => `"${c.name}","${c.phone}","${c.group}","${c.status}","${c.email || ''}"`)
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `contacts-export-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast({
      type: 'success',
      title: 'فایل مخاطبین دانلود شد',
      message: 'خروجی استاندارد با موفقیت ایجاد گردید.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-xs">
        <div>
          <h2 className="text-2xl font-bold text-[#191c21]">مدیریت مخاطبین</h2>
          <p className="text-sm text-[#505f76] mt-1">
            مشاهده و مدیریت تمامی مخاطبین و دسته‌بندی‌های سازمانی
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#727783] absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="جستجوی نام یا شماره..."
              className="h-10 pr-9 pl-4 bg-[#f8fafc] rounded-lg border border-[#cbd5e1] focus:ring-2 focus:ring-[#00488d] focus:border-[#00488d] text-xs text-[#191c21] w-64 outline-none transition-all placeholder:text-[#727783]"
            />
          </div>

          <Button
            variant="secondary"
            size="md"
            onClick={handleExportCSV}
            icon={<FileSpreadsheet className="w-4 h-4 text-[#137333]" />}
          >
            خروجی اکسل
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={handleOpenAdd}
            icon={<UserPlus className="w-4 h-4" />}
          >
            افزودن مخاطب
          </Button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-xs overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-[#e2e8f0] flex flex-wrap items-center justify-between gap-3 bg-[#f8fafc]">
          <div className="flex flex-wrap items-center gap-2">
            {/* Group Filter */}
            <div className="relative">
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="h-9 pr-3 pl-8 bg-white border border-[#cbd5e1] rounded-lg text-xs text-[#505f76] font-medium outline-none focus:ring-2 focus:ring-[#00488d] cursor-pointer"
              >
                <option value="all">همه گروه‌ها</option>
                <option value="مشتریان ویژه">مشتریان ویژه</option>
                <option value="تامین‌کنندگان">تامین‌کنندگان</option>
                <option value="کارمندان">کارمندان</option>
                <option value="شرکای تجاری">شرکای تجاری</option>
                <option value="مشتریان عادی">مشتریان عادی</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="h-9 pr-3 pl-8 bg-white border border-[#cbd5e1] rounded-lg text-xs text-[#505f76] font-medium outline-none focus:ring-2 focus:ring-[#00488d] cursor-pointer"
              >
                <option value="all">همه وضعیت‌ها</option>
                <option value="active">فعال</option>
                <option value="pending">در انتظار تایید</option>
                <option value="inactive">غیرفعال</option>
              </select>
            </div>

            {/* Sort Filter */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="h-9 pr-3 pl-8 bg-white border border-[#cbd5e1] rounded-lg text-xs text-[#505f76] font-medium outline-none focus:ring-2 focus:ring-[#00488d] cursor-pointer"
              >
                <option value="newest">مرتب‌سازی: پیش‌فرض</option>
                <option value="name">مرتب‌سازی: نام (الفبا)</option>
                <option value="activity">مرتب‌سازی: آخرین فعالیت</option>
              </select>
            </div>

            {/* Bulk actions */}
            {selectedIds.length > 0 && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => setIsBulkDeleteOpen(true)}
                icon={<Trash2 className="w-3.5 h-3.5" />}
              >
                حذف ({selectedIds.length.toLocaleString('fa-IR')})
              </Button>
            )}
          </div>

          <div className="text-xs text-[#505f76] flex items-center gap-2">
            <span>
              نمایش{' '}
              {paginatedContacts.length > 0
                ? `${(currentPage - 1) * rowsPerPage + 1} تا ${Math.min(
                    currentPage * rowsPerPage,
                    sortedContacts.length
                  )}`
                : 0}{' '}
              از {sortedContacts.length.toLocaleString('fa-IR')} مخاطب
            </span>
          </div>
        </div>

        {/* Data Table */}
        {sortedContacts.length === 0 ? (
          <EmptyState
            icon={Users}
            title="هنوز مخاطبی با این مشخصات یافت نشد"
            description="می‌توانید فیلترها را ریست کنید یا یک مخاطب جدید ثبت نمایید."
            actionLabel="افزودن مخاطب جدید"
            onAction={handleOpenAdd}
            secondaryActionLabel={searchTerm || selectedGroup !== 'all' ? 'پاکسازی فیلترها' : undefined}
            onSecondaryAction={() => {
              setSearchTerm('');
              setSelectedGroup('all');
              setSelectedStatus('all');
            }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-[#f1f5f9] text-xs font-semibold text-[#505f76] border-b border-[#e2e8f0]">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={
                        paginatedContacts.length > 0 &&
                        selectedIds.length === paginatedContacts.length
                      }
                      onChange={toggleSelectAll}
                      className="rounded border-[#cbd5e1] text-[#00488d] focus:ring-[#00488d] cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-4 font-semibold">نام و نام خانوادگی</th>
                  <th className="py-3 px-4 font-semibold">شماره تماس</th>
                  <th className="py-3 px-4 font-semibold">گروه</th>
                  <th className="py-3 px-4 font-semibold">وضعیت</th>
                  <th className="py-3 px-4 font-semibold">آخرین فعالیت</th>
                  <th className="py-3 px-4 font-semibold w-24 text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9] text-xs text-[#191c21]">
                {paginatedContacts.map((contact) => {
                  const isSelected = selectedIds.includes(contact.id);
                  return (
                    <tr
                      key={contact.id}
                      className={`hover:bg-[#f0f9ff] transition-colors group h-14 ${
                        isSelected ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <td className="py-3 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(contact.id)}
                          className="rounded border-[#cbd5e1] text-[#00488d] focus:ring-[#00488d] cursor-pointer"
                        />
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#d6e3ff] text-[#00488d] flex items-center justify-center font-bold text-xs shrink-0">
                            {contact.initials}
                          </div>
                          <div>
                            <p className="font-semibold text-[#191c21]">{contact.name}</p>
                            {contact.email && (
                              <p className="text-[11px] text-[#727783]">{contact.email}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-[#505f76] font-mono" dir="ltr">
                        {contact.phone}
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#f1f5f9] text-[#334155] border border-[#e2e8f0]">
                          {contact.group}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <Badge status={contact.status} size="sm" />
                      </td>

                      <td className="py-3 px-4 text-[#505f76]">
                        {contact.lastActivity}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleOpenEdit(contact)}
                            className="p-1.5 text-[#505f76] hover:text-[#00488d] hover:bg-[#d6e3ff]/50 rounded-md transition-colors"
                            title="ویرایش"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingContactId(contact.id)}
                            className="p-1.5 text-[#505f76] hover:text-[#ba1a1a] hover:bg-rose-50 rounded-md transition-colors"
                            title="حذف"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {sortedContacts.length > 0 && (
          <div className="p-4 border-t border-[#e2e8f0] bg-[#f8fafc] flex flex-wrap items-center justify-between gap-4 mt-auto">
            {/* Page navigation */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-[#cbd5e1] text-[#505f76] hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${
                    currentPage === pageNum
                      ? 'bg-[#00488d] text-white shadow-xs'
                      : 'border border-[#cbd5e1] bg-white text-[#505f76] hover:bg-[#f1f5f9]'
                  }`}
                >
                  {pageNum.toLocaleString('fa-IR')}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-[#cbd5e1] text-[#505f76] hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Rows per page selector */}
            <div className="flex items-center gap-2 text-xs text-[#505f76]">
              <span>تعداد ردیف در صفحه:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-[#cbd5e1] rounded-lg bg-white text-[#191c21] py-1 px-2 text-xs focus:ring-2 focus:ring-[#00488d] outline-none"
              >
                <option value={5}>۵</option>
                <option value={10}>۱۰</option>
                <option value={20}>۲۰</option>
                <option value={50}>۵۰</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Contact Modal */}
      <Modal
        isOpen={isAddModalOpen || editingContact !== null}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingContact(null);
        }}
        title={editingContact ? 'ویرایش اطلاعات مخاطب' : 'افزودن مخاطب جدید'}
        subtitle="مشخصات مخاطب را به دقت وارد نمایید."
        icon={<UserPlus className="w-5 h-5 text-[#00488d]" />}
        maxWidth="md"
        footer={
          <>
            <Button
              variant="ghost"
              size="md"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingContact(null);
              }}
            >
              انصراف
            </Button>
            <Button variant="primary" size="md" onClick={handleSaveContact}>
              {editingContact ? 'ذخیره تغییرات' : 'ثبت مخاطب'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveContact} className="space-y-4 text-right">
          {/* Name Field */}
          <div>
            <label className="block text-xs font-semibold text-[#191c21] mb-1.5">
              نام و نام خانوادگی <span className="text-[#ba1a1a]">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="مثال: علی محمدی"
              className={`w-full h-10 px-3.5 rounded-lg border text-xs text-[#191c21] bg-[#f8fafc] focus:bg-white focus:ring-2 focus:ring-[#00488d] outline-none transition-all ${
                formErrors.name ? 'border-[#ba1a1a] ring-1 ring-[#ba1a1a]' : 'border-[#cbd5e1]'
              }`}
            />
            {formErrors.name && (
              <p className="text-[11px] text-[#ba1a1a] mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {formErrors.name}
              </p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-xs font-semibold text-[#191c21] mb-1.5">
              شماره همراه <span className="text-[#ba1a1a]">*</span>
            </label>
            <input
              type="text"
              dir="ltr"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="09123456789"
              className={`w-full h-10 px-3.5 rounded-lg border text-xs text-[#191c21] bg-[#f8fafc] focus:bg-white focus:ring-2 focus:ring-[#00488d] outline-none transition-all font-mono ${
                formErrors.phone ? 'border-[#ba1a1a] ring-1 ring-[#ba1a1a]' : 'border-[#cbd5e1]'
              }`}
            />
            {formErrors.phone && (
              <p className="text-[11px] text-[#ba1a1a] mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {formErrors.phone}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold text-[#191c21] mb-1.5">
              آدرس ایمیل (اختیاری)
            </label>
            <input
              type="email"
              dir="ltr"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="example@domain.com"
              className="w-full h-10 px-3.5 rounded-lg border border-[#cbd5e1] text-xs text-[#191c21] bg-[#f8fafc] focus:bg-white focus:ring-2 focus:ring-[#00488d] outline-none transition-all"
            />
          </div>

          {/* Group and Status Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#191c21] mb-1.5">
                گروه مخاطب
              </label>
              <select
                value={formData.group}
                onChange={(e) => setFormData({ ...formData, group: e.target.value as ContactGroup })}
                className="w-full h-10 px-3 rounded-lg border border-[#cbd5e1] text-xs text-[#191c21] bg-white focus:ring-2 focus:ring-[#00488d] outline-none cursor-pointer"
              >
                <option value="مشتریان ویژه">مشتریان ویژه</option>
                <option value="تامین‌کنندگان">تامین‌کنندگان</option>
                <option value="کارمندان">کارمندان</option>
                <option value="شرکای تجاری">شرکای تجاری</option>
                <option value="مشتریان عادی">مشتریان عادی</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#191c21] mb-1.5">
                وضعیت حساب
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as ContactStatus })}
                className="w-full h-10 px-3 rounded-lg border border-[#cbd5e1] text-xs text-[#191c21] bg-white focus:ring-2 focus:ring-[#00488d] outline-none cursor-pointer"
              >
                <option value="active">فعال</option>
                <option value="pending">در انتظار تایید</option>
                <option value="inactive">غیرفعال</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-[#191c21] mb-1.5">
              یادداشت و توضیحات
            </label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="توضیحات تکمیلی در مورد مخاطب..."
              className="w-full p-3 rounded-lg border border-[#cbd5e1] text-xs text-[#191c21] bg-[#f8fafc] focus:bg-white focus:ring-2 focus:ring-[#00488d] outline-none transition-all resize-none"
            />
          </div>
        </form>
      </Modal>

      {/* Delete Single Contact Confirmation */}
      <ConfirmDialog
        isOpen={deletingContactId !== null}
        onClose={() => setDeletingContactId(null)}
        onConfirm={() => {
          if (deletingContactId) {
            onDeleteContact(deletingContactId);
            showToast({
              type: 'success',
              title: 'مخاطب حذف شد',
              message: 'رکورد با موفقیت از سیستم پاک گردید.',
            });
            setDeletingContactId(null);
          }
        }}
        title="حذف مخاطب"
        message="آیا از حذف این مخاطب از سامانه اطمینان دارید؟ این عملیات قابل بازگشت نخواهد بود."
        confirmLabel="حذف مخاطب"
        variant="danger"
      />

      {/* Bulk Delete Confirmation */}
      <ConfirmDialog
        isOpen={isBulkDeleteOpen}
        onClose={() => setIsBulkDeleteOpen(false)}
        onConfirm={handleBulkDeleteConfirm}
        title="حذف گروهی مخاطبین"
        message={`آیا از حذف ${selectedIds.length} مخاطب انتخاب شده اطمینان دارید؟ این اطلاعات به طور کامل حذف خواهند شد.`}
        confirmLabel="حذف همه انتخاب‌ها"
        variant="danger"
      />
    </div>
  );
};

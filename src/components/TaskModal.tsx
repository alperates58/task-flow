import React, { useState, useEffect } from 'react';
import { X, Sparkles, AlertCircle } from 'lucide-react';
import { Task, TaskPriority, TaskStatus } from '../types/kanban';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>, editId?: string) => void;
  taskToEdit?: Task | null;
  defaultStatus?: TaskStatus;
}

const PRESET_CATEGORIES = ['Frontend', 'Backend', 'Tasarım', 'Test', 'Optimizasyon', 'Dokümantasyon', 'DevOps'];

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  taskToEdit,
  defaultStatus = 'todo'
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(defaultStatus);
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [category, setCategory] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setStatus(taskToEdit.status);
      setPriority(taskToEdit.priority);
      setCategory(taskToEdit.category || '');
      setDueDate(taskToEdit.dueDate || '');
    } else {
      setTitle('');
      setDescription('');
      setStatus(defaultStatus);
      setPriority('medium');
      setCategory('');
      setDueDate('');
    }
    setError('');
  }, [taskToEdit, defaultStatus, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Lütfen bir görev başlığı girin.');
      return;
    }

    onSave(
      {
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        priority,
        category: category.trim() || undefined,
        dueDate: dueDate || undefined,
      },
      taskToEdit?.id
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Başlık Alanı */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {taskToEdit ? 'Görevi Düzenle' : 'Yeni Görev Ekle'}
              </h3>
              <p className="text-xs text-slate-500">
                {taskToEdit ? 'Görev ayrıntılarını güncelleyin' : 'Panoya eklenecek yeni bir iş kartı oluşturun'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Alanı */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 text-xs rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Görev Başlığı */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Görev Başlığı <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              placeholder="Örn: Kullanıcı Giriş Ekranını Kodla"
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* Açıklama */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Açıklama (İsteğe bağlı)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Görevle ilgili önemli notlar veya kabul kriterleri..."
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-900 placeholder:text-slate-400 resize-none"
            />
          </div>

          {/* Sütun & Öncelik */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Sütun / Durum */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Sütun (Durum)
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-slate-800"
              >
                <option value="todo">📋 Yapılacaklar</option>
                <option value="in-progress">⚡ Devam Edenler</option>
                <option value="done">✅ Tamamlananlar</option>
              </select>
            </div>

            {/* Öncelik */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Öncelik
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-slate-800"
              >
                <option value="low">🟢 Düşük</option>
                <option value="medium">🔵 Orta</option>
                <option value="high">🟠 Yüksek</option>
                <option value="urgent">🔴 Acil</option>
              </select>
            </div>
          </div>

          {/* Kategori ve Son Tarih */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Kategori */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Kategori / Etiket
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Örn: Frontend, Tasarım..."
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-slate-800 placeholder:text-slate-400"
              />
              <div className="flex flex-wrap gap-1 mt-1.5">
                {PRESET_CATEGORIES.slice(0, 4).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Son Teslim Tarihi */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Son Teslim Tarihi
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-slate-800"
              />
            </div>
          </div>

          {/* Butonlar */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-800 rounded-lg shadow-sm shadow-brand-600/30 transition-colors"
            >
              {taskToEdit ? 'Değişiklikleri Kaydet' : 'Görevi Oluştur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

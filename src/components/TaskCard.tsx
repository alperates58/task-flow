import React from 'react';
import { Calendar, Tag, Edit3, Trash2, ChevronLeft, ChevronRight, AlertCircle, Clock } from 'lucide-react';
import { Task, TaskPriority, TaskStatus } from '../types/kanban';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onMoveStatus: (taskId: string, targetStatus: TaskStatus) => void;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDragEnd: (e: React.DragEvent) => void;
}

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; badgeClass: string; dotClass: string }> = {
  urgent: {
    label: 'Acil',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200/80',
    dotClass: 'bg-rose-500'
  },
  high: {
    label: 'Yüksek',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200/80',
    dotClass: 'bg-amber-500'
  },
  medium: {
    label: 'Orta',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200/80',
    dotClass: 'bg-blue-500'
  },
  low: {
    label: 'Düşük',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    dotClass: 'bg-slate-400'
  }
};

const STATUS_ORDER: TaskStatus[] = ['todo', 'in-progress', 'done'];

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onMoveStatus,
  onDragStart,
  onDragEnd
}) => {
  const priorityInfo = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
  const currentIndex = STATUS_ORDER.indexOf(task.status);
  const prevStatus = currentIndex > 0 ? STATUS_ORDER[currentIndex - 1] : null;
  const nextStatus = currentIndex < STATUS_ORDER.length - 1 ? STATUS_ORDER[currentIndex + 1] : null;

  // Son tarih kontrolü
  let isOverdue = false;
  let formattedDueDate = '';
  if (task.dueDate) {
    const dueTime = new Date(task.dueDate + 'T23:59:59').getTime();
    isOverdue = task.status !== 'done' && dueTime < Date.now();
    try {
      const d = new Date(task.dueDate);
      formattedDueDate = d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
    } catch {
      formattedDueDate = task.dueDate;
    }
  }

  const prevStatusLabels: Record<TaskStatus, string> = {
    'todo': 'Yapılacaklara Al',
    'in-progress': 'Devam Edenlere Al',
    'done': 'Tamamlananlara Al'
  };

  const nextStatusLabels: Record<TaskStatus, string> = {
    'todo': 'Yapılacaklara Al',
    'in-progress': 'Devam Ediyor Yap',
    'done': 'Tamamlandı Yap'
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onDragEnd={onDragEnd}
      className="group relative bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-grab active:cursor-grabbing select-none"
    >
      {/* Üst Kısım: Öncelik ve Kategori */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Öncelik Rozeti */}
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold border ${priorityInfo.badgeClass}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${priorityInfo.dotClass}`} />
            {priorityInfo.label}
          </span>

          {/* Kategori */}
          {task.category && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
              <Tag className="w-3 h-3 text-slate-400" />
              {task.category}
            </span>
          )}
        </div>

        {/* Eylem Butonları (Hover veya dokunmatik) */}
        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            title="Görevi Düzenle"
            className="p-1 rounded-md text-slate-400 hover:text-brand-600 hover:bg-slate-100 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task);
            }}
            title="Görevi Sil"
            className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Başlık */}
      <h3 className={`text-sm font-semibold text-slate-800 leading-snug mb-1.5 ${task.status === 'done' ? 'line-through text-slate-500' : ''}`}>
        {task.title}
      </h3>

      {/* Açıklama */}
      {task.description && (
        <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Alt Bilgi & Hızlı Taşıma Butonları */}
      <div className="pt-2.5 mt-2 border-t border-slate-100 flex items-center justify-between gap-2">
        {/* Son Tarih */}
        <div className="flex items-center gap-1 text-xs">
          {task.dueDate ? (
            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded ${isOverdue ? 'text-rose-700 bg-rose-50 font-semibold' : 'text-slate-500 bg-slate-50'}`}>
              {isOverdue ? <AlertCircle className="w-3 h-3 text-rose-500" /> : <Calendar className="w-3 h-3 text-slate-400" />}
              <span>{formattedDueDate}</span>
              {isOverdue && <span className="text-[10px] uppercase font-bold">(Gecikti)</span>}
            </span>
          ) : (
            <span className="text-slate-300 text-[11px] flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Tarih yok
            </span>
          )}
        </div>

        {/* Hızlı Taşıma Kontrolleri (Mobil ve tek tık için) */}
        <div className="flex items-center gap-1">
          {prevStatus && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMoveStatus(task.id, prevStatus);
              }}
              title={prevStatusLabels[prevStatus]}
              className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-slate-100 hover:bg-brand-50 hover:text-brand-600 text-slate-500 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          )}

          {nextStatus && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMoveStatus(task.id, nextStatus);
              }}
              title={nextStatusLabels[nextStatus]}
              className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-slate-100 hover:bg-brand-50 hover:text-brand-600 text-slate-500 transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

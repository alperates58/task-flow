import React, { useState } from 'react';
import { Plus, Inbox } from 'lucide-react';
import { Task, TaskStatus, ColumnDefinition } from '../types/kanban';
import { TaskCard } from './TaskCard';

interface KanbanColumnProps {
  column: ColumnDefinition;
  tasks: Task[];
  onAddTaskToColumn: (status: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  onMoveStatus: (taskId: string, targetStatus: TaskStatus) => void;
  onDropTask: (taskId: string, targetStatus: TaskStatus) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  tasks,
  onAddTaskToColumn,
  onEditTask,
  onDeleteTask,
  onMoveStatus,
  onDropTask
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Sadece sütunun sınırlarından tamamen çıkıldığında bırak
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      onDropTask(taskId, column.id);
    }
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setIsDragOver(false);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col bg-slate-100/80 rounded-2xl p-3 sm:p-4 border transition-all duration-200 min-h-[500px] ${
        isDragOver
          ? 'border-brand-500 bg-brand-50/50 ring-2 ring-brand-500/20'
          : 'border-slate-200/80'
      }`}
    >
      {/* Sütun Başlığı */}
      <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-200/60">
        <div className="flex items-center gap-2.5">
          <span className={`w-3 h-3 rounded-full ${column.accentColor} shadow-xs`} />
          <h2 className="font-bold text-slate-800 text-sm tracking-tight">{column.title}</h2>
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${column.badgeBg}`}>
            {tasks.length}
          </span>
        </div>

        {/* Bu sütuna ekle butonu */}
        <button
          onClick={() => onAddTaskToColumn(column.id)}
          title={`${column.title} sütununa yeni görev ekle`}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200 transition-all text-xs font-medium inline-flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Görev Kartları Listesi */}
      <div className="flex-1 flex flex-col gap-2.5 overflow-y-auto pr-0.5">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            onMoveStatus={onMoveStatus}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          />
        ))}

        {/* Boş Durum Göstergesi */}
        {tasks.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-slate-200 rounded-xl my-2 bg-white/40">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
              <Inbox className="w-5 h-5" />
            </div>
            <p className="text-xs font-medium text-slate-500">Henüz görev yok</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Kart sürükleyebilir veya buraya yeni ekleyebilirsiniz.
            </p>
            <button
              onClick={() => onAddTaskToColumn(column.id)}
              className="mt-3 px-2.5 py-1 text-xs font-semibold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-md transition-colors"
            >
              + Görev Ekle
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

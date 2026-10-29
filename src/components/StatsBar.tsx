import React from 'react';
import { CheckCircle2, Clock, ListTodo, AlertTriangle } from 'lucide-react';
import { Task } from '../types/kanban';

interface StatsBarProps {
  tasks: Task[];
}

export const StatsBar: React.FC<StatsBarProps> = ({ tasks }) => {
  const total = tasks.length;
  const todoCount = tasks.filter(t => t.status === 'todo').length;
  const inProgressCount = tasks.filter(t => t.status === 'in-progress').length;
  const doneCount = tasks.filter(t => t.status === 'done').length;
  const urgentCount = tasks.filter(t => t.status !== 'done' && (t.priority === 'urgent' || t.priority === 'high')).length;

  const percent = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Yapılacaklar */}
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-600">Yapılacak</p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl sm:text-2xl font-bold text-slate-800">{todoCount}</span>
              <span className="text-xs text-slate-400">/ {total} toplam</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <ListTodo className="w-5 h-5" />
          </div>
        </div>

        {/* Devam Edenler */}
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-600">Devam Eden</p>
            <p className="text-xl sm:text-2xl font-bold text-slate-800 mt-0.5">{inProgressCount}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Tamamlanan & Oran */}
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div className="flex-1 pr-2">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600">Tamamlanan</p>
              <span className="text-xs font-bold text-emerald-700">%{percent}</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">{doneCount}</p>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Acil / Kritik Görevler */}
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-rose-600">Kritik Bekleyen</p>
            <p className="text-xl sm:text-2xl font-bold text-slate-800 mt-0.5">{urgentCount}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

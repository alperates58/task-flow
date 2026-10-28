import React from 'react';
import { Plus, Search, Filter, RotateCcw, CheckCircle2, KanbanSquare } from 'lucide-react';
import { FilterOptions, TaskPriority } from '../types/kanban';

interface NavbarProps {
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  onOpenCreateModal: () => void;
  onResetToDefault: () => void;
  totalTasks: number;
  completedTasks: number;
  categories: string[];
}

export const Navbar: React.FC<NavbarProps> = ({
  filters,
  setFilters,
  onOpenCreateModal,
  onResetToDefault,
  totalTasks,
  completedTasks,
  categories
}) => {
  const percent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Üst Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & Başlık */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
                <KanbanSquare className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-slate-900 tracking-tight">Mini Kanban</h1>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                    v1.0
                  </span>
                </div>
                <p className="text-xs text-slate-500">Kişisel ve Ekip Görev Takip Panosu</p>
              </div>
            </div>

            {/* Mobilde Yeni Görev Butonu */}
            <button
              onClick={onOpenCreateModal}
              className="md:hidden inline-flex items-center gap-1.5 px-3 py-2 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white rounded-lg text-sm font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Görev</span>
            </button>
          </div>

          {/* İlerleme Özeti & Eylemler */}
          <div className="flex flex-wrap items-center gap-3">
            {/* İlerleme Rozeti */}
            <div className="hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>İlerleme:</span>
              <span className="font-bold text-slate-900">%{percent}</span>
              <span className="text-slate-400">({completedTasks}/{totalTasks})</span>
            </div>

            {/* Örnek Verilere Sıfırla */}
            <button
              onClick={onResetToDefault}
              title="Örnek Görevleri Yeniden Yükle"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Örnekleri Yükle</span>
            </button>

            {/* Masaüstü Yeni Görev Butonu */}
            <button
              onClick={onOpenCreateModal}
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white rounded-lg text-sm font-semibold shadow-sm shadow-brand-600/20 transition-all hover:shadow"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Yeni Görev Ekle</span>
            </button>
          </div>
        </div>

        {/* Filtre ve Arama Alanı */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Arama Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              placeholder="Görevlerde ara (başlık veya açıklama)..."
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-lg outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-800 placeholder:text-slate-400"
            />
            {filters.searchQuery && (
              <button
                onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold px-1"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {/* Öncelik Filtresi */}
            <div className="flex items-center gap-1.5 shrink-0">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filters.priorityFilter}
                onChange={(e) => setFilters(prev => ({ ...prev, priorityFilter: e.target.value as TaskPriority | 'all' }))}
                className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              >
                <option value="all">Tüm Öncelikler</option>
                <option value="urgent">Acil</option>
                <option value="high">Yüksek</option>
                <option value="medium">Orta</option>
                <option value="low">Düşük</option>
              </select>
            </div>

            {/* Kategori Filtresi */}
            {categories.length > 0 && (
              <select
                value={filters.categoryFilter}
                onChange={(e) => setFilters(prev => ({ ...prev, categoryFilter: e.target.value }))}
                className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shrink-0"
              >
                <option value="all">Tüm Kategoriler</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            )}

            {/* Sıralama */}
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as FilterOptions['sortBy'] }))}
              className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shrink-0"
            >
              <option value="createdAt-desc">En Yeni Eklenen</option>
              <option value="createdAt-asc">En Eski Eklenen</option>
              <option value="priority-desc">Önceliğe Göre (Acil → Düşük)</option>
              <option value="dueDate-asc">Son Teslim Tarihi</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};

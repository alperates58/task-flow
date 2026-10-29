import { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { KanbanColumn } from './components/KanbanColumn';
import { StatsBar } from './components/StatsBar';
import { TaskModal } from './components/TaskModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { Task, TaskStatus, ColumnDefinition, FilterOptions } from './types/kanban';
import { loadTasksFromStorage, saveTasksToStorage, INITIAL_TASKS } from './utils/storage';
import { Sparkles, Layers } from 'lucide-react';

const COLUMNS: ColumnDefinition[] = [
  {
    id: 'todo',
    title: 'Yapılacaklar',
    description: 'Başlanmayı bekleyen görevler',
    accentColor: 'bg-blue-500',
    bgColor: 'bg-blue-50/40',
    badgeBg: 'bg-blue-100 text-blue-700'
  },
  {
    id: 'in-progress',
    title: 'Devam Edenler',
    description: 'Şu anda üzerinde çalışılanlar',
    accentColor: 'bg-amber-500',
    bgColor: 'bg-amber-50/40',
    badgeBg: 'bg-amber-100 text-amber-700'
  },
  {
    id: 'done',
    title: 'Tamamlananlar',
    description: 'Başarıyla bitirilen görevler',
    accentColor: 'bg-emerald-500',
    bgColor: 'bg-emerald-50/40',
    badgeBg: 'bg-emerald-100 text-emerald-700'
  }
];

export function App() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasksFromStorage());
  
  // Filtreleme Durumu
  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: '',
    priorityFilter: 'all',
    categoryFilter: 'all',
    sortBy: 'createdAt-desc'
  });

  // Modal Durumları
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [defaultColumnStatus, setDefaultColumnStatus] = useState<TaskStatus>('todo');

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  // Mobilde aktif sekme (İsteğe bağlı sekmeli görünüm veya tümü)
  const [mobileTab, setMobileTab] = useState<TaskStatus | 'all'>('all');

  // Görevler değiştikçe LocalStorage güncelle
  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  // Kategorilerin benzersiz listesi
  const categories = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach(t => {
      if (t.category && t.category.trim()) {
        set.add(t.category.trim());
      }
    });
    return Array.from(set);
  }, [tasks]);

  // Filtreleme ve Sıralama
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Metin araması
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDesc = task.description?.toLowerCase().includes(query);
        const matchesCat = task.category?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesCat) return false;
      }

      // Öncelik filtresi
      if (filters.priorityFilter !== 'all' && task.priority !== filters.priorityFilter) {
        return false;
      }

      // Kategori filtresi
      if (filters.categoryFilter !== 'all' && task.category !== filters.categoryFilter) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'createdAt-asc') {
        return a.createdAt - b.createdAt;
      }
      if (filters.sortBy === 'createdAt-desc') {
        return b.createdAt - a.createdAt;
      }
      if (filters.sortBy === 'priority-desc') {
        const priorityWeights: Record<string, number> = { urgent: 4, high: 3, medium: 2, low: 1 };
        return (priorityWeights[b.priority] || 0) - (priorityWeights[a.priority] || 0);
      }
      if (filters.sortBy === 'dueDate-asc') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      }
      return 0;
    });
  }, [tasks, filters]);

  // Sütunlara göre görev gruplama
  const tasksByColumn = useMemo(() => {
    const map: Record<TaskStatus, Task[]> = {
      'todo': [],
      'in-progress': [],
      'done': []
    };
    filteredTasks.forEach(task => {
      if (map[task.status]) {
        map[task.status].push(task);
      } else {
        map['todo'].push(task);
      }
    });
    return map;
  }, [filteredTasks]);

  // Yeni Görev Ekle / Düzenle Kaydet
  const handleSaveTask = (
    data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>,
    editId?: string
  ) => {
    const now = Date.now();
    if (editId) {
      // Düzenleme
      setTasks(prev =>
        prev.map(t => (t.id === editId ? { ...t, ...data, updatedAt: now } : t))
      );
    } else {
      // Yeni Görev
      const newTask: Task = {
        id: 'task_' + Math.random().toString(36).substring(2, 9) + '_' + now,
        ...data,
        createdAt: now,
        updatedAt: now,
      };
      setTasks(prev => [newTask, ...prev]);
    }
  };

  // Sürükle Bırak Bırakma
  const handleDropTask = (taskId: string, targetStatus: TaskStatus) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === taskId) {
          if (task.status === targetStatus) return task;
          return {
            ...task,
            status: targetStatus,
            updatedAt: Date.now()
          };
        }
        return task;
      })
    );
  };

  // Hızlı Durum Değiştirme
  const handleMoveStatus = (taskId: string, targetStatus: TaskStatus) => {
    handleDropTask(taskId, targetStatus);
  };

  // Silme Onayı
  const handleDeleteConfirm = () => {
    if (!taskToDelete) return;
    setTasks(prev => prev.filter(t => t.id !== taskToDelete.id));
    setTaskToDelete(null);
  };

  // Örnek verilere sıfırla
  const handleResetToDefault = () => {
    if (window.confirm('Örnek görevleri yeniden yüklemek istiyor musunuz? Mevcut değişiklikler sıfırlanacaktır.')) {
      setTasks(INITIAL_TASKS);
      setFilters({
        searchQuery: '',
        priorityFilter: 'all',
        categoryFilter: 'all',
        sortBy: 'createdAt-desc'
      });
    }
  };

  const completedCount = tasks.filter(t => t.status === 'done').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Üst Navigasyon & Filtreler */}
      <Navbar
        filters={filters}
        setFilters={setFilters}
        onOpenCreateModal={() => {
          setTaskToEdit(null);
          setDefaultColumnStatus('todo');
          setIsTaskModalOpen(true);
        }}
        onResetToDefault={handleResetToDefault}
        totalTasks={tasks.length}
        completedTasks={completedCount}
        categories={categories}
      />

      {/* İstatistikler */}
      <StatsBar tasks={tasks} />

      {/* Mobil Sütun Değiştirme Sekmeleri */}
      <div className="lg:hidden max-w-7xl mx-auto px-4 sm:px-6 w-full pt-2">
        <div className="flex bg-slate-200/80 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setMobileTab('all')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${mobileTab === 'all' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'}`}
          >
            Tümü
          </button>
          {COLUMNS.map(col => (
            <button
              key={col.id}
              onClick={() => setMobileTab(col.id)}
              className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 ${mobileTab === col.id ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'}`}
            >
              <span>{col.title.split(' ')[0]}</span>
              <span className="text-[10px] px-1 rounded-full bg-slate-100 text-slate-600 font-bold">
                {tasksByColumn[col.id].length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Kanban Sütun Alanı */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 w-full">
        {filteredTasks.length === 0 && tasks.length > 0 && (
          <div className="mb-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Arama ve filtreleme kriterlerinize uyan hiçbir görev bulunamadı.</span>
            </div>
            <button
              onClick={() => setFilters({ searchQuery: '', priorityFilter: 'all', categoryFilter: 'all', sortBy: 'createdAt-desc' })}
              className="font-bold underline hover:text-amber-950"
            >
              Filtreleri Temizle
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
          {COLUMNS.filter(col => mobileTab === 'all' || mobileTab === col.id).map(column => (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={tasksByColumn[column.id]}
              onAddTaskToColumn={(status) => {
                setTaskToEdit(null);
                setDefaultColumnStatus(status);
                setIsTaskModalOpen(true);
              }}
              onEditTask={(task) => {
                setTaskToEdit(task);
                setIsTaskModalOpen(true);
              }}
              onDeleteTask={(task) => {
                setTaskToDelete(task);
                setIsDeleteModalOpen(true);
              }}
              onMoveStatus={handleMoveStatus}
              onDropTask={handleDropTask}
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-600" />
            <span className="font-semibold text-slate-700">Mini Kanban</span>
            <span>— Tarayıcıda yerel ve hızlı görev yönetimi</span>
          </div>
          <p className="text-slate-400 text-[11px]">
            Tüm veriler tarayıcınızın LocalStorage alanında saklanır.
          </p>
        </div>
      </footer>

      {/* Görev Ekle / Düzenle Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setTaskToEdit(null);
        }}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
        defaultStatus={defaultColumnStatus}
      />

      {/* Silme Onay Modalı */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setTaskToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        task={taskToDelete}
      />
    </div>
  );
}
export default App;

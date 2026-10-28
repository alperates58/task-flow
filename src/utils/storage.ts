import { Task } from '../types/kanban';

const STORAGE_KEY = 'mini_kanban_tasks_v1';

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Kullanıcı Arayüzü Tasarımını İncele',
    description: 'Figma üzerindeki yeni mobil navigasyon ve renk paleti taslaklarını değerlendirip geri bildirim paylaş.',
    status: 'todo',
    priority: 'high',
    category: 'Tasarım',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now() - 86400000 * 3,
  },
  {
    id: 'task-2',
    title: 'API Entegrasyon Testlerini Yaz',
    description: 'Kimlik doğrulama ve veri saklama uç noktaları için Jest / Vitest birim testlerini hazırla.',
    status: 'todo',
    priority: 'urgent',
    category: 'Backend',
    dueDate: new Date(Date.now() + 86400000 * 1).toISOString().split('T')[0],
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'task-3',
    title: 'Sürükle-Bırak (Drag & Drop) Deneyimini İyileştir',
    description: 'Kart taşınırken oluşan gölge ve animasyon efektlerini pürüzsüzleştir, mobilde dokunmatik kontrolleri test et.',
    status: 'in-progress',
    priority: 'medium',
    category: 'Frontend',
    dueDate: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
    createdAt: Date.now() - 86400000 * 1,
    updatedAt: Date.now() - 86400000 * 1,
  },
  {
    id: 'task-4',
    title: 'Performans ve Yük Analizi',
    description: 'Lighthouse skorlarını incele ve görsel varlıkların sıkıştırma oranlarını optimize et.',
    status: 'in-progress',
    priority: 'low',
    category: 'Optimizasyon',
    dueDate: new Date(Date.now() + 86400000 * 6).toISOString().split('T')[0],
    createdAt: Date.now() - 86400000 * 4,
    updatedAt: Date.now() - 86400000 * 1,
  },
  {
    id: 'task-5',
    title: 'Proje Mimarisi ve Vite Kurulumu',
    description: 'React 18, TypeScript, Tailwind CSS ve temel bileşen yapısı oluşturuldu.',
    status: 'done',
    priority: 'high',
    category: 'Kurulum',
    dueDate: new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0],
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 86400000 * 1,
  },
  {
    id: 'task-6',
    title: 'Dark / Light Tema Renk Paleti Tanımlamaları',
    description: 'Tasarım tokenları ve kontrast oranları WCAG standartlarına uygun hale getirildi.',
    status: 'done',
    priority: 'low',
    category: 'Tasarım',
    dueDate: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    createdAt: Date.now() - 86400000 * 6,
    updatedAt: Date.now() - 86400000 * 2,
  }
];

export const loadTasksFromStorage = (): Task[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TASKS));
      return INITIAL_TASKS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return INITIAL_TASKS;
  } catch (err) {
    console.error('LocalStorage okuma hatası:', err);
    return INITIAL_TASKS;
  }
};

export const saveTasksToStorage = (tasks: Task[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (err) {
    console.error('LocalStorage yazma hatası:', err);
  }
};

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  category?: string;
  dueDate?: string;
  createdAt: number;
  updatedAt: number;
}

export interface ColumnDefinition {
  id: TaskStatus;
  title: string;
  description: string;
  accentColor: string;
  bgColor: string;
  badgeBg: string;
}

export interface FilterOptions {
  searchQuery: string;
  priorityFilter: TaskPriority | 'all';
  categoryFilter: string;
  sortBy: 'createdAt-desc' | 'createdAt-asc' | 'priority-desc' | 'dueDate-asc';
}

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export interface Note {
  id: string;
  content: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  notes: Note[];
  assignedTo?: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface TaskState {
  tasks: {
    ids: string[];
    entities: {
      tasks: Record<string, Task>;
      notes: Record<string, Note>;
    };
  };
  currentTaskId: string | null;
  loading: boolean;
  error: string | null;
}

export interface TaskFilter {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  assignedTo?: string[];
  createdBy?: string[];
  tags?: string[];
  startDate?: Date;
  endDate?: Date;
}

export interface TaskStats {
  total: number;
  byStatus: {
    [key in TaskStatus]: number;
  };
  byPriority: {
    [key in TaskPriority]: number;
  };
  byAssignee: Record<string, number>;
  byTag: Record<string, number>;
  completionRate: number;
  averageCompletionTime: number;
}

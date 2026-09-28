import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CheckSquare,
  Plus,
  Sparkles,
  Calendar,
  AlertTriangle,
  Trash2,
  CheckCircle2,
  Circle,
  Clock,
} from 'lucide-react';

interface TasksViewProps {
  onOpenAddTask: () => void;
}

export const TasksView: React.FC<TasksViewProps> = ({ onOpenAddTask }) => {
  const { tasks, toggleTaskStatus, deleteTask, addTask } = useApp();

  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'ai'>('all');

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'pending') return t.status === 'pending';
    if (filter === 'completed') return t.status === 'completed';
    if (filter === 'ai') return t.aiSuggested;
    return true;
  });

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return (
          <span className="text-[10px] font-semibold uppercase text-rose-600 dark:text-rose-400">
            High Priority
          </span>
        );
      case 'medium':
        return (
          <span className="text-[10px] font-semibold uppercase text-amber-600 dark:text-amber-400">
            Medium
          </span>
        );
      case 'low':
        return (
          <span className="text-[10px] font-semibold uppercase text-neutral-400">
            Low
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Tasks & Reminders
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Stay organized with customer follow-ups, supply restocking, and proactive AI tasks.
          </p>
        </div>

        <button
          onClick={onOpenAddTask}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Task</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl w-fit">
        {[
          { id: 'all', label: 'All Tasks' },
          { id: 'pending', label: 'Pending' },
          { id: 'completed', label: 'Completed' },
          { id: 'ai', label: 'AI Suggested ✨' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setFilter(item.id as any)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              filter === item.id
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            {filteredTasks.length} tasks
          </span>
          <span className="text-xs text-neutral-400">
            Check off items as you complete them
          </span>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="py-16 text-center">
            <CheckSquare className="w-10 h-10 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
              No tasks in this view
            </h4>
            <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
              You are all caught up! Create a new reminder or ask the AI Administrator for suggestions.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {filteredTasks.map((task) => {
              const isCompleted = task.status === 'completed';

              return (
                <div
                  key={task.id}
                  className={`py-3.5 flex items-center justify-between gap-3 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 px-2 rounded-xl transition-colors ${
                    isCompleted ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className="mt-0.5 text-neutral-400 hover:text-indigo-600 transition-colors cursor-pointer"
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-semibold ${
                            isCompleted
                              ? 'line-through text-neutral-400'
                              : 'text-neutral-900 dark:text-white'
                          }`}
                        >
                          {task.title}
                        </span>

                        {task.aiSuggested && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-1.5 py-0.5 rounded">
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>AI Suggested</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-mono">
                        <Calendar className="w-3 h-3 text-neutral-400" />
                        <span>Due: {task.dueDate}</span>
                        <span>·</span>
                        <span className="capitalize">{task.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {getPriorityBadge(task.priority)}

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                      title="Delete Task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

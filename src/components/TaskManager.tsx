import { Component } from 'react';
import type { Task } from '../types/Task';
import TaskForm from './TaskForm';
import TaskList from './TaskList';

interface TaskManagerState {
    tasks: Task[];
    editingTask: Task | null;
    filter: 'all' | 'active' | 'completed';
}

const STORAGE_KEY = 'task-manager-tasks';

class TaskManager extends Component<Record<string, never>, TaskManagerState> {
    constructor(props: Record<string, never>) {
        super(props);
        this.state = {
            tasks: [],
            editingTask: null,
            filter: 'all',
        };
    }

    // Lifecycle: load tasks from localStorage when component mounts
    componentDidMount() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const tasks: Task[] = JSON.parse(stored);
                this.setState({ tasks });
            } catch {
                console.error('Failed to parse tasks from localStorage');
            }
        }
    }

    // Lifecycle: save tasks to localStorage whenever tasks change
    componentDidUpdate(_prevProps: Record<string, never>, prevState: TaskManagerState) {
        if (prevState.tasks !== this.state.tasks) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state.tasks));
        }
    }

    handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
        const newTask: Task = {
            id: crypto.randomUUID(),
            ...taskData,
            completed: false,
            createdAt: new Date().toISOString(),
        };
        this.setState((prev) => ({ tasks: [newTask, ...prev.tasks] }));
    };

    handleDeleteTask = (id: string) => {
        this.setState((prev) => ({
            tasks: prev.tasks.filter((t) => t.id !== id),
            editingTask: prev.editingTask?.id === id ? null : prev.editingTask,
        }));
    };

    handleEditTask = (task: Task) => {
        this.setState({ editingTask: task });
    };

    handleUpdateTask = (updatedTask: Task) => {
        this.setState((prev) => ({
            tasks: prev.tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
            editingTask: null,
        }));
    };

    handleCancelEdit = () => {
        this.setState({ editingTask: null });
    };

    handleToggleTask = (id: string) => {
        this.setState((prev) => ({
            tasks: prev.tasks.map((t) =>
                t.id === id ? { ...t, completed: !t.completed } : t
            ),
        }));
    };

    handleFilterChange = (filter: 'all' | 'active' | 'completed') => {
        this.setState({ filter });
    };

    handleClearCompleted = () => {
        this.setState((prev) => ({
            tasks: prev.tasks.filter((t) => !t.completed),
        }));
    };

    getStats() {
        const { tasks } = this.state;
        const total = tasks.length;
        const completed = tasks.filter((t) => t.completed).length;
        const active = total - completed;
        return { total, completed, active };
    }

    render() {
        const { tasks, editingTask, filter } = this.state;
        const stats = this.getStats();

        return (
            <div className="task-manager">
                <header className="app-header">
                    <div className="header-content">
                        <h1 className="app-title">
                            <span className="title-icon">✅</span> Task Manager
                        </h1>
                        <p className="app-subtitle">Stay organized, get things done</p>
                    </div>
                    <div className="stats-bar">
                        <div className="stat">
                            <span className="stat-value">{stats.total}</span>
                            <span className="stat-label">Total</span>
                        </div>
                        <div className="stat">
                            <span className="stat-value">{stats.active}</span>
                            <span className="stat-label">Active</span>
                        </div>
                        <div className="stat">
                            <span className="stat-value">{stats.completed}</span>
                            <span className="stat-label">Done</span>
                        </div>
                    </div>
                </header>

                <div className="task-manager-body">
                    <aside className="task-manager-sidebar">
                        <TaskForm
                            onAdd={this.handleAddTask}
                            editingTask={editingTask}
                            onUpdate={this.handleUpdateTask}
                            onCancelEdit={this.handleCancelEdit}
                        />
                    </aside>

                    <main className="task-manager-main">
                        <div className="list-controls">
                            <div className="filter-tabs">
                                {(['all', 'active', 'completed'] as const).map((f) => (
                                    <button
                                        key={f}
                                        className={`filter-tab ${filter === f ? 'active' : ''}`}
                                        onClick={() => this.handleFilterChange(f)}
                                    >
                                        {f.charAt(0).toUpperCase() + f.slice(1)}
                                        {f === 'all' && ` (${stats.total})`}
                                        {f === 'active' && ` (${stats.active})`}
                                        {f === 'completed' && ` (${stats.completed})`}
                                    </button>
                                ))}
                            </div>
                            {stats.completed > 0 && (
                                <button className="btn btn-danger-sm" onClick={this.handleClearCompleted}>
                                    🗑️ Clear Completed
                                </button>
                            )}
                        </div>

                        <TaskList
                            tasks={tasks}
                            onDelete={this.handleDeleteTask}
                            onEdit={this.handleEditTask}
                            onToggle={this.handleToggleTask}
                            filter={filter}
                        />
                    </main>
                </div>
            </div>
        );
    }
}

export default TaskManager;

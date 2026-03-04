import { Component } from 'react';
import type { Task } from '../types/Task';

interface TaskItemProps {
    task: Task;
    onDelete: (id: string) => void;
    onEdit: (task: Task) => void;
    onToggle: (id: string) => void;
}

class TaskItem extends Component<TaskItemProps> {
    handleDelete = () => {
        this.props.onDelete(this.props.task.id);
    };

    handleEdit = () => {
        this.props.onEdit(this.props.task);
    };

    handleToggle = () => {
        this.props.onToggle(this.props.task.id);
    };

    getPriorityClass(): string {
        const { priority } = this.props.task;
        return `priority-${priority}`;
    }

    getPriorityLabel(): string {
        const labels: Record<string, string> = {
            low: '🟢 Low',
            medium: '🟡 Medium',
            high: '🔴 High',
        };
        return labels[this.props.task.priority] || this.props.task.priority;
    }

    render() {
        const { task } = this.props;

        return (
            <div className={`task-item ${task.completed ? 'task-completed' : ''} ${this.getPriorityClass()}`}>
                <div className="task-header">
                    <div className="task-left">
                        <input
                            type="checkbox"
                            className="task-checkbox"
                            checked={task.completed}
                            onChange={this.handleToggle}
                            id={`task-check-${task.id}`}
                        />
                        <label htmlFor={`task-check-${task.id}`} className={`task-title ${task.completed ? 'strikethrough' : ''}`}>
                            {task.title}
                        </label>
                    </div>
                    <div className="task-actions">
                        <span className={`priority-badge ${this.getPriorityClass()}`}>{this.getPriorityLabel()}</span>
                        <button
                            className="btn-icon btn-edit"
                            onClick={this.handleEdit}
                            title="Edit task"
                            disabled={task.completed}
                        >
                            ✏️
                        </button>
                        <button
                            className="btn-icon btn-delete"
                            onClick={this.handleDelete}
                            title="Delete task"
                        >
                            🗑️
                        </button>
                    </div>
                </div>
                {task.description && (
                    <p className="task-description">{task.description}</p>
                )}
                <span className="task-date">
                    📅 {new Date(task.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                    })}
                </span>
            </div>
        );
    }
}

export default TaskItem;

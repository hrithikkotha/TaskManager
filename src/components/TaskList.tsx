import { Component } from 'react';
import type { Task } from '../types/Task';
import TaskItem from './TaskItem';

interface TaskListProps {
    tasks: Task[];
    onDelete: (id: string) => void;
    onEdit: (task: Task) => void;
    onToggle: (id: string) => void;
    filter: 'all' | 'active' | 'completed';
}

class TaskList extends Component<TaskListProps> {
    getFilteredTasks(): Task[] {
        const { tasks, filter } = this.props;
        switch (filter) {
            case 'active':
                return tasks.filter((t) => !t.completed);
            case 'completed':
                return tasks.filter((t) => t.completed);
            default:
                return tasks;
        }
    }

    render() {
        const { onDelete, onEdit, onToggle } = this.props;
        const filteredTasks = this.getFilteredTasks();

        if (filteredTasks.length === 0) {
            return (
                <div className="empty-state">
                    <div className="empty-icon">📋</div>
                    <h3>No tasks found</h3>
                    <p>Add a new task to get started!</p>
                </div>
            );
        }

        return (
            <ul className="task-list">
                {filteredTasks.map((task) => (
                    <li key={task.id} className="task-list-item">
                        <TaskItem
                            task={task}
                            onDelete={onDelete}
                            onEdit={onEdit}
                            onToggle={onToggle}
                        />
                    </li>
                ))}
            </ul>
        );
    }
}

export default TaskList;

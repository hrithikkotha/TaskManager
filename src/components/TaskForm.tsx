import { Component, type ChangeEvent, type FormEvent } from 'react';
import type { Task } from '../types/Task';

interface TaskFormProps {
    onAdd: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
    editingTask: Task | null;
    onUpdate: (task: Task) => void;
    onCancelEdit: () => void;
}

interface TaskFormState {
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
}

class TaskForm extends Component<TaskFormProps, TaskFormState> {
    constructor(props: TaskFormProps) {
        super(props);
        this.state = {
            title: '',
            description: '',
            priority: 'medium',
        };
    }

    componentDidUpdate(prevProps: TaskFormProps) {
        if (prevProps.editingTask !== this.props.editingTask) {
            if (this.props.editingTask) {
                this.setState({
                    title: this.props.editingTask.title,
                    description: this.props.editingTask.description,
                    priority: this.props.editingTask.priority,
                });
            } else {
                this.setState({ title: '', description: '', priority: 'medium' });
            }
        }
    }

    handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
        this.setState({ title: e.target.value });
    };

    handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({ description: e.target.value });
    };

    handlePriorityChange = (e: ChangeEvent<HTMLSelectElement>) => {
        this.setState({ priority: e.target.value as 'low' | 'medium' | 'high' });
    };

    handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const { title, description, priority } = this.state;
        if (!title.trim()) return;

        if (this.props.editingTask) {
            this.props.onUpdate({
                ...this.props.editingTask,
                title: title.trim(),
                description: description.trim(),
                priority,
            });
        } else {
            this.props.onAdd({ title: title.trim(), description: description.trim(), priority });
        }

        this.setState({ title: '', description: '', priority: 'medium' });
    };

    render() {
        const { editingTask, onCancelEdit } = this.props;
        const { title, description, priority } = this.state;
        const isEditing = !!editingTask;

        return (
            <form className="task-form" onSubmit={this.handleSubmit}>
                <h2 className="form-title">{isEditing ? '✏️ Edit Task' : '➕ Add New Task'}</h2>
                <div className="form-group">
                    <label htmlFor="task-title">Task Title</label>
                    <input
                        id="task-title"
                        type="text"
                        placeholder="Enter task title..."
                        value={title}
                        onChange={this.handleTitleChange}
                        className="form-input"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="task-description">Description</label>
                    <textarea
                        id="task-description"
                        placeholder="Enter task description (optional)..."
                        value={description}
                        onChange={this.handleDescriptionChange}
                        className="form-textarea"
                        rows={3}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="task-priority">Priority</label>
                    <select
                        id="task-priority"
                        value={priority}
                        onChange={this.handlePriorityChange}
                        className="form-select"
                    >
                        <option value="low">🟢 Low</option>
                        <option value="medium">🟡 Medium</option>
                        <option value="high">🔴 High</option>
                    </select>
                </div>
                <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                        {isEditing ? 'Update Task' : 'Add Task'}
                    </button>
                    {isEditing && (
                        <button type="button" className="btn btn-secondary" onClick={onCancelEdit}>
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        );
    }
}

export default TaskForm;

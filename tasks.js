// Tasks Management Module
class TasksManager {
    constructor() {
        this.tasks = [];
        this.currentFilter = 'all';
        this.setupEventListeners();
    }

    setupEventListeners() {
        const addBtn = document.getElementById('add-task-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.openAddModal());
        }

        const form = document.getElementById('task-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Filter buttons
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.render();
            });
        });
    }

    async loadTasks() {
        try {
            const userId = auth.getCurrentUser()?.id;
            if (!userId) return;

            this.tasks = await db.getAllByIndex(STORES.tasks, 'userId', userId);
            this.render();
        } catch (error) {
            console.error('Error loading tasks:', error);
            showToast('Error loading tasks', 'error');
        }
    }

    openAddModal() {
        const modal = document.getElementById('task-modal');
        const title = document.getElementById('task-modal-title');
        const idInput = document.getElementById('task-id');

        title.textContent = 'Add Task';
        idInput.value = '';

        this.updateSubjectSelect();
        ui.openModal('task-modal');
    }

    openEditModal(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        const modal = document.getElementById('task-modal');
        const title = document.getElementById('task-modal-title');
        const idInput = document.getElementById('task-id');
        const titleInput = document.getElementById('task-title');
        const descInput = document.getElementById('task-description');
        const subjectInput = document.getElementById('task-subject');
        const dueInput = document.getElementById('task-duedate');
        const priorityInput = document.getElementById('task-priority');
        const statusInput = document.getElementById('task-status');

        title.textContent = 'Edit Task';
        idInput.value = task.id;
        titleInput.value = task.title;
        descInput.value = task.description || '';
        dueInput.value = task.dueDate;
        priorityInput.value = task.priority;
        statusInput.value = task.status;

        this.updateSubjectSelect();
        setTimeout(() => {
            subjectInput.value = task.subjectId;
        }, 0);

        ui.openModal('task-modal');
    }

    updateSubjectSelect() {
        const select = document.getElementById('task-subject');
        select.innerHTML = '<option value="">Select a subject</option>';

        this.subjects.forEach(subject => {
            const option = document.createElement('option');
            option.value = subject.id;
            option.textContent = subject.name;
            select.appendChild(option);
        });
    }

    async handleFormSubmit(e) {
        e.preventDefault();

        const userId = auth.getCurrentUser()?.id;
        if (!userId) return;

        const id = document.getElementById('task-id').value;
        const title = document.getElementById('task-title').value;
        const description = document.getElementById('task-description').value;
        const subjectId = document.getElementById('task-subject').value;
        const dueDate = document.getElementById('task-duedate').value;
        const priority = document.getElementById('task-priority').value;
        const status = document.getElementById('task-status').value;

        try {
            const task = {
                id: id || generateId(),
                userId,
                title,
                description,
                subjectId,
                dueDate,
                priority,
                status,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            await db.put(STORES.tasks, task);
            await this.loadTasks();

            ui.closeModal(document.getElementById('task-modal'));
            showToast(id ? 'Task updated' : 'Task created', 'success');
        } catch (error) {
            console.error('Error saving task:', error);
            showToast('Error saving task', 'error');
        }
    }

    async deleteTask(taskId) {
        if (!confirm('Delete this task?')) {
            return;
        }

        try {
            await db.delete(STORES.tasks, taskId);
            await this.loadTasks();
            showToast('Task deleted', 'success');
        } catch (error) {
            console.error('Error deleting task:', error);
            showToast('Error deleting task', 'error');
        }
    }

    async toggleTaskStatus(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
        task.status = nextStatus;
        task.updatedAt = new Date().toISOString();

        try {
            await db.put(STORES.tasks, task);
            await this.loadTasks();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    }

    getFilteredTasks() {
        if (this.currentFilter === 'all') {
            return this.tasks;
        }
        return this.tasks.filter(t => t.status === this.currentFilter);
    }

    render() {
        const container = document.getElementById('tasks-list');
        if (!container) return;

        const filteredTasks = this.getFilteredTasks();

        if (filteredTasks.length === 0) {
            container.innerHTML = '<p class="placeholder">No tasks. Create one to get started!</p>';
            return;
        }

        // Sort by due date
        filteredTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

        container.innerHTML = filteredTasks.map(task => this.renderTaskItem(task)).join('');

        // Attach event listeners
        filteredTasks.forEach(task => {
            const checkbox = document.querySelector(`[data-task-checkbox="${task.id}"]`);
            const editBtn = document.querySelector(`[data-edit-task="${task.id}"]`);
            const deleteBtn = document.querySelector(`[data-delete-task="${task.id}"]`);

            if (checkbox) {
                checkbox.checked = task.status === 'completed';
                checkbox.addEventListener('change', () => this.toggleTaskStatus(task.id));
            }
            if (editBtn) {
                editBtn.addEventListener('click', () => this.openEditModal(task.id));
            }
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => this.deleteTask(task.id));
            }
        });
    }

    renderTaskItem(task) {
        const subject = this.subjects.find(s => s.id === task.subjectId);
        const subjectName = subject ? subject.name : 'No Subject';
        const subjectColor = subject ? subject.color : '#999';

        return `
            <div class="task-item ${task.status === 'completed' ? 'completed' : ''}">
                <input type="checkbox" class="task-checkbox" data-task-checkbox="${task.id}">
                <div class="task-content">
                    <div class="task-title">${task.title}</div>
                    <div class="task-meta">
                        <span class="task-subject-badge" style="background-color: ${subjectColor}26">${subjectName}</span>
                        <span class="task-priority-${task.priority}">${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
                        <span>${formatDate(task.dueDate)}</span>
                    </div>
                </div>
                <div class="task-actions">
                    <button type="button" data-edit-task="${task.id}" class="task-btn" title="Edit">✎</button>
                    <button type="button" data-delete-task="${task.id}" class="task-btn" title="Delete">🗑</button>
                </div>
            </div>
        `;
    }

    renderTodayTasks() {
        const container = document.getElementById('today-tasks');
        if (!container) return;

        const todayTasks = this.tasks.filter(t =>
            isToday(t.dueDate) && t.status !== 'completed'
        ).sort((a, b) => a.priority === 'high' ? -1 : 1);

        if (todayTasks.length === 0) {
            container.innerHTML = '<p class="placeholder">No tasks for today!</p>';
            return;
        }

        container.innerHTML = todayTasks.map(task => {
            const subject = this.subjects.find(s => s.id === task.subjectId);
            return `
                <div class="today-task">
                    <div class="task-title">${task.title}</div>
                    ${subject ? `<span class="task-subject-badge" style="background-color: ${subject.color}26">${subject.name}</span>` : ''}
                </div>
            `;
        }).join('');
    }
}

// Global tasks manager
const tasks = new TasksManager();

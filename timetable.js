// Timetable Management Module
class TimetableManager {
    constructor() {
        this.classes = [];
        this.currentViewType = 'weekly';
        this.setupEventListeners();
    }

    setupEventListeners() {
        const addBtn = document.getElementById('add-class-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.openAddModal());
        }

        const form = document.getElementById('class-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // View type buttons
        const viewBtns = document.querySelectorAll('.view-btn');
        viewBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                viewBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentViewType = e.target.dataset.viewType;
                this.render();
            });
        });
    }

    async loadClasses() {
        try {
            const userId = auth.getCurrentUser()?.id;
            if (!userId) return;

            this.classes = await db.getAllByIndex(STORES.classes, 'userId', userId);
            this.render();
            this.renderTimetablePreview();
        } catch (error) {
            console.error('Error loading classes:', error);
            showToast('Error loading classes', 'error');
        }
    }

    openAddModal() {
        const modal = document.getElementById('class-modal');
        const title = document.getElementById('class-modal-title');
        const idInput = document.getElementById('class-id');

        title.textContent = 'Add Class';
        idInput.value = '';

        this.updateSubjectSelect();
        ui.openModal('class-modal');
    }

    openEditModal(classId) {
        const classItem = this.classes.find(c => c.id === classId);
        if (!classItem) return;

        const modal = document.getElementById('class-modal');
        const title = document.getElementById('class-modal-title');
        const idInput = document.getElementById('class-id');
        const subjectInput = document.getElementById('class-subject');
        const locationInput = document.getElementById('class-location');
        const timeInput = document.getElementById('class-time');
        const dayInput = document.getElementById('class-day');
        const durationInput = document.getElementById('class-duration');

        title.textContent = 'Edit Class';
        idInput.value = classItem.id;
        locationInput.value = classItem.location || '';
        timeInput.value = classItem.time;
        dayInput.value = classItem.day;
        durationInput.value = classItem.duration;

        this.updateSubjectSelect();
        setTimeout(() => {
            subjectInput.value = classItem.subjectId;
        }, 0);

        ui.openModal('class-modal');
    }

    updateSubjectSelect() {
        const select = document.getElementById('class-subject');
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

        const id = document.getElementById('class-id').value;
        const subjectId = document.getElementById('class-subject').value;
        const location = document.getElementById('class-location').value;
        const time = document.getElementById('class-time').value;
        const day = document.getElementById('class-day').value;
        const duration = parseInt(document.getElementById('class-duration').value);

        try {
            const classItem = {
                id: id || generateId(),
                userId,
                subjectId,
                location,
                time,
                day,
                duration,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            await db.put(STORES.classes, classItem);
            await this.loadClasses();

            ui.closeModal(document.getElementById('class-modal'));
            showToast(id ? 'Class updated' : 'Class created', 'success');
        } catch (error) {
            console.error('Error saving class:', error);
            showToast('Error saving class', 'error');
        }
    }

    async deleteClass(classId) {
        if (!confirm('Delete this class?')) {
            return;
        }

        try {
            await db.delete(STORES.classes, classId);
            await this.loadClasses();
            showToast('Class deleted', 'success');
        } catch (error) {
            console.error('Error deleting class:', error);
            showToast('Error deleting class', 'error');
        }
    }

    getClassesByDay(day) {
        return this.classes.filter(c => c.day === day).sort((a, b) =>
            a.time.localeCompare(b.time)
        );
    }

    render() {
        const container = document.getElementById('timetable-grid');
        if (!container) return;

        if (this.classes.length === 0) {
            container.innerHTML = '<p class="placeholder">No classes scheduled. Add one to get started!</p>';
            return;
        }

        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

        let html = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">';

        days.forEach(day => {
            const dayClasses = this.getClassesByDay(day);
            html += `
                <div class="timetable-day">
                    <h3 style="margin-bottom: 1rem; color: var(--color-accent);">${getDayName(day)}</h3>
                    ${dayClasses.length === 0
                        ? '<p style="color: var(--color-text-secondary); font-size: var(--font-size-sm);">No classes</p>'
                        : dayClasses.map(c => this.renderClassCard(c)).join('')
                    }
                </div>
            `;
        });

        html += '</div>';
        container.innerHTML = html;

        // Attach event listeners
        this.classes.forEach(classItem => {
            const editBtn = document.querySelector(`[data-edit-class="${classItem.id}"]`);
            const deleteBtn = document.querySelector(`[data-delete-class="${classItem.id}"]`);

            if (editBtn) {
                editBtn.addEventListener('click', () => this.openEditModal(classItem.id));
            }
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => this.deleteClass(classItem.id));
            }
        });
    }

    renderClassCard(classItem) {
        const subject = this.subjects.find(s => s.id === classItem.subjectId);
        const subjectName = subject ? subject.name : 'No Subject';
        const subjectColor = subject ? subject.color : '#999';

        return `
            <div style="
                background-color: var(--color-bg-primary);
                border-left: 4px solid ${subjectColor};
                padding: 1rem;
                border-radius: var(--radius-md);
                margin-bottom: 0.5rem;
                border: 1px solid var(--color-border);
                border-left: 4px solid ${subjectColor};
            ">
                <div style="font-weight: 600; font-size: var(--font-size-sm); margin-bottom: 0.25rem;">
                    ${subjectName}
                </div>
                <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-bottom: 0.5rem;">
                    ${classItem.time} (${classItem.duration} min)
                </div>
                ${classItem.location ? `
                    <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-bottom: 0.5rem;">
                        📍 ${classItem.location}
                    </div>
                ` : ''}
                <div style="display: flex; gap: 0.5rem;">
                    <button type="button" data-edit-class="${classItem.id}" class="btn btn-secondary btn-small" style="flex: 1;">Edit</button>
                    <button type="button" data-delete-class="${classItem.id}" class="btn btn-danger btn-small" style="flex: 1;">Delete</button>
                </div>
            </div>
        `;
    }

    renderTimetablePreview() {
        const container = document.getElementById('timetable-today');
        if (!container) return;

        const today = new Date();
        const dayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][today.getDay()];
        const todayClasses = this.getClassesByDay(dayName);

        if (todayClasses.length === 0) {
            container.innerHTML = '<p class="placeholder">No classes today</p>';
            return;
        }

        container.innerHTML = todayClasses.map(c => {
            const subject = this.subjects.find(s => s.id === c.subjectId);
            return `
                <div style="
                    background-color: var(--color-bg-primary);
                    border-left: 3px solid ${subject ? subject.color : '#999'};
                    padding: 0.75rem;
                    border-radius: var(--radius-md);
                    margin-bottom: 0.5rem;
                    border: 1px solid var(--color-border);
                ">
                    <div style="font-weight: 600; font-size: var(--font-size-sm);">${subject ? subject.name : 'No Subject'}</div>
                    <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary);">${c.time}</div>
                </div>
            `;
        }).join('');
    }
}

// Global timetable manager
const timetable = new TimetableManager();

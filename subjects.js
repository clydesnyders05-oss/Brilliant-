// Subjects Management Module
class SubjectsManager {
    constructor() {
        this.subjects = [];
        this.setupEventListeners();
    }

    setupEventListeners() {
        const addBtn = document.getElementById('add-subject-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.openAddModal());
        }

        const form = document.getElementById('subject-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }
    }

    async loadSubjects() {
        try {
            const userId = auth.getCurrentUser()?.id;
            if (!userId) return;

            this.subjects = await db.getAllByIndex(STORES.subjects, 'userId', userId);
            this.render();
        } catch (error) {
            console.error('Error loading subjects:', error);
            showToast('Error loading subjects', 'error');
        }
    }

    openAddModal() {
        const modal = document.getElementById('subject-modal');
        const title = document.getElementById('subject-modal-title');
        const idInput = document.getElementById('subject-id');

        title.textContent = 'Add Subject';
        idInput.value = '';

        ui.openModal('subject-modal');
    }

    openEditModal(subjectId) {
        const subject = this.subjects.find(s => s.id === subjectId);
        if (!subject) return;

        const modal = document.getElementById('subject-modal');
        const title = document.getElementById('subject-modal-title');
        const idInput = document.getElementById('subject-id');
        const nameInput = document.getElementById('subject-name');
        const codeInput = document.getElementById('subject-code');
        const colorInput = document.getElementById('subject-color');

        title.textContent = 'Edit Subject';
        idInput.value = subject.id;
        nameInput.value = subject.name;
        codeInput.value = subject.code || '';
        colorInput.value = subject.color || '#8b7355';

        ui.openModal('subject-modal');
    }

    async handleFormSubmit(e) {
        e.preventDefault();

        const userId = auth.getCurrentUser()?.id;
        if (!userId) return;

        const id = document.getElementById('subject-id').value;
        const name = document.getElementById('subject-name').value;
        const code = document.getElementById('subject-code').value;
        const color = document.getElementById('subject-color').value;

        try {
            const subject = {
                id: id || generateId(),
                userId,
                name,
                code,
                color,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            await db.put(STORES.subjects, subject);
            await this.loadSubjects();

            ui.closeModal(document.getElementById('subject-modal'));
            showToast(id ? 'Subject updated' : 'Subject created', 'success');
        } catch (error) {
            console.error('Error saving subject:', error);
            showToast('Error saving subject', 'error');
        }
    }

    async deleteSubject(subjectId) {
        if (!confirm('Are you sure? This will delete the subject but keep its tasks.')) {
            return;
        }

        try {
            await db.delete(STORES.subjects, subjectId);
            await this.loadSubjects();
            showToast('Subject deleted', 'success');
        } catch (error) {
            console.error('Error deleting subject:', error);
            showToast('Error deleting subject', 'error');
        }
    }

    render() {
        const container = document.getElementById('subjects-list');
        if (!container) return;

        if (this.subjects.length === 0) {
            container.innerHTML = '<p class="placeholder">No subjects yet. Create one to organize your studies!</p>';
            return;
        }

        container.innerHTML = this.subjects.map(subject => this.renderSubjectCard(subject)).join('');

        // Attach event listeners to buttons
        this.subjects.forEach(subject => {
            const editBtn = document.querySelector(`[data-edit-subject="${subject.id}"]`);
            const deleteBtn = document.querySelector(`[data-delete-subject="${subject.id}"]`);

            if (editBtn) {
                editBtn.addEventListener('click', () => this.openEditModal(subject.id));
            }
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => this.deleteSubject(subject.id));
            }
        });
    }

    renderSubjectCard(subject) {
        return `
            <div class="subject-card">
                <div class="subject-color-bar" style="background-color: ${subject.color}"></div>
                <div class="subject-name">${subject.name}</div>
                ${subject.code ? `<div class="subject-code">${subject.code}</div>` : ''}
                <div class="subject-actions">
                    <button type="button" data-edit-subject="${subject.id}" class="btn btn-secondary btn-small">Edit</button>
                    <button type="button" data-delete-subject="${subject.id}" class="btn btn-danger btn-small">Delete</button>
                </div>
            </div>
        `;
    }

    async getSubjectById(id) {
        return this.subjects.find(s => s.id === id);
    }

    async getSubjectsByUser(userId) {
        return await db.getAllByIndex(STORES.subjects, 'userId', userId);
    }
}

// Global subjects manager
const subjects = new SubjectsManager();

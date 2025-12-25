// Vision Board Module - Goals and Inspiration
class VisionManager {
    constructor() {
        this.goals = [];
        this.setupEventListeners();
    }

    setupEventListeners() {
        const addBtn = document.getElementById('add-goal-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.openAddModal());
        }

        const form = document.getElementById('goal-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }
    }

    async loadGoals() {
        try {
            const userId = auth.getCurrentUser()?.id;
            if (!userId) return;

            this.goals = await db.getAllByIndex(STORES.goals, 'userId', userId);
            this.render();
        } catch (error) {
            console.error('Error loading goals:', error);
            showToast('Error loading goals', 'error');
        }
    }

    openAddModal() {
        const modal = document.getElementById('goal-modal');
        const idInput = document.getElementById('goal-id');

        idInput.value = '';

        ui.openModal('goal-modal');
    }

    openEditModal(goalId) {
        const goal = this.goals.find(g => g.id === goalId);
        if (!goal) return;

        const idInput = document.getElementById('goal-id');
        const textInput = document.getElementById('goal-text');

        idInput.value = goal.id;
        textInput.value = goal.text;

        ui.openModal('goal-modal');
    }

    async handleFormSubmit(e) {
        e.preventDefault();

        const userId = auth.getCurrentUser()?.id;
        if (!userId) return;

        const id = document.getElementById('goal-id').value;
        const text = document.getElementById('goal-text').value;

        try {
            const goal = {
                id: id || generateId(),
                userId,
                text,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            await db.put(STORES.goals, goal);
            await this.loadGoals();

            ui.closeModal(document.getElementById('goal-modal'));
            showToast(id ? 'Goal updated' : 'Goal created', 'success');
        } catch (error) {
            console.error('Error saving goal:', error);
            showToast('Error saving goal', 'error');
        }
    }

    async deleteGoal(goalId) {
        if (!confirm('Delete this goal?')) {
            return;
        }

        try {
            await db.delete(STORES.goals, goalId);
            await this.loadGoals();
            showToast('Goal deleted', 'success');
        } catch (error) {
            console.error('Error deleting goal:', error);
            showToast('Error deleting goal', 'error');
        }
    }

    render() {
        const container = document.getElementById('vision-board');
        if (!container) return;

        if (this.goals.length === 0) {
            container.innerHTML = '<p class="placeholder">Your goals will appear here. Add one to inspire yourself!</p>';
            return;
        }

        container.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; padding: 1rem 0;">
                ${this.goals.map(goal => this.renderGoalCard(goal)).join('')}
            </div>
        `;

        // Attach event listeners
        this.goals.forEach(goal => {
            const editBtn = document.querySelector(`[data-edit-goal="${goal.id}"]`);
            const deleteBtn = document.querySelector(`[data-delete-goal="${goal.id}"]`);

            if (editBtn) {
                editBtn.addEventListener('click', () => this.openEditModal(goal.id));
            }
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => this.deleteGoal(goal.id));
            }
        });
    }

    renderGoalCard(goal) {
        const colors = ['#8b7355', '#6b8e99', '#7a8b6f', '#9b7a8b', '#a88b7a'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        return `
            <div style="
                background: linear-gradient(135deg, var(--color-bg-secondary), var(--color-bg-tertiary));
                border: 1px solid var(--color-border);
                border-left: 4px solid ${randomColor};
                border-radius: var(--radius-lg);
                padding: 1.5rem;
                box-shadow: 0 2px 8px var(--color-shadow);
                transition: all var(--transition-base);
                min-height: 200px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            ">
                <div>
                    <div style="font-size: var(--font-size-lg); font-weight: 600; color: var(--color-text-primary); margin-bottom: 1rem; line-height: var(--line-height-normal);">
                        ${goal.text}
                    </div>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <button type="button" data-edit-goal="${goal.id}" class="btn btn-secondary btn-small" style="flex: 1;">Edit</button>
                    <button type="button" data-delete-goal="${goal.id}" class="btn btn-danger btn-small" style="flex: 1;">Delete</button>
                </div>
            </div>
        `;
    }
}

// Global vision manager
const vision = new VisionManager();

// Calendar Module
class CalendarManager {
    constructor() {
        this.currentDate = new Date();
    }

    async loadCalendar() {
        try {
            this.render();
        } catch (error) {
            console.error('Error loading calendar:', error);
        }
    }

    render() {
        const container = document.getElementById('calendar-container');
        if (!container) return;

        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        // Calendar header
        const monthName = this.currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        
        let html = `
            <div style="margin-bottom: 2rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <h2>${monthName}</h2>
                    <div>
                        <button class="btn btn-secondary btn-small" data-nav-month="prev">← Prev</button>
                        <button class="btn btn-secondary btn-small" data-nav-month="today" style="margin-left: 0.5rem;">Today</button>
                        <button class="btn btn-secondary btn-small" data-nav-month="next" style="margin-left: 0.5rem;">Next →</button>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.5rem;">
                    <div style="font-weight: 600; text-align: center; padding: 0.5rem; color: var(--color-accent);">Sun</div>
                    <div style="font-weight: 600; text-align: center; padding: 0.5rem; color: var(--color-accent);">Mon</div>
                    <div style="font-weight: 600; text-align: center; padding: 0.5rem; color: var(--color-accent);">Tue</div>
                    <div style="font-weight: 600; text-align: center; padding: 0.5rem; color: var(--color-accent);">Wed</div>
                    <div style="font-weight: 600; text-align: center; padding: 0.5rem; color: var(--color-accent);">Thu</div>
                    <div style="font-weight: 600; text-align: center; padding: 0.5rem; color: var(--color-accent);">Fri</div>
                    <div style="font-weight: 600; text-align: center; padding: 0.5rem; color: var(--color-accent);">Sat</div>
                    
                    ${this.generateCalendarDays(year, month)}
                </div>
            </div>
        `;

        container.innerHTML = html;

        // Attach event listeners
        const prevBtn = container.querySelector('[data-nav-month="prev"]');
        const nextBtn = container.querySelector('[data-nav-month="next"]');
        const todayBtn = container.querySelector('[data-nav-month="today"]');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.currentDate.setMonth(this.currentDate.getMonth() - 1);
                this.render();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.currentDate.setMonth(this.currentDate.getMonth() + 1);
                this.render();
            });
        }

        if (todayBtn) {
            todayBtn.addEventListener('click', () => {
                this.currentDate = new Date();
                this.render();
            });
        }
    }

    generateCalendarDays(year, month) {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        let html = '';
        let dayCount = 1;

        // Empty cells for days before month starts
        for (let i = 0; i < startingDayOfWeek; i++) {
            html += '<div></div>';
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const isToday = date.toDateString() === new Date().toDateString();
            const dayString = date.toISOString().split('T')[0];

            html += `
                <div style="
                    padding: 0.75rem 0.5rem;
                    text-align: center;
                    border-radius: var(--radius-md);
                    border: 1px solid var(--color-border);
                    background-color: var(--color-bg-secondary);
                    cursor: pointer;
                    transition: all var(--transition-fast);
                    min-height: 60px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    ${isToday ? `
                        background-color: var(--color-accent);
                        color: white;
                        border-color: var(--color-accent);
                    ` : ''}
                " data-date="${dayString}">
                    <div style="font-weight: 600; font-size: var(--font-size-base);">${day}</div>
                    <div style="font-size: var(--font-size-xs); margin-top: 0.25rem;" class="calendar-task-count-${dayString}">0 tasks</div>
                </div>
            `;
        }

        return html;
    }

    updateTaskCounts() {
        // Update task counts for each day
        tasks.tasks.forEach(task => {
            const counter = document.querySelector(`.calendar-task-count-${task.dueDate}`);
            if (counter) {
                const tasksOnDay = tasks.tasks.filter(t => t.dueDate === task.dueDate).length;
                counter.textContent = `${tasksOnDay} task${tasksOnDay !== 1 ? 's' : ''}`;
            }
        });
    }
}

// Global calendar manager
const calendar = new CalendarManager();

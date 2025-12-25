// Settings Module
class SettingsManager {
    constructor() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        const exportBtn = document.getElementById('export-data-btn');
        const resetBtn = document.getElementById('reset-data-btn');

        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportData());
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetData());
        }
    }

    async exportData() {
        try {
            const data = await db.exportData();
            const jsonString = JSON.stringify(data, null, 2);

            // Create blob and download
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `brilliant-cs-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            showToast('Data exported successfully', 'success');
        } catch (error) {
            console.error('Error exporting data:', error);
            showToast('Error exporting data', 'error');
        }
    }

    async resetData() {
        if (!confirm('⚠️ This will delete ALL data. This action cannot be undone. Are you sure?')) {
            return;
        }

        if (!confirm('Are you REALLY sure? This will delete everything!')) {
            return;
        }

        try {
            await db.clearAll();
            showToast('All data cleared', 'success');

            // Reload page
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (error) {
            console.error('Error resetting data:', error);
            showToast('Error resetting data', 'error');
        }
    }

    async importData(file) {
        try {
            const text = await file.text();
            const data = JSON.parse(text);

            await db.importData(data);
            showToast('Data imported successfully', 'success');

            // Reload page
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (error) {
            console.error('Error importing data:', error);
            showToast('Error importing data', 'error');
        }
    }
}

// Global settings manager
const settings = new SettingsManager();

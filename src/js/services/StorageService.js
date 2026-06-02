const StorageService = {
    storageKey: 'monkeyart:palettes',

    savePalette(palette) {
        try {
            const palettes = this.getAllPalettes();

            const existingIndex = palettes.findIndex((p) => p.id === palette.id);
            if (existingIndex !== -1) {
                palettes[existingIndex] = palette;
            } else {
                palettes.push(palette);
            }

            localStorage.setItem(this.storageKey, JSON.stringify(palettes));
            return true;
        } catch (error) {
            if (
                error.name === 'QuotaExceededError' ||
                error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
            ) {
                console.error('LocalStorage quota exceeded:', error);
            } else if (error.name === 'SecurityError') {
                console.error('LocalStorage access denied (private mode?):', error);
            } else {
                console.error('Failed to save palette:', error);
            }
            return false;
        }
    },

    getPaletteById(id) {
        try {
            const palettes = this.getAllPalettes();
            return palettes.find((p) => p.id === id) || null;
        } catch (error) {
            console.error('Failed to get palette:', error);
            return null;
        }
    },

    getAllPalettes() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            if (error instanceof SyntaxError) {
                console.warn('Invalid JSON in localStorage, resetting...');
                localStorage.removeItem(this.storageKey);
            } else {
                console.error('Failed to read palettes:', error);
            }
            return [];
        }
    },

    deletePalette(id) {
        try {
            const palettes = this.getAllPalettes();
            const filtered = palettes.filter((p) => p.id !== id);
            localStorage.setItem(this.storageKey, JSON.stringify(filtered));
            return true;
        } catch (error) {
            console.error('Failed to delete palette:', error);
            return false;
        }
    },

    updatePalette(id, updates) {
        try {
            const palette = this.getPaletteById(id);
            if (!palette) return false;

            const updated = { ...palette, ...updates };
            return this.savePalette(updated);
        } catch (error) {
            console.error('Failed to update palette:', error);
            return false;
        }
    },

    clearAll() {
        try {
            localStorage.removeItem(this.storageKey);
            return true;
        } catch (error) {
            console.error('Failed to clear storage:', error);
            return false;
        }
    },

    count() {
        return this.getAllPalettes().length;
    },

    isAvailable() {
        try {
            const test = '__localStorage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (error) {
            console.warn('LocalStorage unavailable:', error.message);
            return false;
        }
    },

    savePalettes(palettes) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(palettes));
            return true;
        } catch (error) {
            if (
                error.name === 'QuotaExceededError' ||
                error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
            ) {
                console.error('LocalStorage quota exceeded:', error);
            } else if (error.name === 'SecurityError') {
                console.error('LocalStorage access denied (private mode?):', error);
            } else {
                console.error('Failed to save palettes:', error);
            }
            return false;
        }
    },

    loadPalettes() {
        if (!this.isAvailable()) {
            return [];
        }
        return this.getAllPalettes();
    },
};

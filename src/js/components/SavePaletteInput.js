const SavePaletteInput = (() => {
    const getSavedPalettesElement = () => {
        return document.getElementById('savedPalettesList');
    };

    const init = () => {
        createInputUI();
        AppState.subscribe((state) => {});
    };

    const createInputUI = () => {
        const container = getSavedPalettesElement();
        if (!container) return;

        if (document.getElementById('savePaletteInput')) {
            return;
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'save-palette-input-wrapper';

        const input = document.createElement('input');
        input.id = 'savePaletteInput';
        input.type = 'text';
        input.className = 'save-palette-input';
        input.placeholder = '#FF5733,#FFD700,#00FF00';
        input.setAttribute('aria-label', 'Save palette: enter comma-separated hex colors');

        const button = document.createElement('button');
        button.className = 'save-palette-btn primary';
        button.textContent = 'Save Palette';
        button.addEventListener('click', handleSavePalette);

        const error = document.createElement('div');
        error.id = 'savePaletteError';
        error.className = 'save-palette-error hidden';
        error.setAttribute('role', 'alert');

        wrapper.appendChild(input);
        wrapper.appendChild(button);
        wrapper.appendChild(error);

        container.insertBefore(wrapper, container.firstChild);

        input.addEventListener('input', handleInputChange);
    };

    const handleInputChange = (event) => {
        const input = event.target;
        const errorEl = document.getElementById('savePaletteError');

        if (!input.value.trim()) {
            if (errorEl) errorEl.classList.add('hidden');
            return;
        }

        const colors = parseColors(input.value);
        if (colors.valid === false && input.value.includes(',')) {
            if (errorEl) {
                errorEl.textContent = colors.error;
                errorEl.classList.remove('hidden');
            }
        } else if (errorEl) {
            errorEl.classList.add('hidden');
        }
    };

    const handleSavePalette = () => {
        const input = document.getElementById('savePaletteInput');
        if (!input) return;

        const colorString = input.value.trim();
        if (!colorString) {
            showError('Please enter at least one color');
            return;
        }

        const result = parseColors(colorString);

        if (result.valid === false) {
            showError(result.error);
            return;
        }

        if (result.colors.length === 0) {
            showError('No valid colors found');
            return;
        }

        const palette = {
            id: generateId(),
            name: `Custom Palette ${Date.now()}`,
            colors: result.colors,
            source: 'manual',
            timestamp: new Date().toISOString(),
        };

        const currentState = AppState.getState();
        const updatedPalettes = [...currentState.savedPalettes, palette];
        AppState.update({ savedPalettes: updatedPalettes });

        StorageService.savePalettes(updatedPalettes);

        input.value = '';
        showSuccess(`Saved palette with ${result.colors.length} color(s)`);
    };

    const parseColors = (input) => {
        const colors = [];
        const colorStrings = input.split(',');

        for (let i = 0; i < colorStrings.length; i++) {
            const hex = colorStrings[i].trim();

            if (!hex) {
                continue;
            }

            const normalized = normalizeHex(hex);
            if (!normalized) {
                return {
                    valid: false,
                    error: `Invalid color format at position ${i + 1}: "${hex}"`,
                    colors: [],
                };
            }

            colors.push(normalized);

            if (colors.length > 10) {
                return {
                    valid: false,
                    error: 'Maximum 10 colors per palette',
                    colors: [],
                };
            }
        }

        return {
            valid: colors.length > 0,
            colors: colors,
            error: colors.length === 0 ? 'At least one color required' : null,
        };
    };

    const normalizeHex = (hex) => {
        hex = hex.trim();

        if (hex.startsWith('#')) {
            hex = hex.substring(1);
        }

        if (!hex.match(/^[0-9a-fA-F]{3}$/) && !hex.match(/^[0-9a-fA-F]{6}$/)) {
            return null;
        }

        if (hex.length === 3) {
            hex = hex
                .split('')
                .map((c) => c + c)
                .join('');
        }

        return '#' + hex.toUpperCase();
    };

    const showError = (message) => {
        const errorEl = document.getElementById('savePaletteError');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.remove('hidden');
        }
    };

    const showSuccess = (message) => {
        if (typeof Toast !== 'undefined' && Toast.show) {
            Toast.show(message, 'success');
        }

        const errorEl = document.getElementById('savePaletteError');
        if (errorEl) {
            errorEl.classList.add('hidden');
        }
    };

    const generateId = () => {
        return 'palette_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    };

    return {
        init,
    };
})();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => SavePaletteInput.init());
} else {
    SavePaletteInput.init();
}

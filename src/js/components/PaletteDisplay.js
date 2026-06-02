class PaletteDisplay {
    constructor(options = {}) {
        this.id = options.id || `palette-display-${Math.random().toString(36).substr(2, 9)}`;
        this.colors = options.colors || [];
        this.emptyMessage = options.emptyMessage || 'No palette generated yet';
        this.onSwatchClick = null;

        this.createElements();
    }

    createElements() {
        this.container = document.createElement('div');
        this.container.id = this.id;
        this.container.className = 'palette-display';

        this.contentArea = document.createElement('div');
        this.contentArea.className = 'palette-display-content';

        this.container.appendChild(this.contentArea);

        this.render();
    }

    render() {
        this.contentArea.innerHTML = '';

        if (!this.colors || this.colors.length === 0) {
            const emptyState = document.createElement('p');
            emptyState.className = 'empty-state';
            emptyState.textContent = this.emptyMessage;
            this.contentArea.appendChild(emptyState);
        } else {
            ColorBoxFactory.renderMany(this.contentArea, this.colors);

            this.setupColorBoxHandlers();
        }
    }

    setupColorBoxHandlers() {
        const colorBoxes = this.contentArea.querySelectorAll('.color-box-display button');
        colorBoxes.forEach((button) => {
            button.addEventListener('click', async (e) => {
                const hex = button.closest('.color-box-display').dataset.hex;
                try {
                    await ClipboardService.copyToClipboard(hex, { feedback: true });
                } catch (error) {
                    console.error('Copy failed:', error);
                }
            });
        });
    }

    addColor(hex) {
        if (!this.colors.includes(hex)) {
            this.colors.push(hex);
            this.render();
        }
    }

    setColors(colors) {
        this.colors = colors || [];
        this.render();
    }

    removeColor(hex) {
        this.colors = this.colors.filter((c) => c !== hex);
        this.render();
    }

    updatePalette(colors) {
        this.colors = colors || [];
        this.render();
    }

    onSwatch(callback) {
        this.onSwatchClick = callback;
    }

    getElement() {
        return this.container;
    }

    getCurrentColors() {
        return this.colors || [];
    }
}

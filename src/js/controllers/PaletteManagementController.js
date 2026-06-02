class PaletteManagementController {
    constructor(sectionSelector = '#palette-management') {
        this.section = document.querySelector(sectionSelector);
        if (!this.section) {
            console.warn(`PaletteManagementController: Section ${sectionSelector} not found`);
            return;
        }

        this.savedPalettesList = null;
    }

    init() {
        if (!this.section) return;

        let header = this.section.querySelector('h2');
        if (!header) {
            header = document.createElement('h2');
            header.textContent = 'Saved Palettes';
            this.section.appendChild(header);
        }

        this.savedPalettesList = new SavedPalettesList();
        this.section.appendChild(this.savedPalettesList.getElement());
        this.loadPalettes();
        this.handlePaletteSave();

        console.log('✓ Palette Management initialized');
    }

    loadPalettes() {
        if (!this.savedPalettesList) return;

        this.savedPalettesList.loadFromStorage();
        this.savedPalettesList.onSelectPalette((palette) => {
            this.loadPaletteIntoMode(palette);
        });
    }

    handlePaletteSave() {
        document.addEventListener('paletteSaved', (e) => {
            this.loadPalettes();
            Toast.success('Palette saved successfully!', 1500);
        });
    }

    loadPaletteIntoMode(palette) {
        const customSection = document.querySelector('#custom-mode');
        if (!customSection) return;

        const colorInput = customSection.querySelector('.color-input');
        if (colorInput) {
            colorInput.value = palette.colors[0];
            colorInput.dispatchEvent(new Event('input', { bubbles: true }));
            Toast.info('Loaded palette into Custom Mode', 1500);
        }
    }
}

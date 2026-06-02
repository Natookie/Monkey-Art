class CustomModeController {
    constructor() {
        this.colorInput = null;
        this.paletteDisplay = null;
        this.shadeDisplay = null;
        this.errorMessage = null;
        this.modeSection = null;
        this.currentPalette = null;
        this.saveButton = null;
        this.saveDialog = null;

        this.init();
    }

    init() {
        this.modeSection = document.getElementById('custom-mode');
        if (!this.modeSection) {
            console.warn('Custom Mode section not found');
            return;
        }

        const contentArea = this.modeSection.querySelector('.mode-content');
        this.errorMessage = new ErrorMessage({
            targetElement: contentArea,
        });

        this.colorInput = new ColorInput({
            label: 'Enter Primary Color (Hex)',
            placeholder: '#RRGGBB',
            initialValue: '#FF6B35',
        });
        contentArea.appendChild(this.colorInput.getElement());

        this.paletteDisplay = new PaletteDisplay({
            emptyMessage: 'Enter a hex color to generate a palette',
        });
        contentArea.appendChild(this.paletteDisplay.getElement());

        this.shadeDisplay = new ShadeDisplay({
            emptyMessage: 'Shades will appear here',
        });
        contentArea.appendChild(this.shadeDisplay.getElement());

        this.saveButton = document.createElement('button');
        this.saveButton.className = 'btn btn-primary save-palette-btn';
        this.saveButton.textContent = 'Save Palette';
        this.saveButton.setAttribute('aria-label', 'Save current palette');
        this.saveButton.addEventListener('click', () => this.openSaveDialog());
        contentArea.appendChild(this.saveButton);

        this.saveDialog = new SavePaletteDialog();
        this.setupEventListeners();
        this.handleColorInputChange('#FF6B35');
    }

    setupEventListeners() {
        this.colorInput.onInput((value) => {
            this.handleColorInputChange(value);
        });

        this.paletteDisplay.getElement().addEventListener('swatchClicked', (e) => {
            this.handleSwatchClick(e.detail.hex);
        });

        this.shadeDisplay.getElement().addEventListener('shadeClicked', (e) => {
            this.handleSwatchClick(e.detail.hex);
        });
    }

    async handleColorInputChange(value) {
        const validationResult = validation.validateHex(value);

        if (!validationResult.isValid) {
            this.errorMessage.show(validationResult.error);
            return;
        }

        this.errorMessage.clear();

        try {
            const palette = PaletteService.generatePalette(value);
            const shades = PaletteService.generateShades(value);

            this.currentPalette = {
                colors: palette,
                source: 'custom',
            };

            this.paletteDisplay.updatePalette(palette);
            this.shadeDisplay.updateShades(shades);
        } catch (error) {
            console.error('Failed to generate palette:', error);
            this.errorMessage.show('Failed to generate palette. Please try again.');
        }
    }

    async handleSwatchClick(hex) {
        try {
            const result = await ClipboardService.copyToClipboard(hex);

            if (result.success) {
                Toast.success('Copied!', 1500);
            } else {
                Toast.error(result.error || 'Failed to copy', 2000);
            }
        } catch (error) {
            console.error('Copy failed:', error);
            Toast.error('Failed to copy. Please try again.', 2000);
        }
    }

    openSaveDialog() {
        if (!this.currentPalette) {
            Toast.warning('No palette to save', 1500);
            return;
        }

        this.saveDialog.open();

        this.saveDialog.onSaveCallback((paletteData) => {
            const palette = {
                ...this.currentPalette,
                ...paletteData,
            };

            try {
                StorageService.savePalette(palette);
                Toast.success('Palette saved!', 1500);

                document.dispatchEvent(new Event('paletteSaved'));
            } catch (error) {
                console.error('Failed to save palette:', error);
                Toast.error('Failed to save palette', 2000);
            }
        });

        this.saveDialog.onCancelCallback(() => {
        });
    }
}

const customModeController = new CustomModeController();

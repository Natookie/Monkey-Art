class ExploreModeController {
    constructor() {
        this.exploreDisplay = null;
        this.nextButton = null;
        this.saveButton = null;
        this.errorMessage = null;
        this.modeSection = null;
        this.currentPalette = null;
        this.saveDialog = null;

        this.init();
    }

    init() {
        this.modeSection = document.getElementById('explore-mode');
        if (!this.modeSection) {
            console.warn('Explore Mode section not found');
            return;
        }

        const contentArea = this.modeSection.querySelector('.mode-content');

        this.errorMessage = new ErrorMessage({
            targetElement: contentArea,
        });

        this.exploreDisplay = new ExploreDisplay({
            emptyMessage: "Press 'Next' to explore random palettes",
        });
        contentArea.appendChild(this.exploreDisplay.getElement());

        const buttonWrapper = document.createElement('div');
        buttonWrapper.className = 'explore-button-wrapper';

        this.nextButton = document.createElement('button');
        this.nextButton.className = 'btn btn-primary explore-next-btn';
        this.nextButton.textContent = 'Next';
        this.nextButton.setAttribute('aria-label', 'Generate next random palette');
        this.nextButton.addEventListener('click', () => this.generateNextPalette());

        this.saveButton = document.createElement('button');
        this.saveButton.className = 'btn btn-primary save-palette-btn';
        this.saveButton.textContent = 'Save Palette';
        this.saveButton.setAttribute('aria-label', 'Save current explore palette');
        this.saveButton.addEventListener('click', () => this.openSaveDialog());

        buttonWrapper.appendChild(this.nextButton);
        buttonWrapper.appendChild(this.saveButton);
        contentArea.appendChild(buttonWrapper);

        this.saveDialog = new SavePaletteDialog();
        this.setupEventListeners();
        this.generateNextPalette();
    }

    setupEventListeners() {
        this.exploreDisplay.getElement().addEventListener('exploreSwatchClicked', (e) => {
            this.handleSwatchClick(e.detail.hex);
        });
    }

    generateNextPalette() {
        try {
            const palette = ExploreService.getRandomPalette();

            this.currentPalette = {
                colors: palette.colors,
                source: 'explore',
            };

            this.exploreDisplay.updatePalette(palette);
            this.errorMessage.clear();
        } catch (error) {
            console.error('Failed to generate palette:', error);
            this.errorMessage.show('Failed to load palette. Please try again.');
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

        this.saveDialog.onCancelCallback(() => {});
    }
}

const exploreModeController = new ExploreModeController();

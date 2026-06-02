class SavePaletteDialog {
    constructor(options = {}) {
        this.colors = options.colors || [];
        this.source = options.source || 'custom';
        this.onSave = null;
        this.onCancel = null;

        this.createElements();
        this.updateColorPreview();
    }

    setColors(colors) {
        this.colors = colors || [];
        this.updateColorPreview();
    }

    updateColorPreview() {
        if (!this.colorPreview) return;
        this.colorPreview.innerHTML = '';

        const previewColors = this.colors.slice(0, 8);
        previewColors.forEach((hex) => {
            const dot = document.createElement('div');
            dot.className = 'color-dot';
            dot.style.backgroundColor = hex;
            dot.title = hex;
            this.colorPreview.appendChild(dot);
        });

        if (this.colors.length > 8) {
            const more = document.createElement('div');
            more.className = 'color-dot-more';
            more.textContent = `+${this.colors.length - 8}`;
            this.colorPreview.appendChild(more);
        }
    }

    createElements() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'dialog-overlay';
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.cancel();
            }
        });

        this.dialog = document.createElement('div');
        this.dialog.className = 'save-palette-dialog';
        this.dialog.setAttribute('role', 'dialog');
        this.dialog.setAttribute('aria-modal', 'true');
        this.dialog.setAttribute('aria-label', 'Save Palette');

        const header = document.createElement('div');
        header.className = 'dialog-header';
        const title = document.createElement('h2');
        title.textContent = 'Save Palette';
        header.appendChild(title);

        const closeBtn = document.createElement('button');
        closeBtn.className = 'dialog-close-btn';
        closeBtn.setAttribute('aria-label', 'Close dialog');
        closeBtn.textContent = '✕';
        closeBtn.addEventListener('click', () => this.cancel());
        header.appendChild(closeBtn);

        const content = document.createElement('div');
        content.className = 'dialog-content';

        const label = document.createElement('label');
        label.htmlFor = 'palette-name-input';
        label.textContent = 'Palette Name (optional):';

        this.input = document.createElement('input');
        this.input.type = 'text';
        this.input.id = 'palette-name-input';
        this.input.className = 'input-field';
        this.input.placeholder = 'e.g., My Awesome Colors';
        this.input.maxLength = '100';

        const previewLabel = document.createElement('p');
        previewLabel.className = 'dialog-preview-label';
        previewLabel.textContent = 'Colors:';

        this.colorPreview = document.createElement('div');
        this.colorPreview.className = 'dialog-color-preview';

        content.appendChild(label);
        content.appendChild(this.input);
        content.appendChild(previewLabel);
        content.appendChild(this.colorPreview);

        const footer = document.createElement('div');
        footer.className = 'dialog-footer';

        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'btn btn-secondary';
        cancelBtn.textContent = 'Cancel';
        cancelBtn.addEventListener('click', () => this.cancel());

        const saveBtn = document.createElement('button');
        saveBtn.className = 'btn btn-primary';
        saveBtn.textContent = 'Save Palette';
        saveBtn.addEventListener('click', () => this.save());

        footer.appendChild(cancelBtn);
        footer.appendChild(saveBtn);

        this.dialog.appendChild(header);
        this.dialog.appendChild(content);
        this.dialog.appendChild(footer);

        this.overlay.appendChild(this.dialog);
    }

    open() {
        document.body.appendChild(this.overlay);
        this.updateColorPreview();
        this.input.focus();

        this.closeHandler = (e) => {
            if (e.key === 'Escape') {
                this.cancel();
            }
        };
        document.addEventListener('keydown', this.closeHandler);
    }

    close() {
        document.removeEventListener('keydown', this.closeHandler);
        if (this.overlay.parentNode) {
            this.overlay.parentNode.removeChild(this.overlay);
        }
    }

    save() {
        const name = this.input.value.trim();
        const finalName = name || this.generateDefaultName();

        if (this.onSave) {
            this.onSave({
                name: finalName,
                colors: this.colors,
                source: this.source,
                createdAt: new Date().toISOString(),
            });
        }

        this.close();
    }

    cancel() {
        if (this.onCancel) {
            this.onCancel();
        }
        this.close();
    }

    generateDefaultName() {
        const date = new Date();
        return `Palette ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    }

    onSaveCallback(callback) {
        this.onSave = callback;
    }

    onCancelCallback(callback) {
        this.onCancel = callback;
    }
}

class ExploreDisplay {
    constructor(options = {}) {
        this.id = options.id || `explore-display-${Math.random().toString(36).substr(2, 9)}`;
        this.palette = null;
        this.savedPalettes = [];
        this.colorClassLibrary = null;

        this._callbacks = {
            onSwatchClick: null,
            onRandomGenerate: null,
            onUsePalette: null,
            onSavePalette: null,
            onUpdatePalette: null,
        };

        this.expandedSections = {
            random: true,
            saved: true,
            classes: true,
        };

        this.createElements();
        this.loadSavedPalettes();
        this.setupHashListener();
        this.renderRandomPalette();
    }

    onRandomGenerate(callback) {
        this._callbacks.onRandomGenerate = callback;
        return this;
    }

    onSwatch(callback) {
        this._callbacks.onSwatchClick = callback;
        return this;
    }

    onUse(callback) {
        this._callbacks.onUsePalette = callback;
        return this;
    }

    onSave(callback) {
        this._callbacks.onSavePalette = callback;
        return this;
    }

    onUpdatePalette(callback) {
        this._callbacks.onUpdatePalette = callback;
        return this;
    }

    setupHashListener() {
        const hash = window.location.hash.slice(1);
        if (hash && ['random', 'saved', 'classes'].includes(hash)) {
            setTimeout(() => this.scrollToSection(hash), 100);
        }

        window.addEventListener('hashchange', () => {
            const newHash = window.location.hash.slice(1);
            if (newHash && ['random', 'saved', 'classes'].includes(newHash)) {
                this.scrollToSection(newHash);
            }
        });
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(`explore-section-${sectionId}`);
        if (section) {
            const headerOffset = 80;
            const elementPosition = section.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
            });

            this.updateActiveNavLink(sectionId);
            history.pushState(null, null, `#${sectionId}`);
        }
    }

    updateActiveNavLink(sectionId) {
        document.querySelectorAll('.explore-section-link').forEach((link) => {
            link.classList.remove('active');
            if (link.dataset.section === sectionId) {
                link.classList.add('active');
            }
        });
    }

    createElements() {
        this.container = document.createElement('div');
        this.container.className = 'explore-content-area';
        this.container.id = this.id;

        this.createRandomPaletteSection();
        this.createSavedPalettesSection();
        this.createColorClassesSection();
    }

    createRandomPaletteSection() {
        const section = document.createElement('div');
        section.className = `explore-section ${this.expandedSections.random ? '' : 'collapsed'}`;
        section.id = 'explore-section-random';

        const header = document.createElement('div');
        header.className = 'explore-section-header';
        header.addEventListener('click', (e) => {
            if (e.target.tagName !== 'BUTTON' && !e.target.closest('.random-palette-actions')) {
                this.toggleSection('random');
            }
        });

        let totalPalettes = 0;
        if (typeof paletteLibrary !== 'undefined') {
            totalPalettes = paletteLibrary.length;
        } else if (typeof ExploreService !== 'undefined' && ExploreService.getPaletteCount) {
            totalPalettes = ExploreService.getPaletteCount();
        }

        header.innerHTML = `
            <div class="explore-section-title">
                <i class="fas fa-dice-d6"></i>
                <span>Library Palette</span>
            </div>
            <div class="explore-section-toggle">
                <span class="explore-section-count" id="random-palette-count" data-total="${totalPalettes}">
                    ${totalPalettes}
                </span>
                <i class="fas fa-chevron-down"></i>
            </div>
        `;

        const content = document.createElement('div');
        content.className = 'explore-section-content';

        const headerRow = document.createElement('div');
        headerRow.className = 'random-palette-header-row';

        this.paletteNameSpan = document.createElement('span');
        this.paletteNameSpan.className = 'random-palette-name';
        this.paletteNameSpan.textContent = 'No palette generated';

        const actions = document.createElement('div');
        actions.className = 'random-palette-actions';

        this.nextBtn = document.createElement('button');
        this.nextBtn.className = 'btn btn-primary';
        this.nextBtn.innerHTML = '<i class="fas fa-dice"></i> Next Palette';
        this.nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (this._callbacks.onRandomGenerate) {
                this._callbacks.onRandomGenerate();
            }
        });

        this.saveRandomBtn = document.createElement('button');
        this.saveRandomBtn.className = 'btn btn-secondary';
        this.saveRandomBtn.innerHTML = '<i class="fas fa-save"></i> Save';
        this.saveRandomBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (this._callbacks.onSavePalette && this.palette) {
                this._callbacks.onSavePalette(this.palette);
            }
        });

        actions.appendChild(this.nextBtn);
        actions.appendChild(this.saveRandomBtn);
        headerRow.appendChild(this.paletteNameSpan);
        headerRow.appendChild(actions);

        this.randomColorGrid = document.createElement('div');
        this.randomColorGrid.className = 'explore-palette-grid';

        content.appendChild(headerRow);
        content.appendChild(this.randomColorGrid);

        section.appendChild(header);
        section.appendChild(content);
        this.container.appendChild(section);
        this.randomSection = section;
    }

    createSavedPalettesSection() {
        const section = document.createElement('div');
        section.className = `explore-section ${this.expandedSections.saved ? '' : 'collapsed'}`;
        section.id = 'explore-section-saved';

        const header = document.createElement('div');
        header.className = 'explore-section-header';
        header.addEventListener('click', () => this.toggleSection('saved'));

        header.innerHTML = `
            <div class="explore-section-title">
                <i class="fas fa-bookmark"></i>
                <span>Saved Palettes</span>
            </div>
            <div class="explore-section-toggle">
                <span class="explore-section-count" id="saved-palettes-count">0</span>
                <i class="fas fa-chevron-down"></i>
            </div>
        `;

        const content = document.createElement('div');
        content.className = 'explore-section-content';

        this.savedPalettesGrid = document.createElement('div');
        this.savedPalettesGrid.className = 'saved-palettes-grid';
        content.appendChild(this.savedPalettesGrid);

        section.appendChild(header);
        section.appendChild(content);
        this.container.appendChild(section);
        this.savedSection = section;
    }

    createColorClassesSection() {
        const section = document.createElement('div');
        section.className = `explore-section ${this.expandedSections.classes ? '' : 'collapsed'}`;
        section.id = 'explore-section-classes';

        const header = document.createElement('div');
        header.className = 'explore-section-header';
        header.addEventListener('click', () => this.toggleSection('classes'));

        header.innerHTML = `
            <div class="explore-section-title">
                <i class="fas fa-graduation-cap"></i>
                <span>Color Classes</span>
            </div>
            <div class="explore-section-toggle">
                <span class="explore-section-count">5</span>
                <i class="fas fa-chevron-down"></i>
            </div>
        `;

        const content = document.createElement('div');
        content.className = 'explore-section-content';

        if (typeof ColorClassLibrary !== 'undefined') {
            this.colorClassLibrary = new ColorClassLibrary({
                onUsePalette: (colors) => {
                    if (this._callbacks.onUsePalette) {
                        this._callbacks.onUsePalette(colors);
                    }
                },
            });
            content.appendChild(this.colorClassLibrary.getElement());
        } else {
            const fallback = document.createElement('div');
            fallback.className = 'empty-state-icon';
            fallback.innerHTML = `
                <i class="fas fa-book-open"></i>
                <p>Color Class Library loading...</p>
            `;
            content.appendChild(fallback);
        }

        section.appendChild(header);
        section.appendChild(content);
        this.container.appendChild(section);
        this.classesSection = section;
    }

    toggleSection(sectionName) {
        this.expandedSections[sectionName] = !this.expandedSections[sectionName];

        let section;
        if (sectionName === 'random') section = this.randomSection;
        else if (sectionName === 'saved') section = this.savedSection;
        else section = this.classesSection;

        if (section) {
            if (this.expandedSections[sectionName]) {
                section.classList.remove('collapsed');
            } else {
                section.classList.add('collapsed');
            }
        }

        localStorage.setItem('explore_expanded_sections', JSON.stringify(this.expandedSections));
    }

    loadSavedPalettes() {
        if (typeof StorageService !== 'undefined') {
            this.savedPalettes = StorageService.getAllPalettes();
        } else {
            const saved = localStorage.getItem('monkeyart:palettes');
            this.savedPalettes = saved ? JSON.parse(saved) : [];
        }

        const countBadge = this.savedSection?.querySelector('.explore-section-count');
        if (countBadge) countBadge.textContent = this.savedPalettes.length;

        this.renderSavedPalettes();
    }

    truncateText(text, maxLength = 55) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    createEditableName(palette, item) {
        const nameContainer = document.createElement('div');
        nameContainer.className = 'saved-palette-name-container';

        const editBtn = document.createElement('button');
        editBtn.className = 'saved-palette-edit-btn';
        editBtn.innerHTML = '<i class="fas fa-pencil-alt"></i>';
        editBtn.title = 'Edit palette name';

        const nameSpan = document.createElement('span');
        nameSpan.className = 'saved-palette-name';
        nameSpan.textContent = this.truncateText(palette.name || 'Untitled');
        nameSpan.title = palette.name || 'Untitled';
        nameSpan.setAttribute('contenteditable', 'false');

        let isEditing = false;

        const startEditing = () => {
            if (isEditing) return;

            isEditing = true;
            editBtn.style.color = '#FFD700';
            nameSpan.setAttribute('contenteditable', 'true');
            nameSpan.focus();

            const range = document.createRange();
            const selection = window.getSelection();
            range.selectNodeContents(nameSpan);
            selection.removeAllRanges();
            selection.addRange(range);
        };

        const saveEditing = () => {
            if (!isEditing) return;

            let newName = nameSpan.textContent.trim();
            if (newName.length === 0) newName = 'Untitled';

            if (newName.length > 55) {
                newName = newName.substring(0, 55) + '...';
            }

            if (newName !== palette.name) {
                palette.name = newName;
                nameSpan.textContent = this.truncateText(newName);
                nameSpan.title = newName;

                if (typeof StorageService !== 'undefined') {
                    StorageService.updatePalette(palette.id, { name: newName });
                } else {
                    const saved = localStorage.getItem('monkeyart:palettes');
                    const palettes = saved ? JSON.parse(saved) : [];
                    const index = palettes.findIndex((p) => p.id === palette.id);
                    if (index !== -1) {
                        palettes[index].name = newName;
                        localStorage.setItem('monkeyart:palettes', JSON.stringify(palettes));
                    }
                }

                if (typeof Toast !== 'undefined') {
                    Toast.success('Name updated!', 1500);
                }
            } else {
                nameSpan.textContent = this.truncateText(palette.name);
            }

            nameSpan.setAttribute('contenteditable', 'false');
            editBtn.style.color = '';
            isEditing = false;
        };

        nameSpan.addEventListener('click', startEditing);
        nameSpan.addEventListener('blur', saveEditing);
        nameSpan.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                nameSpan.blur();
            }
        });

        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            startEditing();
        });

        nameContainer.appendChild(editBtn);
        nameContainer.appendChild(nameSpan);

        return nameContainer;
    }

    renderSavedPalettes() {
        if (!this.savedPalettesGrid) return;

        this.savedPalettesGrid.innerHTML = '';

        if (this.savedPalettes.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state-icon';
            emptyState.innerHTML = `
                <i class="fas fa-inbox"></i>
                <p>No saved palettes yet</p>
                <p style="font-size: 11px; margin-top: 8px;">Save a palette from Library Palette section</p>
            `;
            this.savedPalettesGrid.appendChild(emptyState);
            return;
        }

        const sorted = [...this.savedPalettes].sort(
            (a, b) => (b.timestamp || 0) - (a.timestamp || 0),
        );

        sorted.forEach((palette) => {
            const item = document.createElement('div');
            item.className = 'saved-palette-item';
            item.setAttribute('data-palette-id', palette.id);

            const header = document.createElement('div');
            header.className = 'saved-palette-header';

            const nameContainer = this.createEditableName(palette, item);

            const headerRight = document.createElement('div');
            headerRight.className = 'saved-palette-header-right';

            const dateSpan = document.createElement('span');
            dateSpan.className = 'saved-palette-date';
            dateSpan.textContent = palette.timestamp
                ? new Date(palette.timestamp).toLocaleDateString()
                : '';

            const editColorsBtn = document.createElement('button');
            editColorsBtn.className = 'saved-palette-edit-colors-btn';
            editColorsBtn.innerHTML = '<i class="fas fa-edit"></i>';
            editColorsBtn.title = 'Edit colors';

            let isEditingColors = false;
            let colorPickerContainer = null;

            editColorsBtn.addEventListener('click', (e) => {
                e.stopPropagation();

                if (isEditingColors) {
                    const newColors = [];
                    const hexInputs =
                        colorPickerContainer.querySelectorAll('.color-edit-input-hex');
                    hexInputs.forEach((input) => {
                        if (input.value) newColors.push(input.value);
                    });

                    if (
                        newColors.length > 0 &&
                        JSON.stringify(newColors) !== JSON.stringify(palette.colors)
                    ) {
                        palette.colors = newColors;

                        if (typeof StorageService !== 'undefined') {
                            StorageService.updatePalette(palette.id, { colors: newColors });
                        } else {
                            const saved = localStorage.getItem('monkeyart:palettes');
                            const palettes = saved ? JSON.parse(saved) : [];
                            const index = palettes.findIndex((p) => p.id === palette.id);
                            if (index !== -1) {
                                palettes[index].colors = newColors;
                                localStorage.setItem(
                                    'monkeyart:palettes',
                                    JSON.stringify(palettes),
                                );
                            }
                        }

                        if (typeof Toast !== 'undefined') {
                            Toast.success('Colors updated!', 1500);
                        }

                        this.renderSavedPaletteColors(item, palette);
                    }

                    colorPickerContainer.remove();
                    editColorsBtn.innerHTML = '<i class="fas fa-edit"></i>';
                    editColorsBtn.title = 'Edit colors';
                    isEditingColors = false;
                } else {
                    isEditingColors = true;
                    editColorsBtn.innerHTML = '<i class="fas fa-check"></i>';
                    editColorsBtn.title = 'Save colors';

                    colorPickerContainer = document.createElement('div');
                    colorPickerContainer.className = 'color-edit-container';

                    palette.colors.forEach((color, index) => {
                        const colorRow = document.createElement('div');
                        colorRow.className = 'color-edit-row';

                        const colorSwatch = document.createElement('div');
                        colorSwatch.className = 'color-edit-picker';
                        colorSwatch.style.backgroundColor = color;
                        colorSwatch.style.width = '45px';
                        colorSwatch.style.height = '45px';
                        colorSwatch.style.borderRadius = '6px';
                        colorSwatch.style.cursor = 'pointer';
                        colorSwatch.style.border = '1px solid var(--border-color, #3a3a3a)';

                        const hiddenColorInput = document.createElement('input');
                        hiddenColorInput.type = 'color';
                        hiddenColorInput.value = color;
                        hiddenColorInput.style.display = 'none';

                        const hexInput = document.createElement('input');
                        hexInput.type = 'text';
                        hexInput.value = color.toUpperCase();
                        hexInput.className = 'color-edit-input-hex';

                        colorSwatch.addEventListener('click', () => {
                            hiddenColorInput.click();
                        });

                        hiddenColorInput.addEventListener('input', (e) => {
                            const newColor = e.target.value;
                            colorSwatch.style.backgroundColor = newColor;
                            hexInput.value = newColor.toUpperCase();
                        });

                        hexInput.addEventListener('input', (e) => {
                            let hex = e.target.value;
                            if (!hex.startsWith('#')) hex = '#' + hex;
                            if (/^#[0-9A-Fa-f]{6}$/i.test(hex)) {
                                colorSwatch.style.backgroundColor = hex;
                                hiddenColorInput.value = hex;
                            }
                        });

                        const removeBtn = document.createElement('button');
                        removeBtn.innerHTML = '<i class="fas fa-trash"></i>';
                        removeBtn.className = 'color-edit-remove';
                        removeBtn.addEventListener('click', () => {
                            colorRow.remove();
                        });

                        colorRow.appendChild(colorSwatch);
                        colorRow.appendChild(hiddenColorInput);
                        colorRow.appendChild(hexInput);
                        colorRow.appendChild(removeBtn);
                        colorPickerContainer.appendChild(colorRow);
                    });

                    const addBtn = document.createElement('button');
                    addBtn.className = 'btn btn-small btn-secondary color-edit-add';
                    addBtn.innerHTML = '<i class="fas fa-plus"></i> Add Color';
                    addBtn.addEventListener('click', () => {
                        const colorRow = document.createElement('div');
                        colorRow.className = 'color-edit-row';

                        const colorSwatch = document.createElement('div');
                        colorSwatch.className = 'color-edit-picker';
                        colorSwatch.style.backgroundColor = '#FF0000';
                        colorSwatch.style.width = '45px';
                        colorSwatch.style.height = '45px';
                        colorSwatch.style.borderRadius = '6px';
                        colorSwatch.style.cursor = 'pointer';
                        colorSwatch.style.border = '1px solid var(--border-color, #3a3a3a)';

                        const hiddenColorInput = document.createElement('input');
                        hiddenColorInput.type = 'color';
                        hiddenColorInput.value = '#FF0000';
                        hiddenColorInput.style.display = 'none';

                        const hexInput = document.createElement('input');
                        hexInput.type = 'text';
                        hexInput.value = '#FF0000';
                        hexInput.className = 'color-edit-input-hex';

                        colorSwatch.addEventListener('click', () => {
                            hiddenColorInput.click();
                        });

                        hiddenColorInput.addEventListener('input', (e) => {
                            const newColor = e.target.value;
                            colorSwatch.style.backgroundColor = newColor;
                            hexInput.value = newColor.toUpperCase();
                        });

                        hexInput.addEventListener('input', (e) => {
                            let hex = e.target.value;
                            if (!hex.startsWith('#')) hex = '#' + hex;
                            if (/^#[0-9A-Fa-f]{6}$/i.test(hex)) {
                                colorSwatch.style.backgroundColor = hex;
                                hiddenColorInput.value = hex;
                            }
                        });

                        const removeBtn = document.createElement('button');
                        removeBtn.innerHTML = '<i class="fas fa-trash"></i>';
                        removeBtn.className = 'color-edit-remove';
                        removeBtn.addEventListener('click', () => {
                            colorRow.remove();
                        });

                        colorRow.appendChild(colorSwatch);
                        colorRow.appendChild(hiddenColorInput);
                        colorRow.appendChild(hexInput);
                        colorRow.appendChild(removeBtn);

                        colorPickerContainer.insertBefore(colorRow, addBtn);
                    });

                    colorPickerContainer.appendChild(addBtn);

                    const colorsDiv = item.querySelector('.saved-palette-colors');
                    colorsDiv.parentNode.insertBefore(colorPickerContainer, colorsDiv.nextSibling);
                }
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'saved-palette-delete-btn';
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            deleteBtn.title = 'Delete palette';

            let deleteState = 'idle';
            let confirmTimeout = null;

            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();

                if (deleteState === 'idle') {
                    deleteState = 'confirm';
                    deleteBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
                    deleteBtn.classList.add('confirm-mode');
                    deleteBtn.title = 'Click again to confirm delete';

                    const confirmText = document.createElement('span');
                    confirmText.className = 'delete-confirm-text';
                    confirmText.textContent = 'Click again';
                    deleteBtn.appendChild(confirmText);

                    confirmTimeout = setTimeout(() => {
                        if (deleteState === 'confirm') {
                            deleteState = 'idle';
                            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
                            deleteBtn.classList.remove('confirm-mode');
                            deleteBtn.title = 'Delete palette';
                            const textSpan = deleteBtn.querySelector('.delete-confirm-text');
                            if (textSpan) textSpan.remove();
                        }
                    }, 3000);
                } else if (deleteState === 'confirm') {
                    if (confirmTimeout) clearTimeout(confirmTimeout);

                    item.style.backgroundColor = 'var(--error-light, #3a1a1a)';
                    item.style.borderColor = 'var(--error, #f87171)';

                    setTimeout(async () => {
                        if (typeof StorageService !== 'undefined') {
                            StorageService.deletePalette(palette.id);
                        } else {
                            const saved = localStorage.getItem('monkeyart:palettes');
                            const palettes = saved ? JSON.parse(saved) : [];
                            const filtered = palettes.filter((p) => p.id !== palette.id);
                            localStorage.setItem('monkeyart:palettes', JSON.stringify(filtered));
                        }
                        this.loadSavedPalettes();
                        if (typeof Toast !== 'undefined') {
                            Toast.success('Palette deleted', 1500);
                        }
                        document.dispatchEvent(new Event('paletteDeleted'));
                    }, 150);
                }
            });

            deleteBtn.addEventListener('mouseleave', () => {
                if (deleteState === 'confirm' && confirmTimeout) {
                    clearTimeout(confirmTimeout);
                    deleteState = 'idle';
                    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
                    deleteBtn.classList.remove('confirm-mode');
                    deleteBtn.title = 'Delete palette';
                    const textSpan = deleteBtn.querySelector('.delete-confirm-text');
                    if (textSpan) textSpan.remove();
                }
            });

            headerRight.appendChild(dateSpan);
            headerRight.appendChild(editColorsBtn);
            headerRight.appendChild(deleteBtn);

            header.appendChild(nameContainer);
            header.appendChild(headerRight);

            const colorsDiv = document.createElement('div');
            colorsDiv.className = 'saved-palette-colors';

            item.appendChild(header);
            item.appendChild(colorsDiv);

            this.renderSavedPaletteColors(item, palette);

            this.savedPalettesGrid.appendChild(item);
        });
    }

    renderSavedPaletteColors(item, palette) {
        const colorsDiv = item.querySelector('.saved-palette-colors');
        if (!colorsDiv) return;

        colorsDiv.innerHTML = '';
        colorsDiv.style.display = 'flex';
        colorsDiv.style.flexWrap = 'wrap';
        colorsDiv.style.gap = '8px';
        colorsDiv.style.width = '100%';

        palette.colors.forEach((color) => {
            const swatch = document.createElement('div');
            swatch.className = 'saved-palette-swatch';
            swatch.style.backgroundColor = color;
            swatch.style.width = '40px';
            swatch.style.height = '40px';
            swatch.style.borderRadius = '6px';
            swatch.style.cursor = 'pointer';
            swatch.style.border = '1px solid var(--border-color, #3a3a3a)';
            swatch.title = color;
            swatch.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleSwatchClick(color);
            });
            colorsDiv.appendChild(swatch);
        });
    }

    renderRandomPalette() {
        if (!this.randomColorGrid) return;

        this.randomColorGrid.innerHTML = '';

        if (!this.palette || !this.palette.colors || this.palette.colors.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state-icon';
            emptyState.innerHTML = `<i class="fas fa-dice-d6"></i><p>Click "Next Palette" to generate</p>`;
            this.randomColorGrid.appendChild(emptyState);
            const countBadge = this.randomSection?.querySelector('.explore-section-count');
            if (countBadge && countBadge.dataset.total) {
                countBadge.textContent = countBadge.dataset.total;
            }
            return;
        }

        const countBadge = this.randomSection?.querySelector('.explore-section-count');
        if (countBadge && countBadge.dataset.total) {
            countBadge.textContent = countBadge.dataset.total;
        }

        if (this.paletteNameSpan && this.palette.name) {
            this.paletteNameSpan.textContent = this.palette.name;
        }

        this.palette.colors.forEach((hex) => {
            const swatchContainer = document.createElement('div');
            swatchContainer.className = 'color-box-display';
            const swatch = document.createElement('button');
            swatch.className = 'color-box-swatch';
            swatch.style.backgroundColor = hex;
            const label = document.createElement('span');
            label.className = 'color-box-label';
            label.textContent = hex.toUpperCase();
            swatchContainer.appendChild(swatch);
            swatchContainer.appendChild(label);
            swatch.addEventListener('click', () => this.handleSwatchClick(hex));
            this.randomColorGrid.appendChild(swatchContainer);
        });
    }

    async handleSwatchClick(hex) {
        try {
            if (typeof ClipboardService !== 'undefined') {
                await ClipboardService.copyToClipboard(hex, { feedback: true });
            }
        } catch (error) {
            console.error('Copy failed:', error);
        }
        if (this._callbacks.onSwatchClick) {
            this._callbacks.onSwatchClick(hex);
        }
    }

    updateRandomPalette(palette) {
        this.palette = palette;
        this.renderRandomPalette();
    }

    refreshSavedPalettes() {
        this.loadSavedPalettes();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    getElement() {
        return this.container;
    }

    destroy() {
        if (this.colorClassLibrary) {
            this.colorClassLibrary.destroy();
        }
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}

if (typeof window !== 'undefined') {
    window.ExploreDisplay = ExploreDisplay;
}

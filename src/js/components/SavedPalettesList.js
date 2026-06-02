class SavedPalettesList {
    constructor(options = {}) {
        this.id = options.id || `saved-palettes-list-${Math.random().toString(36).substr(2, 9)}`;
        this.palettes = [];
        this.filteredPalettes = [];
        this.sortAscending = true;
        this.searchTerm = '';
        this.onPaletteSelect = null;

        this.renderThrottle = null;
        this.maxDisplayPalettes = 50;
        this.useVirtualScrolling = false;

        this.createElements();
        this.setupEventListeners();
    }

    createElements() {
        this.container = document.createElement('div');
        this.container.id = this.id;
        this.container.className = 'saved-palettes-list';

        this.toolbar = document.createElement('div');
        this.toolbar.className = 'palettes-toolbar';

        this.searchInput = document.createElement('input');
        this.searchInput.type = 'text';
        this.searchInput.className = 'input-field palettes-search';
        this.searchInput.placeholder = 'Search palettes...';
        this.searchInput.setAttribute('aria-label', 'Search saved palettes');

        this.sortButton = document.createElement('button');
        this.sortButton.className = 'btn btn-secondary palettes-sort-btn';
        this.sortButton.textContent = 'Sort A→Z';
        this.sortButton.setAttribute('aria-label', 'Sort palettes alphabetically');

        this.toolbar.appendChild(this.searchInput);
        this.toolbar.appendChild(this.sortButton);

        this.listContainer = document.createElement('div');
        this.listContainer.className = 'palettes-list-container';
        this.listContainer.style.overflow = 'auto';
        this.listContainer.style.maxHeight = '600px';

        this.container.appendChild(this.toolbar);
        this.container.appendChild(this.listContainer);

        this.cachedItems = new Map();
    }

    setupEventListeners() {
        let searchTimeout;
        this.searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.searchTerm = e.target.value;
                this.filterAndRender();
            }, 300);
        });

        this.sortButton.addEventListener('click', () => {
            this.toggleSort();
        });
    }

    loadFromStorage() {
        const loadData = () => {
            this.palettes = StorageService.getAllPalettes();
            this.sort();
            this.filterAndRender();
        };

        if (window.requestIdleCallback) {
            requestIdleCallback(loadData);
        } else {
            setTimeout(loadData, 50);
        }
    }

    filterAndRender() {
        if (this.renderThrottle) {
            cancelAnimationFrame(this.renderThrottle);
        }

        this.renderThrottle = requestAnimationFrame(() => {
            this.filter();
            this.render();
        });
    }

    filter() {
        if (!this.searchTerm) {
            this.filteredPalettes = [...this.palettes];
        } else {
            const term = this.searchTerm.toLowerCase();
            this.filteredPalettes = this.palettes.filter((p) =>
                (p.name || '').toLowerCase().includes(term),
            );
        }

        if (this.filteredPalettes.length > this.maxDisplayPalettes) {
            this.filteredPalettes = this.filteredPalettes.slice(0, this.maxDisplayPalettes);
            this.hasMorePalettes = true;
        } else {
            this.hasMorePalettes = false;
        }
    }

    sort() {
        this.palettes.sort((a, b) => {
            const comparison = (a.name || '').localeCompare(b.name || '');
            return this.sortAscending ? comparison : -comparison;
        });

        this.sortButton.textContent = this.sortAscending ? 'Sort A→Z' : 'Sort Z→A';
    }

    toggleSort() {
        this.sortAscending = !this.sortAscending;
        this.sort();
        this.filterAndRender();
    }

    render() {
        const fragment = document.createDocumentFragment();

        if (this.filteredPalettes.length === 0) {
            const emptyState = document.createElement('p');
            emptyState.className = 'empty-state';
            emptyState.textContent = this.searchTerm
                ? `No palettes found matching "${this.searchTerm}"`
                : 'No palettes saved yet';
            fragment.appendChild(emptyState);
        } else {
            const list = document.createElement('div');
            list.className = 'palettes-list';

            for (const palette of this.filteredPalettes) {
                let item = this.cachedItems.get(palette.id);
                if (!item) {
                    item = this.createPaletteItem(palette);
                    this.cachedItems.set(palette.id, item);
                } else {
                    this.updatePaletteItem(item, palette);
                }
                list.appendChild(item.cloneNode(true));
            }

            fragment.appendChild(list);

            if (this.hasMorePalettes) {
                const moreMsg = document.createElement('p');
                moreMsg.className = 'more-palettes-message';
                moreMsg.textContent = `Showing first ${this.maxDisplayPalettes} palettes. Use search to find specific palettes.`;
                moreMsg.style.textAlign = 'center';
                moreMsg.style.padding = 'var(--spacing-md)';
                moreMsg.style.color = 'var(--text-muted)';
                moreMsg.style.fontSize = '12px';
                fragment.appendChild(moreMsg);
            }
        }

        this.listContainer.innerHTML = '';
        this.listContainer.appendChild(fragment);

        this.updateSearchResults();
    }

    createPaletteItem(palette) {
        const item = document.createElement('div');
        item.className = 'palette-item';
        item.id = `palette-${palette.id}`;

        const header = document.createElement('div');
        header.className = 'palette-item-header';

        const name = document.createElement('h3');
        name.className = 'palette-item-name';
        name.textContent = palette.name || 'Untitled Palette';
        name.title = palette.name || 'Untitled Palette';

        header.appendChild(name);
        item.appendChild(header);

        const previewContainer = document.createElement('div');
        previewContainer.className = 'palette-preview';

        if (palette.colors && palette.colors.length > 0) {
            const previewColors = palette.colors.slice(0, 5);
            this.createOptimizedPreview(previewContainer, previewColors, palette.colors.length);
        }

        item.appendChild(previewContainer);

        const footer = document.createElement('div');
        footer.className = 'palette-item-footer';

        const useBtn = document.createElement('button');
        useBtn.className = 'btn btn-small btn-secondary';
        useBtn.textContent = 'Use';
        useBtn.setAttribute('aria-label', `Use palette: ${palette.name}`);
        useBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.onPaletteSelect) {
                this.onPaletteSelect(palette);
            }
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-small btn-danger';
        deleteBtn.textContent = 'Delete';
        deleteBtn.setAttribute('aria-label', `Delete palette: ${palette.name}`);
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm(`Delete "${palette.name}"?`)) {
                StorageService.deletePalette(palette.id);
                this.cachedItems.delete(palette.id);
                this.loadFromStorage();

                if (typeof Toast !== 'undefined') {
                    Toast.success('Palette deleted', 1500);
                }
            }
        });

        footer.appendChild(useBtn);
        footer.appendChild(deleteBtn);
        item.appendChild(footer);

        return item;
    }

    createOptimizedPreview(container, colors, totalColors) {
        container.style.display = 'flex';
        container.style.gap = '8px';
        container.style.marginTop = '8px';
        container.style.flexWrap = 'wrap';

        for (const color of colors) {
            const swatch = document.createElement('div');
            swatch.className = 'preview-swatch';
            swatch.style.cssText = `
                width: 40px;
                height: 40px;
                border-radius: 6px;
                background-color: ${color};
                border: 1px solid var(--border-color);
                cursor: pointer;
                transition: transform 0.1s ease;
            `;
            swatch.title = color;

            swatch.addEventListener('click', async (e) => {
                e.stopPropagation();
                try {
                    if (typeof ClipboardService !== 'undefined') {
                        await ClipboardService.copyToClipboard(color, { feedback: true });
                    } else {
                        await navigator.clipboard.writeText(color);
                    }
                } catch (error) {
                    console.error('Copy failed:', error);
                }
            });

            container.appendChild(swatch);
        }

        if (totalColors > 5) {
            const moreIndicator = document.createElement('div');
            moreIndicator.style.cssText = `
                width: 40px;
                height: 40px;
                border-radius: 6px;
                background: var(--bg-tertiary);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 11px;
                font-weight: bold;
                color: var(--text-secondary);
                border: 1px solid var(--border-color);
            `;
            moreIndicator.textContent = `+${totalColors - 5}`;
            container.appendChild(moreIndicator);
        }
    }

    updatePaletteItem(item, palette) {
        const nameEl = item.querySelector('.palette-item-name');
        if (nameEl) nameEl.textContent = palette.name || 'Untitled Palette';

    }

    updateSearchResults() {
        if (this.searchInput) {
            const resultText = `${this.filteredPalettes.length} palette${this.filteredPalettes.length !== 1 ? 's' : ''} found`;
            this.searchInput.setAttribute('aria-label', resultText);
        }
    }

    getElement() {
        return this.container;
    }

    refresh() {
        this.loadFromStorage();
    }

    destroy() {
        if (this.renderThrottle) {
            cancelAnimationFrame(this.renderThrottle);
        }
        this.cachedItems.clear();
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}

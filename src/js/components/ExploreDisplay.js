class ExploreDisplay {
    constructor(options = {}) {
        this.id = options.id || `explore-display-${Math.random().toString(36).substr(2, 9)}`;
        this.palette = null;
        this.savedPalettes = [];
        this.colorClassLibrary = null;

        this.allPalettes = [];
        this.filteredPalettes = [];
        this.currentPage = 1;
        this.itemsPerPage = 8;
        this.activeCategory = 'all';
        this.searchQuery = '';
        this.visibleCategoriesCount = 10;
        this.expandedCategories = false;

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

        this.loadLibraryPalettes();
        this.createElements();
        this.loadSavedPalettes();
        this.setupHashListener();
        this.setupNavigationLinks();
    }

    loadLibraryPalettes() {
        if (typeof paletteLibrary !== 'undefined' && Array.isArray(paletteLibrary)) {
            this.allPalettes = [...paletteLibrary];
            this.filteredPalettes = [...this.allPalettes];
        } else {
            console.warn('paletteLibrary not found, using fallback');
            this.allPalettes = this.getFallbackPalettes();
            this.filteredPalettes = [...this.allPalettes];
        }
    }

    getFallbackPalettes() {
        return [
            { name: 'Ocean Breeze', colors: ['#0066CC', '#00A4CC', '#00B8CC', '#58C4DC', '#A8DADC'], category: 'cool', tags: ['ocean', 'calm', 'blue'] },
            { name: 'Sunset Blaze', colors: ['#FF6B35', '#F45E61', '#FF85A2', '#E94B3C', '#A23B72'], category: 'warm', tags: ['sunset', 'vibrant'] },
            { name: 'Forest Walk', colors: ['#1B4332', '#2D6A4F', '#40916C', '#52B788', '#74C69D'], category: 'nature', tags: ['forest', 'green'] },
        ];
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

    setupNavigationLinks() {
        const sectionLinks = document.querySelectorAll('.explore-section-link');
        const subLinks = document.querySelectorAll('.explore-sublink');

        const clearAllActiveStates = () => {
            document.querySelectorAll('.explore-section-link').forEach(link => {
                link.classList.remove('active');
                link.classList.remove('active-parent');
            });
            document.querySelectorAll('.explore-sublink').forEach(link => {
                link.classList.remove('active');
            });
        };

        const setActiveSubAndParent = (categoryId, parentSectionId = 'classes') => {
            clearAllActiveStates();
            
            const parentLink = document.querySelector(`.explore-section-link[data-section="${parentSectionId}"]`);
            if (parentLink) {
                parentLink.classList.add('active-parent');
            }
            
            const activeSubLink = document.querySelector(`.explore-sublink[data-category="${categoryId}"]`);
            if (activeSubLink) {
                activeSubLink.classList.add('active');
            }
        };

        sectionLinks.forEach((link) => {
            const newLink = link.cloneNode(true);
            if (link.parentNode) {
                link.parentNode.replaceChild(newLink, link);
            }

            newLink.addEventListener('click', (e) => {
                const sectionId = newLink.dataset.section;
                const parentLi = newLink.closest('.has-sublist');

                if (parentLi && sectionId === 'classes') {
                    e.preventDefault();
                    const sublist = parentLi.querySelector('.explore-sublist');
                    const icon = newLink.querySelector('.sublist-toggle');
                    if (sublist) {
                        sublist.classList.toggle('open');
                        if (icon) {
                            icon.style.transform = sublist.classList.contains('open') ? 'rotate(180deg)' : 'rotate(0deg)';
                        }
                        localStorage.setItem('explore_sublist_open', sublist.classList.contains('open'));
                    }
                    
                    if (!sublist?.classList.contains('open')) {
                        clearAllActiveStates();
                        newLink.classList.add('active');
                    } else {
                        newLink.classList.add('active-parent');
                    }
                    return;
                }

                if (sectionId) {
                    e.preventDefault();
                    clearAllActiveStates();
                    newLink.classList.add('active');
                    this.scrollToSection(sectionId);
                    history.pushState(null, null, `#${sectionId}`);
                }
            });
        });

        subLinks.forEach((link) => {
            const newLink = link.cloneNode(true);
            if (link.parentNode) {
                link.parentNode.replaceChild(newLink, link);
            }

            newLink.addEventListener('click', (e) => {
                e.preventDefault();
                const categoryId = newLink.dataset.category;
                if (categoryId) {
                    setActiveSubAndParent(categoryId, 'classes');
                    this.scrollToCategory(categoryId);
                    history.pushState(null, null, `#category-${categoryId}`);
                }
            });
        });

        const savedState = localStorage.getItem('explore_sublist_open');
        if (savedState === 'true') {
            const sublist = document.querySelector('.explore-sublist');
            const parentLink = document.querySelector('.explore-section-link[data-section="classes"]');
            const icon = document.querySelector('.sublist-toggle');
            if (sublist) sublist.classList.add('open');
            if (icon) icon.style.transform = 'rotate(180deg)';
            if (parentLink) parentLink.classList.add('active-parent');
        }

        this.handleInitialHash();
    }

    handleInitialHash() {
        const hash = window.location.hash.slice(1);
        if (!hash) return;

        if (hash === 'explore-section-random' || hash === 'random') {
            this.updateActiveNavLink('random');
            setTimeout(() => this.scrollToSection('random'), 100);
        } else if (hash === 'explore-section-saved' || hash === 'saved') {
            this.updateActiveNavLink('saved');
            setTimeout(() => this.scrollToSection('saved'), 100);
        } else if (hash === 'explore-section-classes' || hash === 'classes') {
            this.updateActiveNavLink('classes');
            setTimeout(() => this.scrollToSection('classes'), 100);
        } else if (hash.startsWith('category-')) {
            const categoryId = hash.replace('category-', '');
            const parentLink = document.querySelector('.explore-section-link[data-section="classes"]');
            if (parentLink) {
                parentLink.classList.add('active-parent');
            }
            const activeSubLink = document.querySelector(`.explore-sublink[data-category="${categoryId}"]`);
            if (activeSubLink) {
                activeSubLink.classList.add('active');
            }
            setTimeout(() => this.scrollToCategory(categoryId), 100);
        }
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(`explore-section-${sectionId}`);
        if (section) {
            const scrollContainer = this.getScrollContainer();
            const headerOffset = 80;

            if (scrollContainer === window) {
                const elementPosition = section.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            } else {
                const containerRect = scrollContainer.getBoundingClientRect();
                const elementRect = section.getBoundingClientRect();
                const relativeTop = elementRect.top - containerRect.top;
                const currentScroll = scrollContainer.scrollTop;
                const targetScroll = currentScroll + relativeTop - headerOffset;
                scrollContainer.scrollTo({ top: Math.max(0, targetScroll), behavior: 'smooth' });
            }

            this.updateActiveNavLink(sectionId);
        }
    }

    scrollToCategory(categoryId) {
        let categoryElement = document.getElementById(`category-${categoryId}`);
        if (!categoryElement) {
            categoryElement = document.querySelector(`.color-category[data-category-id="${categoryId}"]`);
        }

        if (categoryElement) {
            const scrollContainer = this.getScrollContainer();
            const headerOffset = 80;

            if (scrollContainer === window) {
                const elementPosition = categoryElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            } else {
                const containerRect = scrollContainer.getBoundingClientRect();
                const elementRect = categoryElement.getBoundingClientRect();
                const relativeTop = elementRect.top - containerRect.top;
                const currentScroll = scrollContainer.scrollTop;
                const targetScroll = currentScroll + relativeTop - headerOffset;
                scrollContainer.scrollTo({ top: Math.max(0, targetScroll), behavior: 'smooth' });
            }

            if (categoryElement.classList.contains('collapsed')) {
                setTimeout(() => {
                    const header = categoryElement.querySelector('.color-category-header');
                    if (header) header.click();
                }, 300);
            }
        }
    }

    getScrollContainer() {
        const candidates = [
            document.querySelector('.right-panel'),
            document.querySelector('#rightPanel'),
            document.querySelector('.explore-content-area'),
            document.querySelector('#exploreDisplay'),
            document.querySelector('.tool-content'),
            document.querySelector('.bento-grid'),
        ];

        for (let el of candidates) {
            if (el && el.scrollHeight > el.clientHeight + 5) {
                return el;
            }
        }
        return window;
    }

    updateActiveNavLink(sectionId) {
        document.querySelectorAll('.explore-section-link').forEach((link) => {
            link.classList.remove('active');
            link.classList.remove('active-parent');
            if (link.dataset.section === sectionId) {
                link.classList.add('active');
            }
        });
        document.querySelectorAll('.explore-sublink').forEach((link) => {
            link.classList.remove('active');
        });
    }

    updateActiveSubLink(categoryId) {
        document.querySelectorAll('.explore-sublink').forEach((link) => {
            link.classList.remove('active');
            if (link.dataset.category === categoryId) {
                link.classList.add('active');
            }
        });
    }

    setupHashListener() {
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.slice(1);
            if (hash === 'random' || hash === 'explore-section-random') {
                this.scrollToSection('random');
            } else if (hash === 'saved' || hash === 'explore-section-saved') {
                this.scrollToSection('saved');
            } else if (hash === 'classes' || hash === 'explore-section-classes') {
                this.scrollToSection('classes');
            } else if (hash.startsWith('category-')) {
                const categoryId = hash.replace('category-', '');
                this.scrollToCategory(categoryId);
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
            if (!e.target.closest('.explore-filter-bar') && !e.target.closest('.explore-pagination')) {
                this.toggleSection('random');
            }
        });

        const totalPalettes = this.allPalettes.length;

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

        this.buildFilterBar(content);
        this.buildPagination(content);
        this.buildPaletteGrid(content);

        section.appendChild(header);
        section.appendChild(content);
        this.container.appendChild(section);
        this.randomSection = section;

        this.renderGrid();
    }

    getAllCategories() {
        const cats = new Set();
        this.allPalettes.forEach(p => {
            if (p.category) cats.add(p.category);
        });
        return Array.from(cats).sort();
    }

    capitalize(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    buildFilterBar(container) {
        this.filterContainer = document.createElement('div');
        this.filterContainer.className = 'explore-filter-bar';

        const allCategories = this.getAllCategories();
        
        const categoryWrapper = document.createElement('div');
        categoryWrapper.className = 'explore-categories-wrapper';
        
        const categoriesContainer = document.createElement('div');
        categoriesContainer.className = 'explore-categories-container';
        
        const renderCategories = () => {
            categoriesContainer.innerHTML = '';
            
            const allPill = this.createCategoryPill('all', 'All');
            categoriesContainer.appendChild(allPill);
            
            let categoriesToShow = [...allCategories];
            
            if (!this.expandedCategories && categoriesToShow.length > this.visibleCategoriesCount) {
                categoriesToShow = categoriesToShow.slice(0, this.visibleCategoriesCount);
            }
            
            categoriesToShow.forEach(cat => {
                const pill = this.createCategoryPill(cat, this.capitalize(cat));
                categoriesContainer.appendChild(pill);
            });
            
            if (allCategories.length > this.visibleCategoriesCount) {
                const toggleButton = document.createElement('button');
                toggleButton.className = 'explore-category-pill explore-toggle-more';
                toggleButton.textContent = this.expandedCategories ? 'Less' : `+${allCategories.length - this.visibleCategoriesCount} more`;
                toggleButton.addEventListener('click', () => {
                    this.expandedCategories = !this.expandedCategories;
                    renderCategories();
                });
                categoriesContainer.appendChild(toggleButton);
            }
        };
        
        renderCategories();
        
        categoryWrapper.appendChild(categoriesContainer);
        
        const searchWrapper = document.createElement('div');
        searchWrapper.className = 'explore-search-wrapper';
        searchWrapper.innerHTML = `
            <i class="fas fa-search search-icon"></i>
            <input type="text" id="exploreSearchInput" class="explore-search-input" 
                   placeholder="Search by name or tag... (e.g., autumn, neon, ocean)">
            <button id="exploreClearSearchBtn" class="explore-clear-search-btn" style="display: none;">
                <i class="fas fa-times"></i>
            </button>
        `;

        this.filterContainer.appendChild(categoryWrapper);
        this.filterContainer.appendChild(searchWrapper);
        container.appendChild(this.filterContainer);

        this.attachFilterEvents();
    }

    createCategoryPill(value, label) {
        const pill = document.createElement('button');
        pill.className = `explore-category-pill ${this.activeCategory === value ? 'active' : ''}`;
        pill.setAttribute('data-category', value);
        pill.textContent = label;
        pill.addEventListener('click', () => {
            this.activeCategory = value;
            this.searchQuery = '';
            const searchInput = document.getElementById('exploreSearchInput');
            if (searchInput) {
                searchInput.value = '';
                document.getElementById('exploreClearSearchBtn').style.display = 'none';
            }
            this.applyFilters();
            this.updateActivePill();
        });
        return pill;
    }

    updateActivePill() {
        document.querySelectorAll('.explore-category-pill').forEach(pill => {
            const cat = pill.getAttribute('data-category');
            if (cat === this.activeCategory) {
                pill.classList.add('active');
            } else {
                pill.classList.remove('active');
            }
        });
    }

    attachFilterEvents() {
        setTimeout(() => {
            const searchInput = document.getElementById('exploreSearchInput');
            const clearBtn = document.getElementById('exploreClearSearchBtn');

            if (searchInput) {
                const newSearchInput = searchInput.cloneNode(true);
                if (searchInput.parentNode) {
                    searchInput.parentNode.replaceChild(newSearchInput, searchInput);
                }
                
                newSearchInput.addEventListener('input', (e) => {
                    console.log('Search input changed:', e.target.value);
                    this.searchQuery = e.target.value.toLowerCase();
                    
                    const clearBtnEl = document.getElementById('exploreClearSearchBtn');
                    if (clearBtnEl) {
                        clearBtnEl.style.display = this.searchQuery.length > 0 ? 'flex' : 'none';
                    }
                    
                    this.currentPage = 1;
                    this.applyFilters();
                });
            } else {
                console.warn('Search input not found in DOM');
            }

            const clearBtnFresh = document.getElementById('exploreClearSearchBtn');
            if (clearBtnFresh) {
                const newClearBtn = clearBtnFresh.cloneNode(true);
                if (clearBtnFresh.parentNode) {
                    clearBtnFresh.parentNode.replaceChild(newClearBtn, clearBtnFresh);
                }
                
                newClearBtn.addEventListener('click', () => {
                    const searchInputEl = document.getElementById('exploreSearchInput');
                    if (searchInputEl) {
                        searchInputEl.value = '';
                        this.searchQuery = '';
                        newClearBtn.style.display = 'none';
                        this.currentPage = 1;
                        this.applyFilters();
                    }
                });
            }
        }, 100);
    }

    applyFilters() {
        let results = [...this.allPalettes];
        if (this.activeCategory !== 'all') {
            results = results.filter(p => p.category === this.activeCategory);
        }

        if (this.searchQuery.length > 0) {
            const searchTerms = this.searchQuery.toLowerCase().split(/[, ]+/).filter(term => term.length > 0);
            
            results = results.filter(p => {
                const nameLower = p.name.toLowerCase();
                const tagsLower = p.tags ? p.tags.map(t => t.toLowerCase()) : [];
                
                return searchTerms.some(term => {
                    return nameLower.includes(term) || tagsLower.some(tag => tag.includes(term));
                });
            });
        }

        this.filteredPalettes = results;
        this.currentPage = 1;
        this.updateCategoryCounts();
        this.renderGrid();
    }

    updateCategoryCounts() {
        const countBadge = this.randomSection?.querySelector('.explore-section-count');
        if (countBadge) {
            countBadge.textContent = this.filteredPalettes.length;
        }
    }

    buildPaletteGrid(container) {
        this.paletteGridContainer = document.createElement('div');
        this.paletteGridContainer.className = 'explore-palette-grid-container';
        container.appendChild(this.paletteGridContainer);
    }

    buildPagination(container) {
        this.paginationContainer = document.createElement('div');
        this.paginationContainer.className = 'explore-pagination';
        container.appendChild(this.paginationContainer);
    }

    renderGrid() {
        if (!this.paletteGridContainer) return;

        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        const pagePalettes = this.filteredPalettes.slice(start, end);

        this.paletteGridContainer.innerHTML = '';

        if (this.filteredPalettes.length === 0) {
            this.paletteGridContainer.innerHTML = `
                <div class="empty-state-icon">
                    <i class="fas fa-palette"></i>
                    <p>No palettes found matching "${this.searchQuery || this.activeCategory}"</p>
                    <button id="exploreResetFiltersBtn" class="explore-reset-filters-btn">Reset Filters</button>
                </div>
            `;
            const resetBtn = document.getElementById('exploreResetFiltersBtn');
            if (resetBtn) {
                resetBtn.addEventListener('click', () => {
                    this.activeCategory = 'all';
                    this.searchQuery = '';
                    const searchInput = document.getElementById('exploreSearchInput');
                    if (searchInput) {
                        searchInput.value = '';
                        document.getElementById('exploreClearSearchBtn').style.display = 'none';
                    }
                    this.currentPage = 1;
                    this.applyFilters();
                    this.updateActivePill();
                });
            }
            if (this.paginationContainer) this.paginationContainer.innerHTML = '';
            return;
        }

        const grid = document.createElement('div');
        grid.className = 'explore-palette-grid';
        
        pagePalettes.forEach(palette => {
            const card = this.createPaletteCard(palette);
            grid.appendChild(card);
        });

        this.paletteGridContainer.appendChild(grid);
        this.renderPagination();
    }

    createPaletteCard(palette) {
        const card = document.createElement('div');
        card.className = 'explore-palette-card';
        
        const swatchesContainer = document.createElement('div');
        swatchesContainer.className = 'explore-palette-swatches';
        
        palette.colors.slice(0, 5).forEach(color => {
            const swatch = document.createElement('div');
            swatch.className = 'explore-palette-swatch';
            swatch.style.backgroundColor = color;
            swatch.title = color;
            swatch.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleSwatchClick(color);
            });
            swatchesContainer.appendChild(swatch);
        });
        
        if (palette.colors.length > 5) {
            const more = document.createElement('div');
            more.className = 'explore-palette-swatch more-indicator';
            more.textContent = `+${palette.colors.length - 5}`;
            swatchesContainer.appendChild(more);
        }
        
        const info = document.createElement('div');
        info.className = 'explore-palette-info';
        
        const name = document.createElement('div');
        name.className = 'explore-palette-card-name';
        name.textContent = palette.name;
        
        const category = document.createElement('div');
        category.className = 'explore-palette-card-category';
        category.innerHTML = `<i class="fas fa-tag"></i> ${this.capitalize(palette.category || 'Uncategorized')}`;
        
        info.appendChild(name);
        info.appendChild(category);
        
        if (palette.tags && palette.tags.length > 0) {
            const tagsContainer = document.createElement('div');
            tagsContainer.className = 'explore-palette-card-tags';
            palette.tags.slice(0, 3).forEach(tag => {
                const tagEl = document.createElement('span');
                tagEl.className = 'explore-palette-card-tag';
                tagEl.textContent = tag;
                tagsContainer.appendChild(tagEl);
            });
            if (palette.tags.length > 3) {
                const moreTag = document.createElement('span');
                moreTag.className = 'explore-palette-card-tag';
                moreTag.textContent = `+${palette.tags.length - 3}`;
                tagsContainer.appendChild(moreTag);
            }
            info.appendChild(tagsContainer);
        }
        
        const actions = document.createElement('div');
        actions.className = 'explore-palette-actions';
        
        const saveBtn = document.createElement('button');
        saveBtn.className = 'explore-palette-save-btn';
        saveBtn.innerHTML = '<i class="fas fa-save"></i> Save';
        saveBtn.title = 'Save this palette';
        saveBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.savePaletteFromCard(palette);
        });
        
        const useBtn = document.createElement('button');
        useBtn.className = 'explore-palette-use-btn';
        useBtn.innerHTML = '<i class="fas fa-palette"></i> Use';
        useBtn.title = 'Apply to Tools mode';
        useBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.usePaletteFromCard(palette);
        });
        
        actions.appendChild(saveBtn);
        actions.appendChild(useBtn);
        
        card.appendChild(swatchesContainer);
        card.appendChild(info);
        card.appendChild(actions);
        
        card.addEventListener('click', () => {
            this.usePaletteFromCard(palette);
        });
        
        return card;
    }

    savePaletteFromCard(palette) {
        if (this._callbacks.onSavePalette) {
            this._callbacks.onSavePalette(palette);
        } else {
            const paletteToSave = {
                id: 'palette_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                name: palette.name || 'Palette ' + new Date().toLocaleString(),
                colors: palette.colors,
                source: 'Explore',
                timestamp: Date.now(),
            };
            
            if (typeof StorageService !== 'undefined' && StorageService.savePalette) {
                StorageService.savePalette(paletteToSave);
            } else {
                const saved = localStorage.getItem('monkeyart:palettes');
                const palettes = saved ? JSON.parse(saved) : [];
                palettes.push(paletteToSave);
                localStorage.setItem('monkeyart:palettes', JSON.stringify(palettes));
            }
            
            if (typeof Toast !== 'undefined') {
                Toast.success(`"${paletteToSave.name}" saved!`, 1500);
            }
            this.refreshSavedPalettes();
        }
    }

    usePaletteFromCard(palette) {
        if (!palette || !palette.colors || palette.colors.length === 0) return;
        
        if (this._callbacks.onUsePalette) {
            this._callbacks.onUsePalette(palette.colors);
        } else {
            const primaryColor = palette.colors[0];
            const primaryInput = document.getElementById('primaryColorInput');
            if (primaryInput) {
                primaryInput.value = primaryColor;
                primaryInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
            
            const toolsBtn = document.querySelector('.mode-btn[data-mode="Tools"]');
            if (toolsBtn && !toolsBtn.classList.contains('active')) {
                toolsBtn.click();
            }
        }
        
        if (typeof Toast !== 'undefined') {
            Toast.success(`Applied "${palette.name}" to Tools mode`, 1500);
        }
    }

    renderPagination() {
        if (!this.paginationContainer) return;
        
        const totalPages = Math.ceil(this.filteredPalettes.length / this.itemsPerPage);
        
        if (totalPages <= 1) {
            this.paginationContainer.innerHTML = '';
            return;
        }
        
        this.paginationContainer.innerHTML = '';
        
        const paginationInner = document.createElement('div');
        paginationInner.className = 'explore-pagination-inner';
        
        const controlsLeft = document.createElement('div');
        controlsLeft.className = 'explore-pagination-controls';
        
        const prevBtn = document.createElement('button');
        prevBtn.className = 'explore-page-btn';
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i> Prev';
        prevBtn.disabled = this.currentPage === 1;
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (this.currentPage > 1) {
                this.currentPage--;
                this.renderGrid();
            }
        });
        controlsLeft.appendChild(prevBtn);
        
        const pageNumbers = document.createElement('div');
        pageNumbers.className = 'explore-page-numbers';
        
        let startPage = Math.max(1, this.currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);
        
        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `explore-page-number ${i === this.currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (i >= 1 && i <= totalPages) {
                    this.currentPage = i;
                    this.renderGrid();
                }
            });
            pageNumbers.appendChild(pageBtn);
        }
        
        controlsLeft.appendChild(pageNumbers);
        
        const nextBtn = document.createElement('button');
        nextBtn.className = 'explore-page-btn';
        nextBtn.innerHTML = 'Next <i class="fas fa-chevron-right"></i>';
        nextBtn.disabled = this.currentPage === totalPages;
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.renderGrid();
            }
        });
        controlsLeft.appendChild(nextBtn);
        
        const info = document.createElement('span');
        info.className = 'explore-pagination-info';
        info.textContent = `Showing ${((this.currentPage - 1) * this.itemsPerPage) + 1}-${Math.min(this.currentPage * this.itemsPerPage, this.filteredPalettes.length)} of ${this.filteredPalettes.length} palettes`;
        
        paginationInner.appendChild(controlsLeft);
        paginationInner.appendChild(info);
        
        this.paginationContainer.appendChild(paginationInner);
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

    async handleSwatchClick(hex) {
        try {
            if (typeof ClipboardService !== 'undefined') {
                await ClipboardService.copyToClipboard(hex, { feedback: true });
            } else {
                await navigator.clipboard.writeText(hex);
                if (typeof Toast !== 'undefined') {
                    Toast.success(`${hex.toUpperCase()} copied!`, 1000);
                }
            }
        } catch (error) {
            console.error('Copy failed:', error);
        }
        if (this._callbacks.onSwatchClick) {
            this._callbacks.onSwatchClick(hex);
        }
    }

    refreshSavedPalettes() {
        this.loadSavedPalettes();
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
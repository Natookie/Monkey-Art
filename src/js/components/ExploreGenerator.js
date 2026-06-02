const ExploreGenerator = (() => {
    let exploreDisplay = null;
    let currentPalette = null;

    const init = () => {
        console.log('ExploreGenerator.init() called');

        const container = document.getElementById('exploreDisplay');
        if (!container) {
            console.error('ExploreGenerator: DOM element with id "exploreDisplay" not found');
            return;
        }

        container.innerHTML = '';

        exploreDisplay = new ExploreDisplay();
        container.__exploreDisplay = exploreDisplay;
        exploreDisplay.onRandomGenerate(() => generateNextPalette());
        exploreDisplay.onSave((palette) => savePalette(palette));
        exploreDisplay.onUse((colors) => applyPaletteToTools(colors));

        container.appendChild(exploreDisplay.getElement());
        setTimeout(() => setupNavigation(), 500);

        generateNextPalette();
    };

    const refreshSavedPalettes = () => {
        if (exploreDisplay && exploreDisplay.refreshSavedPalettes) {
            exploreDisplay.refreshSavedPalettes();
            console.log('Saved palettes refreshed');
        }
    };

    const getScrollContainer = () => {
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
                console.log('Found scroll container:', el.className || el.id);
                return el;
            }
        }

        return window;
    };

    const setupNavigation = () => {
        console.log('Setting up navigation...');

        const sectionLinks = document.querySelectorAll('.explore-section-link');
        const subLinks = document.querySelectorAll('.explore-sublink');

        sectionLinks.forEach((link) => {
            const newLink = link.cloneNode(true);
            link.parentNode.replaceChild(newLink, link);

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
                            icon.style.transform = sublist.classList.contains('open')
                                ? 'rotate(180deg)'
                                : 'rotate(0deg)';
                        }
                        localStorage.setItem(
                            'explore_sublist_open',
                            sublist.classList.contains('open'),
                        );
                    }
                    return;
                }

                if (sectionId) {
                    e.preventDefault();
                    scrollToSectionById(sectionId);
                }
            });
        });

        subLinks.forEach((link) => {
            const newLink = link.cloneNode(true);
            link.parentNode.replaceChild(newLink, link);

            newLink.addEventListener('click', (e) => {
                e.preventDefault();
                const categoryId = newLink.dataset.category;

                if (categoryId) {
                    scrollToCategoryById(categoryId);
                    updateActiveStates('classes');
                    updateActiveSubLink(categoryId);
                    history.pushState(null, null, `#category-${categoryId}`);
                }
            });
        });

        const savedState = localStorage.getItem('explore_sublist_open');
        if (savedState === 'true') {
            const sublist = document.querySelector('.explore-sublist');
            const icon = document.querySelector('.sublist-toggle');
            if (sublist) sublist.classList.add('open');
            if (icon) icon.style.transform = 'rotate(180deg)';
        }

        handleInitialHash();
    };

    const scrollToSectionById = (sectionId) => {
        const section = document.getElementById(`explore-section-${sectionId}`);
        if (section) {
            const scrollContainer = getScrollContainer();
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

            updateActiveStates(sectionId);
            history.pushState(null, null, `#explore-section-${sectionId}`);
        }
    };

    const scrollToCategoryById = (categoryId) => {
        let categoryElement = document.getElementById(`category-${categoryId}`);
        if (!categoryElement) {
            categoryElement = document.querySelector(
                `.color-category[data-category-id="${categoryId}"]`,
            );
        }

        if (categoryElement) {
            const scrollContainer = getScrollContainer();
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
    };

    const handleInitialHash = () => {
        const hash = window.location.hash.slice(1);
        if (!hash) return;

        if (hash === 'explore-section-random') {
            setTimeout(() => scrollToSectionById('random'), 500);
        } else if (hash === 'explore-section-saved') {
            setTimeout(() => scrollToSectionById('saved'), 500);
        } else if (hash === 'explore-section-classes') {
            setTimeout(() => scrollToSectionById('classes'), 500);
        } else if (hash.startsWith('category-')) {
            const categoryId = hash.replace('category-', '');
            setTimeout(() => scrollToCategoryById(categoryId), 500);
        }
    };

    const updateActiveStates = (sectionId) => {
        document.querySelectorAll('.explore-section-link').forEach((link) => {
            link.classList.remove('active');
            if (link.dataset.section === sectionId) {
                link.classList.add('active');
            }
        });
    };

    const updateActiveSubLink = (categoryId) => {
        document.querySelectorAll('.explore-sublink').forEach((link) => {
            link.classList.remove('active');
            if (link.dataset.category === categoryId) {
                link.classList.add('active');
            }
        });
    };

    const generateNextPalette = () => {
        try {
            if (typeof ExploreService !== 'undefined' && ExploreService.getRandomPalette) {
                currentPalette = ExploreService.getRandomPalette();
            } else {
                currentPalette = {
                    name: 'Sample Palette',
                    colors: ['#FF6B35', '#F7931E', '#FDB833', '#C1272D', '#4A1F1A'],
                    source: 'explore',
                };
            }

            if (currentPalette && currentPalette.colors && currentPalette.colors.length > 0) {
                exploreDisplay.updateRandomPalette(currentPalette);
            }
        } catch (error) {
            console.error('Error generating random palette:', error);
        }
    };

    const savePalette = (palette) => {
        if (!palette || !palette.colors) return;

        try {
            const paletteToSave = {
                id: 'palette_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                name: palette.name || 'Palette ' + new Date().toLocaleString(),
                colors: palette.colors,
                source: palette.source || 'Explore',
                timestamp: Date.now(),
            };

            if (typeof StorageService !== 'undefined' && StorageService.savePalette) {
                StorageService.savePalette(paletteToSave);
                if (typeof Toast !== 'undefined')
                    Toast.success(`"${paletteToSave.name}" saved!`, 1500);
                refreshSavedPalettes();
            } else {
                const saved = localStorage.getItem('monkeyart:palettes');
                const palettes = saved ? JSON.parse(saved) : [];
                palettes.push(paletteToSave);
                localStorage.setItem('monkeyart:palettes', JSON.stringify(palettes));
                if (typeof Toast !== 'undefined') Toast.success('Palette saved locally!', 1500);
                refreshSavedPalettes();
            }
        } catch (error) {
            console.error('Error saving palette:', error);
        }
    };

    const applyPaletteToTools = (colors) => {
        if (!colors || colors.length === 0) return;

        const primaryInput = document.getElementById('primaryColorInput');
        if (primaryInput && colors[0]) {
            primaryInput.value = colors[0];
            primaryInput.dispatchEvent(new Event('input', { bubbles: true }));
        }

        const toolsBtn = document.querySelector('.mode-btn[data-mode="Tools"]');
        if (toolsBtn && !toolsBtn.classList.contains('active')) toolsBtn.click();

        if (typeof Toast !== 'undefined') Toast.success('Palette applied to Tools mode', 1500);
    };

    document.addEventListener('refreshSavedPalettes', () => {
        refreshSavedPalettes();
    });

    return {
        init,
        refreshSavedPalettes,
    };
})();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () =>
        setTimeout(() => ExploreGenerator.init(), 100),
    );
} else {
    setTimeout(() => ExploreGenerator.init(), 100);
}

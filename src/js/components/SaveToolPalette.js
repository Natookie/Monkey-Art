const SaveToolPalette = (() => {
    let initialized = false;
    let isRefreshing = false;

    const init = () => {
        if (initialized) return;
        initialized = true;

        console.log('SaveToolPalette initializing...');

        addSaveButtonToCard('paletteCard', 'Palette');
        addSaveButtonToCard('shadeCard', 'Shades');
        addSaveButtonToCard('blendCard', 'Blend');

        document.addEventListener('paletteSaved', () => {
            refreshExploreMode();
        });

        console.log('SaveToolPalette initialized');
    };

    const refreshExploreMode = () => {
        if (isRefreshing) {
            console.log('Already refreshing, skipping...');
            return;
        }

        isRefreshing = true;
        console.log('refreshExploreMode called - trying to refresh saved palettes');

        const exploreContainer = document.getElementById('exploreDisplay');
        if (exploreContainer && exploreContainer.__exploreDisplay) {
            if (exploreContainer.__exploreDisplay.refreshSavedPalettes) {
                exploreContainer.__exploreDisplay.refreshSavedPalettes();
            }
        }

        if (typeof ExploreGenerator !== 'undefined' && ExploreGenerator.refreshSavedPalettes) {
            ExploreGenerator.refreshSavedPalettes();
        }

        setTimeout(() => {
            isRefreshing = false;
        }, 500);
    };

    const addSaveButtonToCard = (cardId, toolName) => {
        const card = document.getElementById(cardId);
        if (!card) {
            console.warn(`Card not found: ${cardId}`);
            return;
        }

        if (card.querySelector('.tool-header-save-btn')) return;

        const toolHeader = card.querySelector('.tool-header');
        if (!toolHeader) return;

        const saveBtn = document.createElement('button');
        saveBtn.className = 'tool-header-save-btn';
        saveBtn.innerHTML = '<i class="fas fa-save"></i> <span>Save</span>';
        saveBtn.setAttribute('aria-label', `Save ${toolName} palette`);
        saveBtn.title = `Save ${toolName} palette`;

        saveBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            handleSave(toolName);
        });

        toolHeader.appendChild(saveBtn);
        console.log(`Save button added to ${toolName}`);
    };

    const handleSave = (toolName) => {
        console.log(`handleSave called for ${toolName}`);
        let colors = [];

        switch (toolName) {
            case 'Palette':
                if (typeof PaletteGenerator !== 'undefined' && PaletteGenerator.getCurrentColors) {
                    colors = PaletteGenerator.getCurrentColors();
                    console.log(`Got ${colors.length} colors from PaletteGenerator`);
                } else {
                    const swatches = document.querySelectorAll('#paletteDisplay .color-box-swatch');
                    swatches.forEach((swatch) => {
                        const bgColor = swatch.style.backgroundColor;
                        if (bgColor) {
                            const hex = rgbToHex(bgColor);
                            if (!colors.includes(hex)) colors.push(hex);
                        }
                    });
                    console.log(`Got ${colors.length} colors from DOM fallback`);
                }
                break;

            case 'Shades':
                if (typeof ShadeDisplay !== 'undefined' && ShadeDisplay.getCurrentColors) {
                    colors = ShadeDisplay.getCurrentColors();
                    console.log(`Got ${colors.length} colors from ShadeDisplay`);
                } else {
                    const swatches = document.querySelectorAll('#shadeDisplay .color-box-swatch');
                    swatches.forEach((swatch) => {
                        const bgColor = swatch.style.backgroundColor;
                        if (bgColor) {
                            const hex = rgbToHex(bgColor);
                            if (!colors.includes(hex)) colors.push(hex);
                        }
                    });
                    console.log(`Got ${colors.length} colors from DOM fallback`);
                }
                break;

            case 'Blend':
                if (typeof BlendGenerator !== 'undefined' && BlendGenerator.getCurrentColors) {
                    colors = BlendGenerator.getCurrentColors();
                    console.log(`Got ${colors.length} colors from BlendGenerator`);
                } else {
                    const swatches = document.querySelectorAll('#blendDisplay .color-box-swatch');
                    swatches.forEach((swatch) => {
                        const bgColor = swatch.style.backgroundColor;
                        if (bgColor) {
                            const hex = rgbToHex(bgColor);
                            if (!colors.includes(hex)) colors.push(hex);
                        }
                    });
                    console.log(`Got ${colors.length} colors from DOM fallback`);
                }
                break;
        }

        colors = [...new Set(colors)].filter((c) => c && c.startsWith('#'));

        if (colors.length === 0) {
            if (typeof Toast !== 'undefined') {
                Toast.warning(`No colors to save from ${toolName}`, 1500);
            }
            return;
        }

        console.log(`Saving ${colors.length} colors from ${toolName}`);
        openSaveDialog(colors, toolName);
    };

    const rgbToHex = (rgb) => {
        const result = rgb.match(/\d+/g);
        if (!result) return '#FFD700';
        const hex =
            '#' +
            result
                .slice(0, 3)
                .map((x) => {
                    const hexVal = parseInt(x).toString(16);
                    return hexVal.length === 1 ? '0' + hexVal : hexVal;
                })
                .join('');
        return hex.toUpperCase();
    };

    const openSaveDialog = (colors, source) => {
        if (typeof SavePaletteDialog === 'undefined') {
            console.warn('SavePaletteDialog not available');
            if (typeof Toast !== 'undefined') {
                Toast.error('Save dialog not available', 2000);
            }
            return;
        }

        const dialog = new SavePaletteDialog({
            colors: colors,
            source: source.toLowerCase(),
        });

        dialog.open();
        dialog.onSaveCallback((paletteData) => {
            const palette = {
                id: 'palette_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                colors: colors,
                source: source.toLowerCase(),
                name: paletteData.name || `Untitled ${source} Palette`,
                description: paletteData.description || '',
                timestamp: Date.now(),
            };

            console.log('Saving palette:', palette);

            if (typeof StorageService !== 'undefined') {
                try {
                    StorageService.savePalette(palette);
                    console.log('Palette saved via StorageService');
                    if (typeof Toast !== 'undefined') {
                        Toast.success(`${source} palette saved!`, 1500);
                    }
                    refreshExploreMode();
                } catch (error) {
                    console.error('Failed to save palette:', error);
                    if (typeof Toast !== 'undefined') {
                        Toast.error('Failed to save palette', 2000);
                    }
                }
            } else {
                try {
                    const saved = localStorage.getItem('monkeyart:palettes');
                    const palettes = saved ? JSON.parse(saved) : [];
                    palettes.push(palette);
                    localStorage.setItem('monkeyart:palettes', JSON.stringify(palettes));
                    console.log('Palette saved to localStorage');
                    if (typeof Toast !== 'undefined') {
                        Toast.success(`${source} palette saved locally!`, 1500);
                    }
                    refreshExploreMode();
                } catch (error) {
                    console.error('Failed to save palette to localStorage:', error);
                    if (typeof Toast !== 'undefined') {
                        Toast.error('Failed to save palette', 2000);
                    }
                }
            }
        });
    };

    return { init };
})();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => SaveToolPalette.init(), 500);
    });
} else {
    setTimeout(() => SaveToolPalette.init(), 500);
}

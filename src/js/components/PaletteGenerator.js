const PaletteGenerator = (() => {
    let currentColors = [];
    let lockedMap = [];
    let currentType = 'RANDOM';
    let currentSize = '8';
    let lastPrimaryColor = '';
    let isInitialized = false;

    const PALETTE_TYPES = {
        ANALOGOUS: { name: 'Analogous' },
        COMPLEMENTARY: { name: 'Complementary' },
        TRIADIC: { name: 'Triadic' },
        TETRADIC: { name: 'Tetradic' },
        MONOCHROMATIC: { name: 'Mono' },
        RANDOM: { name: 'Random' },
    };

    const container = document.getElementById('paletteDisplay');
    const paletteCard = document.getElementById('paletteCard');

    if (!container) {
        console.error('PaletteGenerator: paletteDisplay not found');
        return;
    }

    const hexToHsl = (hex) => {
        if (typeof ColorConverter !== 'undefined' && ColorConverter.hexToRgb) {
            const rgb = ColorConverter.hexToRgb(hex);
            if (rgb) {
                return ColorConverter.rgbToHsl(rgb.r, rgb.g, rgb.b);
            }
        }
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0,
            s,
            l = (max + min) / 2;
        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
                    break;
                case g:
                    h = ((b - r) / d + 2) / 6;
                    break;
                case b:
                    h = ((r - g) / d + 4) / 6;
                    break;
            }
        }
        return { h: h * 360, s: s * 100, l: l * 100 };
    };

    const hslToHex = (h, s, l) => {
        if (typeof ColorConverter !== 'undefined' && ColorConverter.hslToRgb) {
            const rgb = ColorConverter.hslToRgb(h, s, l);
            return ColorConverter.rgbToHex(rgb.r, rgb.g, rgb.b);
        }
        h = h / 360;
        s = s / 100;
        l = l / 100;
        let r, g, b;
        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
        const toHex = (x) => {
            const hex = Math.round(x * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
    };

    const generateColor = (primaryHsl, type, targetHue = null, variation = 15) => {
        let newHue, newSat, newLight;

        if (targetHue !== null) {
            newHue = targetHue + (Math.random() - 0.5) * variation;
        } else if (type === 'RANDOM') {
            newHue = Math.random() * 360;
        } else if (type === 'ANALOGOUS') {
            const offset = (Math.random() - 0.5) * 50;
            newHue = (primaryHsl.h + offset + 360) % 360;
        } else if (type === 'COMPLEMENTARY') {
            newHue = (primaryHsl.h + 180) % 360;
        } else if (type === 'TRIADIC') {
            newHue = primaryHsl.h;
        } else if (type === 'TETRADIC') {
            const angles = [90, 180, 270];
            const baseAngle = angles[Math.floor(Math.random() * angles.length)];
            newHue = (primaryHsl.h + baseAngle + (Math.random() - 0.5) * 20 + 360) % 360;
        } else if (type === 'MONOCHROMATIC') {
            newHue = primaryHsl.h;
        } else {
            newHue = Math.random() * 360;
        }

        if (type === 'MONOCHROMATIC') {
            newSat = Math.min(95, Math.max(30, primaryHsl.s + (Math.random() - 0.5) * 50));
            newLight = Math.min(90, Math.max(15, primaryHsl.l + (Math.random() - 0.5) * 60));
        } else {
            newSat = 55 + Math.random() * 40;
            newLight = 45 + Math.random() * 40;
            if (type === 'ANALOGOUS') {
                newSat = Math.min(95, Math.max(50, primaryHsl.s + (Math.random() - 0.5) * 25));
                newLight = Math.min(85, Math.max(40, primaryHsl.l + (Math.random() - 0.5) * 25));
            } else if (type === 'COMPLEMENTARY') {
                newSat = Math.min(95, Math.max(55, primaryHsl.s + (Math.random() - 0.5) * 30));
                newLight = Math.min(80, Math.max(45, primaryHsl.l + (Math.random() - 0.5) * 25));
            }
        }

        newHue = ((newHue % 360) + 360) % 360;
        newSat = Math.min(95, Math.max(35, newSat));
        newLight = Math.min(88, Math.max(25, newLight));

        return { h: newHue, s: newSat, l: newLight };
    };

    const generateBalancedPalette = (primaryColor, type, size) => {
        const count = parseInt(size);
        const primaryHsl = hexToHsl(primaryColor);
        const colors = [primaryColor];

        let targetHues = [];
        if (type === 'COMPLEMENTARY') {
            const complementHue = (primaryHsl.h + 180) % 360;
            for (let i = 1; i < count; i++) {
                targetHues.push(i % 2 === 0 ? primaryHsl.h : complementHue);
            }
        } else if (type === 'TRIADIC') {
            const hues = [primaryHsl.h, (primaryHsl.h + 120) % 360, (primaryHsl.h + 240) % 360];
            for (let i = 1; i < count; i++) {
                targetHues.push(hues[i % hues.length]);
            }
        } else if (type === 'TETRADIC') {
            const hues = [
                primaryHsl.h,
                (primaryHsl.h + 90) % 360,
                (primaryHsl.h + 180) % 360,
                (primaryHsl.h + 270) % 360,
            ];
            for (let i = 1; i < count; i++) {
                targetHues.push(hues[i % hues.length]);
            }
        } else {
            targetHues = null;
        }

        for (let i = 1; i < count; i++) {
            let colorHsl;
            if (targetHues !== null) {
                colorHsl = generateColor(primaryHsl, type, targetHues[i - 1], 15);
            } else {
                colorHsl = generateColor(primaryHsl, type, null, 15);
            }
            colors.push(hslToHex(colorHsl.h, colorHsl.s, colorHsl.l));
        }
        return colors;
    };

    const getColorPriority = (hex) => {
        const hsl = hexToHsl(hex);
        const isAchromatic = hsl.s < 8 || hsl.l > 98 || hsl.l < 5;
        if (isAchromatic) {
            return { isAchromatic: true, hue: 999, lightness: hsl.l, saturation: hsl.s };
        }
        return { isAchromatic: false, hue: hsl.h, lightness: hsl.l, saturation: hsl.s };
    };

    const sortAllColors = (colors) => {
        return [...colors].sort((a, b) => {
            const priorityA = getColorPriority(a);
            const priorityB = getColorPriority(b);

            if (priorityA.isAchromatic && !priorityB.isAchromatic) return 1;
            if (!priorityA.isAchromatic && priorityB.isAchromatic) return -1;

            if (priorityA.isAchromatic && priorityB.isAchromatic) {
                return priorityA.lightness - priorityB.lightness;
            }

            if (Math.abs(priorityA.hue - priorityB.hue) > 0.5) return priorityA.hue - priorityB.hue;
            if (Math.abs(priorityA.lightness - priorityB.lightness) > 0.5)
                return priorityA.lightness - priorityB.lightness;
            return priorityA.saturation - priorityB.saturation;
        });
    };

    const sortUnlockedColors = (colors, locked) => {
        const unlockedIndices = [];
        const unlockedValues = [];
        for (let i = 0; i < colors.length; i++) {
            if (!locked[i]) {
                unlockedIndices.push(i);
                unlockedValues.push(colors[i]);
            }
        }
        const sortedUnlocked = sortAllColors(unlockedValues);
        const newColors = [...colors];
        for (let i = 0; i < unlockedIndices.length; i++) {
            newColors[unlockedIndices[i]] = sortedUnlocked[i];
        }
        return newColors;
    };

    const createToolbar = () => {
        if (document.querySelector('.palette-toolbar')) return;

        const toolbar = document.createElement('div');
        toolbar.className = 'palette-toolbar';

        const leftSide = document.createElement('div');
        leftSide.className = 'toolbar-left';

        const rightSide = document.createElement('div');
        rightSide.className = 'toolbar-right';

        const dropdownWrapper = document.createElement('div');
        dropdownWrapper.className = 'palette-dropdown-wrapper';

        const typeSelect = document.createElement('select');
        typeSelect.className = 'palette-type-select';
        typeSelect.id = 'palette-type-select';
        typeSelect.name = 'palette-type';
        typeSelect.setAttribute('aria-label', 'Palette type selector');

        Object.entries(PALETTE_TYPES).forEach(([key, type]) => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = type.name;
            typeSelect.appendChild(option);
        });
        typeSelect.value = currentType;

        const arrowSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        arrowSvg.setAttribute('class', 'dropdown-arrow');
        arrowSvg.setAttribute('width', '14');
        arrowSvg.setAttribute('height', '14');
        arrowSvg.setAttribute('viewBox', '0 0 24 24');
        arrowSvg.setAttribute('fill', 'none');
        arrowSvg.setAttribute('stroke', 'currentColor');
        arrowSvg.setAttribute('stroke-width', '2');
        arrowSvg.setAttribute('stroke-linecap', 'round');
        arrowSvg.setAttribute('stroke-linejoin', 'round');

        const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        polyline.setAttribute('points', '6 9 12 15 18 9');
        arrowSvg.appendChild(polyline);

        dropdownWrapper.appendChild(typeSelect);
        dropdownWrapper.appendChild(arrowSvg);

        let isOpen = false;
        typeSelect.addEventListener('mousedown', () => {
            isOpen = !isOpen;
            if (isOpen) dropdownWrapper.classList.add('open');
            else dropdownWrapper.classList.remove('open');
        });
        typeSelect.addEventListener('blur', () => {
            isOpen = false;
            dropdownWrapper.classList.remove('open');
        });
        typeSelect.addEventListener('change', (e) => {
            currentType = e.target.value;
            regeneratePalette();
            isOpen = false;
            dropdownWrapper.classList.remove('open');
        });

        const sizeContainer = document.createElement('div');
        sizeContainer.className = 'palette-size-slider-container';
        const sizeLabel = document.createElement('label');
        sizeLabel.className = 'palette-size-label';
        sizeLabel.setAttribute('for', 'palette-size-slider');
        sizeLabel.textContent = 'Color count';

        const sliderWrapper = document.createElement('div');
        sliderWrapper.className = 'palette-slider-wrapper';

        const sizeSlider = document.createElement('input');
        sizeSlider.type = 'range';
        sizeSlider.className = 'palette-size-slider';
        sizeSlider.id = 'palette-size-slider';
        sizeSlider.name = 'palette-size';
        sizeSlider.min = 0;
        sizeSlider.max = 3;
        sizeSlider.step = 1;
        sizeSlider.setAttribute('aria-label', 'Number of colors: 4, 8, 16, or 32');

        const sizeValues = [4, 8, 16, 32];
        const currentIndex = sizeValues.indexOf(parseInt(currentSize));
        sizeSlider.value = currentIndex >= 0 ? currentIndex : 1;

        const tickContainer = document.createElement('div');
        tickContainer.className = 'palette-slider-ticks';

        sizeValues.forEach((value, idx) => {
            const tick = document.createElement('span');
            tick.className = 'palette-slider-tick';
            tick.textContent = value;
            tick.dataset.value = value;
            tick.dataset.index = idx;
            tick.setAttribute('role', 'button');
            tick.setAttribute('tabindex', '0');
            tick.setAttribute('aria-label', `${value} colors`);

            const handleTickClick = () => {
                sizeSlider.value = idx;
                updateSliderBackground(sizeSlider, idx, sizeValues.length);
                updateActiveTick(idx);
                const newSize = sizeValues[idx].toString();
                currentSize = newSize;
                const newLocked = new Array(parseInt(newSize)).fill(false);
                for (let i = 0; i < Math.min(lockedMap.length, newLocked.length); i++) {
                    newLocked[i] = lockedMap[i];
                }
                lockedMap = newLocked;
                regeneratePalette();
            };
            tick.addEventListener('click', handleTickClick);
            tick.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleTickClick();
                }
            });
            tickContainer.appendChild(tick);
        });

        const updateSliderBackground = (slider, value, max) => {
            const percent = (value / (max - 1)) * 100;
            slider.style.background = `linear-gradient(to right, 
                var(--accent-primary, #f0ad4e) 0%, 
                var(--accent-primary, #f0ad4e) ${percent}%,
                var(--bg-tertiary, #e0e0e0) ${percent}%,
                var(--bg-tertiary, #e0e0e0) 100%
            )`;
        };

        const updateActiveTick = (activeIndex) => {
            document.querySelectorAll('.palette-slider-tick').forEach((tick, i) => {
                if (i === activeIndex) tick.classList.add('active');
                else tick.classList.remove('active');
            });
        };

        sizeSlider.addEventListener('input', (e) => {
            const idx = parseInt(e.target.value);
            updateSliderBackground(sizeSlider, idx, sizeValues.length);
            updateActiveTick(idx);
            const newSize = sizeValues[idx].toString();
            currentSize = newSize;
            const newLocked = new Array(parseInt(newSize)).fill(false);
            for (let i = 0; i < Math.min(lockedMap.length, newLocked.length); i++) {
                newLocked[i] = lockedMap[i];
            }
            lockedMap = newLocked;
            regeneratePalette();
        });

        updateSliderBackground(sizeSlider, currentIndex >= 0 ? currentIndex : 1, sizeValues.length);
        updateActiveTick(currentIndex >= 0 ? currentIndex : 1);

        sliderWrapper.appendChild(sizeSlider);
        sizeContainer.appendChild(sizeLabel);
        sizeContainer.appendChild(sliderWrapper);
        sizeContainer.appendChild(tickContainer);

        const regenerateBtn = document.createElement('button');
        regenerateBtn.className = 'palette-regenerate-btn';
        regenerateBtn.innerHTML = '<i class="fas fa-sync-alt"></i>';
        regenerateBtn.title = 'Regenerate palette (locked colors stay)';
        regenerateBtn.setAttribute('aria-label', 'Regenerate palette');

        regenerateBtn.addEventListener('click', (e) => {
            e.preventDefault();
            regenerateBtn.classList.add('rotating');
            setTimeout(() => {
                regenerateBtn.classList.remove('rotating');
            }, 300);
            regeneratePalette();
        });

        leftSide.appendChild(dropdownWrapper);
        leftSide.appendChild(sizeContainer);
        rightSide.appendChild(regenerateBtn);

        toolbar.appendChild(leftSide);
        toolbar.appendChild(rightSide);

        const toolHeader = paletteCard?.querySelector('.tool-header');
        if (toolHeader) {
            toolHeader.after(toolbar);
        } else {
            container.parentElement.insertBefore(toolbar, container);
        }
    };

    const createColorBox = (color, index, isLocked, isPrimary) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'color-box-display';
        if (isLocked) wrapper.classList.add('locked');
        if (isPrimary) wrapper.classList.add('primary-color');
        wrapper.dataset.index = index;

        const swatch = document.createElement('button');
        swatch.className = 'color-box-swatch';
        swatch.style.backgroundColor = color;
        swatch.setAttribute('aria-label', `Copy ${color}`);

        const hexLabel = document.createElement('span');
        hexLabel.className = 'color-box-label';
        hexLabel.textContent = color.toUpperCase();

        swatch.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(color);
                if (typeof Toast !== 'undefined') {
                    Toast.success(`${color} copied!`, 1000);
                }
            } catch (err) {
                console.error('Copy failed:', err);
            }
        });

        swatch.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            lockedMap[index] = !lockedMap[index];
            if (!lockedMap[index]) {
                const newSorted = sortUnlockedColors(currentColors, lockedMap);
                currentColors = newSorted;
                renderPalette();
                updateAppStatePalette();
            } else {
                renderPalette();
            }
        });

        wrapper.appendChild(swatch);
        wrapper.appendChild(hexLabel);
        return wrapper;
    };

    const getPrimaryColor = () => {
        if (typeof AppState !== 'undefined') {
            const state = AppState.getState();
            return state.primaryColor || '#FFD700';
        }
        return '#FFD700';
    };

    const regeneratePalette = () => {
        const primaryColor = getPrimaryColor();
        const targetCount = parseInt(currentSize);

        let freshPalette = generateBalancedPalette(primaryColor, currentType, targetCount);

        for (let i = 0; i < targetCount; i++) {
            if (lockedMap[i] && currentColors[i] && currentColors[i] !== freshPalette[i]) {
                freshPalette[i] = currentColors[i];
            }
        }

        currentColors = sortUnlockedColors(freshPalette, lockedMap);
        renderPalette();
        updateAppStatePalette();
    };

    const renderPalette = () => {
        if (!container) return;
        container.innerHTML = '';
        const primaryHex = getPrimaryColor().toUpperCase();

        currentColors.forEach((color, idx) => {
            const isPrimary = color.toUpperCase() === primaryHex;
            const colorBox = createColorBox(color, idx, lockedMap[idx] || false, isPrimary);
            container.appendChild(colorBox);
        });
    };

    const updateAppStatePalette = () => {
        if (typeof AppState !== 'undefined') {
            AppState.update({ palette: [...currentColors] });
        }
    };

    const getCurrentColors = () => {
        return [...currentColors];
    };

    const init = () => {
        if (isInitialized) return;
        isInitialized = true;

        createToolbar();

        const primaryColor = getPrimaryColor();
        lastPrimaryColor = primaryColor;
        const targetCount = parseInt(currentSize);
        let initialPalette = generateBalancedPalette(primaryColor, currentType, targetCount);
        lockedMap = new Array(targetCount).fill(false);
        currentColors = sortUnlockedColors(initialPalette, lockedMap);

        renderPalette();
        updateAppStatePalette();

        if (typeof AppState !== 'undefined') {
            AppState.subscribe((state) => {
                const newPrimaryColor = state.primaryColor;
                if (newPrimaryColor && newPrimaryColor !== lastPrimaryColor) {
                    lastPrimaryColor = newPrimaryColor;
                    const newTargetCount = parseInt(currentSize);
                    const newLocked = new Array(newTargetCount).fill(false);
                    for (let i = 0; i < Math.min(lockedMap.length, newTargetCount); i++) {
                        if (lockedMap[i]) newLocked[i] = true;
                    }
                    lockedMap = newLocked;

                    let freshPalette = generateBalancedPalette(
                        newPrimaryColor,
                        currentType,
                        newTargetCount,
                    );
                    for (let i = 0; i < newTargetCount; i++) {
                        if (lockedMap[i] && currentColors[i]) {
                            freshPalette[i] = currentColors[i];
                        }
                    }
                    currentColors = sortUnlockedColors(freshPalette, lockedMap);
                    renderPalette();
                    updateAppStatePalette();
                }
            });
        }
    };

    return { init, getCurrentColors };
})();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (typeof PaletteGenerator !== 'undefined' && PaletteGenerator.init) {
            PaletteGenerator.init();
        }
    });
} else {
    if (typeof PaletteGenerator !== 'undefined' && PaletteGenerator.init) {
        PaletteGenerator.init();
    }
}

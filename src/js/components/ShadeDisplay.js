const ShadeDisplay = (() => {
    const container = document.getElementById('shadeDisplay');
    let toolbarCreated = false;
    let skyColorPicker = null;

    if (!container) {
        console.error('ShadeDisplay: DOM element with id "shadeDisplay" not found');
        return { init: () => {}, getCurrentColors: () => [] };
    }

    const isValidHex = (hex) => {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
    };

    const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (result) {
            return {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16),
            };
        }
        return { r: 255, g: 215, b: 0 };
    };

    const rgbToHex = (r, g, b) => {
        const toHex = (x) => {
            const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        return '#' + toHex(r) + toHex(g) + toHex(b);
    };

    const generateFallbackShades = (baseColor) => {
        const rgb = hexToRgb(baseColor);
        const shades = [baseColor];

        for (let i = 1; i <= 4; i++) {
            const factor = 1 - i * 0.12;
            shades.push(rgbToHex(rgb.r * factor, rgb.g * factor, rgb.b * factor));
        }

        for (let i = 1; i <= 4; i++) {
            const factor = 1 + i * 0.12;
            shades.push(
                rgbToHex(
                    Math.min(255, rgb.r * factor),
                    Math.min(255, rgb.g * factor),
                    Math.min(255, rgb.b * factor),
                ),
            );
        }

        return shades;
    };

    const init = () => {
        createToolbar();

        if (typeof AppState !== 'undefined') {
            AppState.subscribe((state) => {
                update(state);
            });
            update(AppState.getState());
        }
    };

    const refreshShades = () => {
        if (typeof AppState !== 'undefined') {
            const state = AppState.getState();
            update(state);
        }
    };

    const createToolbar = () => {
        if (toolbarCreated) return;

        const toolbar = document.createElement('div');
        toolbar.className = 'shade-toolbar';

        const hueShiftWrapper = document.createElement('div');
        hueShiftWrapper.className = 'shade-toggle-wrapper';

        const hueShiftLabel = document.createElement('label');
        hueShiftLabel.className = 'shade-toggle-label';

        const hueShiftCheckbox = document.createElement('input');
        hueShiftCheckbox.type = 'checkbox';
        hueShiftCheckbox.className = 'shade-toggle-input';
        hueShiftCheckbox.checked = true;

        const hueShiftSpan = document.createElement('span');
        hueShiftSpan.textContent = 'Hue Shift';

        hueShiftLabel.appendChild(hueShiftCheckbox);
        hueShiftLabel.appendChild(hueShiftSpan);
        hueShiftWrapper.appendChild(hueShiftLabel);

        const skyWrapper = document.createElement('div');
        skyWrapper.className = 'shade-sky-wrapper';

        const skyLabel = document.createElement('label');
        skyLabel.className = 'shade-toggle-label';

        const skyCheckbox = document.createElement('input');
        skyCheckbox.type = 'checkbox';
        skyCheckbox.className = 'shade-toggle-input';
        skyCheckbox.checked = false;

        const skySpan = document.createElement('span');
        skySpan.textContent = 'Sky Light';

        skyLabel.appendChild(skyCheckbox);
        skyLabel.appendChild(skySpan);
        skyWrapper.appendChild(skyLabel);

        const skyPickerWrapper = document.createElement('div');
        skyPickerWrapper.className = 'shade-sky-picker-wrapper';
        skyPickerWrapper.style.display = 'none';

        const skyColorLabel = document.createElement('span');

        skyColorPicker = document.createElement('input');
        skyColorPicker.type = 'color';
        skyColorPicker.className = 'shade-sky-picker';
        skyColorPicker.value = '#87CEEB';
        skyColorPicker.setAttribute('aria-label', 'Sky color for lighting');

        skyColorPicker.style.backgroundColor = '#87CEEB';
        skyColorPicker.style.borderRadius = '6px';
        skyColorPicker.style.cursor = 'pointer';
        skyColorPicker.style.padding = '0';
        skyColorPicker.style.border = '2px solid #87CEEB';

        skyPickerWrapper.appendChild(skyColorPicker);

        hueShiftCheckbox.addEventListener('change', (e) => {
            if (typeof ShadeCalculator !== 'undefined') {
                ShadeCalculator.setUseHueShift(e.target.checked);
                refreshShades();
            }
        });

        skyCheckbox.addEventListener('change', (e) => {
            if (typeof ShadeCalculator !== 'undefined') {
                ShadeCalculator.setUseSkyColor(e.target.checked);
                skyPickerWrapper.style.display = e.target.checked ? 'flex' : 'none';
                refreshShades();
            }
        });

        skyColorPicker.addEventListener('input', (e) => {
            if (typeof ShadeCalculator !== 'undefined') {
                ShadeCalculator.setSkyColor(e.target.value);
                skyColorPicker.style.backgroundColor = e.target.value;
                skyColorPicker.style.borderColor = e.target.value;
                refreshShades();
            }
        });

        skyColorPicker.addEventListener('change', (e) => {
            if (typeof ShadeCalculator !== 'undefined') {
                ShadeCalculator.setSkyColor(e.target.value);
                skyColorPicker.style.backgroundColor = e.target.value;
                skyColorPicker.style.borderColor = e.target.value;
            }
        });

        toolbar.appendChild(hueShiftWrapper);
        toolbar.appendChild(skyWrapper);
        toolbar.appendChild(skyPickerWrapper);

        const toolCard = container.closest('.tool-card');
        if (toolCard) {
            toolCard.insertBefore(toolbar, container);
        } else {
            container.parentNode.insertBefore(toolbar, container);
        }

        toolbarCreated = true;
    };

    const update = (state) => {
        let baseColor = state.primaryColor;

        if (!baseColor || !isValidHex(baseColor)) {
            console.warn('Invalid base color:', baseColor, 'using fallback #FFD700');
            baseColor = '#FFD700';
        }

        if (typeof ShadeCalculator === 'undefined' || !ShadeCalculator.generateShades) {
            console.warn('ShadeCalculator not available, using fallback');
            const fallbackShades = generateFallbackShades(baseColor);
            renderShades(fallbackShades, baseColor);
            return;
        }

        try {
            let shades = ShadeCalculator.generateShades(baseColor);

            if (!shades || shades.length === 0) {
                console.warn('ShadeCalculator returned empty array, using fallback');
                shades = generateFallbackShades(baseColor);
            }

            renderShades(shades, baseColor);
        } catch (error) {
            console.error('Error generating shades:', error);
            const fallbackShades = generateFallbackShades(baseColor);
            renderShades(fallbackShades, baseColor);
        }
    };

    const renderShades = (shades, baseColor) => {
        if (!container) return;

        const existingRows = container.querySelectorAll('.shade-row');
        existingRows.forEach((row) => row.remove());

        const darkerRow = document.createElement('div');
        darkerRow.className = 'shade-row shade-row-darker';

        const darkerLabel = document.createElement('div');
        darkerLabel.className = 'shade-row-label';
        darkerLabel.textContent = 'DARKER';
        darkerRow.appendChild(darkerLabel);

        const darkerColors = document.createElement('div');
        darkerColors.className = 'shade-colors';

        const darkerOrder = [
            shades[0] || baseColor,
            shades[1] || baseColor,
            shades[2] || baseColor,
            shades[3] || baseColor,
            shades[4] || baseColor,
        ];

        for (let i = 0; i < darkerOrder.length; i++) {
            const color = darkerOrder[i];
            const isPrimary = i === 0;
            const colorBox = createShadeColorBox(color, i, isPrimary);
            darkerColors.appendChild(colorBox);
        }
        darkerRow.appendChild(darkerColors);

        const lighterRow = document.createElement('div');
        lighterRow.className = 'shade-row shade-row-lighter';

        const lighterLabel = document.createElement('div');
        lighterLabel.className = 'shade-row-label';
        lighterLabel.textContent = 'LIGHTER';
        lighterRow.appendChild(lighterLabel);

        const lighterColors = document.createElement('div');
        lighterColors.className = 'shade-colors';

        const lighterOrder = [
            shades[0] || baseColor,
            shades[5] || baseColor,
            shades[6] || baseColor,
            shades[7] || baseColor,
            shades[8] || baseColor,
        ];

        for (let i = 0; i < lighterOrder.length; i++) {
            const color = lighterOrder[i];
            const isPrimary = i === 0;
            const colorBox = createShadeColorBox(color, i, isPrimary);
            lighterColors.appendChild(colorBox);
        }
        lighterRow.appendChild(lighterColors);

        const percentRow = document.createElement('div');
        percentRow.className = 'shade-row shade-row-percent';

        const percentLabel = document.createElement('div');
        percentLabel.className = 'shade-row-label';
        percentLabel.textContent = 'VALUE';
        percentRow.appendChild(percentLabel);

        const percentValues = document.createElement('div');
        percentValues.className = 'shade-percentages';

        const displayPercentages = ['0%', '-15%', '-30%', '+15%', '+30%'];
        for (let i = 0; i < displayPercentages.length; i++) {
            const percentSpan = document.createElement('span');
            percentSpan.className = 'shade-percent-value';
            percentSpan.textContent = displayPercentages[i];
            percentValues.appendChild(percentSpan);
        }
        percentRow.appendChild(percentValues);

        container.appendChild(darkerRow);
        container.appendChild(lighterRow);
        container.appendChild(percentRow);
    };

    const createShadeColorBox = (color, index, isPrimary = false) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'color-box-display';
        if (isPrimary) {
            wrapper.classList.add('primary-shade');
        }
        wrapper.setAttribute('data-index', index);

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

        wrapper.appendChild(swatch);
        wrapper.appendChild(hexLabel);

        return wrapper;
    };

    const getCurrentColors = () => {
        const swatches = document.querySelectorAll('#shadeDisplay .color-box-swatch');
        const colors = [];
        swatches.forEach((swatch) => {
            const color = swatch.style.backgroundColor;
            if (color && color.startsWith('rgb')) {
                const rgb = color.match(/\d+/g);
                if (rgb) {
                    const hex =
                        '#' +
                        rgb
                            .slice(0, 3)
                            .map((x) => {
                                const hexVal = parseInt(x).toString(16);
                                return hexVal.length === 1 ? '0' + hexVal : hexVal;
                            })
                            .join('');
                    if (!colors.includes(hex.toUpperCase())) {
                        colors.push(hex.toUpperCase());
                    }
                }
            } else if (color) {
                colors.push(color.toUpperCase());
            }
        });
        return colors;
    };

    return { init, getCurrentColors };
})();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (typeof ShadeDisplay !== 'undefined' && ShadeDisplay.init) {
            ShadeDisplay.init();
        }
    });
} else {
    if (typeof ShadeDisplay !== 'undefined' && ShadeDisplay.init) {
        ShadeDisplay.init();
    }
}
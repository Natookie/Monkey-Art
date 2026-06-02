const ColorBoxFactory = {
    create(options = {}) {
        const { hex, label = '', onCopy = null, clickable = true } = options;

        if (!hex || !/^#[0-9a-f]{6}$/i.test(hex)) {
            throw new Error(`Invalid hex color: ${hex}`);
        }

        const container = document.createElement('div');
        container.className = 'color-box-display';
        container.setAttribute('data-hex', hex.toLowerCase());
        if (label) {
            container.setAttribute('data-label', label);
        }

        const square = document.createElement('div');
        square.className = 'color-box-display-square';
        square.style.backgroundColor = hex;

        const accessibleLabel = label ? `${label}: ${hex}` : hex;
        square.setAttribute('role', 'button');
        square.setAttribute('aria-label', `Copy color ${accessibleLabel}`);
        square.setAttribute('tabindex', clickable ? '0' : '-1');

        const hexDisplay = document.createElement('div');
        hexDisplay.className = 'color-box-display-hex';
        hexDisplay.textContent = hex.toLowerCase();
        hexDisplay.setAttribute('aria-hidden', 'true');

        container.appendChild(square);
        container.appendChild(hexDisplay);

        if (clickable) {
            square.addEventListener('click', () => {
                ColorBoxFactory.handleCopy(hex, onCopy);
            });

            square.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    ColorBoxFactory.handleCopy(hex, onCopy);
                }
            });

            square.addEventListener('mousedown', () => {
                square.classList.add('active');
            });
            document.addEventListener('mouseup', () => {
                square.classList.remove('active');
            });
        }

        return container;
    },

    handleCopy(hex, onCopy) {
        navigator.clipboard
            .writeText(hex.toLowerCase())
            .then(() => {
                if (onCopy && typeof onCopy === 'function') {
                    onCopy(hex.toLowerCase());
                }
            })
            .catch((err) => {
                console.error('Failed to copy color:', err);
                if (onCopy && typeof onCopy === 'function') {
                    onCopy(hex.toLowerCase(), 'error');
                }
            });
    },

    updateColor(element, newHex) {
        if (!newHex || !/^#[0-9a-f]{6}$/i.test(newHex)) {
            throw new Error(`Invalid hex color: ${newHex}`);
        }

        const square = element.querySelector('.color-box-display-square');
        const hexDisplay = element.querySelector('.color-box-display-hex');

        if (square) {
            square.style.backgroundColor = newHex;
        }
        if (hexDisplay) {
            hexDisplay.textContent = newHex.toLowerCase();
        }

        element.setAttribute('data-hex', newHex.toLowerCase());
    },

    getColor(element) {
        return element.getAttribute('data-hex') || '#000000';
    },

    renderMany(container, colors, options = {}) {
        const { onCopy = null, clearFirst = true } = options;

        if (clearFirst) {
            container.innerHTML = '';
        }

        const elements = [];

        colors.forEach((colorData) => {
            const hex = typeof colorData === 'string' ? colorData : colorData.hex;
            const label = typeof colorData === 'string' ? '' : colorData.label;

            try {
                const element = ColorBoxFactory.create({
                    hex,
                    label,
                    onCopy,
                    clickable: true,
                });
                container.appendChild(element);
                elements.push(element);
            } catch (err) {
                console.error(`Failed to create ColorBox for ${hex}:`, err);
            }
        });

        return elements;
    },

    findByHex(container, hex) {
        return container.querySelector(`[data-hex="${hex.toLowerCase()}"]`);
    },

    getAll(container) {
        return Array.from(container.querySelectorAll('.color-box-display'));
    },

    setHighlight(element, highlight) {
        if (highlight) {
            element.classList.add('highlighted');
        } else {
            element.classList.remove('highlighted');
        }
    },
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ColorBoxFactory;
}

const ColorBox = (() => {
    const primaryElement = document.querySelector('.color-box--primary');
    const blendElement = document.querySelector('.color-box--blend');

    if (!primaryElement) {
        console.error('ColorBox: Primary color box element (.color-box--primary) not found');
        return;
    }

    const init = () => {
        setupColorBox(
            primaryElement,
            'primary',
            'Primary color picker - drag to select hue and lightness',
        );

        if (blendElement) {
            setupColorBox(
                blendElement,
                'blend',
                'Blend color picker - drag to select hue and lightness',
            );
        }

        AppState.subscribe((state) => {
            updateColorBox(primaryElement, 'primary', state);
            if (blendElement) {
                updateColorBox(blendElement, 'blend', state);

                const blendMode = state.blendMode || state.blendEnabled;
                if (blendMode) {
                    blendElement.classList.add('active');
                } else {
                    blendElement.classList.remove('active');
                }
            }
        });
    };

    const setupColorBox = (element, sourceId, ariaLabel) => {
        element.setAttribute('tabindex', '0');
        element.setAttribute('role', 'slider');
        element.setAttribute('aria-label', ariaLabel);
        element.setAttribute('aria-valuemin', '0');
        element.setAttribute('aria-valuemax', '360');
        element.setAttribute('aria-valuenow', '0');

        const onColorChange = (rgb) => {
            const colors = AppState.get('colors');
            if (colors && colors[sourceId]) {
                colors[sourceId] = colors[sourceId].withRgb(rgb);
                AppState.update({
                    colors,
                    ...(sourceId === 'primary' && { primaryColor: colors[sourceId].hexValue }),
                    ...(sourceId === 'blend' && { secondaryColor: colors[sourceId].hexValue }),
                });
            }
        };

        const dragHandler = new ColorBoxDrag();
        dragHandler.bindToElement(element, sourceId, onColorChange);

        element.addEventListener('click', async (e) => {
            if (dragHandler && dragHandler.justEndedDrag) {
                return;
            }

            const colors = AppState.get('colors');
            if (colors && colors[sourceId]) {
                const hex = colors[sourceId].hexValue;

                const result = await ClipboardService.copyToClipboard(hex, {
                    feedback: true,
                    sourceId: sourceId,
                });

                if (result.success) {
                    console.log(`Copied ${sourceId} color: ${hex}`);
                }
            }
        });
    };

    const updateColorBox = (element, sourceId, state) => {
        const colors = state.colors;
        let color = sourceId === 'primary' ? state.primaryColor : state.secondaryColor;

        if (colors && colors[sourceId]) {
            const colorSource = colors[sourceId];
            color = colorSource.hexValue;

            const hsl = colorSource.hsl;
            element.setAttribute('aria-valuenow', `${hsl.h.toFixed(0)}°`);
        }

        element.style.backgroundColor = color;
        element.setAttribute('aria-label', `${sourceId} color picker: ${color}`);
    };

    const destroy = () => {
    };

    return {
        init,
        destroy,
    };
})();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ColorBox.init());
} else {
    ColorBox.init();
}

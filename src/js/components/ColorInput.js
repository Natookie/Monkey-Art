class ColorInput {
    constructor(options = {}) {
        this.id = options.id || `color-input-${Math.random().toString(36).substr(2, 9)}`;
        this.label = options.label || 'Color';
        this.placeholder = options.placeholder || '#RRGGBB';
        this.initialValue = options.initialValue || '#ffffff';
        this.onInputCallback = null;
        this.onChangeCallback = null;
        this.hslSliders = null;

        this.createElements();

        setTimeout(() => {
            this.setupHSLSliders();
        }, 0);
    }

    createElements() {
        this.container = document.createElement('div');
        this.container.className = 'color-input-group';

        this.labelElement = document.createElement('label');
        this.labelElement.htmlFor = this.id;
        this.labelElement.textContent = this.label;

        this.inputWrapper = document.createElement('div');
        this.inputWrapper.className = 'color-input-wrapper';

        this.input = document.createElement('input');
        this.input.type = 'text';
        this.input.id = this.id;
        this.input.className = 'input-field color-input-field';
        this.input.placeholder = this.placeholder;
        this.input.value = this.initialValue;
        this.input.setAttribute('maxlength', '7');
        this.input.setAttribute('autocomplete', 'off');
        this.input.setAttribute('spellcheck', 'false');

        this.swatch = document.createElement('div');
        this.swatch.className = 'color-swatch-preview';
        this.swatch.setAttribute('aria-label', `Color preview: ${this.initialValue}`);
        this.setSwatchColor(this.initialValue);

        this.inputWrapper.appendChild(this.input);
        this.inputWrapper.appendChild(this.swatch);

        this.container.appendChild(this.labelElement);
        this.container.appendChild(this.inputWrapper);

        this.input.addEventListener('input', (e) => {
            const value = e.target.value;
            if (this.isValidHex(value)) {
                this.setSwatchColor(value);
                if (this.onInputCallback) {
                    this.onInputCallback(value);
                }
            }
        });

        this.input.addEventListener('blur', (e) => {
            const value = e.target.value.trim();
            const validation = this.validate();

            if (value.length > 0 && !validation.isValid) {
                this.input.classList.add('error');
            } else {
                this.input.classList.remove('error');
            }

            if (this.onChangeCallback) {
                this.onChangeCallback(value, validation);
            }
        });

        this.colorPreviewArea = this.createColorPreviewBox();
        this.container.appendChild(this.colorPreviewArea);

        this.hslSlidersContainer = document.createElement('div');
        this.hslSlidersContainer.className = 'hsl-sliders-group';
        this.container.appendChild(this.hslSlidersContainer);
    }

    createColorPreviewBox() {
        const container = document.createElement('div');
        container.className = 'color-preview-area';

        const gradient = document.createElement('div');
        gradient.className = 'color-preview-gradient';

        const cursor = document.createElement('div');
        cursor.className = 'color-preview-cursor';
        cursor.setAttribute('role', 'slider');
        cursor.setAttribute('aria-label', 'Color saturation and lightness selector');

        gradient.appendChild(cursor);
        container.appendChild(gradient);

        let isDragging = false;

        gradient.addEventListener('mousedown', (e) => {
            isDragging = true;
            this.updateSLFromMousePosition(e, gradient, cursor);
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                this.updateSLFromMousePosition(e, gradient, cursor);
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        gradient.addEventListener('touchstart', (e) => {
            isDragging = true;
            this.updateSLFromMousePosition(e.touches[0], gradient, cursor);
        });

        document.addEventListener('touchmove', (e) => {
            if (isDragging) {
                this.updateSLFromMousePosition(e.touches[0], gradient, cursor);
            }
        });

        document.addEventListener('touchend', () => {
            isDragging = false;
        });

        return container;
    }

    updateSLFromMousePosition(event, gradient, cursor) {
        const rect = gradient.getBoundingClientRect();
        const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
        const y = Math.max(0, Math.min(event.clientY - rect.top, rect.height));

        const saturation = Math.round((x / rect.width) * 100);
        const lightness = Math.round(100 - (y / rect.height) * 100);

        cursor.style.left = `${(x / rect.width) * 100}%`;
        cursor.style.top = `${(y / rect.height) * 100}%`;

        if (this.hslSliders) {
            this.hslSliders.setChannel('saturation', saturation);
            this.hslSliders.setChannel('lightness', lightness);
        }

        const currentHex = this.getValue();
        if (this.isValidHex(currentHex)) {
            if (this.onInputCallback) {
                this.onInputCallback(currentHex);
            }
        }
    }

    isValidHex(hex) {
        return HSLColor.isValidHex(hex);
    }

    validate() {
        const hex = this.getValue();
        if (!hex || hex.length === 0) {
            return { isValid: false, error: 'Color is required' };
        }
        if (!this.isValidHex(hex)) {
            return { isValid: false, error: 'Invalid hex color format' };
        }
        return { isValid: true };
    }

    setSwatchColor(hex) {
        if (this.isValidHex(hex)) {
            this.swatch.style.backgroundColor = hex;
            this.swatch.setAttribute('aria-label', `Color preview: ${hex.toUpperCase()}`);

            if (this.hslSliders) {
                const hsl = HSLColor.hexToHsl(hex);
                this.updateColorPreviewGradient(hsl.h);
            }
        }
    }

    updateColorPreviewGradient(hue) {
        const gradient = this.colorPreviewArea.querySelector('.color-preview-gradient');
        if (!gradient) return;

        const baseRGB = HSLColor.hslToRgb(hue, 100, 50);
        const colorHex = HSLColor.hslToHex(hue, 100, 50);

        gradient.style.background = `
            linear-gradient(to right,
                hsl(0, 0%, 50%),
                hsl(${hue}, 100%, 50%)
            ),
            linear-gradient(to top,
                hsl(${hue}, 100%, 0%),
                hsl(${hue}, 100%, 50%),
                hsl(${hue}, 100%, 100%)
            )
        `;
    }

    getValue() {
        return this.input.value.toLowerCase();
    }

    setValue(hex) {
        if (this.isValidHex(hex)) {
            this.input.value = hex.toLowerCase();
            this.input.classList.remove('error');
            this.setSwatchColor(hex);

            if (this.hslSliders) {
                const hsl = HSLColor.hexToHsl(hex);
                this.hslSliders.setColor(hsl.h, hsl.s, hsl.l);
            }
        }
    }

    setupHSLSliders() {
        if (!this.hslSliders && typeof HSLSlider !== 'undefined') {
            const currentHex = this.getValue();
            const hsl = this.isValidHex(currentHex)
                ? HSLColor.hexToHsl(currentHex)
                : { h: 0, s: 100, l: 50 };

            this.hslSliders = HSLSlider.createLinkedSliders({
                container: this.hslSlidersContainer,
                initialColor: hsl,
                onChange: (newHSL) => {
                    const newHex = HSLColor.hslToHex(newHSL.h, newHSL.s, newHSL.l);
                    this.setValue(newHex);

                    if (this.onInputCallback) {
                        this.onInputCallback(newHex);
                    }
                },
            });

            this.updateColorPreviewGradient(hsl.h);
        }
    }

    onInput(callback) {
        this.onInputCallback = callback;
    }

    onChange(callback) {
        this.onChangeCallback = callback;
    }

    getElement() {
        return this.container;
    }

    focus() {
        this.input.focus();
    }

    setError(message) {
        this.input.setAttribute('aria-invalid', 'true');
        this.input.setAttribute('aria-describedby', `${this.id}-error`);
    }

    clearError() {
        this.input.removeAttribute('aria-invalid');
        this.input.removeAttribute('aria-describedby');
    }
}

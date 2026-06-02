class BlendDisplay {
    constructor(options = {}) {
        this.id = options.id || `blend-display-${Math.random().toString(36).substr(2, 9)}`;
        this.blends = options.blends || [];
        this.emptyMessage = options.emptyMessage || 'No blend generated yet';
        this.onChange = options.onChange || null;

        this.primaryColor = options.primaryColor || '#FFD700';
        this.blendColor = options.blendColor || '#0028ff';
        this.blendCount = options.blendCount || 5;

        this.currentHue = 0;
        this.currentSat = 0;
        this.currentLight = 0;

        this.createElements();
        this.attachSliderEvents();

        this.initializeGradients();
        this.updateBlends();
    }

    createElements() {
        this.container = document.createElement('div');
        this.container.className = 'blend-display';

        this.createToolbar();
        this.createContentArea();
    }

    createToolbar() {
        const toolbar = document.createElement('div');
        toolbar.className = 'blend-toolbar';

        const mainRow = document.createElement('div');
        mainRow.className = 'blend-main-row';

        const colorBox = this.createColorBox();
        mainRow.appendChild(colorBox);

        const slidersPanel = this.createSlidersPanel();
        mainRow.appendChild(slidersPanel);

        toolbar.appendChild(mainRow);

        const countRow = this.createCountRow();
        toolbar.appendChild(countRow);

        this.container.appendChild(toolbar);

        this.colorSwatch = colorBox.querySelector('.blend-color-swatch');
        this.colorHexSpan = colorBox.querySelector('.blend-color-hex');
        this.pickerInput = colorBox.querySelector('.blend-hidden-picker');
    }

    createColorBox() {
        const box = document.createElement('div');
        box.className = 'blend-color-box';

        const label = document.createElement('span');
        label.className = 'blend-color-box-label';
        label.textContent = 'Blend';

        const swatch = document.createElement('div');
        swatch.className = 'blend-color-swatch';
        swatch.style.backgroundColor = this.blendColor;

        const hex = document.createElement('span');
        hex.className = 'blend-color-hex';
        hex.textContent = this.blendColor.toUpperCase();

        const picker = document.createElement('input');
        picker.type = 'color';
        picker.className = 'blend-hidden-picker';
        picker.value = this.blendColor;

        swatch.addEventListener('click', () => {
            picker.click();
        });

        picker.addEventListener('input', (e) => {
            const newColor = e.target.value;
            this.updateBlendColor(newColor);
        });

        box.appendChild(label);
        box.appendChild(swatch);
        box.appendChild(hex);
        box.appendChild(picker);

        return box;
    }

    createSlidersPanel() {
        const panel = document.createElement('div');
        panel.className = 'blend-sliders-panel';

        const hsl = this.hexToHsl(this.blendColor);
        this.currentHue = hsl.h;
        this.currentSat = hsl.s;
        this.currentLight = hsl.l;

        const hueRow = this.createSliderRow('H', 0, 360, this.currentHue, 'hue', '°');
        const satRow = this.createSliderRow('S', 0, 100, this.currentSat, 'sat', '%');
        const lightRow = this.createSliderRow('L', 0, 100, this.currentLight, 'light', '%');

        panel.appendChild(hueRow);
        panel.appendChild(satRow);
        panel.appendChild(lightRow);

        this.hueSliderEl = hueRow.querySelector('input');
        this.satSliderEl = satRow.querySelector('input');
        this.lightSliderEl = lightRow.querySelector('input');
        this.hueValueEl = hueRow.querySelector('.blend-slider-row-value');
        this.satValueEl = satRow.querySelector('.blend-slider-row-value');
        this.lightValueEl = lightRow.querySelector('.blend-slider-row-value');

        return panel;
    }

    createSliderRow(label, min, max, value, type, unit) {
        const row = document.createElement('div');
        row.className = 'blend-slider-row';

        const labelSpan = document.createElement('span');
        labelSpan.className = 'blend-slider-row-label';
        labelSpan.textContent = label;

        const sliderWrapper = document.createElement('div');
        sliderWrapper.className = 'blend-slider-wrapper';

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.className = `blend-slider-compact ${type}`;
        slider.min = min;
        slider.max = max;
        slider.step = 1;
        slider.value = value;

        sliderWrapper.appendChild(slider);

        const valueSpan = document.createElement('span');
        valueSpan.className = 'blend-slider-row-value';
        valueSpan.textContent = `${value}${unit}`;

        row.appendChild(labelSpan);
        row.appendChild(sliderWrapper);
        row.appendChild(valueSpan);

        return row;
    }

    initializeGradients() {
        const hsl = { h: this.currentHue, s: this.currentSat, l: this.currentLight };
        this.updateSliderGradients(hsl);
    }

    attachSliderEvents() {
        if (this.hueSliderEl) {
            this.hueSliderEl.addEventListener('input', (e) => {
                const newHue = parseInt(e.target.value);
                this.currentHue = newHue;
                if (this.hueValueEl) this.hueValueEl.textContent = `${newHue}°`;

                const newColor = this.hslToHex(newHue, this.currentSat, this.currentLight);
                this.updateBlendColorFromSliders(
                    newColor,
                    newHue,
                    this.currentSat,
                    this.currentLight,
                );
            });
        }

        if (this.satSliderEl) {
            this.satSliderEl.addEventListener('input', (e) => {
                const newSat = parseInt(e.target.value);
                this.currentSat = newSat;
                if (this.satValueEl) this.satValueEl.textContent = `${newSat}%`;

                const newColor = this.hslToHex(this.currentHue, newSat, this.currentLight);
                this.updateBlendColorFromSliders(
                    newColor,
                    this.currentHue,
                    newSat,
                    this.currentLight,
                );

                this.updateSliderGradients({ h: this.currentHue, s: newSat, l: this.currentLight });
            });
        }

        if (this.lightSliderEl) {
            this.lightSliderEl.addEventListener('input', (e) => {
                const newLight = parseInt(e.target.value);
                this.currentLight = newLight;
                if (this.lightValueEl) this.lightValueEl.textContent = `${newLight}%`;

                const newColor = this.hslToHex(this.currentHue, this.currentSat, newLight);
                this.updateBlendColorFromSliders(
                    newColor,
                    this.currentHue,
                    this.currentSat,
                    newLight,
                );
            });
        }
    }

    createCountRow() {
        const row = document.createElement('div');
        row.className = 'blend-count-row';

        const label = document.createElement('span');
        label.className = 'blend-count-label';
        label.textContent = 'Steps';

        const sliderWrapper = document.createElement('div');
        sliderWrapper.className = 'blend-slider-wrapper';

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.className = 'blend-count-slider-compact';
        slider.min = 3;
        slider.max = 10;
        slider.step = 1;
        slider.value = this.blendCount;

        sliderWrapper.appendChild(slider);

        const valueSpan = document.createElement('span');
        valueSpan.className = 'blend-count-value-compact';
        valueSpan.textContent = this.blendCount;

        slider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            valueSpan.textContent = value;
            this.blendCount = value;
            this.updateBlends();
        });

        row.appendChild(label);
        row.appendChild(sliderWrapper);
        row.appendChild(valueSpan);

        this.countSlider = slider;
        this.countValue = valueSpan;

        return row;
    }

    updateBlendColor(newColor) {
        const hsl = this.hexToHsl(newColor);

        if (hsl.s === 0 || hsl.l === 0 || hsl.l === 100) {
            if (this.currentHue !== undefined && hsl.h === 0 && this.currentHue > 0) {
                hsl.h = this.currentHue;
            }
        }

        this.currentHue = hsl.h;
        this.currentSat = hsl.s;
        this.currentLight = hsl.l;
        this.blendColor = newColor;

        if (this.colorSwatch) {
            this.colorSwatch.style.backgroundColor = newColor;
            if (this.colorHexSpan) this.colorHexSpan.textContent = newColor.toUpperCase();
        }
        if (this.pickerInput) this.pickerInput.value = newColor;

        if (this.hueSliderEl && this.hueSliderEl.value != this.currentHue) {
            this.hueSliderEl.value = this.currentHue;
            if (this.hueValueEl) this.hueValueEl.textContent = `${this.currentHue}°`;
        }
        if (this.satSliderEl && this.satSliderEl.value != this.currentSat) {
            this.satSliderEl.value = this.currentSat;
            if (this.satValueEl) this.satValueEl.textContent = `${this.currentSat}%`;
        }
        if (this.lightSliderEl && this.lightSliderEl.value != this.currentLight) {
            this.lightSliderEl.value = this.currentLight;
            if (this.lightValueEl) this.lightValueEl.textContent = `${this.currentLight}%`;
        }

        this.updateSliderGradients({
            h: this.currentHue,
            s: this.currentSat,
            l: this.currentLight,
        });

        this.updateBlends();
    }

    updateBlendColorFromSliders(newColor, hue, sat, light) {
        this.currentHue = hue;
        this.currentSat = sat;
        this.currentLight = light;
        this.blendColor = newColor;

        if (this.colorSwatch) {
            this.colorSwatch.style.backgroundColor = newColor;
            if (this.colorHexSpan) this.colorHexSpan.textContent = newColor.toUpperCase();
        }
        if (this.pickerInput) this.pickerInput.value = newColor;

        this.updateSliderGradients({ h: hue, s: sat, l: light });

        this.updateBlends();
    }

    updateSliderGradients(hsl) {
        if (this.satSliderEl) {
            this.satSliderEl.style.setProperty('--blend-hue', `${hsl.h}deg`);
        }

        if (this.lightSliderEl) {
            this.lightSliderEl.style.setProperty('--blend-hue', `${hsl.h}deg`);
            this.lightSliderEl.style.setProperty('--blend-sat', `${hsl.s}%`);
        }
    }

    hexToHsl(hex) {
        let r = parseInt(hex.slice(1, 3), 16) / 255;
        let g = parseInt(hex.slice(3, 5), 16) / 255;
        let b = parseInt(hex.slice(5, 7), 16) / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0,
            s = 0,
            l = (max + min) / 2;

        if (max !== min) {
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
            h = Math.round(h * 360);
        } else {
            h = this.currentHue !== undefined ? this.currentHue : 0;
        }

        return {
            h: h,
            s: Math.round(s * 100),
            l: Math.round(l * 100),
        };
    }

    hslToHex(h, s, l) {
        h = Math.max(0, Math.min(360, h));
        s = Math.max(0, Math.min(100, s));
        l = Math.max(0, Math.min(100, l));

        const hNorm = h / 360;
        const sNorm = s / 100;
        const lNorm = l / 100;

        let r, g, b;

        if (sNorm === 0) {
            r = g = b = lNorm;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };

            const q = lNorm < 0.5 ? lNorm * (1 + sNorm) : lNorm + sNorm - lNorm * sNorm;
            const p = 2 * lNorm - q;

            r = hue2rgb(p, q, hNorm + 1 / 3);
            g = hue2rgb(p, q, hNorm);
            b = hue2rgb(p, q, hNorm - 1 / 3);
        }

        const toHex = (x) => {
            const hex = Math.round(x * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };

        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    getHueFromHex(hex) {
        return this.hexToHsl(hex).h;
    }

    getSatFromHex(hex) {
        return this.hexToHsl(hex).s;
    }

    getLightFromHex(hex) {
        return this.hexToHsl(hex).l;
    }

    calculateBlends() {
        const blends = [];
        const steps = this.blendCount;

        for (let i = 0; i < steps; i++) {
            const ratio = steps > 1 ? i / (steps - 1) : 0;
            const blendedColor = this.blendColors(this.primaryColor, this.blendColor, ratio);
            const percentage = Math.round(ratio * 100);
            blends.push({ hex: blendedColor, percentage });
        }

        return blends;
    }

    blendColors(color1, color2, ratio) {
        const rgb1 = this.hexToRgb(color1);
        const rgb2 = this.hexToRgb(color2);

        const r = Math.round(rgb1.r * (1 - ratio) + rgb2.r * ratio);
        const g = Math.round(rgb1.g * (1 - ratio) + rgb2.g * ratio);
        const b = Math.round(rgb1.b * (1 - ratio) + rgb2.b * ratio);

        return this.rgbToHex(r, g, b);
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
            ? {
                  r: parseInt(result[1], 16),
                  g: parseInt(result[2], 16),
                  b: parseInt(result[3], 16),
              }
            : { r: 0, g: 0, b: 0 };
    }

    rgbToHex(r, g, b) {
        const toHex = (x) => {
            const hex = Math.max(0, Math.min(255, x)).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    updateBlends() {
        this.blends = this.calculateBlends();
        this.render();

        if (this.onChange) {
            this.onChange({
                blends: this.blends,
                primaryColor: this.primaryColor,
                blendColor: this.blendColor,
                blendCount: this.blendCount,
            });
        }
    }

    createContentArea() {
        this.contentArea = document.createElement('div');
        this.contentArea.className = 'blend-display-content';
        this.container.appendChild(this.contentArea);
    }

    render() {
        if (!this.contentArea) return;
        this.contentArea.innerHTML = '';

        if (!this.blends || this.blends.length === 0) {
            const emptyState = document.createElement('p');
            emptyState.className = 'empty-state';
            emptyState.textContent = this.emptyMessage;
            this.contentArea.appendChild(emptyState);
        } else {
            const hexColors = this.blends.map((item) => item.hex);

            if (typeof ColorBoxFactory !== 'undefined' && ColorBoxFactory.renderMany) {
                ColorBoxFactory.renderMany(this.contentArea, hexColors);

                this.addPercentageLabels();

                this.setupColorBoxHandlers(hexColors);
            } else {
                this.renderFallbackColorBoxes(hexColors);
            }
        }
    }

    addPercentageLabels() {
        const colorBoxes = this.contentArea.querySelectorAll('.color-box-display');
        colorBoxes.forEach((box, index) => {
            if (index < this.blends.length) {
                let label = box.querySelector('.blend-percentage-label');
                if (!label) {
                    label = document.createElement('div');
                    label.className = 'blend-percentage-label';
                    box.appendChild(label);
                }
                label.textContent = `${this.blends[index].percentage}%`;
            }
        });
    }

    setupColorBoxHandlers(hexColors) {
        const colorBoxes = this.contentArea.querySelectorAll('.color-box-display');
        colorBoxes.forEach((box, index) => {
            const swatch = box.querySelector('.color-box-swatch');
            if (swatch) {
                const hex = hexColors[index];
                box.dataset.hex = hex;

                const newSwatch = swatch.cloneNode(true);
                swatch.parentNode.replaceChild(newSwatch, swatch);

                newSwatch.addEventListener('click', async () => {
                    try {
                        if (
                            typeof ClipboardService !== 'undefined' &&
                            ClipboardService.copyToClipboard
                        ) {
                            await ClipboardService.copyToClipboard(hex, { feedback: true });
                        } else {
                            await navigator.clipboard.writeText(hex);
                            if (typeof Toast !== 'undefined') {
                                Toast.success(`${hex} copied!`, 1000);
                            }
                        }
                    } catch (error) {
                        console.error('Copy failed:', error);
                    }
                });
            }
        });
    }

    renderFallbackColorBoxes(hexColors) {
        hexColors.forEach((color, index) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'color-box-display';
            wrapper.dataset.hex = color;

            const swatch = document.createElement('button');
            swatch.className = 'color-box-swatch';
            swatch.style.backgroundColor = color;
            swatch.setAttribute('aria-label', `Copy ${color}`);

            const hexLabel = document.createElement('span');
            hexLabel.className = 'color-box-label';
            hexLabel.textContent = color.toUpperCase();

            const percentageLabel = document.createElement('div');
            percentageLabel.className = 'blend-percentage-label';
            percentageLabel.textContent = `${this.blends[index].percentage}%`;

            wrapper.appendChild(swatch);
            wrapper.appendChild(hexLabel);
            wrapper.appendChild(percentageLabel);
            this.contentArea.appendChild(wrapper);

            swatch.addEventListener('click', async () => {
                try {
                    if (
                        typeof ClipboardService !== 'undefined' &&
                        ClipboardService.copyToClipboard
                    ) {
                        await ClipboardService.copyToClipboard(color, { feedback: true });
                    } else {
                        await navigator.clipboard.writeText(color);
                        if (typeof Toast !== 'undefined') {
                            Toast.success(`${color} copied!`, 1000);
                        }
                    }
                } catch (error) {
                    console.error('Copy failed:', error);
                }
            });
        });
    }

    setPrimaryColor(color) {
        if (!color || color === this.primaryColor) return;
        this.primaryColor = color;
        this.updateBlends();
    }

    setBlendColor(color) {
        if (!color || color === this.blendColor) return;
        this.updateBlendColor(color);
    }

    setBlendCount(count) {
        count = Math.max(3, Math.min(10, count));
        if (count === this.blendCount) return;
        this.blendCount = count;

        if (this.countSlider) this.countSlider.value = count;
        if (this.countValue) this.countValue.textContent = count;

        this.updateBlends();
    }

    getBlends() {
        return this.blends;
    }

    getElement() {
        return this.container;
    }

    destroy() {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }

    getCurrentColors() {
        return this.blends.map((blend) => blend.hex) || [];
    }
}

if (typeof window !== 'undefined') {
    window.BlendDisplay = BlendDisplay;
}

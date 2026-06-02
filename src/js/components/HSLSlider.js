const HSLSlider = {
    create(options = {}) {
        const {
            channel = 'hue',
            value = channel === 'hue' ? 0 : 50,
            onChange = null,
            label = null,
            step = 1,
            baseColor = { h: 0, s: 100, l: 50 },
        } = options;

        if (!['hue', 'saturation', 'lightness'].includes(channel)) {
            throw new Error(`Invalid HSL channel: ${channel}`);
        }

        const config = this.getChannelConfig(channel);
        const normalizedValue = Math.max(config.min, Math.min(config.max, value));

        const container = document.createElement('div');
        container.className = 'hsl-slider-wrapper';
        container.dataset.channel = channel;

        const labelElement = document.createElement('label');
        labelElement.className = 'hsl-slider-label';
        labelElement.textContent = label || config.label;
        labelElement.setAttribute(
            'for',
            `hsl-${channel}-${Math.random().toString(36).substr(2, 9)}`,
        );

        const track = document.createElement('div');
        track.className = 'hsl-slider-track';
        this.updateTrackGradient(track, channel, baseColor);

        const input = document.createElement('input');
        input.type = 'range';
        input.className = 'hsl-slider-input';
        input.id = labelElement.getAttribute('for');
        input.min = config.min;
        input.max = config.max;
        input.step = step;
        input.value = normalizedValue;
        input.setAttribute('aria-label', `${config.label}: ${normalizedValue}${config.unit}`);
        input.setAttribute('aria-valuemin', config.min);
        input.setAttribute('aria-valuemax', config.max);
        input.setAttribute('aria-valuenow', normalizedValue);

        const valueDisplay = document.createElement('span');
        valueDisplay.className = 'hsl-slider-value';
        valueDisplay.textContent = `${normalizedValue}${config.unit}`;

        const controlsRow = document.createElement('div');
        controlsRow.className = 'hsl-slider-controls';
        controlsRow.appendChild(labelElement);
        controlsRow.appendChild(valueDisplay);

        const sliderRow = document.createElement('div');
        sliderRow.className = 'hsl-slider-row';
        sliderRow.appendChild(track);
        sliderRow.appendChild(input);

        container.appendChild(controlsRow);
        container.appendChild(sliderRow);

        const sliderControl = {
            element: container,
            input: input,
            track: track,
            valueDisplay: valueDisplay,
            channel: channel,
            currentValue: normalizedValue,
            baseColor: { ...baseColor },
            onChange: onChange,
            config: config,
        };

        this.setupEvents(sliderControl);

        return sliderControl;
    },

    getChannelConfig(channel) {
        const configs = {
            hue: {
                label: 'Hue',
                unit: '°',
                min: 0,
                max: 360,
                defaultGradient:
                    'linear-gradient(to right, ' +
                    'rgb(255, 0, 0), ' +
                    'rgb(255, 255, 0), ' +
                    'rgb(0, 255, 0), ' +
                    'rgb(0, 255, 255), ' +
                    'rgb(0, 0, 255), ' +
                    'rgb(255, 0, 255), ' +
                    'rgb(255, 0, 0))',
            },
            saturation: {
                label: 'Saturation',
                unit: '%',
                min: 0,
                max: 100,
                defaultGradient: null,
            },
            lightness: {
                label: 'Lightness',
                unit: '%',
                min: 0,
                max: 100,
                defaultGradient: null,
            },
        };

        return configs[channel] || configs.hue;
    },

    updateTrackGradient(track, channel, baseColor) {
        let gradient;

        if (channel === 'hue') {
            gradient = this.getChannelConfig('hue').defaultGradient;
        } else if (channel === 'saturation') {
            const fullSat = HSLColor.hslToRgb(baseColor.h, 100, baseColor.l);
            const noSat = HSLColor.hslToRgb(baseColor.h, 0, baseColor.l);
            const rgbNoSat = `rgb(${noSat.r}, ${noSat.g}, ${noSat.b})`;
            const rgbFullSat = `rgb(${fullSat.r}, ${fullSat.g}, ${fullSat.b})`;
            gradient = `linear-gradient(to right, ${rgbNoSat}, ${rgbFullSat})`;
        } else if (channel === 'lightness') {
            const darkRgb = `rgb(0, 0, 0)`;
            const midRgb = (() => {
                const mid = HSLColor.hslToRgb(baseColor.h, baseColor.s, 50);
                return `rgb(${mid.r}, ${mid.g}, ${mid.b})`;
            })();
            const lightRgb = `rgb(255, 255, 255)`;
            gradient = `linear-gradient(to right, ${darkRgb}, ${midRgb}, ${lightRgb})`;
        }

        if (gradient) {
            track.style.background = gradient;
        }
    },

    setupEvents(sliderControl) {
        const { input, valueDisplay, channel, config } = sliderControl;

        input.addEventListener('input', (e) => {
            const newValue = parseInt(e.target.value);
            this.updateSlider(sliderControl, newValue);
        });

        input.addEventListener('keydown', (e) => {
            const step = parseInt(input.step) || 1;
            let newValue = parseInt(input.value);

            if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
                e.preventDefault();
                newValue = Math.max(config.min, newValue - step);
                this.updateSlider(sliderControl, newValue);
            } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
                e.preventDefault();
                newValue = Math.min(config.max, newValue + step);
                this.updateSlider(sliderControl, newValue);
            } else if (e.key === 'Home') {
                e.preventDefault();
                this.updateSlider(sliderControl, config.min);
            } else if (e.key === 'End') {
                e.preventDefault();
                this.updateSlider(sliderControl, config.max);
            }
        });

        let isTouching = false;
        input.addEventListener('touchstart', () => {
            isTouching = true;
        });
        input.addEventListener('touchend', () => {
            isTouching = false;
        });
    },

    updateSlider(sliderControl, newValue) {
        const { input, valueDisplay, channel, config, onChange } = sliderControl;

        const clampedValue = Math.max(config.min, Math.min(config.max, newValue));

        sliderControl.currentValue = clampedValue;
        input.value = clampedValue;

        valueDisplay.textContent = `${clampedValue}${config.unit}`;
        input.setAttribute('aria-valuenow', clampedValue);

        if (onChange && typeof onChange === 'function') {
            onChange(clampedValue, sliderControl.element);
        }
    },

    setValue(sliderControl, newValue) {
        this.updateSlider(sliderControl, newValue);
    },

    getValue(sliderControl) {
        return sliderControl.currentValue;
    },

    updateBaseColor(sliderControl, newBaseColor) {
        sliderControl.baseColor = { ...newBaseColor };
        this.updateTrackGradient(sliderControl.track, sliderControl.channel, newBaseColor);
    },

    createLinkedSliders(options = {}) {
        const {
            container = document.body,
            initialColor = { h: 0, s: 100, l: 50 },
            onChange = null,
        } = options;

        const sliders = {};
        const controllers = { h: null, s: null, l: null };

        const triggerChange = () => {
            const currentColor = {
                h: sliders.h.currentValue,
                s: sliders.s.currentValue,
                l: sliders.l.currentValue,
            };

            if (controllers.s) {
                this.updateBaseColor(sliders.s, currentColor);
            }
            if (controllers.l) {
                this.updateBaseColor(sliders.l, currentColor);
            }

            if (onChange && typeof onChange === 'function') {
                onChange(currentColor);
            }
        };

        sliders.h = this.create({
            channel: 'hue',
            value: initialColor.h,
            onChange: triggerChange,
            baseColor: initialColor,
        });

        sliders.s = this.create({
            channel: 'saturation',
            value: initialColor.s,
            onChange: triggerChange,
            baseColor: initialColor,
        });

        sliders.l = this.create({
            channel: 'lightness',
            value: initialColor.l,
            onChange: triggerChange,
            baseColor: initialColor,
        });

        container.appendChild(sliders.h.element);
        container.appendChild(sliders.s.element);
        container.appendChild(sliders.l.element);

        return {
            hSlider: sliders.h,
            sSlider: sliders.s,
            lSlider: sliders.l,
            element: container,

            getColor() {
                return {
                    h: sliders.h.currentValue,
                    s: sliders.s.currentValue,
                    l: sliders.l.currentValue,
                };
            },

            setColor(h, s, l) {
                HSLSlider.setValue(sliders.h, h);
                HSLSlider.setValue(sliders.s, s);
                HSLSlider.setValue(sliders.l, l);
                triggerChange();
            },

            setChannel(channel, value) {
                if (sliders[channel]) {
                    HSLSlider.setValue(sliders[channel], value);
                    triggerChange();
                }
            },
        };
    },
};

const ColorInputGroup = (() => {
    const primaryInput = document.getElementById('primaryColorInput');
    const errorMessage = document.getElementById('errorMessage');

    const primaryHueSlider = document.getElementById('primaryHueSlider');
    const primarySatSlider = document.getElementById('primarySatSlider');
    const primaryLightSlider = document.getElementById('primaryLightSlider');
    const primaryHueValue = document.getElementById('primaryHueValue');
    const primarySatValue = document.getElementById('primarySatValue');
    const primaryLightValue = document.getElementById('primaryLightValue');
    const primaryGradient = document.querySelector('#primaryColorControls .color-preview-gradient');
    const primaryCursor = document.querySelector('#primaryColorControls .color-preview-cursor');

    if (!primaryInput) {
        console.error('ColorInputGroup: primaryColorInput not found');
        return;
    }

    const hexToHsl = (hex) => {
        if (typeof ColorConverter !== 'undefined') {
            const rgb = ColorConverter.hexToRgb(hex);
            if (rgb) {
                return ColorConverter.rgbToHsl(rgb.r, rgb.g, rgb.b);
            }
        }
        if (hex === '#FFD700') return { h: 51, s: 100, l: 50 };
        return { h: 0, s: 100, l: 50 };
    };

    const hslToHex = (h, s, l) => {
        if (typeof ColorConverter !== 'undefined') {
            const rgb = ColorConverter.hslToRgb(h, s, l);
            return ColorConverter.rgbToHex(rgb.r, rgb.g, rgb.b);
        }
        return '#FFD700';
    };

    const isValidHex = (hex) => {
        if (typeof ColorConverter !== 'undefined') {
            return ColorConverter.hexToRgb(hex) !== null;
        }
        return /^#[0-9A-Fa-f]{6}$/i.test(hex);
    };

    const normalizeHex = (hex) => {
        let normalized = hex.trim();
        if (!normalized.startsWith('#')) normalized = '#' + normalized;
        return normalized.toUpperCase();
    };

    const updateAppState = (hex) => {
        if (typeof AppState !== 'undefined') {
            AppState.update({ primaryColor: hex.toUpperCase() });
        }
    };

    const updateGradientBackground = (gradient, hue) => {
        if (!gradient) return;

        gradient.style.background = `
        linear-gradient(to right, 
            hsl(0, 0%, 50%), 
            hsl(${hue}, 100%, 50%)
        ),
        linear-gradient(to bottom,
            rgba(255, 255, 255, 1),
            rgba(255, 255, 255, 0),
            rgba(0, 0, 0, 1)
        )
    `;
        gradient.style.backgroundBlendMode = 'overlay';
    };

    const updateCursorPosition = (cursor, saturation, lightness) => {
        if (!cursor) return;
        const satPercent = (saturation / 100) * 100;
        const lightPercent = ((100 - lightness) / 100) * 100;
        cursor.style.left = `${satPercent}%`;
        cursor.style.top = `${lightPercent}%`;
    };

    const updateSatGradient = (satSlider, hue) => {
        if (!satSlider) return;
        satSlider.style.background = `linear-gradient(to right, 
      hsl(${hue}, 0%, 50%), 
      hsl(${hue}, 100%, 50%)
    )`;
    };

    const updateLightGradient = (lightSlider, hue, saturation) => {
        if (!lightSlider) return;
        lightSlider.style.background = `linear-gradient(to right, 
      hsl(${hue}, ${saturation}%, 0%), 
      hsl(${hue}, ${saturation}%, 50%),
      hsl(${hue}, ${saturation}%, 100%)
    )`;
    };

    const setupDragPicker = (gradient, cursor, satSlider, lightSlider) => {
        if (!gradient) return;

        let isDragging = false;

        const updateFromDrag = (clientX, clientY) => {
            const rect = gradient.getBoundingClientRect();
            if (rect.width === 0) return;

            const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
            const y = Math.max(0, Math.min(clientY - rect.top, rect.height));

            const saturation = Math.round((x / rect.width) * 100);
            const lightness = Math.round(100 - (y / rect.height) * 100);

            updateCursorPosition(cursor, saturation, lightness);

            if (satSlider) satSlider.value = saturation;
            if (lightSlider) lightSlider.value = lightness;

            if (satSlider) satSlider.dispatchEvent(new Event('input'));
            if (lightSlider) lightSlider.dispatchEvent(new Event('input'));
        };

        const onMouseMove = (e) => {
            if (isDragging) updateFromDrag(e.clientX, e.clientY);
        };

        const onMouseUp = () => {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        gradient.addEventListener('mousedown', (e) => {
            isDragging = true;
            updateFromDrag(e.clientX, e.clientY);
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        gradient.addEventListener('touchstart', (e) => {
            e.preventDefault();
            isDragging = true;
            const touch = e.touches[0];
            updateFromDrag(touch.clientX, touch.clientY);
        });

        document.addEventListener('touchmove', (e) => {
            if (isDragging && e.touches[0]) {
                e.preventDefault();
                updateFromDrag(e.touches[0].clientX, e.touches[0].clientY);
            }
        });

        document.addEventListener('touchend', () => {
            isDragging = false;
        });
    };

    const initPrimaryControls = () => {
        if (!primaryHueSlider || !primarySatSlider || !primaryLightSlider) {
            console.error('Primary HSL controls not found');
            return;
        }

        const currentHex = primaryInput.value || '#FFD700';
        const hsl = hexToHsl(currentHex);

        primaryHueSlider.value = hsl.h;
        primarySatSlider.value = hsl.s;
        primaryLightSlider.value = hsl.l;
        if (primaryHueValue) primaryHueValue.textContent = `${Math.round(hsl.h)}°`;
        if (primarySatValue) primarySatValue.textContent = `${Math.round(hsl.s)}%`;
        if (primaryLightValue) primaryLightValue.textContent = `${Math.round(hsl.l)}%`;

        updateGradientBackground(primaryGradient, hsl.h);
        updateCursorPosition(primaryCursor, hsl.s, hsl.l);
        updateSatGradient(primarySatSlider, hsl.h);
        updateLightGradient(primaryLightSlider, hsl.h, hsl.s);

        setupDragPicker(primaryGradient, primaryCursor, primarySatSlider, primaryLightSlider);

        primaryHueSlider.addEventListener('input', (e) => {
            const hue = parseInt(e.target.value);
            if (primaryHueValue) primaryHueValue.textContent = `${hue}°`;
            updateGradientBackground(primaryGradient, hue);
            updateSatGradient(primarySatSlider, hue);
            updateLightGradient(primaryLightSlider, hue, parseInt(primarySatSlider.value));

            const hex = hslToHex(
                hue,
                parseInt(primarySatSlider.value),
                parseInt(primaryLightSlider.value),
            );
            primaryInput.value = hex.toLowerCase();
            updateAppState(hex);
        });

        primarySatSlider.addEventListener('input', (e) => {
            const sat = parseInt(e.target.value);
            if (primarySatValue) primarySatValue.textContent = `${sat}%`;
            updateCursorPosition(primaryCursor, sat, parseInt(primaryLightSlider.value));
            updateLightGradient(primaryLightSlider, parseInt(primaryHueSlider.value), sat);

            const hex = hslToHex(
                parseInt(primaryHueSlider.value),
                sat,
                parseInt(primaryLightSlider.value),
            );
            primaryInput.value = hex.toLowerCase();
            updateAppState(hex);
        });

        primaryLightSlider.addEventListener('input', (e) => {
            const light = parseInt(e.target.value);
            if (primaryLightValue) primaryLightValue.textContent = `${light}%`;
            updateCursorPosition(primaryCursor, parseInt(primarySatSlider.value), light);

            const hex = hslToHex(
                parseInt(primaryHueSlider.value),
                parseInt(primarySatSlider.value),
                light,
            );
            primaryInput.value = hex.toLowerCase();
            updateAppState(hex);
        });

        primaryInput.addEventListener('input', (e) => {
            const value = e.target.value;
            if (isValidHex(value)) {
                primaryInput.classList.remove('error');
                if (errorMessage) errorMessage.classList.add('hidden');

                const hsl = hexToHsl(value);
                primaryHueSlider.value = hsl.h;
                primarySatSlider.value = hsl.s;
                primaryLightSlider.value = hsl.l;
                if (primaryHueValue) primaryHueValue.textContent = `${Math.round(hsl.h)}°`;
                if (primarySatValue) primarySatValue.textContent = `${Math.round(hsl.s)}%`;
                if (primaryLightValue) primaryLightValue.textContent = `${Math.round(hsl.l)}%`;

                updateGradientBackground(primaryGradient, hsl.h);
                updateCursorPosition(primaryCursor, hsl.s, hsl.l);
                updateSatGradient(primarySatSlider, hsl.h);
                updateLightGradient(primaryLightSlider, hsl.h, hsl.s);

                updateAppState(value);
            }
        });

        primaryInput.addEventListener('blur', (e) => {
            const value = e.target.value.trim();
            if (value.length > 0 && !isValidHex(value)) {
                primaryInput.classList.add('error');
                if (errorMessage) {
                    errorMessage.textContent = `Invalid color format: ${value}`;
                    errorMessage.classList.remove('hidden');
                }
            } else if (value.length > 0 && isValidHex(value)) {
                primaryInput.classList.remove('error');
                if (errorMessage) errorMessage.classList.add('hidden');
                const normalized = normalizeHex(value);
                primaryInput.value = normalized;
                updateAppState(normalized);
            }
        });
    };

    const init = () => {
        initPrimaryControls();

        if (typeof AppState !== 'undefined') {
            AppState.subscribe((state) => {
                if (state.primaryColor && primaryInput.value !== state.primaryColor.toLowerCase()) {
                    primaryInput.value = state.primaryColor.toLowerCase();
                    const hsl = hexToHsl(state.primaryColor);
                    primaryHueSlider.value = hsl.h;
                    primarySatSlider.value = hsl.s;
                    primaryLightSlider.value = hsl.l;
                    if (primaryHueValue) primaryHueValue.textContent = `${Math.round(hsl.h)}°`;
                    if (primarySatValue) primarySatValue.textContent = `${Math.round(hsl.s)}%`;
                    if (primaryLightValue) primaryLightValue.textContent = `${Math.round(hsl.l)}%`;
                    updateGradientBackground(primaryGradient, hsl.h);
                    updateCursorPosition(primaryCursor, hsl.s, hsl.l);
                }
            });
        }
    };

    return { init };
})();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (typeof ColorInputGroup !== 'undefined' && ColorInputGroup.init) {
            ColorInputGroup.init();
        }
    });
} else {
    if (typeof ColorInputGroup !== 'undefined' && ColorInputGroup.init) {
        ColorInputGroup.init();
    }
}

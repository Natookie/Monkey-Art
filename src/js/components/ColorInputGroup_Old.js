const ColorInputGroup = (() => {
    const colorInputGroup = document.getElementById('colorInputGroup');
    const primaryInput = document.getElementById('primaryColorInput');
    const secondaryInput = document.getElementById('secondaryColorInput');
    const secondaryGroup = document.getElementById('secondaryColorGroup');
    const blendToggle = document.getElementById('blendToggle');
    const errorMessage = document.getElementById('errorMessage');

    let primaryColorInputComponent = null;
    let secondaryColorInputComponent = null;

    if (!primaryInput) {
        console.error('ColorInputGroup: primaryColorInput not found');
        return;
    }

    const init = () => {
        if (typeof ColorInput !== 'undefined') {
            primaryColorInputComponent = new ColorInput({
                id: primaryInput.id,
                label: 'Primary Color',
                placeholder: '#FFD700',
                initialValue: '#FFD700',
            });

            const primaryLabel = colorInputGroup.querySelector('label[for="primaryColorInput"]');
            if (primaryLabel) {
                primaryLabel.insertAdjacentElement(
                    'afterend',
                    primaryColorInputComponent.getElement(),
                );
                if (primaryInput.parentElement === colorInputGroup) {
                    primaryInput.remove();
                }
            }

            primaryColorInputComponent.onChange((value, validation) => {
                if (validation.isValid) {
                    const normalized = normalizeHex(value);
                    AppState.update({ primaryColor: normalized });
                }
            });
        }

        if (primaryInput && primaryInput.parentElement) {
            primaryInput.addEventListener('input', handlePrimaryColorChange);
            primaryInput.addEventListener('blur', handlePrimaryColorBlur);
        }

        if (secondaryInput) {
            if (typeof ColorInput !== 'undefined') {
                secondaryColorInputComponent = new ColorInput({
                    id: secondaryInput.id,
                    label: 'Secondary Color',
                    placeholder: '#FF0000',
                    initialValue: '#FF0000',
                });

                const secondaryLabel = secondaryGroup.querySelector(
                    'label[for="secondaryColorInput"]',
                );
                if (secondaryLabel) {
                    secondaryLabel.insertAdjacentElement(
                        'afterend',
                        secondaryColorInputComponent.getElement(),
                    );
                    if (secondaryInput.parentElement === secondaryGroup) {
                        secondaryInput.remove();
                    }
                }

                secondaryColorInputComponent.onChange((value, validation) => {
                    if (validation.isValid) {
                        const normalized = normalizeHex(value);
                        AppState.update({ secondaryColor: normalized });
                    }
                });
            }

            if (secondaryInput && secondaryInput.parentElement) {
                secondaryInput.addEventListener('input', handleSecondaryColorChange);
                secondaryInput.addEventListener('blur', handleSecondaryColorBlur);
            }
        }

        AppState.subscribe((state) => {
            updateInputValues(state);
            const blendEnabled = state.blendMode?.enabled ?? state.blendEnabled;
            updateSecondaryVisibility(blendEnabled);
        });

        const state = AppState.getState();
        updateInputValues(state);
        const blendEnabled = state.blendMode?.enabled ?? state.blendEnabled;
        updateSecondaryVisibility(blendEnabled);
    };

    const handlePrimaryColorChange = (event) => {
        const value = event.target.value;

        if (isValidHex(value)) {
            updateColorSwatch('primaryColorBox', value);
            primaryInput.classList.remove('error');
            if (errorMessage) {
                errorMessage.classList.add('hidden');
            }
        }
    };

    const handlePrimaryColorBlur = (event) => {
        const value = event.target.value.trim();

        if (value.length > 0 && !isValidHex(value)) {
            primaryInput.classList.add('error');
            if (errorMessage) {
                errorMessage.textContent = `Invalid color format: ${value}`;
                errorMessage.classList.remove('hidden');
            }
        } else if (value.length > 0 && isValidHex(value)) {
            primaryInput.classList.remove('error');
            if (errorMessage) {
                errorMessage.classList.add('hidden');
            }

            const normalized = normalizeHex(value);
            AppState.update({ primaryColor: normalized });
            updateColorSwatch('primaryColorBox', normalized);
        } else {
            primaryInput.classList.remove('error');
            if (errorMessage) {
                errorMessage.classList.add('hidden');
            }
        }
    };

    const handleSecondaryColorChange = (event) => {
        const value = event.target.value;

        if (isValidHex(value)) {
            updateColorSwatch('blendColorBox', value);
            secondaryInput.classList.remove('error');
            if (errorMessage) {
                errorMessage.classList.add('hidden');
            }
        }
    };

    const handleSecondaryColorBlur = (event) => {
        const value = event.target.value.trim();

        if (value.length > 0 && !isValidHex(value)) {
            secondaryInput.classList.add('error');
            if (errorMessage) {
                errorMessage.textContent = `Invalid color format: ${value}`;
                errorMessage.classList.remove('hidden');
            }
        } else if (value.length > 0 && isValidHex(value)) {
            secondaryInput.classList.remove('error');
            if (errorMessage) {
                errorMessage.classList.add('hidden');
            }

            const normalized = normalizeHex(value);
            AppState.update({ secondaryColor: normalized });
            updateColorSwatch('blendColorBox', normalized);

            if (blendToggle && blendToggle.checked) {
                recalculateBlend();
            }
        } else {
            secondaryInput.classList.remove('error');
            if (errorMessage) {
                errorMessage.classList.add('hidden');
            }
        }
    };

    const handleBlendToggle = (event) => {
    };

    const recalculateBlend = () => {
        const state = AppState.getState();
        if (BlendService && typeof BlendService.blend === 'function') {
            const blendedColor = BlendService.blend(state.primaryColor, state.secondaryColor);
            AppState.updateState({ blendedColor });
        }
    };

    const updateInputValues = (state) => {
        if (primaryInput.value !== state.primaryColor) {
            primaryInput.value = state.primaryColor;
        }

        if (secondaryInput && secondaryInput.value !== state.secondaryColor) {
            secondaryInput.value = state.secondaryColor;
        }

        if (blendToggle && blendToggle.checked !== state.blendEnabled) {
            blendToggle.checked = state.blendEnabled;
        }
    };

    const updateSecondaryVisibility = (isVisible) => {
        if (secondaryGroup) {
            if (isVisible) {
                secondaryGroup.classList.remove('hidden');
            } else {
                secondaryGroup.classList.add('hidden');
            }
        }
    };

    const isValidHex = (hex) => {
        if (!hex) return false;
        hex = hex.trim();
        return /^#?[0-9a-fA-F]{3}$/.test(hex) || /^#?[0-9a-fA-F]{6}$/.test(hex);
    };

    const normalizeHex = (hex) => {
        if (!hex) return null;

        hex = hex.trim();
        if (!hex.startsWith('#')) {
            hex = '#' + hex;
        }

        const rgbMatch = hex.match(/^#([0-9a-fA-F]{3})$/i);
        const rrggbbMatch = hex.match(/^#([0-9a-fA-F]{6})$/i);

        if (rgbMatch) {
            const [, rgb] = rgbMatch;
            return (
                '#' +
                rgb
                    .split('')
                    .map((c) => c + c)
                    .join('')
                    .toUpperCase()
            );
        } else if (rrggbbMatch) {
            return '#' + rrggbbMatch[1].toUpperCase();
        }

        return null;
    };

    const updateColorSwatch = (elementId, hex) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.backgroundColor = hex;
            element.setAttribute('aria-label', `Color preview: ${hex}`);
        }
    };

    return {
        init,
    };
})();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ColorInputGroup.init());
} else {
    ColorInputGroup.init();
}

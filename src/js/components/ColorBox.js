const ColorBox = (() => {
    const primaryElement = document.querySelector('.color-box--primary');
    const blendElement = document.querySelector('.color-box--blend');

    if (!primaryElement) {
        console.error('ColorBox: Primary color box element not found');
        return;
    }

    const init = () => {
        if (typeof AppState !== 'undefined') {
            AppState.subscribe((state) => {
                if (state.primaryColor) {
                    primaryElement.style.backgroundColor = state.primaryColor;
                    primaryElement.setAttribute(
                        'aria-label',
                        `Primary color: ${state.primaryColor}`,
                    );
                }

                if (blendElement && state.secondaryColor) {
                    blendElement.style.backgroundColor = state.secondaryColor;
                    blendElement.setAttribute(
                        'aria-label',
                        `Secondary color: ${state.secondaryColor}`,
                    );

                    const blendEnabled = state.blendMode?.enabled ?? state.blendEnabled;
                    if (blendEnabled) {
                        blendElement.classList.remove('hidden');
                    } else {
                        blendElement.classList.add('hidden');
                    }
                }
            });
        }
    };

    return { init };
})();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ColorBox.init());
} else {
    ColorBox.init();
}

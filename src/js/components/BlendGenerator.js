const BlendGenerator = (() => {
    const container = document.getElementById('blendDisplay');
    let blendDisplay = null;

    if (!container) {
        console.error('BlendGenerator: DOM element with id "blendDisplay" not found');
        return;
    }

    const init = () => {
        let primaryColor = '#FFD700';
        if (typeof AppState !== 'undefined') {
            const state = AppState.getState();
            primaryColor = state.primaryColor || '#FFD700';
        }

        blendDisplay = new BlendDisplay({
            primaryColor: primaryColor,
            blendColor: '#0066CC',
            blendCount: 5,
            onChange: (data) => {
                window.currentBlendData = data;

                document.dispatchEvent(
                    new CustomEvent('blendUpdated', {
                        detail: data,
                    }),
                );
            },
        });

        container.innerHTML = '';
        container.appendChild(blendDisplay.getElement());

        console.log('BlendGenerator initialized with self-contained BlendDisplay');
    };

    const updatePrimaryColor = (newPrimaryColor) => {
        if (blendDisplay && newPrimaryColor) {
            blendDisplay.setPrimaryColor(newPrimaryColor);
        }
    };

    const getBlendDisplay = () => {
        return blendDisplay;
    };

    const refresh = () => {
        if (blendDisplay) {
            blendDisplay.updateBlends();
        }
    };

    const getCurrentColors = () => {
        if (blendDisplay && blendDisplay.getCurrentColors) {
            return blendDisplay.getCurrentColors();
        }
        return [];
    };

    return {
        init,
        updatePrimaryColor,
        getBlendDisplay,
        refresh,
        getCurrentColors,
    };
})();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (typeof BlendGenerator !== 'undefined' && BlendGenerator.init) {
            BlendGenerator.init();
        }
    });
} else {
    if (typeof BlendGenerator !== 'undefined' && BlendGenerator.init) {
        BlendGenerator.init();
    }
}

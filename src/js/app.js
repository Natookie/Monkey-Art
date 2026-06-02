const app = {
    init() {
        this.setupSelectionPrevention();
        this.initializeComponents();
        this.setupModeSwitch();
        this.syncPrimaryColorWithBlend();
        this.verifyGenerators();
    },

    setupSelectionPrevention() {
        document.addEventListener('selectstart', (e) => {
            if (
                e.target?.classList?.contains('allow-select') ||
                e.target?.tagName === 'INPUT' ||
                e.target?.tagName === 'TEXTAREA'
            ) {
                return;
            }
            e.preventDefault();
        });
    },

    initializeComponents() {
        if (typeof NotificationManager !== 'undefined' && NotificationManager.init) {
            NotificationManager.init({
                container: 'body',
                maxActive: 3,
                autoDismissTime: 3000,
            });
        }

        const generators = [
            'PaletteGenerator',
            'ExploreGenerator',
            'BlendGenerator',
            'ShadeDisplay',
        ];

        generators.forEach((gen) => {
            if (typeof window[gen] !== 'undefined' && window[gen].init) {
                console.log(`Initializing ${gen}...`);
                window[gen].init();
            } else if (typeof window[gen] !== 'undefined') {
                console.log(`${gen} available but has no init method`);
            } else {
                console.warn(`${gen} not loaded - check script order`);
            }
        });
    },

    setupModeSwitch() {
        const toolsPanel = document.getElementById('toolsPanel');
        const explorePanel = document.getElementById('explorePanel');
        const toolsRightPanel = document.getElementById('toolsRightPanel');
        const exploreRightPanel = document.getElementById('exploreRightPanel');

        if (!toolsPanel || !explorePanel || !toolsRightPanel || !exploreRightPanel) {
            console.warn('Mode switch: Required panels not found');
            return;
        }

        if (typeof AppState !== 'undefined') {
            AppState.subscribe((state) => {
                const isToolsMode = state.mode === 'Tools';
                toolsPanel.classList.toggle('hidden', !isToolsMode);
                explorePanel.classList.toggle('hidden', isToolsMode);
                toolsRightPanel.classList.toggle('hidden', !isToolsMode);
                exploreRightPanel.classList.toggle('hidden', isToolsMode);
            });

            const initialState = AppState.getState();
            const isToolsMode = initialState.mode === 'Tools';
            toolsPanel.classList.toggle('hidden', !isToolsMode);
            explorePanel.classList.toggle('hidden', isToolsMode);
            toolsRightPanel.classList.toggle('hidden', !isToolsMode);
            exploreRightPanel.classList.toggle('hidden', isToolsMode);
        }
    },

    syncPrimaryColorWithBlend() {
        if (typeof AppState === 'undefined') return;

        AppState.subscribe((state) => {
            if (state.primaryColor && typeof BlendGenerator !== 'undefined') {
                if (BlendGenerator.updatePrimaryColor) {
                    BlendGenerator.updatePrimaryColor(state.primaryColor);
                }
            }
        });

        const primaryColorInput = document.getElementById('primaryColorInput');
        if (primaryColorInput) {
            primaryColorInput.addEventListener('change', (e) => {
                const newColor = e.target.value;
                if (
                    newColor &&
                    typeof BlendGenerator !== 'undefined' &&
                    BlendGenerator.updatePrimaryColor
                ) {
                    BlendGenerator.updatePrimaryColor(newColor);
                }
            });
        }

        const hueSlider = document.getElementById('primaryHueSlider');
        const satSlider = document.getElementById('primarySatSlider');
        const lightSlider = document.getElementById('primaryLightSlider');

        const updateFromHSL = () => {
            setTimeout(() => {
                if (
                    primaryColorInput &&
                    typeof BlendGenerator !== 'undefined' &&
                    BlendGenerator.updatePrimaryColor
                ) {
                    BlendGenerator.updatePrimaryColor(primaryColorInput.value);
                }
            }, 50);
        };

        if (hueSlider) hueSlider.addEventListener('input', updateFromHSL);
        if (satSlider) satSlider.addEventListener('input', updateFromHSL);
        if (lightSlider) lightSlider.addEventListener('input', updateFromHSL);
    },

    verifyGenerators() {
        const expected = [
            'PaletteGenerator',
            'ExploreGenerator',
            'BlendGenerator',
            'ShadeDisplay',
            'BlendDisplay',
        ];
        expected.forEach((component) => {
            if (typeof window[component] === 'undefined') {
                console.warn(`${component} not loaded`);
            } else {
                console.log(`${component} is available`);
            }
        });
    },
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
} else {
    app.init();
}

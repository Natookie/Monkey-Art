const ModeToggle = (() => {
    const container = document.getElementById('modeToggle');

    if (!container) {
        console.error('ModeToggle: DOM element with id "modeToggle" not found');
        return;
    }

    const buttons = container.querySelectorAll('.mode-btn');
    const init = () => {
        buttons.forEach((button) => {
            button.addEventListener('click', handleModeClick);
        });

        AppState.subscribe((state) => {
            updateActive(state.mode);
        });

        updateActive(AppState.getState().mode);
    };

    const handleModeClick = (event) => {
        const mode = event.currentTarget.getAttribute('data-mode');
        AppState.update({ mode });
    };

    const updateActive = (mode) => {
        buttons.forEach((btn) => {
            if (btn.getAttribute('data-mode') === mode) {
                btn.classList.add('active');
                btn.setAttribute('aria-pressed', 'true');
            } else {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            }
        });
    };

    return {
        init,
    };
})();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ModeToggle.init());
} else {
    ModeToggle.init();
}

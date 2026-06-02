const StorageWarning = (() => {
    const warningBanner = document.getElementById('storageWarning');
    const dismissButton = document.querySelector('.storage-warning-dismiss');

    if (!warningBanner) {
        console.error('StorageWarning: DOM element with id "storageWarning" not found');
        return;
    }

    const init = () => {
        checkStorageAvailability();

        if (dismissButton) {
            dismissButton.addEventListener('click', handleDismiss);
        }

        AppState.subscribe((state) => {
            if (!state.storageAvailable) {
                show();
            }
        });
    };

    const checkStorageAvailability = () => {
        const available = StorageService.isAvailable();

        if (!available) {
            AppState.update({ storageAvailable: false });
            show();
        } else {
            AppState.update({ storageAvailable: true });
            hide();
        }
    };

    const show = () => {
        if (warningBanner) {
            warningBanner.classList.remove('hidden');
            warningBanner.setAttribute('aria-live', 'assertive');
        }
    };

    const hide = () => {
        if (warningBanner) {
            warningBanner.classList.add('hidden');
            warningBanner.setAttribute('aria-live', 'off');
        }
    };

    const handleDismiss = () => {
        hide();
    };

    return {
        init,
        show,
        hide,
        checkStorageAvailability,
    };
})();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => StorageWarning.init());
} else {
    StorageWarning.init();
}

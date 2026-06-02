const AppState = (() => {
    let state = {
        primaryColor: '#FFD700',
        mode: 'Tools',
        savedPalettes: [],
        storageAvailable: true,
        errorMessage: null,
        toastMessage: null,
    };

    const listeners = [];
    const notifyListeners = () => {
        listeners.forEach((callback) => {
            try {
                callback(state);
            } catch (error) {
                console.error('Error in state listener:', error);
            }
        });
    };

    return {
        getState() {
            return { ...state };
        },

        get(key) {
            return state[key];
        },

        update(partial) {
            if (typeof partial !== 'object' || partial === null) {
                console.error('AppState.update: expected object, got', typeof partial);
                return;
            }

            state = {
                ...state,
                ...partial,
            };

            notifyListeners();
        },

        subscribe(callback) {
            if (typeof callback !== 'function') {
                console.error('AppState.subscribe: expected function, got', typeof callback);
                return () => {};
            }

            listeners.push(callback);

            return () => {
                const index = listeners.indexOf(callback);
                if (index > -1) {
                    listeners.splice(index, 1);
                }
            };
        },

        reset() {
            state = {
                primaryColor: '#FFD700',
                mode: 'Tools',
                savedPalettes: [],
                storageAvailable: true,
                errorMessage: null,
                toastMessage: null,
            };
            notifyListeners();
        },

        initialize(initialData) {
            if (typeof initialData === 'object' && initialData !== null) {
                state = {
                    ...state,
                    ...initialData,
                };
                notifyListeners();
            }
        },

        addSavedPalette(palette) {
            state.savedPalettes = [...state.savedPalettes, palette];
            notifyListeners();
        },

        removeSavedPalette(id) {
            state.savedPalettes = state.savedPalettes.filter((p) => p.id !== id);
            notifyListeners();
        },

        updateSavedPalette(id, updates) {
            state.savedPalettes = state.savedPalettes.map((p) =>
                p.id === id ? { ...p, ...updates } : p,
            );
            notifyListeners();
        },

        setPrimaryColor(hex) {
            state.primaryColor = hex;
            notifyListeners();
        },

        setMode(mode) {
            if (mode === 'Tools' || mode === 'Explore') {
                state.mode = mode;
                notifyListeners();
            } else {
                console.warn('Invalid mode:', mode);
            }
        },

        getListenerCount() {
            return listeners.length;
        },

        isStorageAvailable() {
            return state.storageAvailable;
        },

        setStorageAvailable(available) {
            state.storageAvailable = available;
            notifyListeners();
        },

        showError(message) {
            state.errorMessage = message;
            notifyListeners();
            setTimeout(() => {
                if (state.errorMessage === message) {
                    state.errorMessage = null;
                    notifyListeners();
                }
            }, 5000);
        },

        clearError() {
            state.errorMessage = null;
            notifyListeners();
        },

        showToast(message) {
            state.toastMessage = message;
            notifyListeners();
            setTimeout(() => {
                if (state.toastMessage === message) {
                    state.toastMessage = null;
                    notifyListeners();
                }
            }, 3000);
        },
    };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AppState;
}

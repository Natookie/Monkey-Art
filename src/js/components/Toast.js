class Toast {
    static defaultDuration = 1500;
    static container = null;
    static toasts = [];
    static maxToasts = 5;
    static isCleaningUp = false;

    static init() {
        if (Toast.container) return;

        Toast.container = document.createElement('div');
        Toast.container.id = 'toast-container';
        Toast.container.className = 'toast-container';
        Toast.container.setAttribute('role', 'region');
        Toast.container.setAttribute('aria-label', 'Toast notifications');
        Toast.container.setAttribute('aria-live', 'polite');
        Toast.container.setAttribute('aria-atomic', 'false');

        document.body.appendChild(Toast.container);
    }

    static show(message, duration = Toast.defaultDuration, options = {}) {
        if (!Toast.container) {
            Toast.init();
        }

        if (Toast.toasts.length >= Toast.maxToasts) {
            const oldestToast = Toast.toasts.shift();
            if (oldestToast) {
                if (oldestToast.timeout) {
                    clearTimeout(oldestToast.timeout);
                }
                if (oldestToast.element && oldestToast.element.parentNode) {
                    oldestToast.element.classList.remove('toast-show');
                    setTimeout(() => {
                        if (oldestToast.element && oldestToast.element.parentNode) {
                            oldestToast.element.parentNode.removeChild(oldestToast.element);
                        }
                    }, 300);
                }
            }
        }

        const toastId = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
        const type = options.type || 'success';
        const dismissable = options.dismissable !== false;

        const toast = document.createElement('div');
        toast.id = toastId;
        toast.className = `toast toast-${type}`;
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');

        const content = document.createElement('div');
        content.className = 'toast-content';

        const icon = document.createElement('span');
        icon.className = 'toast-icon';
        icon.setAttribute('aria-hidden', 'true');

        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ',
        };
        icon.textContent = icons[type] || '✓';

        const messageEl = document.createElement('span');
        messageEl.className = 'toast-message';
        messageEl.textContent = message;

        content.appendChild(icon);
        content.appendChild(messageEl);

        if (dismissable) {
            const dismissBtn = document.createElement('button');
            dismissBtn.className = 'toast-dismiss';
            dismissBtn.setAttribute('aria-label', 'Dismiss notification');
            dismissBtn.textContent = '✕';
            dismissBtn.addEventListener('click', () => {
                Toast.dismiss(toastId);
            });
            content.appendChild(dismissBtn);
        }

        toast.appendChild(content);

        Toast.container.appendChild(toast);

        let showTimeout = setTimeout(() => {
            toast.classList.add('toast-show');
            showTimeout = null;
        }, 10);

        let timeoutId = null;
        
        if (duration > 0) {
            timeoutId = setTimeout(() => {
                Toast.dismiss(toastId);
            }, duration);
        }

        const toastInstance = {
            id: toastId,
            element: toast,
            timeout: timeoutId,
            showTimeout: showTimeout,
            dismiss: () => Toast.dismiss(toastId),
        };

        Toast.toasts.push(toastInstance);

        return toastInstance;
    }

    static dismiss(toastId) {
        const toastIndex = Toast.toasts.findIndex((t) => t.id === toastId);
        if (toastIndex === -1) return;

        const toastInstance = Toast.toasts[toastIndex];

        if (toastInstance.showTimeout) {
            clearTimeout(toastInstance.showTimeout);
            toastInstance.showTimeout = null;
        }

        if (toastInstance.timeout) {
            clearTimeout(toastInstance.timeout);
            toastInstance.timeout = null;
        }

        if (toastInstance.element) {
            toastInstance.element.classList.remove('toast-show');
            
            const removeTimeout = setTimeout(() => {
                if (toastInstance.element && toastInstance.element.parentNode) {
                    toastInstance.element.parentNode.removeChild(toastInstance.element);
                }
                const finalIndex = Toast.toasts.findIndex((t) => t.id === toastId);
                if (finalIndex !== -1) {
                    Toast.toasts.splice(finalIndex, 1);
                }
                clearTimeout(removeTimeout);
            }, 300);
            toastInstance.removeTimeout = removeTimeout;
        } else {
            Toast.toasts.splice(toastIndex, 1);
        }
    }

    static dismissAll() {
        const toastIds = [...Toast.toasts.map((t) => t.id)];
        toastIds.forEach((id) => Toast.dismiss(id));
    }

    static success(message, duration = Toast.defaultDuration) {
        return Toast.show(message, duration, { type: 'success' });
    }

    static error(message, duration = Toast.defaultDuration) {
        return Toast.show(message, duration, { type: 'error' });
    }

    static warning(message, duration = Toast.defaultDuration) {
        return Toast.show(message, duration, { type: 'warning' });
    }

    static info(message, duration = Toast.defaultDuration) {
        return Toast.show(message, duration, { type: 'info' });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Toast.init());
} else {
    Toast.init();
}
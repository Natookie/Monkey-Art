class Toast {
    static defaultDuration = 1500;
    static container = null;
    static toasts = [];

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

        const toastId = `toast-${Date.now()}-${Math.random()}`;
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

        setTimeout(() => {
            toast.classList.add('toast-show');
        }, 10);

        Toast.container.appendChild(toast);

        const toastInstance = {
            id: toastId,
            element: toast,
            dismiss: () => Toast.dismiss(toastId),
            timeout: null,
        };

        Toast.toasts.push(toastInstance);

        if (duration > 0) {
            toastInstance.timeout = setTimeout(() => {
                Toast.dismiss(toastId);
            }, duration);
        }

        return toastInstance;
    }

    static dismiss(toastId) {
        const toastIndex = Toast.toasts.findIndex((t) => t.id === toastId);
        if (toastIndex === -1) return;

        const toastInstance = Toast.toasts[toastIndex];

        if (toastInstance.timeout) {
            clearTimeout(toastInstance.timeout);
        }

        toastInstance.element.classList.remove('toast-show');

        setTimeout(() => {
            if (toastInstance.element.parentNode) {
                toastInstance.element.parentNode.removeChild(toastInstance.element);
            }
            Toast.toasts.splice(toastIndex, 1);
        }, 300);
    }

    static dismissAll() {
        const toastIds = Toast.toasts.map((t) => t.id);
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

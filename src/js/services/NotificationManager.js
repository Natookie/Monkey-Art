const NotificationManager = {
    activeNotifications: new Map(),
    queue: [],
    maxActive: 3,

    containerSelector: '#notifications-container',
    notificationClass: 'notification',

    init(options = {}) {
        if (options.containerSelector) {
            this.containerSelector = options.containerSelector;
        }
        if (options.maxActive) {
            this.maxActive = options.maxActive;
        }

        if (!document.querySelector(this.containerSelector)) {
            const container = document.createElement('div');
            container.id = this.containerSelector.replace('#', '');
            container.className = 'notifications-container';
            document.body.appendChild(container);
        }
    },

    notify(notification) {
        const {
            hex,
            message,
            type = 'copy',
            duration = type === 'error' ? 5000 : 3000,
        } = notification;

        if (hex && this.getActiveNotificationByHex(hex)) {
            return false;
        }

        const id = `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const notificationObj = {
            id,
            hex,
            message,
            type,
            duration,
            createdAt: Date.now(),
            dismissController: new AbortController(),
        };

        this.queue.push(notificationObj);
        this.processQueue();

        return true;
    },

    getActiveNotificationByHex(hex) {
        if (!hex) return null;

        for (const [, notif] of this.activeNotifications) {
            if (notif.hex === hex) {
                return notif;
            }
        }
        return null;
    },

    processQueue() {
        while (this.queue.length > 0 && this.activeNotifications.size < this.maxActive) {
            const notification = this.queue.shift();
            this.displayNotification(notification);
        }
    },

    displayNotification(notification) {
        const container = document.querySelector(this.containerSelector);
        if (!container) {
            console.error(`Notification container not found: ${this.containerSelector}`);
            return;
        }

        const element = document.createElement('div');
        element.className = `${this.notificationClass} notification-${notification.type}`;
        element.id = notification.id;
        element.setAttribute('role', 'alert');
        element.setAttribute('aria-live', 'assertive');

        const messageEl = document.createElement('span');
        messageEl.className = 'notification-message';
        messageEl.textContent = notification.message;
        element.appendChild(messageEl);

        const closeBtn = document.createElement('button');
        closeBtn.className = 'notification-close';
        closeBtn.setAttribute('aria-label', 'Dismiss notification');
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', () => {
            this.dismiss(notification.id);
        });
        element.appendChild(closeBtn);

        container.appendChild(element);
        this.activeNotifications.set(notification.id, notification);
        requestAnimationFrame(() => {
            element.classList.add('show');
        });

        const timerId = setTimeout(() => {
            this.dismiss(notification.id);
        }, notification.duration);

        notification.timerId = timerId;
    },

    dismiss(id) {
        const notification = this.activeNotifications.get(id);
        if (!notification) return;

        if (notification.timerId) {
            clearTimeout(notification.timerId);
        }

        try {
            notification.dismissController.abort();
        } catch (e) {
        }

        this.activeNotifications.delete(id);

        const element = document.getElementById(id);
        if (element) {
            element.classList.remove('show');
            element.addEventListener(
                'transitionend',
                () => {
                    if (element.parentNode) {
                        element.parentNode.removeChild(element);
                    }
                },
                { once: true },
            );

            setTimeout(() => {
                if (element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            }, 500);
        }

        this.processQueue();
    },

    dismissAll() {
        const ids = Array.from(this.activeNotifications.keys());
        ids.forEach((id) => this.dismiss(id));
        this.queue = [];
    },

    getNotification(id) {
        return this.activeNotifications.get(id) || null;
    },

    getActiveCount() {
        return this.activeNotifications.size;
    },

    getQueuedCount() {
        return this.queue.length;
    },
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = NotificationManager;
}

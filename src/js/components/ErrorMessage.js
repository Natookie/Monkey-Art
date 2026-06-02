class ErrorMessage {
    constructor(options = {}) {
        this.id = options.id || `error-message-${Math.random().toString(36).substr(2, 9)}`;
        this.targetElement = options.targetElement || document.body;
        this.autoDismissTime = options.autoDismissTime || 0;
        this.dismissTimeout = null;

        this.createElements();
    }

    createElements() {
        this.container = document.createElement('div');
        this.container.id = this.id;
        this.container.className = 'error-message-container';
        this.container.setAttribute('role', 'alert');
        this.container.setAttribute('aria-live', 'polite');
        this.container.setAttribute('aria-atomic', 'true');
        this.container.style.display = 'none';

        this.messageWrapper = document.createElement('div');
        this.messageWrapper.className = 'error-message-wrapper';

        this.icon = document.createElement('span');
        this.icon.className = 'error-icon';
        this.icon.setAttribute('aria-hidden', 'true');
        this.icon.textContent = '✕';

        this.messageText = document.createElement('p');
        this.messageText.className = 'error-message-text';

        this.dismissButton = document.createElement('button');
        this.dismissButton.className = 'error-dismiss-btn';
        this.dismissButton.setAttribute('aria-label', 'Dismiss error message');
        this.dismissButton.textContent = '✕';
        this.dismissButton.addEventListener('click', () => this.hide());

        this.messageWrapper.appendChild(this.icon);
        this.messageWrapper.appendChild(this.messageText);
        this.container.appendChild(this.messageWrapper);
        this.container.appendChild(this.dismissButton);

        this.targetElement.appendChild(this.container);
    }

    show(message) {
        this.messageText.textContent = message;
        this.container.style.display = 'block';

        if (this.dismissTimeout) {
            clearTimeout(this.dismissTimeout);
        }

        if (this.autoDismissTime > 0) {
            this.dismissTimeout = setTimeout(() => this.hide(), this.autoDismissTime);
        }
    }

    hide() {
        this.container.style.display = 'none';

        if (this.dismissTimeout) {
            clearTimeout(this.dismissTimeout);
            this.dismissTimeout = null;
        }
    }

    clear() {
        this.messageText.textContent = '';
        this.hide();
    }

    isVisible() {
        return this.container.style.display !== 'none';
    }

    getElement() {
        return this.container;
    }
}

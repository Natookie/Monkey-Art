const ClipboardService = {
    async copyToClipboard(text, options = {}) {
        const { feedback = true, sourceId = null } = options;

        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
            try {
                await navigator.clipboard.writeText(text);

                if (sourceId && AppState.recordClipboardCopy) {
                    AppState.recordClipboardCopy(text, sourceId);
                }

                if (feedback) {
                    this.showSuccessFeedback(text);
                }

                return { success: true };
            } catch (error) {
                if (error.name === 'NotAllowedError') {
                    console.warn('Clipboard access denied by user or browser');
                    if (feedback) {
                        this.showErrorFeedback(
                            'Clipboard access denied. Please use Ctrl+C to copy instead.',
                            'permission_denied',
                        );
                    }
                    return {
                        success: false,
                        error: 'Permission denied',
                        errorType: 'NotAllowedError',
                    };
                } else if (error.name === 'NotFoundError') {
                    console.warn('Clipboard not available');
                    if (feedback) {
                        this.showErrorFeedback(
                            'Clipboard is not available on this browser.',
                            'unavailable',
                        );
                    }
                    return {
                        success: false,
                        error: 'Clipboard not available',
                        errorType: 'NotFoundError',
                    };
                } else if (error.name === 'NotSupportedError') {
                    console.warn('Clipboard operation not supported');
                    if (feedback) {
                        this.showErrorFeedback(
                            'Clipboard operations are not supported. Please use Ctrl+C.',
                            'unsupported',
                        );
                    }
                    return {
                        success: false,
                        error: 'Operation not supported',
                        errorType: 'NotSupportedError',
                    };
                }

                console.warn('Clipboard API failed:', error);
            }
        }

        try {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-9999px';
            textArea.style.top = '-9999px';
            document.body.appendChild(textArea);
            textArea.select();

            const success = document.execCommand('copy');
            document.body.removeChild(textArea);

            if (success) {
                if (sourceId && AppState.recordClipboardCopy) {
                    AppState.recordClipboardCopy(text, sourceId);
                }
                if (feedback) {
                    this.showSuccessFeedback(text);
                }

                return { success: true };
            } else {
                if (feedback) {
                    this.showErrorFeedback(
                        'Failed to copy text. Please try using Ctrl+C.',
                        'copy_command_failed',
                    );
                }
                return {
                    success: false,
                    error: 'Copy command failed',
                    errorType: 'execCommandFailed',
                };
            }
        } catch (error) {
            console.error('Fallback copy failed:', error);
            if (feedback) {
                this.showErrorFeedback(
                    'Unable to copy to clipboard. Your browser may not support this operation.',
                    'fallback_failed',
                );
            }
            return {
                success: false,
                error: 'Unable to copy to clipboard',
                errorType: 'fallbackFailed',
            };
        }
    },

    showSuccessFeedback(hex) {
        if (typeof NotificationManager !== 'undefined' && NotificationManager.notify) {
            NotificationManager.notify({
                id: `copy-${hex}`,
                hex: hex,
                type: 'copy',
                message: `Copied: ${hex.toUpperCase()}`,
            });
        }
        else if (typeof Toast !== 'undefined' && Toast.show) {
            Toast.show(`Copied: ${hex}`, 2000, { type: 'success' });
        } else {
            console.log(`Copied to clipboard: ${hex}`);
        }
    },

    showErrorFeedback(message, context = 'copy_error') {
        if (typeof NotificationManager !== 'undefined' && NotificationManager.notify) {
            NotificationManager.notify({
                id: `error-${context}-${Date.now()}`,
                hex: '#ff0000',
                type: 'error',
                message: message,
            });
        }
        else if (typeof Toast !== 'undefined' && Toast.show) {
            Toast.show(message, 3000, { type: 'error' });
        } else {
            console.error(`Copy failed: ${message}`);
        }
    },

    isAvailable() {
        return (
            !!(navigator.clipboard && typeof navigator.clipboard.writeText === 'function') ||
            !!(document.queryCommandSupported && document.queryCommandSupported('copy'))
        );
    },
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ClipboardService;
}

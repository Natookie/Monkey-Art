class ColorBoxDrag {
    constructor() {
        this.isActive = false;
        this.sourceId = null;
        this.startX = 0;
        this.startY = 0;
        this.startColor = null;
        this.element = null;
        this.onColorChange = null;
        this.saturation = 100;
        this.rafId = null;
        this.lastRafTime = 0;
        this.justEndedDrag = false;

        this.elementX = 0;
        this.elementY = 0;
        this.elementWidth = 0;
        this.elementHeight = 0;

        this._boundMouseDown = this.onMouseDown.bind(this);
        this._boundMouseMove = this.onMouseMove.bind(this);
        this._boundMouseUp = this.onMouseUp.bind(this);
        this._boundKeyDown = this.onKeyDown.bind(this);
    }

    bindToElement(element, sourceId, onColorChange) {
        this.element = element;
        this.sourceId = sourceId;
        this.onColorChange = onColorChange;

        if (!element) {
            console.error('ColorBoxDrag: element is not defined');
            return;
        }

        element.addEventListener('mousedown', this._boundMouseDown);
        document.addEventListener('mousemove', this._boundMouseMove, { passive: true });
        document.addEventListener('mouseup', this._boundMouseUp);
        element.addEventListener('keydown', this._boundKeyDown);
    }

    unbindFromElement() {
        if (this.element) {
            this.element.removeEventListener('mousedown', this._boundMouseDown);
            this.element.removeEventListener('keydown', this._boundKeyDown);
        }

        document.removeEventListener('mousemove', this._boundMouseMove);
        document.removeEventListener('mouseup', this._boundMouseUp);

        this.element = null;
    }

    onMouseDown(e) {
        if (e.target !== this.element && !this.element.contains(e.target)) {
            return;
        }

        e.preventDefault();

        this.startX = e.clientX;
        this.startY = e.clientY;

        const rect = this.element.getBoundingClientRect();
        this.elementX = rect.left;
        this.elementY = rect.top;
        this.elementWidth = rect.width;
        this.elementHeight = rect.height;

        if (this.onColorChange) {
            this.startColor = this.getCurrentColor();
        }

        this.isActive = true;
        AppState.startDrag(this.sourceId, this.startX, this.startY, this.startColor);

        this.element.classList.add('dragging');
    }

    onMouseMove(e) {
        if (!this.isActive) return;

        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }

        this.rafId = requestAnimationFrame(() => {
            if (!this.isActive) return;

            const deltaX = e.clientX - this.elementX;
            const deltaY = e.clientY - this.elementY;

            const clampedX = Math.max(0, Math.min(this.elementWidth, deltaX));
            const clampedY = Math.max(0, Math.min(this.elementHeight, deltaY));

            const hue = (clampedX / this.elementWidth) * 360;

            const lightness = 100 - (clampedY / this.elementHeight) * 100;

            const rgb = ColorConverter.hslToRgb(hue, this.saturation, lightness);

            if (this.onColorChange) {
                this.onColorChange(rgb);
            }

            AppState.updateDrag(e.clientX, e.clientY, rgb);

            this.lastRafTime = Date.now();
        });
    }

    onMouseUp(e) {
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }

        this.isActive = false;
        this.startX = 0;
        this.startY = 0;
        this.startColor = null;

        AppState.endDrag();

        if (this.element) {
            this.element.classList.remove('dragging');
        }

        this.justEndedDrag = true;
        setTimeout(() => {
            this.justEndedDrag = false;
        }, 100);
    }

    onKeyDown(e) {
        if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
            return;
        }

        const shift = e.shiftKey ? 10 : 1;

        let currentRgb = this.getCurrentColor();
        if (!currentRgb) {
            currentRgb = { r: 255, g: 0, b: 0 };
        }

        let hsl = ColorConverter.rgbToHsl(currentRgb.r, currentRgb.g, currentRgb.b);

        switch (e.key) {
            case 'ArrowLeft':
                hsl.h = (hsl.h - shift + 360) % 360;
                e.preventDefault();
                break;
            case 'ArrowRight':
                hsl.h = (hsl.h + shift) % 360;
                e.preventDefault();
                break;
            case 'ArrowUp':
                hsl.l = Math.min(100, hsl.l + shift);
                e.preventDefault();
                break;
            case 'ArrowDown':
                hsl.l = Math.max(0, hsl.l - shift);
                e.preventDefault();
                break;
            default:
                return;
        }

        const newRgb = ColorConverter.hslToRgb(hsl.h, hsl.s, hsl.l);
        if (this.onColorChange) {
            this.onColorChange(newRgb);
        }

        if (this.sourceId && AppState.get('colors') && AppState.get('colors')[this.sourceId]) {
            AppState.get('colors')[this.sourceId] =
                AppState.get('colors')[this.sourceId].withRgb(newRgb);
            AppState.update({ colors: AppState.get('colors') });
        }

        if (this.element) {
            this.element.setAttribute('aria-valuenow', `${hsl.h.toFixed(0)}°`);
        }
    }

    getCurrentColor() {
        const colors = AppState.get('colors');
        if (colors && colors[this.sourceId]) {
            return colors[this.sourceId].rgb;
        }
        return null;
    }

    rgbToHsl(r, g, b) {
        return ColorConverter.rgbToHsl(r, g, b);
    }

    hslToRgb(h, s, l) {
        return ColorConverter.hslToRgb(h, s, l);
    }
}

const colorBoxDrag = new ColorBoxDrag();

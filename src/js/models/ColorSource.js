class ColorSource {
    constructor(id, rgb) {
        if (!['primary', 'blend'].includes(id)) {
            throw new Error(`Invalid source ID: ${id}. Must be 'primary' or 'blend'.`);
        }

        if (
            !rgb ||
            typeof rgb.r !== 'number' ||
            typeof rgb.g !== 'number' ||
            typeof rgb.b !== 'number'
        ) {
            throw new Error('Invalid RGB object. Expected {r, g, b} with numeric values.');
        }

        this.id = id;
        this._rgb = {
            r: Math.max(0, Math.min(255, rgb.r)),
            g: Math.max(0, Math.min(255, rgb.g)),
            b: Math.max(0, Math.min(255, rgb.b)),
        };
    }

    get rgb() {
        return { ...this._rgb };
    }

    get hexValue() {
        return ColorConverter.rgbToHex(this._rgb.r, this._rgb.g, this._rgb.b);
    }

    get hsl() {
        return ColorConverter.rgbToHsl(this._rgb.r, this._rgb.g, this._rgb.b);
    }

    getDisplayColor() {
        return `rgb(${this._rgb.r}, ${this._rgb.g}, ${this._rgb.b})`;
    }

    withRgb(rgb) {
        return new ColorSource(this.id, rgb);
    }

    withHsl(hsl) {
        const rgb = ColorConverter.hslToRgb(hsl.h, hsl.s, hsl.l);
        return new ColorSource(this.id, rgb);
    }

    withHex(hex) {
        const rgb = ColorConverter.hexToRgb(hex);
        if (!rgb) return null;
        return new ColorSource(this.id, rgb);
    }

    equals(other) {
        if (!(other instanceof ColorSource)) return false;
        return (
            this._rgb.r === other._rgb.r &&
            this._rgb.g === other._rgb.g &&
            this._rgb.b === other._rgb.b
        );
    }

    toString() {
        return `ColorSource(${this.id}: ${this.hexValue})`;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ColorSource;
}

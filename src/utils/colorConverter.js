const ColorConverter = (() => {
    const rgbToHsl = (r, g, b) => {
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h,
            s,
            l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r:
                    h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
                    break;
                case g:
                    h = ((b - r) / d + 2) / 6;
                    break;
                case b:
                    h = ((r - g) / d + 4) / 6;
                    break;
            }
        }

        return {
            h: Math.round(h * 360 * 10) / 10,
            s: Math.round(s * 100 * 10) / 10,
            l: Math.round(l * 100 * 10) / 10,
        };
    };

    const hslToRgb = (h, s, l) => {
        h = h / 360;
        s = s / 100;
        l = l / 100;

        let r, g, b;

        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        if (s === 0) {
            r = g = b = l;
        } else {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255),
        };
    };

    const rgbToHex = (r, g, b) => {
        return `#${[r, g, b]
            .map((x) => {
                const hex = x.toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            })
            .join('')
            .toUpperCase()}`;
    };

    const hexToRgb = (hex) => {
        let cleanHex = hex.replace(/^#/, '').toUpperCase();

        if (cleanHex.length === 3) {
            cleanHex = cleanHex
                .split('')
                .map((char) => char + char)
                .join('');
        }

        if (!/^[0-9A-F]{6}$/.test(cleanHex)) {
            console.warn(`Invalid hex color: ${hex}`);
            return null;
        }

        return {
            r: parseInt(cleanHex.substr(0, 2), 16),
            g: parseInt(cleanHex.substr(2, 2), 16),
            b: parseInt(cleanHex.substr(4, 2), 16),
        };
    };

    return {
        rgbToHsl,
        hslToRgb,
        rgbToHex,
        hexToRgb,
    };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ColorConverter;
}

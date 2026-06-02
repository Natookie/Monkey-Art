const HSLColor = {
    rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s;
        const l = (max + min) / 2;

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
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100),
        };
    },

    hslToRgb(h, s, l) {
        h = (h % 360) / 360;
        s = Math.max(0, Math.min(100, s)) / 100;
        l = Math.max(0, Math.min(100, l)) / 100;

        let r, g, b;

        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };

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
    },

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!result) {
            throw new Error(`Invalid hex color: ${hex}`);
        }
        return {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        };
    },

    rgbToHex(r, g, b) {
        const toHex = (n) => {
            const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toLowerCase();
    },

    hexToHsl(hex) {
        const rgb = this.hexToRgb(hex);
        return this.rgbToHsl(rgb.r, rgb.g, rgb.b);
    },

    hslToHex(h, s, l) {
        const rgb = this.hslToRgb(h, s, l);
        return this.rgbToHex(rgb.r, rgb.g, rgb.b);
    },

    fromHex(hex) {
        const cleanHex = hex.toLowerCase().startsWith('#')
            ? hex.toLowerCase()
            : `#${hex.toLowerCase()}`;

        if (!/^#[0-9a-f]{6}$/.test(cleanHex)) {
            throw new Error(`Invalid hex color: ${hex}`);
        }

        const rgb = this.hexToRgb(cleanHex);
        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);

        return {
            hex: cleanHex,
            r: rgb.r,
            g: rgb.g,
            b: rgb.b,
            h: hsl.h,
            s: hsl.s,
            l: hsl.l,
        };
    },

    fromHsl(h, s, l) {
        const h_clamped = Math.max(0, Math.min(360, h));
        const s_clamped = Math.max(0, Math.min(100, s));
        const l_clamped = Math.max(0, Math.min(100, l));

        const rgb = this.hslToRgb(h_clamped, s_clamped, l_clamped);
        const hex = this.rgbToHex(rgb.r, rgb.g, rgb.b);

        return {
            hex,
            r: rgb.r,
            g: rgb.g,
            b: rgb.b,
            h: h_clamped,
            s: s_clamped,
            l: l_clamped,
        };
    },

    isValidHex(hex) {
        return /^#?[0-9a-f]{6}$/i.test(hex);
    },

    isValidHsl(h, s, l) {
        return h >= 0 && h <= 360 && s >= 0 && s <= 100 && l >= 0 && l <= 100;
    },
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = HSLColor;
}

const PaletteService = {
    generatePalette(hex) {
        const validation_result = validation.validateHex(hex);
        if (!validation_result.isValid) {
            throw new Error(validation_result.error);
        }

        const hsl = validation.hexToHsl(hex);
        if (!hsl) {
            throw new Error('Failed to convert hex to HSL');
        }

        const colors = [
            {
                h: hsl.h,
                s: hsl.s,
                l: hsl.l,
                name: 'Primary',
            },
            {
                h: (hsl.h + 180) % 360,
                s: hsl.s,
                l: hsl.l,
                name: 'Opposite',
            },
            {
                h: (hsl.h + 150) % 360,
                s: Math.min(hsl.s + 10, 100),
                l: hsl.l,
                name: 'Near-Opposite 1',
            },
            {
                h: (hsl.h + 210) % 360,
                s: Math.min(hsl.s + 10, 100),
                l: hsl.l,
                name: 'Near-Opposite 2',
            },
            {
                h: (hsl.h + 60) % 360,
                s: Math.max(hsl.s - 15, 30),
                l: Math.max(hsl.l + 10, 80),
                name: 'Accent',
            },
        ];

        const hexColors = colors.map((color) => validation.hslToHex(color.h, color.s, color.l));

        return hexColors;
    },

    generateShades(hex) {
        const validation_result = validation.validateHex(hex);
        if (!validation_result.isValid) {
            throw new Error(validation_result.error);
        }

        const hsl = validation.hexToHsl(hex);
        if (!hsl) {
            throw new Error('Failed to convert hex to HSL');
        }

        const shades = [
            { l: 80, label: 'Lighter' },
            { l: hsl.l, label: 'Original' },
            { l: Math.max(hsl.l - 30, 20), label: 'Dark 1' },
            { l: Math.max(hsl.l - 50, 10), label: 'Dark 2' },
            { l: Math.max(hsl.l - 70, 5), label: 'Dark 3' },
        ];

        const hexShades = shades.map((shade) => validation.hslToHex(hsl.h, hsl.s, shade.l));

        return hexShades;
    },

    validatePalette(palette) {
        if (!Array.isArray(palette)) return false;
        return palette.every((hex) => validation.validateHex(hex).isValid);
    },

    getBrightness(hex) {
        const rgb = validation.hexToRgb(hex);
        if (!rgb) return 128;

        return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    },

    getTextColorForBackground(hex) {
        const brightness = this.getBrightness(hex);
        return brightness > 150 ? '#000000' : '#FFFFFF';
    },
};

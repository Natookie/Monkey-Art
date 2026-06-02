const ShadeCalculator = (() => {
    let useHueShift = true;
    let useSkyColor = false;
    let skyColor = '#87CEEB';

    const SHADE_STEPS = {
        dark: [10, 20, 30, 40],
        light: [10, 20, 30, 40],
    };

    const HUE_SHIFT = {
        dark: 5,
        light: -5,
    };

    const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
            ? {
                  r: parseInt(result[1], 16),
                  g: parseInt(result[2], 16),
                  b: parseInt(result[3], 16),
              }
            : null;
    };

    const rgbToHex = (r, g, b) => {
        const toHex = (x) => {
            const hex = Math.round(Math.max(0, Math.min(255, x))).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        return '#' + toHex(r) + toHex(g) + toHex(b);
    };

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
        return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
    };

    const hslToRgb = (h, s, l) => {
        h /= 360;
        s /= 100;
        l /= 100;
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
        return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
    };

    const blendColors = (baseRgb, skyRgb, intensity = 0.3) => {
        return {
            r: baseRgb.r * (1 - intensity) + skyRgb.r * intensity,
            g: baseRgb.g * (1 - intensity) + skyRgb.g * intensity,
            b: baseRgb.b * (1 - intensity) + skyRgb.b * intensity,
        };
    };

    const generateShade = (baseHsl, step, isDark, skyRgb = null) => {
        let newHue = baseHsl.h;
        let newSat = baseHsl.s;
        let newLight = isDark ? Math.max(5, baseHsl.l - step) : Math.min(95, baseHsl.l + step);

        if (useHueShift) {
            if (isDark) {
                const shiftAmount = HUE_SHIFT.dark * (step / 20);
                newHue = (baseHsl.h + shiftAmount) % 360;
            } else {
                const shiftAmount = HUE_SHIFT.light * (step / 20);
                newHue = (baseHsl.h + shiftAmount + 360) % 360;
            }
        }

        if (isDark) {
            newSat = Math.min(95, baseHsl.s + step / 2);
        } else {
            newSat = Math.max(50, baseHsl.s - step / 3);
        }

        let rgb = hslToRgb(newHue, newSat, newLight);

        if (useSkyColor && skyRgb) {
            const maxIntensity = 0.35;
            const intensity = (step / 40) * maxIntensity;
            rgb = blendColors(rgb, skyRgb, intensity);
        }

        return rgbToHex(rgb.r, rgb.g, rgb.b);
    };

    const generateShades = (hex) => {
        const rgb = hexToRgb(hex);
        if (!rgb) {
            console.error('Invalid hex color:', hex);
            return [];
        }

        const baseHsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        const skyRgb = useSkyColor ? hexToRgb(skyColor) : null;
        const shades = [];

        shades.push(hex);

        for (const step of SHADE_STEPS.dark) {
            const darkShade = generateShade(baseHsl, step, true, skyRgb);
            shades.push(darkShade);
        }

        for (const step of SHADE_STEPS.light) {
            const lightShade = generateShade(baseHsl, step, false, skyRgb);
            shades.push(lightShade);
        }

        return shades;
    };

    return {
        generateShades,
        setUseHueShift: (value) => {
            useHueShift = value;
        },
        setUseSkyColor: (value) => {
            useSkyColor = value;
        },
        setSkyColor: (value) => {
            skyColor = value;
        },
        getConfig: () => ({ useHueShift, useSkyColor, skyColor }),
    };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ShadeCalculator;
}

const DiagnosticReport = (() => {
    const report = {
        timestamp: new Date().toISOString(),
        initialized: false,
        errors: [],
        warnings: [],
        checks: {},
    };

    return {
        check: (name, fn) => {
            try {
                const result = fn();
                report.checks[name] = {
                    status: result ? 'PASS' : 'FAIL',
                    result: result,
                };
                if (!result) {
                    report.warnings.push(`${name}: Check failed`);
                }
                return result;
            } catch (error) {
                report.checks[name] = {
                    status: 'ERROR',
                    error: error.message,
                };
                report.errors.push(`${name}: ${error.message}`);
                return false;
            }
        },

        print: () => {
            console.log('=== DIAGNOSTIC REPORT ===');
            console.log('Timestamp:', report.timestamp);
            console.log('\n=== CHECKS ===');
            Object.entries(report.checks).forEach(([name, result]) => {
                const icon =
                    result.status === 'PASS' ? '✅' : result.status === 'ERROR' ? '❌' : '⚠️';
                console.log(`${icon} ${name}: ${result.status}`);
                if (result.error) console.log(`   Error: ${result.error}`);
            });

            if (report.errors.length > 0) {
                console.log('\n=== ERRORS ===');
                report.errors.forEach((e) => console.log('❌', e));
            }

            if (report.warnings.length > 0) {
                console.log('\n=== WARNINGS ===');
                report.warnings.forEach((w) => console.log('⚠️', w));
            }

            console.log('\n=== Summary ===');
            console.log(`Errors: ${report.errors.length}`);
            console.log(`Warnings: ${report.warnings.length}`);
        },
    };
})();

console.log('Starting Phase 3 Diagnostics...\n');

DiagnosticReport.check('ColorConverter defined', () => typeof ColorConverter !== 'undefined');
DiagnosticReport.check(
    'ColorConverter.rgbToHsl',
    () => typeof ColorConverter.rgbToHsl === 'function',
);
DiagnosticReport.check(
    'ColorConverter.hslToRgb',
    () => typeof ColorConverter.hslToRgb === 'function',
);
DiagnosticReport.check(
    'ColorConverter.rgbToHex',
    () => typeof ColorConverter.rgbToHex === 'function',
);
DiagnosticReport.check(
    'ColorConverter.hexToRgb',
    () => typeof ColorConverter.hexToRgb === 'function',
);

DiagnosticReport.check('ColorSource defined', () => typeof ColorSource !== 'undefined');
DiagnosticReport.check('ColorBoxDrag defined', () => typeof ColorBoxDrag !== 'undefined');
DiagnosticReport.check('AppState defined', () => typeof AppState !== 'undefined');
DiagnosticReport.check('ClipboardService defined', () => typeof ClipboardService !== 'undefined');

DiagnosticReport.check('AppState.get exists', () => typeof AppState.get === 'function');
DiagnosticReport.check('AppState.update exists', () => typeof AppState.update === 'function');
DiagnosticReport.check('AppState.startDrag exists', () => typeof AppState.startDrag === 'function');
DiagnosticReport.check('AppState.endDrag exists', () => typeof AppState.endDrag === 'function');

DiagnosticReport.check(
    'Primary color box exists',
    () => document.querySelector('.color-box--primary') !== null,
);
DiagnosticReport.check(
    'Blend color box exists',
    () => document.querySelector('.color-box--blend') !== null,
);
DiagnosticReport.check(
    'Tools content div exists',
    () => document.getElementById('toolsContent') !== null,
);
DiagnosticReport.check(
    'Explore content div exists',
    () => document.getElementById('exploreContent') !== null,
);
DiagnosticReport.check(
    'Blend toggle exists',
    () => document.getElementById('blendToggle') !== null,
);
DiagnosticReport.check(
    'Primary input exists',
    () => document.getElementById('primaryColorInput') !== null,
);
DiagnosticReport.check(
    'Secondary color group exists',
    () => document.getElementById('secondaryColorGroup') !== null,
);

DiagnosticReport.check('RGB to Hex works', () => {
    const hex = ColorConverter.rgbToHex(255, 0, 0);
    return hex === '#FF0000';
});

DiagnosticReport.check('Hex to RGB works', () => {
    const rgb = ColorConverter.hexToRgb('#FF0000');
    return rgb && rgb.r === 255 && rgb.g === 0 && rgb.b === 0;
});

DiagnosticReport.check('RGB to HSL works', () => {
    const hsl = ColorConverter.rgbToHsl(255, 0, 0);
    return hsl && hsl.h >= 0 && hsl.h <= 360;
});

DiagnosticReport.check('HSL to RGB round-trip', () => {
    const rgb1 = { r: 255, g: 0, b: 0 };
    const hsl = ColorConverter.rgbToHsl(rgb1.r, rgb1.g, rgb1.b);
    const rgb2 = ColorConverter.hslToRgb(hsl.h, hsl.s, hsl.l);
    return (
        Math.abs(rgb2.r - rgb1.r) <= 1 &&
        Math.abs(rgb2.g - rgb1.g) <= 1 &&
        Math.abs(rgb2.b - rgb1.b) <= 1
    );
});

DiagnosticReport.check('AppState has colors', () => {
    const state = AppState.getState
        ? AppState.getState()
        : AppState.get
          ? AppState.get('colors')
          : null;
    return state && typeof state === 'object';
});

DiagnosticReport.check('Color box has width', () => {
    const box = document.querySelector('.color-box--primary');
    return box && box.offsetWidth > 0;
});

DiagnosticReport.check('Color box has height', () => {
    const box = document.querySelector('.color-box--primary');
    return box && box.offsetHeight > 0;
});

DiagnosticReport.check(
    'ColorBox component initialized',
    () => typeof ColorBox !== 'undefined' && ColorBox.init,
);
DiagnosticReport.check(
    'ModeToggle component initialized',
    () => typeof ModeToggle !== 'undefined' && ModeToggle.init,
);
DiagnosticReport.check(
    'BlendToggle component initialized',
    () => typeof BlendToggle !== 'undefined' && BlendToggle.init,
);

DiagnosticReport.print();

window.DiagnosticReport = DiagnosticReport;

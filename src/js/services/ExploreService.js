const ExploreService = {
    getRandomPalette() {
        if (
            typeof paletteLibrary !== 'undefined' &&
            Array.isArray(paletteLibrary) &&
            paletteLibrary.length > 0
        ) {
            const randomIndex = Math.floor(Math.random() * paletteLibrary.length);
            const palette = { ...paletteLibrary[randomIndex] };
            palette.source = 'explore';
            palette.timestamp = Date.now();
            return palette;
        }

        console.warn('Palette library not available, using fallback');
        const fallbackPalettes = [
            {
                name: 'Ocean Breeze',
                colors: ['#0066CC', '#00A4CC', '#00B8CC', '#58C4DC', '#A8DADC'],
            },
            {
                name: 'Sunset Blaze',
                colors: ['#FF6B35', '#F45E61', '#FF85A2', '#E94B3C', '#A23B72'],
            },
            {
                name: 'Forest Walk',
                colors: ['#1B4332', '#2D6A4F', '#40916C', '#52B788', '#74C69D'],
            },
        ];
        const randomIndex = Math.floor(Math.random() * fallbackPalettes.length);
        return { ...fallbackPalettes[randomIndex], source: 'explore', timestamp: Date.now() };
    },

    getPaletteCount() {
        if (typeof paletteLibrary !== 'undefined') {
            return paletteLibrary.length;
        }
        return 0;
    },
};

if (typeof window !== 'undefined') {
    window.ExploreService = ExploreService;
}

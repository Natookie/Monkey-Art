const ExploreService = {
    getAllPalettes() {
        if (typeof paletteLibrary !== 'undefined' && Array.isArray(paletteLibrary)) {
            return paletteLibrary;
        }
        return [];
    },

    getRandomPalette() {
        const palettes = this.getAllPalettes();
        if (palettes.length > 0) {
            const randomIndex = Math.floor(Math.random() * palettes.length);
            const palette = { ...palettes[randomIndex] };
            palette.source = 'explore';
            palette.timestamp = Date.now();
            return palette;
        }

        console.warn('Palette library not available, using fallback');
        const fallbackPalettes = [
            { name: 'Ocean Breeze', colors: ['#0066CC', '#00A4CC', '#00B8CC', '#58C4DC', '#A8DADC'], category: 'cool', tags: ['ocean', 'blue'] },
            { name: 'Sunset Blaze', colors: ['#FF6B35', '#F45E61', '#FF85A2', '#E94B3C', '#A23B72'], category: 'warm', tags: ['sunset', 'vibrant'] },
            { name: 'Forest Walk', colors: ['#1B4332', '#2D6A4F', '#40916C', '#52B788', '#74C69D'], category: 'nature', tags: ['forest', 'green'] },
        ];
        const randomIndex = Math.floor(Math.random() * fallbackPalettes.length);
        return { ...fallbackPalettes[randomIndex], source: 'explore', timestamp: Date.now() };
    },

    getRandomFilteredPalette(searchQuery, category, tag) {
        let results = this.getAllPalettes();
        
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase().trim();
            results = results.filter(palette => 
                palette.name.toLowerCase().includes(lowerQuery) ||
                (palette.category && palette.category.toLowerCase().includes(lowerQuery)) ||
                (palette.tags && palette.tags.some(t => t.toLowerCase().includes(lowerQuery)))
            );
        }
        
        if (category && category !== 'all') {
            results = results.filter(palette => palette.category === category);
        }
        
        if (tag && tag !== 'all') {
            results = results.filter(palette => palette.tags && palette.tags.includes(tag));
        }
        
        if (results.length === 0) return null;
        
        const randomIndex = Math.floor(Math.random() * results.length);
        return { ...results[randomIndex], source: 'explore', timestamp: Date.now() };
    },

    getFilteredPalettes(searchQuery, category, tag) {
        let results = this.getAllPalettes();
        
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase().trim();
            results = results.filter(palette => 
                palette.name.toLowerCase().includes(lowerQuery) ||
                (palette.category && palette.category.toLowerCase().includes(lowerQuery)) ||
                (palette.tags && palette.tags.some(t => t.toLowerCase().includes(lowerQuery)))
            );
        }
        
        if (category && category !== 'all') {
            results = results.filter(palette => palette.category === category);
        }
        
        if (tag && tag !== 'all') {
            results = results.filter(palette => palette.tags && palette.tags.includes(tag));
        }
        
        return results;
    },

    getPaletteCount() {
        return this.getAllPalettes().length;
    },

    getCategories() {
        const palettes = this.getAllPalettes();
        const categories = new Set();
        palettes.forEach(palette => {
            if (palette.category) categories.add(palette.category);
        });
        return Array.from(categories).sort();
    },

    getAllTags() {
        const palettes = this.getAllPalettes();
        const tags = new Set();
        palettes.forEach(palette => {
            if (palette.tags && Array.isArray(palette.tags)) {
                palette.tags.forEach(tag => tags.add(tag));
            }
        });
        return Array.from(tags).sort();
    },

    searchPalettes(query) {
        return this.getFilteredPalettes(query, null, null);
    },

    filterByCategory(category) {
        return this.getFilteredPalettes(null, category, null);
    },

    filterByTag(tag) {
        return this.getFilteredPalettes(null, null, tag);
    },

    getPalettesByCategory(category) {
        return this.filterByCategory(category);
    },

    getPalettesByTag(tag) {
        return this.filterByTag(tag);
    }
};

if (typeof window !== 'undefined') {
    window.ExploreService = ExploreService;
}
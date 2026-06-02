class ColorClassLibrary {
    constructor(options = {}) {
        this.id = options.id || `color-class-library-${Math.random().toString(36).substr(2, 9)}`;
        this.onUsePalette = options.onUsePalette || null;

        this.collapsedCategories = {
            fundamentals: false,
            gameRules: false,
            techniques: false,
            harmonies: false,
            advanced: false,
        };

        this.categories = [
            {
                id: 'fundamentals',
                name: 'Color Fundamentals',
                icon: '🎨',
                topics: [
                    {
                        title: 'Value (Lightness)',
                        description:
                            'How light or dark a color is. The most important element for shading.',
                        colors: ['#1a1a1a', '#4a4a4a', '#808080', '#b3b3b3', '#e6e6e6'],
                        tips: [
                            'Use 4-5 values max per color in pixel art',
                            'More values = smooth gradients (larger sprites)',
                            'Fewer values = chunky retro look (16x16 sprites)',
                            "The 'squint test': Squint to see values clearly",
                            'Value is more important than color - design in grayscale first',
                        ],
                        example: '32x32 character: 3-4 values per color is ideal',
                    },
                    {
                        title: 'Hue Shifting',
                        description:
                            'Instead of adding black for shadows, shift the hue toward purple/blue.',
                        colors: ['#FF6B35', '#D9482A', '#8B3A2A', '#4A2A2A', '#2A1A1A'],
                        tips: [
                            'Shadow = shift hue toward purple/blue',
                            'Highlight = shift hue toward yellow/warm',
                            'Never shade with just black! It kills vibrancy',
                            'The amount of hue shift depends on your style',
                            'Compare: #FF0000 (red) → #9900FF (purple shadow) looks alive',
                        ],
                        example:
                            'Skin tones: Base peach → Shadow with purple tint → Highlight with yellow tint',
                    },
                    {
                        title: 'Color Temperature',
                        description:
                            'Colors feel warm (red/yellow) or cool (blue/purple). Use temperature for depth.',
                        colors: ['#FF6B35', '#FF9F4A', '#FFD166', '#06D6A0', '#118AB2'],
                        tips: [
                            'Warm colors = foreground, light sources, characters',
                            'Cool colors = background, shadows, water, sky',
                            'Warm light + Cool shadows = Dynamic contrast',
                            'Cool light + Warm shadows = Dreamy, atmospheric',
                            'Desaturated backgrounds make characters pop',
                        ],
                        example: 'Campfire scene: Warm orange fire, cool blue night background',
                    },
                ],
            },
            {
                id: 'gameRules',
                name: 'Game Asset Rules',
                icon: '🎮',
                topics: [
                    {
                        title: 'Player Character Priority',
                        description: 'The player must be instantly recognizable and easy to track.',
                        colors: ['#FFD700', '#FF8C00', '#FF4500', '#FF0000', '#CC0000'],
                        tips: [
                            'Highest contrast on the screen',
                            'Use bright, saturated colors (gold, cyan, magenta)',
                            'Avoid using similar colors for enemies',
                            'Add a subtle glow or outline for clarity',
                            'Test player visibility on all background types',
                        ],
                        example: 'Link (green tunic) works because enemies are different colors',
                    },
                    {
                        title: 'Enemy Design',
                        description: 'Enemies should be visible but not distract from the player.',
                        colors: ['#8B0000', '#A52A2A', '#CD5C5C', '#DC143C', '#B22222'],
                        tips: [
                            'Medium contrast - noticeable but not overwhelming',
                            'Use complementary colors to player for contrast',
                            'Distinct silhouettes matter more than colors',
                            'Red/purple tones work well for enemies',
                            'Avoid pure white/bright yellow (reserved for player/items)',
                        ],
                        example: 'Classic Mario: Mario is red/blue, Goombas are brown',
                    },
                    {
                        title: 'Collectibles & UI',
                        description: 'Items and UI need high visibility and clear readability.',
                        colors: ['#FFD700', '#00FF00', '#00CED1', '#FF69B4', '#FFFFFF'],
                        tips: [
                            'Use bright, saturated colors (gold, cyan, bright green)',
                            'Add animation or pulsing effects',
                            'UI text must have 4.5:1 contrast ratio minimum',
                            'Important UI elements (health) use warm colors',
                            'Secondary UI (inventory) use cooler colors',
                        ],
                        example: 'Super Mario coins: Bright gold with pulsing animation',
                    },
                    {
                        title: 'Background Design',
                        description: 'Backgrounds should support gameplay without overwhelming it.',
                        colors: ['#2B2B2B', '#3A4A3A', '#4A5A4A', '#5A6A5A', '#6A7A6A'],
                        tips: [
                            'Lower contrast than foreground elements',
                            'Use cooler, desaturated colors',
                            'Parallax layers should have different value ranges',
                            'Avoid pure black or pure white in backgrounds',
                            'Test player visibility on all background tiles',
                        ],
                        example: 'Celeste: Desaturated blues/purples for backgrounds',
                    },
                ],
            },
            {
                id: 'techniques',
                name: 'Pixel Art Techniques',
                icon: '🖼️',
                topics: [
                    {
                        title: 'Anti-Aliasing (AA)',
                        description: 'Smoothing jagged edges by adding transitional colors.',
                        colors: ['#FF0000', '#FF6B6B', '#FFB3B3', '#FFE6E6', '#FFFFFF'],
                        tips: [
                            'Use 50% blend colors for transitions',
                            'AA is optional - some styles prefer chunky pixels',
                            'Best used on curved surfaces',
                            "Don't over-AA, it can make things look blurry",
                            'For 16x16 sprites, manual AA is usually too subtle',
                        ],
                        example: 'Diagonal line: Main color → 50% blend → background color',
                    },
                    {
                        title: 'Subsurface Scattering',
                        description: 'Light passing through thin surfaces (skin, leaves, wax).',
                        colors: ['#FFD1DC', '#FFA6C9', '#FF7BA7', '#E884B8', '#C96BA0'],
                        tips: [
                            'Light side = warm base color',
                            'Dark side = reddish/purple tint (not black!)',
                            'Most visible in ears, fingers, leaves',
                            'Creates organic, living feel',
                            'Essential for glowing effects (candles, magic)',
                        ],
                        example: 'Character ear: Orange base → Dark side with purple tint',
                    },
                    {
                        title: 'Material Rendering',
                        description: 'Different materials reflect light differently.',
                        colors: ['#C0C0C0', '#A9A9A9', '#808080', '#696969', '#4A4A4A'],
                        tips: [
                            'Metal: High contrast, sharp highlights, blue/gray tint',
                            'Wood: Low saturation browns, subtle grain lines',
                            'Stone: Grays with green/blue hints, rough texture',
                            'Fabric: Soft shading, less contrast than metal',
                            'Water: Gradient bands, highlights on wave tops',
                        ],
                        example: 'Sword blade: White highlight → Gray base → Dark gray edge shadow',
                    },
                    {
                        title: 'Glow & Light Effects',
                        description: 'Creating emissive light sources and glow effects.',
                        colors: ['#FFFF00', '#FFD700', '#FFA500', '#FF8C00', '#FF4500'],
                        tips: [
                            'Use gradient of same hue, increasing in value',
                            'Glow should extend 2-4 pixels around source',
                            'Add slight color tint to nearby surfaces',
                            'Use blend modes if available',
                            'Animate glow with value pulsation',
                        ],
                        example: 'Torch: Bright yellow center → Orange glow → Red edge',
                    },
                ],
            },
            {
                id: 'harmonies',
                name: 'Color Harmonies',
                icon: '🌈',
                topics: [
                    {
                        title: 'Complementary Colors',
                        description: 'Colors opposite on the color wheel (red/green, blue/orange).',
                        colors: ['#FF0000', '#FF6347', '#FFA500', '#00FF00', '#008000'],
                        tips: [
                            'Creates high energy and strong contrast',
                            'Use for player vs enemy distinction',
                            '60/30/10 rule: 60% dominant, 30% secondary, 10% accent',
                            'Be careful - too much can cause eye strain',
                            'Great for UI buttons and important elements',
                        ],
                        example: 'Red enemy on green grass instantly pops',
                    },
                    {
                        title: 'Analogous Colors',
                        description: 'Colors next to each other on the color wheel.',
                        colors: ['#FF6B35', '#FF9F4A', '#FFD166', '#FFFF99', '#FFFFCC'],
                        tips: [
                            'Creates harmony and calm feeling',
                            'Perfect for nature scenes and peaceful areas',
                            'Choose one dominant color as base',
                            'Great for backgrounds and environments',
                            'Lower contrast than complementary',
                        ],
                        example: 'Forest level: Greens → Yellow-greens → Yellow',
                    },
                    {
                        title: 'Triadic Colors',
                        description: 'Three evenly spaced colors on the color wheel.',
                        colors: ['#FF0000', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF'],
                        tips: [
                            'Balanced and vibrant',
                            'Use one as dominant, two as accents',
                            'Great for colorful, playful games',
                            'Reduce saturation for more mature themes',
                            'Harder to balance than other harmonies',
                        ],
                        example: 'Super Mario: Red (Mario), Yellow (coins), Blue (overalls)',
                    },
                    {
                        title: 'Monochromatic',
                        description: 'Single hue with varying values and saturations.',
                        colors: ['#003366', '#004080', '#0066CC', '#3399FF', '#66CCFF'],
                        tips: [
                            'Very cohesive and unified look',
                            'Great for horror or atmospheric games',
                            'Use value changes for all contrast',
                            'Add small accent color for interest',
                            'Excellent for indoor/dungeon levels',
                        ],
                        example: 'Limbo: Entirely grayscale monochromatic',
                    },
                ],
            },
            {
                id: 'advanced',
                name: 'Advanced Concepts',
                icon: '📐',
                topics: [
                    {
                        title: 'Atmospheric Perspective',
                        description:
                            'Objects farther away appear cooler, lighter, and less detailed.',
                        colors: ['#8B4513', '#7B5B3A', '#6B7050', '#5A8570', '#4A9A90'],
                        tips: [
                            'Background: Lower contrast, cooler hues (blue/green)',
                            'Midground: Medium contrast, neutral hues',
                            'Foreground: High contrast, warmer hues',
                            'Add mist/dust between layers for depth',
                            'Desaturate distant objects',
                        ],
                        example:
                            'Mountain scene: Foreground warm green → Midground blue-green → Background light blue',
                    },
                    {
                        title: 'Limited Palettes',
                        description: 'Restricting your total color count for cohesive style.',
                        colors: ['#FFFFFF', '#A9A9A9', '#4A4A4A', '#FFD700', '#000000'],
                        tips: [
                            'GameBoy: 4 colors max',
                            'SNES: 16 colors per sprite, 256 total',
                            'Modern pixel art: 32-64 colors total',
                            'Limited palettes force creative decisions',
                            'Easier to maintain consistency',
                        ],
                        example: 'Pokémon Gold/Silver: Masterful use of limited GBC palette',
                    },
                    {
                        title: 'Dithering',
                        description: 'Creating gradients and textures with pixel patterns.',
                        colors: ['#FF0000', '#FF6666', '#FFAAAA', '#FFDDDD', '#FFFFFF'],
                        tips: [
                            'Checkerboard pattern blends two colors',
                            'Great for retro texture effects',
                            'Use sparingly in modern pixel art',
                            'Different patterns create different textures',
                            "Adds 'noise' and grit to surfaces",
                        ],
                        example:
                            'Sky gradient: Red → checkered blend → orange → checkered → yellow',
                    },
                ],
            },
        ];

        this.createElements();
    }

    createElements() {
        this.container = document.createElement('div');
        this.container.className = 'color-class-library';
        this.container.id = this.id;

        this.categoriesContainer = document.createElement('div');
        this.categoriesContainer.className = 'color-categories-container';
        this.container.appendChild(this.categoriesContainer);

        this.render();
    }

    scrollToCategory(categoryId) {
        const categoryElement = this.categoriesContainer.querySelector(
            `.color-category[data-category-id="${categoryId}"]`,
        );
        if (categoryElement) {
            const headerOffset = 80;
            const elementPosition = categoryElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
            });
        }
    }

    toggleCategory(categoryId) {
        this.collapsedCategories[categoryId] = !this.collapsedCategories[categoryId];

        const categoryDiv = this.categoriesContainer.querySelector(
            `.color-category[data-category-id="${categoryId}"]`,
        );
        if (categoryDiv) {
            if (this.collapsedCategories[categoryId]) {
                categoryDiv.classList.add('collapsed');
            } else {
                categoryDiv.classList.remove('collapsed');
                setTimeout(() => {
                    this.scrollToCategory(categoryId);
                }, 100);
            }
        }

        localStorage.setItem('color_class_collapsed', JSON.stringify(this.collapsedCategories));
    }

    render() {
        this.categoriesContainer.innerHTML = '';

        const saved = localStorage.getItem('color_class_collapsed');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                Object.assign(this.collapsedCategories, parsed);
            } catch (e) {}
        }

        this.categories.forEach((category) => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = `color-category ${this.collapsedCategories[category.id] ? 'collapsed' : ''}`;
            categoryDiv.setAttribute('data-category-id', category.id);
            categoryDiv.setAttribute('id', `category-${category.id}`);

            const categoryHeader = document.createElement('div');
            categoryHeader.className = 'color-category-header';
            categoryHeader.innerHTML = `
                <div class="category-header-left">
                    <span class="category-icon">${category.icon}</span>
                    <h3>${category.name}</h3>
                </div>
                <div class="category-toggle">
                    <i class="fas fa-chevron-down"></i>
                </div>
            `;
            categoryHeader.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleCategory(category.id);
            });

            const topicsContainer = document.createElement('div');
            topicsContainer.className = 'color-topics-container';

            category.topics.forEach((topic) => {
                const card = this.createTopicCard(topic);
                topicsContainer.appendChild(card);
            });

            categoryDiv.appendChild(categoryHeader);
            categoryDiv.appendChild(topicsContainer);
            this.categoriesContainer.appendChild(categoryDiv);
        });
    }

    createTopicCard(topic) {
        const card = document.createElement('div');
        card.className = 'color-topic-card';

        const title = document.createElement('h4');
        title.className = 'color-topic-title';
        title.textContent = topic.title;

        const description = document.createElement('p');
        description.className = 'color-topic-description';
        description.textContent = topic.description;

        const preview = document.createElement('div');
        preview.className = 'color-topic-preview';

        topic.colors.forEach((color, index) => {
            const swatch = document.createElement('div');
            swatch.className = 'topic-swatch';
            swatch.style.backgroundColor = color;
            swatch.title = color;

            swatch.addEventListener('click', (e) => {
                e.stopPropagation();
                if (this.onUsePalette) {
                    this.onUsePalette([color]);
                    if (typeof Toast !== 'undefined') {
                        Toast.success(`${color} applied!`, 1500);
                    }
                }
            });

            preview.appendChild(swatch);
        });

        const tips = document.createElement('div');
        tips.className = 'color-topic-tips';
        const tipsTitle = document.createElement('div');
        tipsTitle.className = 'tips-title';
        tipsTitle.innerHTML = '<i class="fas fa-lightbulb"></i> Pro Tips';
        const tipsList = document.createElement('ul');
        topic.tips.forEach((tip) => {
            const li = document.createElement('li');
            li.textContent = tip;
            tipsList.appendChild(li);
        });
        tips.appendChild(tipsTitle);
        tips.appendChild(tipsList);

        const example = document.createElement('div');
        example.className = 'color-topic-example';
        example.innerHTML = `
            <i class="fas fa-pixel-art">🎮</i>
            <span>Example: ${topic.example}</span>
        `;

        card.appendChild(title);
        card.appendChild(description);
        card.appendChild(preview);
        card.appendChild(tips);
        card.appendChild(example);


        return card;
    }

    getElement() {
        return this.container;
    }

    destroy() {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}

if (typeof window !== 'undefined') {
    window.ColorClassLibrary = ColorClassLibrary;
}

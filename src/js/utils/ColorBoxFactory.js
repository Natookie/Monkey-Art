const ColorBoxFactory = {
    createColorBox(hex, options = {}) {
        const container = document.createElement('div');
        container.className = 'color-box-display';
        container.setAttribute('data-hex', hex.toUpperCase());

        const button = document.createElement('button');
        button.className = 'color-box-swatch';
        button.style.backgroundColor = hex;
        button.setAttribute('aria-label', `Copy color ${hex.toUpperCase()}`);
        button.setAttribute('data-color', hex);

        const label = document.createElement('span');
        label.className = 'color-box-label';
        label.textContent = hex.toUpperCase();

        container.appendChild(button);
        container.appendChild(label);

        return container;
    },

    renderMany(container, colors) {
        if (!container || !colors || !Array.isArray(colors)) {
            console.error('ColorBoxFactory.renderMany: Invalid arguments');
            return;
        }

        container.innerHTML = '';

        colors.forEach((color) => {
            const colorBox = this.createColorBox(color);
            container.appendChild(colorBox);
        });
    },

    create(hex, options = {}) {
        return this.createColorBox(hex, options);
    },
};

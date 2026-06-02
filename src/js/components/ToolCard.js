const ToolCard = (() => {
    const init = () => {
        const cards = document.querySelectorAll('.tool-card');

        cards.forEach((card) => {
            if (!card.getAttribute('role')) {
                card.setAttribute('role', 'region');
            }

            card.addEventListener('mouseenter', () => {
                card.classList.add('hover');
            });

            card.addEventListener('mouseleave', () => {
                card.classList.remove('hover');
            });

            card.addEventListener('focusin', () => {
                card.classList.add('focus');
            });

            card.addEventListener('focusout', () => {
                card.classList.remove('focus');
            });
        });
    };

    return {
        init,
    };
})();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ToolCard.init());
} else {
    ToolCard.init();
}

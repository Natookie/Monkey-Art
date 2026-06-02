const ImageUpload = (() => {
    const getSavedPalettesElement = () => {
        return document.getElementById('savedPalettesList');
    };

    const init = () => {
        createUploadUI();

        AppState.subscribe((state) => {});
    };

    const createUploadUI = () => {
        const container = getSavedPalettesElement();
        if (!container) return;

        if (document.getElementById('imageUploadWrapper')) {
            return;
        }

        const wrapper = document.createElement('div');
        wrapper.id = 'imageUploadWrapper';
        wrapper.className = 'image-upload-wrapper';

        const dropZone = document.createElement('div');
        dropZone.id = 'imageDropZone';
        dropZone.className = 'image-drop-zone';
        dropZone.setAttribute('role', 'button');
        dropZone.setAttribute('tabindex', '0');
        dropZone.setAttribute('aria-label', 'Drop image here or click to upload');
        dropZone.innerHTML = `
      <div class="drop-zone-content">
        <i class="fas fa-image" aria-hidden="true"></i>
        <p>Drop image here or <strong>click to upload</strong></p>
        <small>PNG, JPEG (extract colors from image)</small>
      </div>
    `;

        const fileInput = document.createElement('input');
        fileInput.id = 'imageFileInput';
        fileInput.type = 'file';
        fileInput.className = 'hidden';
        fileInput.accept = 'image/png,image/jpeg';
        fileInput.setAttribute('aria-label', 'Choose image file');

        const error = document.createElement('div');
        error.id = 'imageUploadError';
        error.className = 'image-upload-error hidden';
        error.setAttribute('role', 'alert');

        wrapper.appendChild(dropZone);
        wrapper.appendChild(fileInput);
        wrapper.appendChild(error);

        container.appendChild(wrapper);

        dropZone.addEventListener('click', handleDropZoneClick);
        dropZone.addEventListener('dragover', handleDragOver);
        dropZone.addEventListener('dragleave', handleDragLeave);
        dropZone.addEventListener('drop', handleDrop);
        dropZone.addEventListener('keydown', handleDropZoneKeydown);
        fileInput.addEventListener('change', handleFileSelect);
    };

    const handleDropZoneClick = () => {
        document.getElementById('imageFileInput')?.click();
    };

    const handleDropZoneKeydown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleDropZoneClick();
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const dropZone = document.getElementById('imageDropZone');
        if (dropZone) {
            dropZone.classList.add('drag-over');
        }
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const dropZone = document.getElementById('imageDropZone');
        if (dropZone) {
            dropZone.classList.remove('drag-over');
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();

        const dropZone = document.getElementById('imageDropZone');
        if (dropZone) {
            dropZone.classList.remove('drag-over');
        }

        const files = event.dataTransfer?.files;
        if (files && files.length > 0) {
            processFile(files[0]);
        }
    };

    const handleFileSelect = (event) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            processFile(files[0]);
        }
    };

    const processFile = (file) => {
        if (!['image/png', 'image/jpeg'].includes(file.type)) {
            showError('Please upload a PNG or JPEG image');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showError('File size must be less than 5MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                extractColorsFromImage(img, file.name);
            };
            img.onerror = () => {
                showError('Failed to load image');
            };
            img.src = event.target.result;
        };
        reader.onerror = () => {
            showError('Failed to read file');
        };

        reader.readAsDataURL(file);
    };

    const extractColorsFromImage = (img, fileName) => {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = 50;
            canvas.height = 50;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, 50, 50);

            const imageData = ctx.getImageData(0, 0, 50, 50);
            const data = imageData.data;

            const colors = {};
            for (let i = 0; i < data.length; i += 4) {
                const r = Math.round(data[i] / 32) * 32;
                const g = Math.round(data[i + 1] / 32) * 32;
                const b = Math.round(data[i + 2] / 32) * 32;
                const hex = rgbToHex(r, g, b);

                colors[hex] = (colors[hex] || 0) + 1;
            }

            const sortedColors = Object.entries(colors)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([hex]) => hex);

            if (sortedColors.length === 0) {
                showError('Could not extract colors from image');
                return;
            }

            const palette = {
                id: generateId(),
                name: `Image: ${fileName.substring(0, 30)}`,
                colors: sortedColors,
                source: 'image',
                timestamp: new Date().toISOString(),
            };

            const currentState = AppState.getState();
            const updatedPalettes = [...currentState.savedPalettes, palette];
            AppState.update({ savedPalettes: updatedPalettes });

            StorageService.savePalettes(updatedPalettes);

            showSuccess(`Extracted ${sortedColors.length} colors from image`);
        } catch (error) {
            console.error('Error extracting colors:', error);
            showError('Failed to extract colors from image');
        }
    };

    const rgbToHex = (r, g, b) => {
        const toHex = (x) => {
            const hex = Math.round(Math.max(0, Math.min(255, x))).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        return '#' + toHex(r) + toHex(g) + toHex(b);
    };

    const showError = (message) => {
        const errorEl = document.getElementById('imageUploadError');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.remove('hidden');
        }
    };

    const showSuccess = (message) => {
        if (typeof Toast !== 'undefined' && Toast.show) {
            Toast.show(message, 'success');
        }

        const errorEl = document.getElementById('imageUploadError');
        if (errorEl) {
            errorEl.classList.add('hidden');
        }
    };

    const generateId = () => {
        return 'palette_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    };

    return {
        init,
    };
})();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ImageUpload.init());
} else {
    ImageUpload.init();
}

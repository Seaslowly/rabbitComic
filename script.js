class DrawingNotesApp {
    constructor() {
        this.canvas = document.getElementById('drawing-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.notesEditor = document.getElementById('notes-editor');
        
        this.isDrawing = false;
        this.currentTool = 'pen';
        this.brushSize = 3;
        this.brushColor = '#000000';
        
        this.colors = [
            '#000000', '#FFFFFF', '#FF0000', '#00FF00',
            '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
            '#FFA500', '#800080', '#FFC0CB', '#A52A2A',
            '#808080', '#FFD700', '#00CED1', '#FF6347'
        ];
        
        this.lastX = 0;
        this.lastY = 0;
        
        this.autoSaveTimer = null;
        
        this.init();
    }

    init() {
        this.setupCanvas();
        this.createColorPalette();
        this.attachEventListeners();
        this.loadFromLocalStorage();
        this.updateCharWordCount();
    }

    createColorPalette() {
        const palette = document.getElementById('color-palette');
        this.colors.forEach((color, index) => {
            const colorBlock = document.createElement('div');
            colorBlock.className = 'color-block';
            colorBlock.style.backgroundColor = color;
            colorBlock.dataset.color = color;
            
            if (index === 0) {
                colorBlock.classList.add('active');
            }
            
            colorBlock.addEventListener('click', () => {
                this.selectColor(color);
                document.querySelectorAll('.color-block').forEach(block => {
                    block.classList.remove('active');
                });
                colorBlock.classList.add('active');
            });
            
            palette.appendChild(colorBlock);
        });
    }

    selectColor(color) {
        this.brushColor = color;
        if (this.currentTool === 'pen') {
            document.getElementById('tool-select').value = 'pen';
        }
    }

    setupCanvas() {
        const container = this.canvas.parentElement;
        const maxWidth = Math.min(container.clientWidth - 40, 800);
        const maxHeight = Math.min(window.innerHeight * 0.5, 500);
        
        this.canvas.width = maxWidth;
        this.canvas.height = maxHeight;
        
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
    }

    attachEventListeners() {
        document.getElementById('tool-select').addEventListener('change', (e) => {
            this.currentTool = e.target.value;
        });

        const brushSizeInput = document.getElementById('brush-size');
        brushSizeInput.addEventListener('input', (e) => {
            this.brushSize = parseInt(e.target.value);
            document.getElementById('size-value').textContent = this.brushSize;
        });

        document.getElementById('import-image').addEventListener('click', () => {
            document.getElementById('image-input').click();
        });

        document.getElementById('image-input').addEventListener('change', (e) => {
            this.importImage(e);
        });

        document.getElementById('clear-canvas').addEventListener('click', () => {
            this.clearCanvas();
        });

        document.getElementById('save-drawing').addEventListener('click', () => {
            this.saveDrawing();
        });

        document.getElementById('export-drawing').addEventListener('click', () => {
            this.exportDrawing();
        });

        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseout', () => this.stopDrawing());

        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.canvas.dispatchEvent(mouseEvent);
        });

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.canvas.dispatchEvent(mouseEvent);
        });

        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            const mouseEvent = new MouseEvent('mouseup', {});
            this.canvas.dispatchEvent(mouseEvent);
        });

        document.getElementById('save-notes').addEventListener('click', () => {
            this.saveNotes();
        });

        document.getElementById('clear-notes').addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all notes?')) {
                this.notesEditor.value = '';
                this.saveNotes();
                this.updateCharWordCount();
            }
        });

        this.notesEditor.addEventListener('input', () => {
            this.updateCharWordCount();
            this.autoSaveNotes();
        });

        window.addEventListener('resize', () => {
            this.handleResize();
        });

        window.addEventListener('beforeunload', () => {
            this.saveDrawing();
            this.saveNotes();
        });
    }

    getCanvasCoordinates(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    startDrawing(e) {
        this.isDrawing = true;
        const coords = this.getCanvasCoordinates(e);
        this.lastX = coords.x;
        this.lastY = coords.y;
    }

    draw(e) {
        if (!this.isDrawing) return;

        const coords = this.getCanvasCoordinates(e);

        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(coords.x, coords.y);

        if (this.currentTool === 'pen') {
            this.ctx.strokeStyle = this.brushColor;
            this.ctx.lineWidth = this.brushSize;
        } else if (this.currentTool === 'eraser') {
            this.ctx.strokeStyle = '#FFFFFF';
            this.ctx.lineWidth = this.brushSize * 2;
        }

        this.ctx.stroke();

        this.lastX = coords.x;
        this.lastY = coords.y;
    }

    stopDrawing() {
        if (this.isDrawing) {
            this.isDrawing = false;
            this.saveDrawing();
        }
    }

    clearCanvas() {
        if (confirm('Are you sure you want to clear the canvas?')) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.saveDrawing();
        }
    }

    saveDrawing() {
        const drawingData = this.canvas.toDataURL();
        localStorage.setItem('savedDrawing', drawingData);
        this.showIndicator('Drawing saved!');
    }

    loadDrawing() {
        const savedDrawing = localStorage.getItem('savedDrawing');
        if (savedDrawing) {
            const img = new Image();
            img.onload = () => {
                this.ctx.drawImage(img, 0, 0);
            };
            img.src = savedDrawing;
        }
    }

    exportDrawing() {
        const link = document.createElement('a');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        link.download = `drawing-${timestamp}.png`;
        link.href = this.canvas.toDataURL();
        link.click();
        this.showIndicator('Drawing exported!');
    }

    importImage(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'];
        if (!validTypes.includes(file.type)) {
            alert('Please select a valid image file (JPG, PNG, GIF, WebP, or BMP)');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvasWidth = this.canvas.width;
                const canvasHeight = this.canvas.height;
                const imgAspect = img.width / img.height;
                const canvasAspect = canvasWidth / canvasHeight;
                
                let drawWidth, drawHeight, offsetX, offsetY;
                
                if (imgAspect > canvasAspect) {
                    drawWidth = canvasWidth;
                    drawHeight = canvasWidth / imgAspect;
                    offsetX = 0;
                    offsetY = (canvasHeight - drawHeight) / 2;
                } else {
                    drawHeight = canvasHeight;
                    drawWidth = canvasHeight * imgAspect;
                    offsetX = (canvasWidth - drawWidth) / 2;
                    offsetY = 0;
                }
                
                this.ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
                this.saveDrawing();
                this.showIndicator('Image imported!');
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
        
        event.target.value = '';
    }

    saveNotes() {
        const notesContent = this.notesEditor.value;
        if (!notesContent.trim()) {
            alert('Notes are empty. Please write something before saving.');
            return;
        }
        
        const blob = new Blob([notesContent], { type: 'text/plain' });
        const link = document.createElement('a');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        link.download = `notes-${timestamp}.txt`;
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
        
        this.showIndicator('Notes downloaded as TXT!');
    }

    autoSaveNotes() {
        clearTimeout(this.autoSaveTimer);
        this.autoSaveTimer = setTimeout(() => {
            localStorage.setItem('savedNotes', this.notesEditor.value);
        }, 1000);
    }

    loadNotes() {
        const savedNotes = localStorage.getItem('savedNotes');
        if (savedNotes) {
            this.notesEditor.value = savedNotes;
        }
    }

    updateCharWordCount() {
        const text = this.notesEditor.value;
        const charCount = text.length;
        const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;

        document.getElementById('char-count').textContent = `${charCount} characters`;
        document.getElementById('word-count').textContent = `${wordCount} words`;
    }

    showIndicator(message) {
        const indicator = document.getElementById('auto-save-indicator');
        indicator.textContent = message;
        indicator.classList.add('show');

        setTimeout(() => {
            indicator.classList.remove('show');
        }, 2000);
    }

    loadFromLocalStorage() {
        this.loadDrawing();
        this.loadNotes();
    }

    handleResize() {
        const savedDrawing = this.canvas.toDataURL();
        
        this.setupCanvas();
        
        const img = new Image();
        img.onload = () => {
            this.ctx.drawImage(img, 0, 0);
        };
        img.src = savedDrawing;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new DrawingNotesApp();
});

class DrawingNotesApp {
    constructor() {
        this.canvas = document.getElementById('drawing-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.notesEditor = document.getElementById('notes-editor');
        
        this.isDrawing = false;
        this.currentTool = 'pen';
        this.brushSize = 3;
        this.brushColor = '#000000';
        
        this.lastX = 0;
        this.lastY = 0;
        
        this.autoSaveTimer = null;
        
        this.init();
    }

    init() {
        this.setupCanvas();
        this.attachEventListeners();
        this.loadFromLocalStorage();
        this.updateCharWordCount();
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

        document.getElementById('color-picker').addEventListener('input', (e) => {
            this.brushColor = e.target.value;
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

    saveNotes() {
        const notesContent = this.notesEditor.value;
        localStorage.setItem('savedNotes', notesContent);
        this.showIndicator('Notes saved!');
    }

    autoSaveNotes() {
        clearTimeout(this.autoSaveTimer);
        this.autoSaveTimer = setTimeout(() => {
            this.saveNotes();
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

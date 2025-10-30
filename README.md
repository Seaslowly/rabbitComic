# Drawing & Notes Webpage

An interactive web application that combines drawing and note-taking functionality.

## Features

### Drawing Canvas
- **Free Drawing**: Draw freely with mouse or touch input
- **Customizable Tools**: 
  - Pen/brush with adjustable size (1-50px)
  - Color palette with 16 preset colors (clickable blocks)
  - Eraser tool with larger size for easy corrections
- **Image Import**: 
  - Import images in JPG, JPEG, PNG, GIF, WebP, and BMP formats
  - Images are automatically scaled to fit the canvas
  - Draw over imported images
- **Canvas Controls**:
  - Clear canvas functionality
  - Auto-save to localStorage
  - Export drawing as PNG image

### Note-Taking
- **Text Editor**: Dedicated area for writing and editing notes
- **Download as TXT**: Save notes as downloadable .txt files with timestamps
- **Auto-save to localStorage**: Notes persist in browser after 1 second of inactivity
- **Character & Word Count**: Real-time statistics

### User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Touch Support**: Full touch support for mobile and tablet drawing
- **Modern UI**: Clean, intuitive interface with gradient design
- **Data Persistence**: All data stored locally in browser (localStorage)

## Usage

Simply open `index.html` in a web browser to start using the application.

### Drawing
1. Select your tool (Pen or Eraser)
2. Adjust the brush size using the slider
3. Choose a color from the 16 preset color blocks
4. Click "Import Image" to load an image onto the canvas (JPG, PNG, GIF, WebP, BMP)
5. Start drawing on the canvas (you can draw over imported images)
6. Use "Clear Canvas" to start over
7. Use "Export as Image" to download your drawing

### Notes
1. Click in the notes area and start typing
2. Notes auto-save to localStorage after 1 second for persistence
3. Character and word count displayed at the bottom
4. Click "Save as TXT" to download your notes as a .txt file with timestamp
5. Use "Clear Notes" to erase all text

## Technical Details

- **Pure HTML/CSS/JavaScript**: No dependencies required
- **localStorage API**: For persistent canvas and notes storage
- **Canvas API**: For drawing and image manipulation
- **FileReader API**: For image import functionality
- **Blob API**: For TXT file download functionality
- **Touch Events**: For mobile device support
- **Responsive Grid Layout**: Adapts to all screen sizes

## Browser Compatibility

Works in all modern browsers that support:
- HTML5 Canvas
- localStorage API
- ES6 JavaScript
- CSS Grid

## License

Open source - feel free to use and modify as needed.

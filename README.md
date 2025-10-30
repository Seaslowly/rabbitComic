# Drawing & Notes Webpage

An interactive web application that combines drawing and note-taking functionality.

## Features

### Drawing Canvas
- **Free Drawing**: Draw freely with mouse or touch input
- **Customizable Tools**: 
  - Pen/brush with adjustable size (1-50px)
  - Color picker for unlimited color options
  - Eraser tool with larger size for easy corrections
- **Canvas Controls**:
  - Clear canvas functionality
  - Auto-save to localStorage
  - Export drawing as PNG image

### Note-Taking
- **Text Editor**: Dedicated area for writing and editing notes
- **Auto-save**: Notes automatically save after 1 second of inactivity
- **Character & Word Count**: Real-time statistics
- **Persistent Storage**: Notes saved to localStorage

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
3. Choose a color with the color picker
4. Start drawing on the canvas
5. Use "Clear Canvas" to start over
6. Use "Export as Image" to download your drawing

### Notes
1. Click in the notes area and start typing
2. Notes auto-save after 1 second
3. Character and word count displayed at the bottom
4. Use "Clear Notes" to erase all text

## Technical Details

- **Pure HTML/CSS/JavaScript**: No dependencies required
- **localStorage API**: For persistent data storage
- **Canvas API**: For drawing functionality
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

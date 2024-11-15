# SVG Converter

A secure, front-end SaaS application built with Vue.js and Tailwind CSS that converts SVG files into PNG, WEBP, and JPG formats. The application features a modern, responsive interface with drag-and-drop functionality and custom dimension controls.

## Features

- 🔄 Convert SVG files to PNG, WEBP, and JPG formats
- 📏 Custom dimension controls with aspect ratio preservation
- 🖼️ Drag-and-drop file upload interface
- 🔒 Secure client-side processing
- 📱 Fully responsive design
- ⚡ Real-time conversion feedback
- 🎨 Modern UI with Tailwind CSS
- 💾 Batch file processing
- 🖥️ Preview converted images
- 📊 File size and dimension information

## Getting Started

### Prerequisites

- Node.js 16.x or later
- npm 7.x or later

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/svg-converter.git
cd svg-converter
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Usage

1. **Upload Files**: Drag and drop SVG files onto the upload area or click to select files
2. **Configure Dimensions**: 
   - Set custom width and/or height
   - Use preset sizes (Small, Medium, Large)
   - Toggle aspect ratio preservation
3. **Convert**: Files are automatically converted to all supported formats
4. **Download**: Click the download button for each converted image

## Technical Details

- Built with Vue 3 Composition API
- State management with Pinia
- Styling with Tailwind CSS
- TypeScript for type safety
- Client-side image processing
- Vite for fast development and building

## Security

- All processing happens client-side
- No server uploads required
- File size limits enforced
- Input validation for all user inputs
- Secure file handling

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Vue.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- The open-source community for inspiration and tools
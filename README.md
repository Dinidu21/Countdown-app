# Strategic Countdown Timer

![GitHub last commit](https://img.shields.io/github/last-commit/Dinidu21/Countdown-app)
![GitHub Deployment](https://github.com/dinidu21/Countdown-app/actions/workflows/deploy.yml/badge.svg)
![License](https://img.shields.io/badge/License-MIT-blue.svg)

A professional countdown timer tracking 90 days from January 27, 2025, featuring a modern UI with dynamic progress tracking and responsive design.

**Live Demo:** [Checkout! ](https://dinidu21.github.io/Countdown-app)

## Features

- 🕒 Real-time countdown with days, hours, minutes, and seconds
- 📈 Progress bar with dynamic color transitions
- 📅 Start and end date display
- 🔄 Refresh button with icon
- 📱 Fully responsive design
- 🎨 Modern color scheme with CSS variables
- ⚡ Automatic GitHub Pages deployment

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Dinidu21/Countdown-app.git
```
2. Open `index.html` in any modern web browser

## Usage

After deployment, the timer will automatically:
- Start counting down from January 27, 2025
- Show time remaining in days, hours, minutes, and seconds
- Update progress bar in real-time
- Display end date calculation (July 26, 2025)

## Technologies Used

- **HTML5** - Semantic markup structure
- **CSS3** - Modern styling with CSS variables
- **JavaScript** - Real-time calculations
- **Bootstrap 5** - Responsive layout components
- **Font Awesome** - Icon toolkit
- **GitHub Actions** - CI/CD Pipeline

## Customization

Modify the following in `styles.css`:
```css
:root {
    --primary-color: #FF6B6B;    /* Main accent color */
    --secondary-color: #4ECDC4;  /* Progress bar color */
    --background-color: #F8F9FA; /* Page background */
    --text-color: #2D3436;       /* Primary text color */
}
```

To change dates, modify in `script.js`:
```javascript
const startDate = new Date('2025-01-27T00:00:00'); // Modify start date here
```

## Deployment

1. Push to GitHub repository:
```bash
git push origin main
```
2. GitHub Actions will automatically deploy to GitHub Pages
3. Enable GitHub Pages in repository settings (if not automatic)
   - Source: `GitHub Actions`
   - Branch: `gh-pages`

## Contributing

1. Fork the project
2. Create your feature branch:
```bash
git checkout -b feature/your-feature
```
3. Commit changes:
```bash
git commit -m 'Add some feature'
```
4. Push to branch:
```bash
git push origin feature/your-feature
```
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Acknowledgments

- Bootstrap Team for responsive framework
- Font Awesome for icons
- GitHub Actions for CI/CD pipeline

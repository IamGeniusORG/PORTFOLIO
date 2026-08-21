# Tanmay Dey (Teddy) - Personal Portfolio

A modern, interactive personal portfolio showcasing AI/ML projects, full-stack applications, systems programming, and content creation work.

## Features

- **Interactive 3D Background** - Three.js particle system with mouse interaction
- **Multi-Theme Support** - Cyberpunk, Deep Sea, Lava, and Default themes
- **Custom Cursor** - Smooth animated cursor with hover effects
- **Scroll Animations** - Reveal-on-scroll with IntersectionObserver
- **Music Player** - Background music toggle with visualizer
- **Terminal Easter Egg** - Hidden terminal (type `sudo` to activate)
- **Random Project Selector** - "View My Work" opens random GitHub repo
- **Responsive Design** - Mobile-first, works on all devices

## Tech Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **3D Graphics**: Three.js (r128)
- **Icons**: Font Awesome 6
- **Fonts**: Inter (Google Fonts)
- **Deployment**: Vercel

## Project Structure

```
├── index.html          # Main HTML structure
├── style.css           # All styles (themes, animations, layout)
├── script.js           # All JavaScript logic
├── Creater Pic.png     # Content section image
├── Portfolio Music.mp3 # Background music
└── Tanmay_Dey_Resume.pdf
```

## Sections

1. **Hero** - Introduction with animated text
2. **About** - Skills, philosophy, tech stack (6 categories)
3. **Testimonials & Achievements** - Project references and milestones
4. **Content Creation** - Blox2Build YouTube channel
5. **Contact** - Email, GitHub, LinkedIn, Instagram

## Local Development

```bash
# Simple HTTP server
python -m http.server 8000
# or
npx serve .
```

Then open `http://localhost:8000`

## Deployment

Connected to Vercel for automatic deployments on push to `main`:

```bash
git add .
git commit -m "Your message"
git push origin main
```

## Customization

- **Themes**: Edit CSS custom properties in `style.css`
- **Projects**: Update `projectRepos` array in `script.js`
- **Content**: Modify `index.html` sections
- **Skills**: Edit skills grid in About section

## License

MIT License - Feel free to use as inspiration for your own portfolio.
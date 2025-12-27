# 📸 Photo Booth

<div align="center">

A modern web-based photo booth built with Svelte 5, SvelteKit, and Tailwind CSS. Capture photo strips with customizable layouts and frames directly in your browser.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Svelte](https://img.shields.io/badge/Svelte-5.0-orange)](https://svelte.dev)
[![SvelteKit](https://img.shields.io/badge/SvelteKit-Latest-red)](https://kit.svelte.dev)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-orange)](https://workers.cloudflare.com)

**[🌐 Live Demo](https://photo-booth.aungmyokyaw.workers.dev/)** • [Features](#-features) • [Getting Started](#-getting-started) • [Development](#-development)

</div>

---

## ✨ Features

### 📷 Camera & Capture

- **Live camera preview** with progress tracking
- **3-second countdown timer** for perfect photo timing
- **Camera switching** between front and rear cameras
- **High-resolution captures** at your camera's maximum quality
- **Demo mode** - test with placeholder images when no camera available

### 🖼️ Photo Strips

- **Two layout options**:
  - **2×2 Grid** - Compact square layout
  - **4×1 Strip** - Full-size horizontal strip
- **9 frame color options**: None, White, Black, Gold, Silver, Rose, Blue, Green, Purple
- **High-resolution output** - Downloads as PNG

### 🖼️ Gallery

- **View all saved photo strips**
- **Download individual strips** as PNG
- **Delete strips** individually

### 📱 Responsive Design

- **Mobile-first** design that works on any device
- **Touch-friendly** controls
- **Adaptive layouts** for screens of all sizes
- **Fixed floating buttons** for easy mobile access

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** or **Bun**
- A modern web browser with camera support

### Installation

```bash
# Clone the repository
git clone https://github.com/AungMyoKyaw/photo-booth.git
cd photo-booth

# Install dependencies
bun install
# or
npm install

# Start development server
bun run dev
# or
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
bun run build
bun run preview
```

### Deployment

This project is deployed on **Cloudflare Workers** using `@sveltejs/adapter-cloudflare`.

```bash
# Deploy to Cloudflare Workers
bun run build
npx wrangler deploy
```

**Live Demo**: https://photo-booth.aungmyokyaw.workers.dev/

---

## 📸 Usage

1. **Allow camera access** when prompted (or enable Demo Mode)
2. **Choose a layout** (2×2 Grid or 4×1 Strip)
3. **Select a frame color** (optional)
4. **Tap the capture button** to take a photo with a 3-second countdown
5. **Take up to 4 photos** for your strip
6. **Download** your photo strip when complete!

---

## 🛠️ Development

### Project Structure

```
photo-booth/
├── src/
│   ├── lib/
│   │   ├── components/       # Svelte components
│   │   │   ├── Camera.svelte         # Camera preview with switching
│   │   │   ├── Countdown.svelte      # 3-second countdown timer
│   │   │   ├── FrameSelector.svelte  # Frame color picker
│   │   │   ├── Gallery.svelte        # Photo strip gallery
│   │   │   ├── LayoutSelector.svelte # Layout picker (2×2 / 4×1)
│   │   │   └── PhotoStrip.svelte     # Current strip preview
│   │   ├── stores/           # State management (Svelte 5 runes)
│   │   │   └── photos.svelte.ts
│   │   ├── types/            # TypeScript types
│   │   │   └── photo.ts
│   │   └── utils/            # Utility functions
│   │       └── canvas.ts     # Photo strip generation
│   ├── routes/               # SvelteKit routes
│   │   ├── +layout.svelte    # Root layout
│   │   ├── +page.svelte      # Main page
│   │   └── layout.css        # Global styles
│   └── app.html              # HTML template
├── static/                   # Static assets
├── package.json
├── svelte.config.js
├── tsconfig.json
└── vite.config.ts
```

### Available Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Build for production     |
| `npm run preview` | Preview production build |
| `npm run check`   | Run type checking        |
| `npm run lint`    | Run Prettier + ESLint    |
| `npm run format`  | Format with Prettier     |
| `npm run test`    | Run tests with Vitest    |

---

## 🎨 Tech Stack

- **Framework**: [Svelte 5](https://svelte.dev) with Svelte 5 Runes (`$state`, `$derived`, `$props`)
- **Meta-framework**: [SvelteKit](https://kit.svelte.dev)
- **Deployment**: [Cloudflare Workers](https://workers.cloudflare.com) with [@sveltejs/adapter-cloudflare](https://kit.svelte.dev/docs/adapter-cloudflare)
- **Styling**: CSS with CSS custom properties
- **Icons**: [Lucide Svelte](https://lucide.dev/icons/)
- **Type Safety**: [TypeScript](https://www.typescriptlang.org)
- **Build Tool**: [Vite](https://vitejs.dev)
- **Package Manager**: [Bun](https://bun.sh)
- **Testing**: [Vitest](https://vitest.dev)

---

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 15+
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [Svelte 5](https://svelte.dev) and [SvelteKit](https://kit.svelte.dev)
- Deployed on [Cloudflare Workers](https://workers.cloudflare.com)
- Icons from [Lucide](https://lucide.dev)
- Inspired by classic photo booth experiences
- Developed with assistance from **GLM 4.7**

---

<div align="center">

Made with ❤️ by [Aung Myo Kyaw](https://github.com/AungMyoKyaw)

Built with [Svelte 5](https://svelte.dev) • 🤖 GLM 4.7

**[🌐 Live Demo](https://photo-booth.aungmyokyaw.workers.dev/)** • [📦 GitHub](https://github.com/AungMyoKyaw/photo-booth)

[⬆ Back to Top](#-photo-booth)

</div>

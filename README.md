# 🌌 Athul Titus — Portfolio

Interactive 3D developer portfolio showcasing immersive experiences, quantum computation interests, AI tools, and full-stack projects.

🔗 **Live Site:** [https://portfolio-pi-snowy-54.vercel.app/](https://portfolio-pi-snowy-54.vercel.app/)

---

## ✨ Features

- **3D Hacker Avatar:** Auto-rotating volumetric avatar that reacts to mouse movement and cursor dragging (with pause/resume logic).
- **Cinematic Zoom & Tunnel Transition:** Scroll-driven camera fly-through that zooms into the avatar, accompanied by warp-speed star streaks and a falling digital particle rain overlay.
- **Buttery smooth navigation:** Instant-jump navbar links bypassing the scroll-driven animation zone for immediate page navigation.
- **Aesthetic Glassmorphism:** Sleek dark interface with red highlights, smooth gradients, and light/dark theme support.
- **Fully Responsive:** Beautifully optimized across mobile, tablet, and desktop screens.

---

## 🛠️ Tech Stack

- **Core:** React, Vite, JavaScript
- **3D Logic:** HTML5 Canvas, CSS 3D Transforms (`preserve-3d`)
- **Styling:** CSS variables, Tailwind CSS, custom keyframes

---

## 🚀 Getting Started

### 1. Installation
Clone the repository and install the dependencies:
```bash
git clone https://github.com/Athul-Titus/Athul-Titus.github.io.git
cd Athul-Titus.github.io
npm install
```

### 2. Run Locally
Start the development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📦 Deployment

This project uses the `gh-pages` module to automate builds and deploy directly to the root user domain:

```bash
npm run deploy
```
This command compiles the React project into static assets and pushes them to the `main` branch of the repo.

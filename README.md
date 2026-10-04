# EasyMeds

A mobile-friendly web app designed for elderly users to help them manage their medication routines. The focus is not only on functionality but also on usability, accessibility, and human-centered design.

**Live demo:** https://easy-meds-e3x8.vercel.app/

## Tech Stack

- React
- Vite
- Tailwind CSS (via PostCSS)

## Running Locally

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher (check with `node --version`)
- npm (comes with Node.js)

### Steps

1. **Clone the repo** and open a terminal inside it:
```bash
   git clone https://github.com/safiamussaratt/EasyMeds.git
   cd EasyMeds
```

2. **Install dependencies** (only needed once):
```bash
   npm install
```

3. **Start the dev server**:
```bash
   npm run dev
```

4. **Open your browser** at:
```
   http://localhost:5173
```

The app hot-reloads when you edit files.

### Viewing on your phone (same Wi-Fi)

Run the dev server with `--host` to expose it on your local network:
```bash
npm run dev -- --host
```
Then open the IP address shown in the terminal (e.g. `http://192.168.x.x:5173`) on your phone.

## Build for Production

```bash
npm run build
```
Output goes to the `dist/` folder.

## Deployment

The app is deployed on [Vercel](https://vercel.com). To deploy your own copy:

1. Import the repo into Vercel.
2. Use the auto-detected Vite settings (build command `npm run build`, output directory `dist`).
3. Click **Deploy**. Every push to `main` redeploys automatically.

## License

MIT, see [LICENSE](LICENSE).

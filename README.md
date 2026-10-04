# EasyMeds
This project proposes the design and development of a mobile application tailored  specifically for elderly users to help them manage their medication routines effectively. The  focus of this project is not only functionality but also usability, accessibility, and  human-centered design.

# How to Run EasyMeds

This is a **React web app** that runs in your browser via a local dev server.

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher (you can check: `node --version`)
- npm (comes with Node.js)

## Steps

1. **Unzip** the project folder and open a terminal inside it.

2. **Install dependencies** (only needed once):
   ```bash
   npm install
   ```

3. **Start the dev server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and go to:
   ```
   http://localhost:5173
   ```

That's it! The app will hot-reload automatically when you edit files.

## To view on your phone (same Wi-Fi)

Run with `--host` to expose it on your local network:
```bash
npm run dev -- --host
```
Then open the IP address shown in the terminal (e.g. `http://192.168.x.x:5173`) on your phone.

## Build for production

```bash
npm run build
```
Output goes to the `dist/` folder.

## What was fixed

- `react` and `react-dom` were listed as optional `peerDependencies`, which meant
  they weren't being installed. They've been moved to `dependencies` so `npm install`
  picks them up automatically.

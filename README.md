# EN_SmartApp - Engineering Web Portal

## Overview
This is a modular, scalable web portal designed for engineering applications. It serves as a central hub (Shell) for various independent engineering tools (Modules). The system is designed to be hosted on GitHub Pages or any static host, with a backend powered by Google Sheets and Google Apps Script.

## Project Structure
```text
/ (Root)
├── index.html              # Main Landing Portal
├── style.css               # Global Design System (Tokens, Grid, Typography)
├── script.js               # Global Utilities (Navigation, API)
├── /assets                 # Images and Icons
│   └── /icons
├── /shared                 # Shared Logic and Components
│   ├── units.js            # Unit conversion utilities
│   └── api.js              # GAS API Connector
└── /apps                   # Independent Application Modules
    ├── /civil-land         # Civil Engineering: Land Area Calc
    └── /mech-piperack      # Mechanical Engineering: Pipe Rack Calc
```

## Adding a New Application
1. Create a new folder in `/apps/` (e.g., `apps/my-new-app`).
2. Create an `index.html` inside that folder.
3. Link the global `style.css` and `script.js` if you want to inherit the portal's design system.
4. Add a new "App Card" to the main `index.html` grid.

## Design System
The portal uses a "Premium Engineering" aesthetic:
- **Primary Color:** Deep Navy (`#0A192F`)
- **Accent Color:** Safety Orange (`#FF6B00`)
- **Typography:** Inter / Roboto Mono
- **Icons:** FontAwesome (embedded via CDN)

## Backend Integration
The backend is a Google Apps Script Web App.
- **Endpoint:** *[Insert GAS Deployment URL Here]*
- **Database:** Google Sheets
- **Auth:** Standard Token/Key authentication (managed in `script.js`)

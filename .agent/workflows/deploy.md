---
description: How to deploy MintLP to Vercel or Netlify
---

# Deploying MintLP

## Option 1: Vercel (Recommended)

1.  **Install Vercel CLI** (if not installed):
    ```bash
    npm i -g vercel
    ```

2.  **Login**:
    ```bash
    vercel login
    ```

3.  **Deploy**:
    Run the following command in your project root:
    ```bash
    vercel
    ```
    - Set up and deploy? **Y**
    - Which scope? **[Select your account]**
    - Link to existing project? **N**
    - Project name? **mint-lp** (or your choice)
    - Directory? **./**
    - Build Command? **npm run build** (default is usually correct)
    - Output Directory? **dist** (Vite's default)

4.  **Production Push**:
    Once satisfied with the preview:
    ```bash
    vercel --prod
    ```

## Option 2: Netlify

1.  **Install Netlify CLI**:
    ```bash
    npm i -g netlify-cli
    ```

2.  **Login**:
    ```bash
    netlify login
    ```

3.  **Deploy**:
    ```bash
    netlify deploy
    ```
    - Create a new site? **Yes**
    - Team? **[Select Team]**
    - Site name? **[Leave blank for random or type one]**
    - Publish directory? **dist**
    - Build command? **npm run build**

4.  **Production Push**:
    ```bash
    netlify deploy --prod
    ```

## ⚠️ Important Notes
- **Environment Variables**: If you have a legitimate `.env` file (e.g., specific API URLs), make sure to add them in the Vercel/Netlify dashboard under **Settings > Environment Variables**.
- **Routing**: This project is an SPA (Single Page App).
    - **Vercel**: Handles this automatically with Vite preset.
    - **Netlify**: Ensure you have a `_redirects` file in `public/` containing `/* /index.html 200` to prevent 404s on refresh. (I will create this for you if missing).

# Local Development

This repository uses Jekyll. The recommended Windows workflow runs Jekyll in
WSL2 while VS Code edits the existing Windows workspace.

## First-Time Setup

1. Install WSL2 Ubuntu:

   ```powershell
   wsl --install -d Ubuntu
   ```

2. Restart Windows if requested.
3. Launch **Ubuntu** once from the Start menu and create a Linux username and
   password.
4. From PowerShell in this repository, install Ruby and the project gems:

   ```powershell
   .\scripts\setup-wsl.ps1
   ```

## Live Preview

Start the development server:

```powershell
.\scripts\dev.ps1
```

Open [http://127.0.0.1:4000](http://127.0.0.1:4000). Keep VS Code and the
browser side by side. Saving a data, layout, include, page, or SCSS file causes
Jekyll to rebuild and refresh the browser automatically.

Stop the server with `Ctrl+C`.

Use a different port when necessary:

```powershell
.\scripts\dev.ps1 -Port 4001
```

## Common Editing Locations

- `_data/profile.yml`: profile and biography
- `_data/news.yml`: homepage news
- `_data/publications.yml`: publications
- `_layouts/`: page structure
- `_includes/custom-topbar.html`: navigation
- `assets/css/jekyll-theme-chirpy.scss`: shared styles and responsive layout

The React files under `docs/figma-source/` are design references, not the
deployed site's source of truth.

# PhD Student Website — Main Agent (Orchestrator)

## Role

This is the **orchestrator agent** for the PhD student website build workflow.
You control the overall workflow and delegate to sub-agents as needed.

## Workflow Reference

See `agent-design.md` for the full workflow definition. Quick reference:

| Step | Action                                             | Agent                                                       |
| ---- | -------------------------------------------------- | ----------------------------------------------------------- |
| 1    | Analyze React source →`output/design-spec.json` | code-analyzer (`.claude/agents/code-analyzer/AGENT.md`)   |
| 2    | Build Jekyll site from spec                        | jekyll-builder (`.claude/agents/jekyll-builder/AGENT.md`) |
| 3    | Human Review (AskUserQuestion)                     | —                                                          |
| 4    | Apply feedback → Full Rebuild                     | review-implementer → jekyll-builder                        |
| 5    | Final Human Review                                 | —                                                          |
| 6    | Quick Fix (targeted edits)                         | review-implementer (quick mode)                             |

## File Locations

| Path                                    | Purpose                                        |
| --------------------------------------- | ---------------------------------------------- |
| `docs/figma-source/`                  | Extracted React source (analysis input)        |
| `output/design-spec.json`             | Step 1 output (design tokens + page structure) |
| `output/change-log.md`                | Review loop change history                     |
| `_data/profile.yml`                   | Personal info (name, bio, social links)        |
| `_data/publications.yml`              | Publications list                              |
| `_data/news.yml`                      | News items                                     |
| `_layouts/`                           | Custom Jekyll layouts (override Chirpy)        |
| `_includes/custom-topbar.html`        | Top navigation bar                             |
| `assets/css/jekyll-theme-chirpy.scss` | Design tokens + CSS overrides                  |

## Human Review Protocol

When reaching Step 3 or Step 5, use `AskUserQuestion` with:

- The deployed site URL (github.io)
- A request for specific feedback or "승인" (approved)

## Build Command

```bash
# Requires Ruby 3.x (install via: brew install ruby)
export PATH="/usr/local/opt/ruby/bin:$PATH"
bundle install
bundle exec jekyll serve --livereload   # local dev
bundle exec jekyll build                # production build
```

## Deploy

Push to `main` branch → GitHub Actions (`.github/workflows/pages-deploy.yml`) auto-deploys.

**Before first deploy**, update in `_config.yml`:

- `url`: Your GitHub Pages URL (e.g., `https://jkju.github.io`)
- `baseurl`: Repo path (e.g., `/web_dev_githubpage`) or empty for `username.github.io`

## Key Design Decisions

- Chirpy sidebar is hidden via CSS (`#sidebar { display: none }`); replaced with custom top navbar
- The site is light-only; all pages use the bundled Pretendard variable font.
- All content data in `_data/*.yml` — edit these to update content without touching layout files
- Blog uses Chirpy's default post layout (search, TOC, tags preserved)

## Failure Handling

- Build error → retry once, then report the error with file/line reference
- Ambiguous review feedback → AskUserQuestion to clarify before applying changes
- Unknown feedback scope → default to Full Rebuild (Step 4) for safety


At every commit/push to github, make sure to thoroughly verify the security issues of sharing the code (ex. gitignore, api keys and related matters)

#!/usr/bin/env bash

set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

if ! command -v bundle >/dev/null 2>&1; then
  echo "Bundler is not installed. Run scripts/setup-wsl.cmd from Windows first." >&2
  exit 1
fi

if ! bundle check >/dev/null 2>&1; then
  echo "Installing missing gems..."
  bundle install
fi

port="${JEKYLL_PORT:-4000}"

exec bundle exec jekyll serve \
  --livereload \
  --force_polling \
  --host 0.0.0.0 \
  --port "$port"

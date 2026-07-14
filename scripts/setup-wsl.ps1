param(
  [string]$Distro = "Ubuntu"
)

$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$installedDistros = @(& wsl.exe --list --quiet) -replace "`0", ""

if ($installedDistros -notcontains $Distro) {
  throw @"
$Distro is not ready yet. Restart Windows, launch Ubuntu once from the Start menu,
create your Linux username and password, then run this script again.
"@
}

Write-Host "Installing Ruby and build dependencies in $Distro..."
& wsl.exe -d $Distro -u root -- bash -lc `
  "apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y ruby-full build-essential zlib1g-dev && gem install bundler -v 4.0.7 --no-document"

if ($LASTEXITCODE -ne 0) {
  throw "Ruby installation failed with exit code $LASTEXITCODE."
}

$wslRepoRoot = (& wsl.exe -d $Distro -- wslpath -a $repoRoot).Trim()

Write-Host "Installing Jekyll dependencies for this repository..."
& wsl.exe -d $Distro -- bash -lc `
  "cd '$wslRepoRoot' && bundle config set --local path vendor/bundle && bundle install"

if ($LASTEXITCODE -ne 0) {
  throw "Bundle installation failed with exit code $LASTEXITCODE."
}

Write-Host ""
Write-Host "Setup complete. Start the live preview with:"
Write-Host "  .\scripts\dev.ps1"

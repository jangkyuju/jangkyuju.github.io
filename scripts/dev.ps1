param(
  [string]$Distro = "Ubuntu",
  [int]$Port = 4000
)

$ErrorActionPreference = "Stop"

function ConvertTo-WslPath {
  param([Parameter(Mandatory = $true)][string]$WindowsPath)

  if ($WindowsPath -notmatch '^([A-Za-z]):\\(.*)$') {
    throw "Unsupported Windows path: $WindowsPath"
  }

  $drive = $Matches[1].ToLowerInvariant()
  $relativePath = $Matches[2] -replace '\\', '/'
  return "/mnt/$drive/$relativePath"
}

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$installedDistros = @(& wsl.exe --list --quiet) -replace "`0", ""

if ($installedDistros -notcontains $Distro) {
  throw "$Distro is not ready. Run .\scripts\setup-wsl.cmd after completing the Ubuntu first-run setup."
}

$wslRepoRoot = ConvertTo-WslPath $repoRoot

Write-Host "Starting Jekyll LiveReload at http://127.0.0.1:$Port"
Write-Host "Press Ctrl+C to stop the server."

& wsl.exe -d $Distro -- bash -lc `
  "cd '$wslRepoRoot' && JEKYLL_PORT='$Port' bash scripts/dev.sh"

if ($LASTEXITCODE -ne 0) {
  throw "Jekyll exited with code $LASTEXITCODE. Run .\scripts\setup-wsl.cmd if dependencies are missing."
}

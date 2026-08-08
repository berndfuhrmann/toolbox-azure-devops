# Destroys the Azure DevOps Server Express demo VM and removes test/e2e/.env.
#
# Run from anywhere in the repository.

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

if (-not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
  Write-Warning "Elevation required. Relaunching as administrator..."
  Start-Process pwsh -Verb RunAs -Wait -ArgumentList "-ExecutionPolicy Bypass -File `"$PSCommandPath`""
  exit $LASTEXITCODE
}

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Push-Location $ScriptDir

try {
  Write-Host "=== Destroying demo VM ==="
  vagrant destroy -f

  $envFile = Join-Path $ScriptDir ".env"
  if (Test-Path $envFile) {
    Remove-Item $envFile
    Write-Host "Removed $envFile"
  }

  Write-Host "=== Done ==="
} finally {
  Pop-Location
}

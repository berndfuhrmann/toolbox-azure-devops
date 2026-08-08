# Destroys any existing demo VM, provisions a fresh one with Azure DevOps Server
# Express, and seeds it with a PAT.
# Writes AZURE_DEVOPS_URL and AZURE_DEVOPS_PAT to test/e2e/.env.
#
# Requires: Vagrant (Hyper-V provider), Node.js
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
  # 1. Clean slate
  Write-Host "=== Destroying existing VM ==="
  vagrant destroy -f

  # 2. Boot VM without provisioning (ISO attachment triggers fire automatically)
  Write-Host "=== Booting VM ==="
  vagrant up --no-provision --provider=hyperv

  # 3. Run provisioners — installs ADO Server Express (takes 30-60 minutes)
  Write-Host "=== Provisioning VM ==="
  vagrant provision

  # 4. Discover the VM's IP from Hyper-V (may take a moment after boot)
  Write-Host "=== Waiting for VM IP address ==="
  $vmIp = $null
  for ($attempt = 0; $attempt -lt 60; $attempt++) {
    $vmIp = Get-VMNetworkAdapter -VMName "ado-server" -ErrorAction SilentlyContinue |
      Select-Object -ExpandProperty IPAddresses |
      Where-Object { $_ -match '^\d{1,3}(\.\d{1,3}){3}$' } |
      Select-Object -First 1
    if ($vmIp) { break }
    Start-Sleep -Seconds 5
  }
  if (-not $vmIp) { throw "Could not get VM IP address within 5 minutes." }
  Write-Host "VM IP: $vmIp"

  # 5. Wait for TFS port 8080 to accept connections
  $serverUrl = "http://${vmIp}:8080"
  Write-Host "=== Waiting for TFS at $serverUrl ==="
  $tfsReady = $false
  for ($attempt = 1; $attempt -le 30; $attempt++) {
    $tcp = Test-NetConnection -ComputerName $vmIp -Port 8080 -WarningAction SilentlyContinue
    if ($tcp.TcpTestSucceeded) { $tfsReady = $true; break }
    Write-Host "  Attempt $attempt/30 — port not open yet, waiting 10s..."
    Start-Sleep -Seconds 10
  }
  if (-not $tfsReady) { throw "TFS port 8080 was not reachable within 5 minutes." }
  Write-Host "TFS is reachable."

  # 6. Create PAT — seed-server.mjs writes token to stdout, diagnostics to stderr
  Write-Host "=== Creating PAT ==="
  $patToken = (& node "$ScriptDir\create-pat.mjs" $serverUrl).Trim()
  if ($patToken.Length -lt 20) { throw "PAT token looks invalid: '$patToken'" }
  Write-Host "PAT created."

  # 7. Write .env
  $envFile = Join-Path $ScriptDir ".env"
  "AZURE_DEVOPS_URL=$serverUrl`nAZURE_DEVOPS_ORGANIZATION=DefaultCollection`nAZURE_DEVOPS_PAT=$patToken" |
    Set-Content -Path $envFile -Encoding UTF8 -NoNewline

  Write-Host ""
  Write-Host "=== Done ==="
  Write-Host "  Server:   $serverUrl/DefaultCollection"
  Write-Host "  Env file: $envFile"
} finally {
  Pop-Location
}

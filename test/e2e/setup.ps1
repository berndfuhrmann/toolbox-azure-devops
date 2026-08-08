# PowerShell script to automate the installation of Azure DevOps Server Express.

# Log to a local path (no shared folder dependency).
Start-Transcript -Path "C:\setup-log.txt" -Append

Write-Host "Starting Azure DevOps Server Express setup..."
Write-Host "This process can take 30-60 minutes. Please be patient."

Write-Host "Installing IIS Web Server Role..."
Install-WindowsFeature -name Web-Server -IncludeManagementTools -ErrorAction Stop

Write-Host "Scanning DVD drives for the Azure DevOps installer..."
$installerPath = $null
foreach ($drive in [System.IO.DriveInfo]::GetDrives() | Where-Object DriveType -eq CDRom) {
  $found = Get-ChildItem -Path $drive.Name -Recurse -Filter "AzureDevOpsExpress.exe" -ErrorAction SilentlyContinue |
    Select-Object -First 1
  if ($found) {
    $installerPath = $found.FullName
    Write-Host "Found installer at: $installerPath"
    break
  }
}

if (-not $installerPath) {
  Write-Error "FATAL: 'AzureDevOpsExpress.exe' was not found on any DVD drive. Ensure the ISO is attached as a virtual DVD drive."
  exit 1
}

Write-Host "Creating unattended installation file (unattend.ini)..."

# Get the current machine name dynamically
$machineName = $env:COMPUTERNAME
Write-Host "Detected machine name: $machineName"

# unattend.ini was uploaded to C:\ by the Vagrant file provisioner.
$templatePath = "C:\unattend.ini"
if (-not (Test-Path $templatePath)) {
  Write-Error "FATAL: Could not find unattend.ini template at $templatePath"
  exit 1
}

# Read the template and replace COMPUTERNAME placeholder with actual machine name
$unattendContent = Get-Content -Path $templatePath -Raw
$unattendContent = $unattendContent -replace "COMPUTERNAME", $machineName

# Write the customized content to a local path (not the shared folder)
$unattendPath = "C:\unattend.ini"
$unattendContent | Out-File -FilePath $unattendPath -Encoding UTF8 -Force
Write-Host "Generated unattend.ini with machine name: $machineName at $unattendPath"

Write-Host "Starting Azure DevOps Server silent installation..."
Write-Host "This is the longest step. It includes installing SQL Server Express."

try {
  Start-Process -FilePath $installerPath -ArgumentList "/Silent" -Wait -ErrorAction Stop
  Write-Host "Silent installation command completed."
} catch {
  Write-Error "FATAL: The installer process failed."
  exit 1
}


try {
  Start-Process -FilePath "C:\Program Files\Azure DevOps Server\Tools\tfsconfig.exe" -ArgumentList "unattend", "/configure", "/unattendfile:$unattendPath" -Wait -ErrorAction Stop
  Write-Host "Silent configuration command completed."
} catch {
  Write-Error "FATAL: The configure process failed."
  exit 1
}

Write-Host "Enabling IIS Basic Authentication..."
Install-WindowsFeature -Name Web-Basic-Auth -ErrorAction SilentlyContinue
Import-Module WebAdministration -ErrorAction SilentlyContinue
Set-WebConfigurationProperty `
  -Filter "/system.webServer/security/authentication/basicAuthentication" `
  -Name "enabled" -Value $true `
  -PSPath "IIS:\Sites\Team Foundation Server"
Write-Host "IIS Basic Authentication enabled on 'Team Foundation Server' site."

New-NetFirewallRule -DisplayName "Azure DevOps Server (TCP 8080)" `
  -Direction Inbound `
  -LocalPort 8080 `
  -Protocol TCP `
  -Action Allow

Write-Host "------------------------------------------------------------"
Write-Host "SUCCESS: Azure DevOps Server setup is complete."
Write-Host "You should be able to access the web portal from your host machine at:"
Write-Host "http://localhost:8080/tfs"
Write-Host "------------------------------------------------------------"

Stop-Transcript

$vmName = "ado-server"
$isoPath = Join-Path $PSScriptRoot "AzureDevOpsServerExpress2022.iso"

if (-not (Get-VM -Name $vmName -ErrorAction SilentlyContinue)) {
  Write-Host "VM '$vmName' does not exist yet; skipping DVD attachment."
  exit 0
}

$dvd = Get-VMDvdDrive -VMName $vmName -ErrorAction SilentlyContinue | Select-Object -First 1
if ($dvd) {
  Set-VMDvdDrive -VMName $vmName `
    -ControllerNumber   $dvd.ControllerNumber `
    -ControllerLocation $dvd.ControllerLocation `
    -Path $isoPath
} else {
  Add-VMDvdDrive -VMName $vmName -Path $isoPath
}
Write-Host "ISO attached as DVD drive to VM '$vmName'."

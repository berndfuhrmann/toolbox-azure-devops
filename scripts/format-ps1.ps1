# Formats *.ps1 files in test/e2e using PSScriptAnalyzer.
# Requires: Install-Module -Name PSScriptAnalyzer -Scope CurrentUser

if (-not (Get-Module -ListAvailable -Name PSScriptAnalyzer)) {
  Write-Error "PSScriptAnalyzer is not installed. Run: Install-Module -Name PSScriptAnalyzer -Scope CurrentUser"
  exit 1
}

Import-Module PSScriptAnalyzer

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$settingsPath = Join-Path $projectRoot "PSScriptAnalyzerSettings.psd1"
$targetPath = Join-Path $projectRoot "test" "e2e"

$files = @($PSCommandPath) + @(Get-ChildItem -Path $targetPath -Recurse -Filter "*.ps1")

foreach ($file in $files) {
  $path = if ($file -is [string]) { $file } else { $file.FullName }
  $content = Get-Content -Path $path -Raw
  $formatted = Invoke-Formatter -ScriptDefinition $content -Settings $settingsPath
  [System.IO.File]::WriteAllText($path, $formatted)
  Write-Host "Formatted: $path"
}

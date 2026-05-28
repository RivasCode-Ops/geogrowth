# Publica geogrowth em RivasCode-Ops/geogrowth (requer: gh auth login)
$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
Set-Location $root

gh auth status 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Execute primeiro: gh auth login"
    exit 1
}

$remote = git remote get-url origin 2>$null
if (-not $remote) {
    gh repo create RivasCode-Ops/geogrowth --public --source=. --remote=origin --push
} else {
    git push -u origin main
}
Write-Host "OK: https://github.com/RivasCode-Ops/geogrowth"

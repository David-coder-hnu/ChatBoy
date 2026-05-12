# build.ps1 - build single markdown for make-pdf
$GuideDir = $PSScriptRoot
$OutputFile = Join-Path $GuideDir "soulclone-beginners-guide.md"

$parts = @(
    "PART-01-vision",
    "PART-02-first-clone",
    "PART-03-tech-behind-soul",
    "PART-04-ai-twin",
    "PART-05-design-system",
    "PART-06-development",
    "PART-07-going-further"
)

$files = @()

# cover and toc
$coverFile = Join-Path $GuideDir "00-cover.md"
$tocFile = Join-Path $GuideDir "00-toc.md"
if (Test-Path $coverFile) { $files += $coverFile }
if (Test-Path $tocFile) { $files += $tocFile }

# collect chapters
foreach ($part in $parts) {
    $partDir = Join-Path $GuideDir $part
    if (Test-Path $partDir) {
        $chapterFiles = Get-ChildItem -Path $partDir -Filter "*.md" | Sort-Object Name
        foreach ($cf in $chapterFiles) {
            $files += $cf.FullName
        }
    }
}

# build output
$output = ""
foreach ($f in $files) {
    $content = Get-Content -Path $f -Raw -Encoding UTF8
    $output = $output + $content + "`n`n"
}

Set-Content -Path $OutputFile -Value $output -Encoding UTF8
Write-Host "Built: $OutputFile ($($files.Count) files)"

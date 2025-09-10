param(
    [Parameter(Mandatory=$true)]
    [string]$Title,
    
    [Parameter(Mandatory=$true)]
    [string]$Problem,
    
    [Parameter(Mandatory=$true)]
    [string]$UserStory,
    
    [Parameter(Mandatory=$true)]
    [string[]]$AcceptanceCriteria,
    
    [string[]]$Dependencies = @(),
    
    [string]$Notes = "None"
)

# Get the script directory and set up paths
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$IssuesDir = Join-Path $ScriptDir "..\issues"

# Ensure issues directory exists
if (-not (Test-Path $IssuesDir)) {
    New-Item -ItemType Directory -Path $IssuesDir -Force | Out-Null
    Write-Host "Created issues directory: $IssuesDir" -ForegroundColor Green
}

# Get next issue number
function Get-NextIssueNumber {
    $folders = Get-ChildItem -Path $IssuesDir -Directory -ErrorAction SilentlyContinue | Where-Object { $_.Name -match "^GOATS-\d+_" }
    
    if ($folders.Count -eq 0) {
        return 1
    }
    
    $numbers = $folders | ForEach-Object {
        if ($_.Name -match "^GOATS-(\d+)_") {
            [int]$matches[1]
        }
    } | Where-Object { $_ -ne $null }
    
    if ($numbers.Count -eq 0) {
        return 1
    }
    
    return ($numbers | Measure-Object -Maximum).Maximum + 1
}

# Create simple description from title
function Get-SimpleDescription {
    param([string]$title)
    
    $description = $title.ToLower()
    $description = $description -replace '[^a-z0-9\s-]', ''
    $description = $description -replace '\s+', '-'
    $description = $description.Trim('-')
    
    # Ensure we have a valid description
    if ([string]::IsNullOrEmpty($description)) {
        $description = "issue"
    }
    
    # Limit length
    if ($description.Length -gt 50) {
        $description = $description.Substring(0, 50)
    }
    
    return $description
}

# Generate issue content
function New-IssueContent {
    param(
        [string]$title,
        [string]$problem,
        [string]$userStory,
        [string[]]$acceptanceCriteria,
        [string[]]$dependencies,
        [string]$notes
    )
    
    $criteriaText = $acceptanceCriteria | ForEach-Object { "- [ ] $_" } | Out-String
    $criteriaText = $criteriaText.Trim()
    
    $dependenciesText = if ($dependencies.Count -gt 0) {
        ($dependencies | ForEach-Object { "- $_" } | Out-String).Trim()
    } else {
        "- None"
    }
    
    $content = @"
# $title

## Problem
$problem

## User Story  
$userStory

## Acceptance Criteria
$criteriaText

## Dependencies
$dependenciesText

## Notes
$notes
"@
    
    return $content
}

try {
    # Get next issue number
    $issueNumber = Get-NextIssueNumber
    
    # Create simple description
    $simpleDescription = Get-SimpleDescription -title $Title
    
    # Create folder name
    $paddedNumber = $issueNumber.ToString().PadLeft(3, '0')
    $folderName = "GOATS-" + $paddedNumber + "_" + $simpleDescription
    $issueFolderPath = Join-Path $IssuesDir $folderName
    
    # Create issue folder
    New-Item -ItemType Directory -Path $issueFolderPath -Force | Out-Null
    
    # Generate issue content
    $issueContent = New-IssueContent -title $Title -problem $Problem -userStory $UserStory -acceptanceCriteria $AcceptanceCriteria -dependencies $Dependencies -notes $Notes
    
    # Write issue.txt file
    $issueFilePath = Join-Path $issueFolderPath "issue.txt"
    $issueContent | Out-File -FilePath $issueFilePath -Encoding UTF8
    
    # Return success result
    $result = @{
        Success = $true
        IssueNumber = $issueNumber
        FolderName = $folderName
        FolderPath = $issueFolderPath
        IssueFilePath = $issueFilePath
        Message = "Issue GOATS-" + $paddedNumber + " created successfully"
    }
    
    Write-Host "SUCCESS: $($result.Message)" -ForegroundColor Green
    Write-Host "Folder: $folderName" -ForegroundColor Cyan
    Write-Host "File: $issueFilePath" -ForegroundColor Cyan
    
    return $result
    
} catch {
    $errorResult = @{
        Success = $false
        Error = $_.Exception.Message
        Message = "Failed to create issue"
    }
    
    Write-Host "ERROR: $($errorResult.Message): $($errorResult.Error)" -ForegroundColor Red
    return $errorResult
}

# Create-Issue PowerShell Script Usage

This PowerShell script allows the Product Manager agent to easily create development issues in the `ai_team/issues` folder.

## Usage

```powershell
.\Create-Issue.ps1 -Title "Issue Title" -Problem "Problem description" -UserStory "As a user, I want..." -AcceptanceCriteria @("Criteria 1", "Criteria 2") -Dependencies @("Dep 1", "Dep 2") -Notes "Additional notes"
```

## Parameters

- **Title** (Required): The issue title
- **Problem** (Required): What problem this solves
- **UserStory** (Required): User story in format "As a [user type], I want [feature] so that [benefit]"
- **AcceptanceCriteria** (Required): Array of specific, testable requirements
- **Dependencies** (Optional): Array of blockers or prerequisites
- **Notes** (Optional): Additional context

## Example

```powershell
.\Create-Issue.ps1 `
    -Title "Add User Dashboard" `
    -Problem "Users need a central place to view their fantasy teams and stats" `
    -UserStory "As a fantasy sports user, I want a dashboard so that I can quickly see my teams and performance" `
    -AcceptanceCriteria @(
        "Dashboard shows all user's fantasy teams",
        "Dashboard displays current standings",
        "Dashboard shows recent activity",
        "Dashboard is responsive on mobile devices"
    ) `
    -Dependencies @(
        "User authentication system",
        "Team data API"
    ) `
    -Notes "Use React components for dashboard widgets"
```

## Output

The script creates:
- A folder named `GOATS-XXX_description` (where XXX is auto-incremented, zero-padded to 3 digits)
- An `issue.txt` file with the formatted issue content following the Product Manager template
- Returns a success/error result object with issue details

### Auto-Incrementing Behavior
- Scans existing `GOATS-XXX_*` folders in the issues directory
- Finds the highest existing issue number
- Creates the next sequential number (e.g., if GOATS-004 exists, next will be GOATS-005)
- Handles gaps gracefully (if GOATS-002 is deleted, next issue will still be GOATS-006)
- Zero-pads numbers to 3 digits (001, 002, 003, etc.)

### Folder Structure
```
ai_team/issues/
├── GOATS-001_add-user-authentication/
│   └── issue.txt
├── GOATS-002_test-issue-2/
│   └── issue.txt
└── GOATS-003_add-team-management/
    └── issue.txt
```

### Issue Template Format
The `issue.txt` file follows this exact template:
```
# [Title]

## Problem
[What problem does this solve?]

## User Story  
[As a user type, I want feature so that benefit]

## Acceptance Criteria
- [ ] [Specific, testable requirement]
- [ ] [Another requirement]

## Dependencies
- [Any blockers or prerequisites]

## Notes
[Additional context]
```

## Integration with Product Manager Agent

The Product Manager agent can call this script by:
1. Collecting the required information from the product request
2. Formatting it according to the template
3. Calling the PowerShell script with the appropriate parameters
4. Handling the success/error response

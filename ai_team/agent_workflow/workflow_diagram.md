# AI Agent Workflow Diagram

This Mermaid diagram describes the flow from request to completion in the AI agent workflow system.

```mermaid
flowchart TD
    A["User Request"] --> B["Product Integrator/Manager"]
    B --> C["Architect"]
    C --> D["Team"]
    
    D --> E["Engineer"]
    D --> F["QA Engineer"]
    D --> G["Documenter"]
    
    E --> H["Sanity Agent"]
    F --> H
    G --> H
    
    H --> I{"Decision Point"}
    I -->|"Needs Revision"| D
    I -->|Approved| J["Pull Request"]
    
    %% Styling
    classDef requestClass fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef managerClass fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef architectClass fill:#e8f5e8,stroke:#1b5e20,stroke-width:2px
    classDef teamClass fill:#fff3e0,stroke:#e65100,stroke-width:2px
    classDef sanityClass fill:#fce4ec,stroke:#880e4f,stroke-width:2px
    classDef decisionClass fill:#f1f8e9,stroke:#33691e,stroke-width:2px
    classDef outputClass fill:#e0f2f1,stroke:#004d40,stroke-width:2px
    
    class A requestClass
    class B managerClass
    class C architectClass
    class D,E,F,G teamClass
    class H sanityClass
    class I decisionClass
    class J outputClass
```

## Workflow Description

1. **Request**: Your initial feature request, bug report, or product idea
2. **Product Integrator/Manager**: Analyzes request, creates acceptance criteria and new issue artifacts
3. **Architect**: Designs technical approach, identifies dependencies, and creates development tasks
4. **Team**: Three parallel work streams:
   - **Engineer**: Implements code changes and ensures tests pass
   - **QA Engineer**: Creates and runs tests, validates functionality
   - **Documenter**: Updates documentation and creates user guides
5. **Sanity Agent**: Performs final validation and manual testing
6. **Decision Point**: Determines if work needs revision or is ready for production, if you work is not ready for a pull request at this step consider evaluating if there are any steps that can increase the accuracy of the artifacts produced by your code
7. **Pull Request**: Final output ready for review and deployment

## Key Features

- **Parallel Processing**: Engineer, QA Engineer, and Documenter work simultaneously
- **Quality Gates**: Sanity Agent provides final validation
- **Iterative Process**: Work can be sent back to the team for revisions
- **Clear Handoffs**: Each role has defined inputs and outputs that are actual artifacts, not temporal data

As I built out this project, I wanted to track the thoughts, tactics, and strategies to help me get the most out of AI. They are recorded below.

Currently, a true fully agentic workflow—one that allows a user to make product decisions and have agents automatically break down and carry out the necessary tasks to fulfill those decisions—does not exist. The process and flow I use to simulate that workflow is described below. First, there are some parameters your project should follow to ensure agents have enough context to be successful.

1. Keep as Many Relevant Artifacts Within the Repository as Possible
   - Include stored procedures, configuration files, and database schemas
   - Maintain API documentation and integration specifications
   - Store environment-specific configurations and deployment scripts
   - Keep architectural diagrams and system design documents
   - Without access to this information, AI will make less optimal decisions and may hallucinate useless code

2. Give Your AI Access to Issue Tracking and Project Management
   - Maintain a text log of issues, bugs, and feature requests
   - Document project priorities and roadmap decisions
   - Include user feedback and requirements gathering notes
   - Consider integrating with issue tracking systems (GitHub Issues, Jira, etc.)
   - Keep track of completed tasks and lessons learned

3. Setup Your AI Rules to Explain Your Process as Much as Possible
   - Create comprehensive prompts that explain your development workflow
   - Document coding standards, conventions, and best practices
   - Include examples of good and bad implementations
   - Consider modifying the AI_Team_Workflow_Prompt.txt to your repository's needs
   - Establish clear guidelines for AI decision-making and code generation

4. Establish Clear Code Organization and Documentation Standards
   - Maintain consistent file structure and naming conventions
   - Include comprehensive README files for each major component
   - Document API endpoints, data models, and integration points
   - Keep architectural decisions and rationale documented

5. Implement Comprehensive Testing Infrastructure
   - Set up automated testing frameworks that AI can understand and extend
   - Include unit tests, integration tests, and end-to-end test examples
   - Document testing patterns and conventions used in the project
   - Ensure test coverage reports are accessible and up-to-date

6. Create Detailed Environment and Configuration Documentation
   - Document all environment variables and their purposes
   - Include setup instructions for development, staging, and production
   - Maintain configuration templates and examples
   - Document deployment processes and infrastructure requirements

7. Establish Clear Git Workflow and Branching Strategy
   - Define branching conventions (feature branches, release branches, etc.)
   - Document commit message standards and PR templates
   - Include code review guidelines and quality gates
   - Maintain a changelog or release notes system

8. Set Up Monitoring and Observability
   - Include logging standards and error handling patterns
   - Document performance monitoring and alerting systems
   - Maintain health check endpoints and status pages
   - Include debugging and troubleshooting guides

9. Create Comprehensive API Documentation
   - Document all external APIs and their authentication methods
   - Include request/response examples and error codes
   - Maintain API versioning strategy and migration guides
   - Document rate limiting and usage policies

10. Establish Security and Compliance Guidelines
    - Document security best practices and vulnerability management
    - Include data privacy and compliance requirements
    - Maintain security audit procedures and incident response plans
    - Document access control and permission systems 

Not all of these need to be done manually too, it is recommended to have AI help you iterate on getting this up as well. 

Now the goal is to get your Agents ready to act as the different roles within the project just as a development team would normally do. While there may be still some things you will have to do manually, especially on work that is more business, configuration, or service based. The agent roles I have found the most success with are the following:

1. Product Integrator/Manager (How does this request fit within the existing vision of the product -> Acceptance Criteria)
2. Architect (How does this request fit within the existing implementation of the product -> Dev, QA, and Sanity Tasks, start branch, outline specs and documentation)
3. QA Engineer (QA Task -> Testing Changes, ok if failing)
4. Engineer (Dev Task -> Code Changes, Passing Tests)
5. Documenter (Doc Task -> Documentaiton Changes)
5. Sanity Agent (Sanity Task -> "Manual"/Manual Tests)

Using these 

Now you are ready to start following the process laid out in AI_Team_Playbook.txt to start building apps as a product person
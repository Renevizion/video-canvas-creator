# AI System Architecture - Production Grade

This is how real AI systems work - **modular agents**, not monolithic prompts.

## Quick Reference

- **Meta-Reasoner**: Routes to the right agent based on input type
- **Story Agent**: Handles text prompts and narratives
- **Brand Agent**: Extracts brand from websites
- **Asset Agent**: Analyzes images/videos/files
- **Data Agent**: Creates data visualizations
- **Goal Agent**: Strategic planning for objectives

Each agent has its own specialized prompt and tools.

See implementation in `/src/ai-system/`

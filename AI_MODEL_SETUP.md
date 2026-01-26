# AI Model Integration Guide

## Current Setup

This video creation system is **model-agnostic** and designed to work with any AI model including:
- Claude Code (with MCP/desktop integration)
- Claude via API
- Gemini Pro/Ultra
- GPT-4
- Other models

## For Best Results with Different Models

### Claude Code (Optimal Experience)
Claude Code has direct MCP (Model Context Protocol) integration which provides:
- ✅ Direct file system access
- ✅ Tool/skill integration
- ✅ Real-time code execution
- ✅ Desktop app integration

**No configuration needed** - Claude Code can directly use all features.

### Gemini (Google AI)
For Gemini models, configure via environment variables:

```env
# Add to .env
VITE_AI_MODEL=gemini
VITE_GEMINI_API_KEY=your_key_here
VITE_AI_TEMPERATURE=0.7
```

**Gemini Recommendations:**
- Use `gemini-1.5-pro` for complex video generation
- Use `gemini-1.5-flash` for faster, simpler videos
- Temperature: 0.7 for creative output
- Max tokens: 8192+ for detailed video plans

### Claude via API
```env
VITE_AI_MODEL=claude
VITE_ANTHROPIC_API_KEY=your_key_here
VITE_CLAUDE_MODEL=claude-3-5-sonnet-20241022
VITE_AI_TEMPERATURE=0.7
```

## System Design Philosophy

The video creation system uses **natural language understanding** at its core:

1. **Prompt Analysis** - Understands what you want
2. **Component Matching** - Finds the right video components
3. **Plan Generation** - Creates a structured video plan
4. **Rendering** - Uses Remotion to actually create the video

This means **ANY** capable AI model can:
- Parse your prompts
- Match to templates
- Generate creative variations
- Produce video plans

## Bridging the Gap

### What Claude Code Offers
- Direct tool access (MCP)
- File system manipulation
- Real-time feedback loop

### What This System Provides (Model-Independent)
- ✅ Pre-built video components (already coded)
- ✅ Template system (no AI coding needed)
- ✅ Keyword matching (simple pattern recognition)
- ✅ Remotion integration (works standalone)

### Making Gemini Work Like Claude Code

The key difference is **how** the AI accesses features:

**Claude Code:** Direct tool/skill access → "Use Remotion skill"
**Gemini:** Template-based → Pre-built patterns + smart matching

**Solution:** The `UsableComponents` registry makes ALL showcase features accessible through simple keyword matching. No need for direct tool access.

```typescript
// Example: User types "music visualization"
// System automatically finds and uses MusicVisualization component
// No AI coding needed - just pattern matching
```

## Recommendation

**For your setup with Gemini:**

1. Use the natural language creator (already implemented)
2. System maps your prompts to working components
3. No need for AI to write code - components are pre-built
4. Focus on describing WHAT you want, not HOW to code it

**This approach is actually BETTER than requiring AI coding because:**
- ✅ Faster (no code generation)
- ✅ More reliable (tested components)
- ✅ Consistent quality (professional templates)
- ✅ Works with any model (no special integration needed)

## Usage Pattern

Instead of: "Claude, use the Remotion skill to create X"
You use: "Create a music visualization" → System uses pre-built component

This is **production-grade** and **model-agnostic**.

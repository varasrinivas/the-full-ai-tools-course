Re-verify tool-capability claims in module $ARGUMENTS.
1. Extract every factual claim about Claude Code or GitHub Copilot features.
2. Check each against current official docs (Anthropic docs, GitHub changelog, VS release notes) via web search.
3. Update wording where behavior changed; bump lastVerified; clear needsVerification flags that now pass.
4. Log a one-line changelog entry per changed claim in PROGRESS.md.

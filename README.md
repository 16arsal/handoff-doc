# handoff-doc

A Claude Code skill that writes, restructures and reviews product handoff docs: the page a developer, tester or stakeholder reads to understand a feature they have never heard of, see what changes, and build or review it without asking.

## What it enforces

- **A fixed order.** The problem today (with its chain and what delays it), goals and constraints, the vocabulary, the exact logic as a decision tree of the user's picks plus a slider over a real record, what changes on each real screen with the text it shows, then an appendix with a testing matrix and the data the logic reads. An outline sits at the top.
- **Rules a new reader needs.** Lead with the point, each fact once, define before use, no abbreviations, one word one meaning, a click path for every button, real data run through the real code, no invented features, cut don't fold.
- **How to build the hard parts.** The logic section from the deciding function, the templates from the product's string builders, Mermaid in an HTML page or artifact, a Markdown copy generated from the page.
- **A review loop, a coherence pass and a pre-publish checklist**, and a mode that turns a meeting's outcome into a decision doc.

## Install

Clone it into your user skills folder. The folder must be named `handoff-doc`, matching `name:` in `SKILL.md`.

```bash
git clone https://github.com/16arsal/handoff-doc ~/.claude/skills/handoff-doc
```

Or copy the folder into a project's `.claude/skills/` to share it with that repo.

## Use

In Claude Code, type `/handoff-doc` followed by what you want:

```
/handoff-doc write the handoff page for ticket ABC-123 from the spec in docs/plan
/handoff-doc review this page, a new reader says it jumps right into the solution
/handoff-doc turn this meeting summary into a decision doc for review
```

Claude also picks the skill up on its own when a request matches its description.

## Files

- `SKILL.md`: the rules, in the order the doc is written.
- `example-outline.md`: a filled-in skeleton on an illustrative feature (an order system's delivery date check).

## Origin

Distilled from several review rounds on real feature handoff pages. Every rule is there because a reader asked for it. Project names, ticket numbers and reviewers' quotes have been removed so the skill applies to any product.

## License

MIT.

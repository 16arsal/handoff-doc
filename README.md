# handoff-doc

A Claude Code skill that turns a decided solution into a handoff doc that every stakeholder can read without asking questions.

## The problem

A product owner's work runs in a loop. A need comes in from a client or a user. You work out the best way to meet it, test the idea against the product's real data and rules, and build a mockup. Then comes the part that takes the longest and shows the least: explaining it. The developer wants every screen and every line of text. The tester wants the cases. The manager wants the goals and the limits. The client wants to see their problem, not your solution. None of them were in the room when the solution took shape, and each of them reads a different page.

Pages written by the people who designed a feature tend to fail those readers in the same ways. They open with the solution before the problem. They use the team's vocabulary before explaining it. They say the same fact in three sections and leave out the one screen the developer needed. The reader asks in a thread, the page gets patched, and the mockup and the spec drift apart.

## What the skill does

You decide the solution. The skill handles the presentation. It writes the page in a fixed order that a reader who has never heard of the problem can follow from top to bottom:

1. **The problem today.** What goes wrong and for whom, the chain of work behind it drawn as a diagram, and one real example with its consequence.
2. **Goals and constraints.** Three outcomes and three hard limits, one line each, before any solution detail.
3. **The vocabulary.** Every new term or state in one table, with what it means and what clears it.
4. **The exact logic.** A decision tree of the user's own picks, and one real record the reader can move along the input that decides the outcome, so two people applying the rules get the same answer.
5. **What changes on each screen.** One tab per screen the change touches, with the click path, the screen itself, and every line of text it adds.
6. **Appendix.** A testing matrix from a real run, and the list of data the logic reads.

An outline sits at the top. A feature with no rules skips section 4, and one that adds no text keeps the screens and drops the text tables. The skill says what to do in each case rather than padding.

The same skill restructures or reviews an existing doc when a reader says it jumps right into the solution, repeats itself, or is hard to follow. It also turns a meeting's outcome into a decision doc for review.

## What you need, and what you get

You need the source (a ticket, a spec or a meeting outcome), a mockup or prototype of the screens the change touches, and ideally the code that decides the outcome, so every number on the page comes from running it. Without code, the skill builds the rules from the spec and marks every value as unverified until a run replaces it.

You get an HTML page, built for desktop review, and a Markdown copy generated from it once the owner calls it final. The companion spec is updated in the same pass, so the page, the mockup and the spec always say the same thing.

## The rules it holds you to

- Lead with the point. A section's first sentence is what the reader must take away.
- Each fact appears once. If a table or diagram says it, the prose does not.
- Define before use, and never use abbreviations.
- Every button or screen named gets its click path.
- Product text reads as professional sentences. Labels are one or two words.
- Cut, don't fold. A cluttered section gets shorter, not hidden behind Show or Hide.
- Real data, or seeded data the code computes. Never an estimate.
- No invented features. Anything extra goes in a separate follow-up doc.

The full list, with the reasoning and examples, is in `SKILL.md`.

## Install

Clone it into your user skills folder. The folder must be named `handoff-doc`, matching `name:` in `SKILL.md`.

```bash
git clone https://github.com/16arsal/handoff-doc ~/.claude/skills/handoff-doc
```

Or copy the folder into a project's `.claude/skills/` to share it with everyone on that repo.

## Use

In Claude Code, type `/handoff-doc` followed by what you want:

```
/handoff-doc write the handoff page for ticket ABC-123 from the spec in docs/plan
/handoff-doc review this page, a new reader says it jumps right into the solution
/handoff-doc turn this meeting summary into a decision doc for review
```

Claude also picks the skill up on its own when a request matches its description.

## Files

- `SKILL.md`: the rules, in the order the doc is written, with how to build the logic section and the screen templates from the code.
- `example-outline.md`: a filled-in skeleton on an illustrative feature, an order system's delivery date check.
- `example/delivery-date-check.js`: the small engine behind that example. Every date in the outline comes from running it, which is the rule the skill holds real pages to.

## Origin

I wrote this as a product owner after several review rounds on real feature handoff pages, where the same feedback kept coming back: start with the problem, say each thing once, show me where the button is. Every rule exists because a reader asked for it. Project names, ticket numbers and the reviewers' quotes have been removed so the skill applies to any product.

## License

MIT.

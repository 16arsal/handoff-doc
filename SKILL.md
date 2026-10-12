---
name: handoff-doc
description: |
  Write, restructure or review a product handoff doc: a feature explainer, spec
  summary, presentation page or artifact for readers who don't know the problem.
  Use when asked to make, fix or present such a doc, a status or tag page, or a
  "one pager", and when feedback says a doc "jumps right into it", is redundant,
  ambiguous, cluttered, not continuous or hard for a new reader to follow. Also
  keeps the companion spec in step with the page. The order is fixed: the problem today
  (its chain and what delays it), goals and constraints, the vocabulary, the exact logic
  as a decision tree of the user's picks and a slider over a real record's date, what
  changes on each real screen with the text it shows, then an appendix with a testing
  matrix and the data the logic reads. An outline sits at the top. Also turns a meeting's
  outcome into a decision doc.
metadata:
  version: "1.0.0"
  author: Arsal
---

# Handoff doc

A handoff doc lets someone who has never heard of the problem understand it, see what
changes, and build or review it without asking. It is written for that reader, not for
the people who designed the feature.

Every rule below exists because a reader of a real handoff page asked for it. The
examples use one illustrative feature throughout: an order system that records the
delivery date promised to a customer, and a check that says whether that date can still
be met. Swap in your own feature, records and screens.

## The order

Write the sections in this order and don't skip ahead. Each one opens with a line that
leads on from the section before, so the doc reads as one argument.

Open the doc with a **lead** of one or two sentences under the title that states only the
problem ("An order promises the customer a delivery date. The system records that date,
but it never checks whether the work behind it can still finish in time"). No solution and
no new vocabulary in the lead: a reader who meets the solution's tags before the problem
asks why the doc showcases a fix for a problem it hasn't explored yet. Goals may name the
fix in one sentence ("This feature adds a check for this"), and goals are written without
assuming the solution's parts. The new vocabulary is introduced at the top of its own
section, in a line that leads on from the problem ("The check looks for the delays in
section 1 and puts each order in exactly one of five states").

Then an **outline**: every section, numbered, linked, with a few words on what it holds.
Number the section headings to match (1, 2 … and A, B for the appendix).

| # | Section | What it must contain | Check |
|---|---|---|---|
| 1 | **The problem today** | The problem in the first sentence, not the background: "An order's promised date can be impossible from the day it is typed, and today nobody finds out until a dispatch run has passed", then why in one more ("most of the work behind the date runs on fixed dates that no one on the order controls…"). Context for a newcomer comes second, in one short paragraph that also introduces the diagram (who sets the date and where the product shows it). When the work is a chain, draw it (Mermaid): every stage as its name and one real value ("Supplier dispatch · next run Oct 20"), no group boxes, no second description line, the record named once in the text rather than on every node, and a legend in plain words ("Runs on fixed dates" / "No fixed dates") with no solution vocabulary. End with one relatable example and its consequence, and fold the other causes into it as one sentence ("A cancelled run, paperwork filed after the cut-off, or a longer customs window can do the same"). There is no separate scenario section: the causes are this sentence. Readers of a denser draft said the writing didn't support what the problem was until they had read the whole section, and asked for anything irrelevant or repeated to be trimmed | Does the first sentence say what goes wrong? Could someone outside the team say why it matters? |
| 2 | **Goals and constraints** | Three goals, each a distinct outcome in one line, written as the state of the world once it works ("From the day a date is typed, the planner knows whether it can be met and which dispatch run it depends on, and the answer stays current"), never as tasks. Three constraints, each a hard limit in one line ("Only fixed dates count, such as dispatch runs and the customs window, never estimates of effort"). Cut detail another section already shows (what the warning names, the list of fixed dates, how linking works) and anything implied ("The planner decides" after "The system never changes a date"). Later sections never restate a constraint | No solution detail yet; no goal starts with a verb; each item fits on one line |
| 3 | **The vocabulary, and what clears each state** | One line that leads on from the problem and counts the states ("Three show a tag; On track and Not checked show nothing"), then one table with a row per state, the no-tag states as muted italic text ("On track (no tag)"), never a pill. Columns: the tag (just the pill), what it means, its term in the ticket (a state the ticket doesn't have reads "Not in the ticket (an addition to confirm)"), and what clears it in a few plain words. The no-tag state that can't be checked carries its conditions in its "Means" cell. How one state is chosen lives in section 4, with the logic it depends on. Name a button only when the ticket asks for one | Labels are one or two words; every button named exists in the product or mockup and is asked for by the ticket |
| 4 | **The exact logic** | One line saying what the section answers ("how the system picks the tag, step by step, so anyone applying the rules gets the same one"), with a pointer to the appendix that lists the data it reads. Then two parts. **What each pick does:** a left-to-right decision tree headed by the user's own choice ("What did the planner pick for the line's source?"), one branch per option under the product's labels, kept separate wherever two options behave differently (Made to order and Drop-shipped), a follow-up question only where an option's effect depends on something ("Has the supplier confirmed a ship date yet?"), and every outcome in one aligned column in plain words about the effect ("Waits for a dispatch run", "Adds the customs window", "Doesn't change the date", "Needs input until it has a ship date") with one real value each. Name the fields the user picks in (the line editor's Source and Stage), and add any other choice that matters, such as "waits for" links between lines, as one sentence under the tree. Readers asked whether the doc said anywhere that the result depends on the user's choices, and asked for a decision tree; three simpler shapes in between (pairs of boxes, a mapping onto the chain, a flat table) all failed. **How the tag is chosen:** two or three sentences define the two dates in plain words ("must finish by", counted back from the promised date; "can finish by", counted forward from today, once as planned and once with one thing slipping), then a slider over one real record's promised date (see "Building the logic section"). The questions read as checks where Yes is fine and the first No decides the tag ("Can the date be met?", "Even if one thing slips?", "Has the system all it needs?"); later questions read "Skipped". A static ladder plus a timeline confused readers, and so did a stack of one-row timelines. Close with the edge rules a reader would otherwise guess at (a missing input counts as no wait; the warning names the line furthest up the chain) and a pointer to the spec | Two people applying it get the same answer; the reader can find the user's choices and their effects |
| 5 | **What changes, step by step, on the real screens** | After the logic, so its intro doesn't redefine the vocabulary ("The tags show where people already work"). One sentence says what the diagram follows and who walks which steps. Then one Mermaid journey with two lanes: today's journey, ending in what goes wrong, and the journey with the change, its steps numbered, one step per screen the change touches; a step that works as it does today keeps today's dashed style and loops back ("The tags update"). No lane per role. Under it, a segmented control: equal segments, each with a number badge, a screen name ("The orders list", "An order", "After a change", "Confirming") and a short hint of what changes there ("tags on every row"), plus one more segment for every new screen the feature adds that isn't a journey step (the supplier "Dispatch calendar" tab, "new in Settings"). Clicking a step in the diagram opens its tab. Each tab: "Where" click path, labelled "Today" and "With …" lines of one short sentence, the real prototype screen captured clean with an HTML pin on each line it adds, then the table of those lines (#, where it shows, template, example). The step that shows the main message holds the message table instead, by state, with a short special-cases table. A line belongs to the screen it lives on and appears in one table only (the supplier's run count moved to the Dispatch calendar tab, not kept in "After a change" too) | A developer can find every surface they need to touch and every sentence on it, in about 20 rows; every new screen has a tab |
| A | **Testing matrix** | Titled for what it holds ("Testing matrix: every case, by the tag it should give"). A short intro says where the cases come from and states the shared set-up once, so the rows list only what differs. One closed group per result (the result's pill and its case count, opening to its own table of ID, case, set-up and result), all from a real run. Cases with the same cause share a row and list every ID ("8 · 10 · 19"). Results are short facts, not the full sentence again, since section 5 holds the templates. Anything a reader needs to understand the feature belongs in the body: readers ask why important information sits in an appendix | Nothing in the body depends on it, the body cites no test numbers, and no two rows say the same thing |
| B | **The data the logic reads** | A plain list, one line per input: its name in bold, where it lives in the product in brackets (pointing to its tab in section 5 when the feature adds it), and what the logic uses it for ("Supplier dispatch runs (Settings → Suppliers → a supplier → Dispatch calendar): when a line can ship, and by when its paperwork is due"). Today's date is the last item. No example values and no "without it" text: cards carrying both read as clutter; what shows when an input is missing lives in the logic and the templates | Every input the logic reads is here, once |

Section 4 applies when the feature has rules, and the step tables in section 5 when it
generates text. For a feature that has neither, drop them; don't pad.

## Rules for the whole doc

- **Lead with the point.** A section's first sentence says what the reader needs to take away; background and context follow. Readers who finish a section before learning its problem ask for a rewrite.
- **Each fact appears once.** If a table, a diagram or an interactive figure already says it, the prose doesn't repeat it, and no later section restates an earlier one. When a figure takes over a paragraph's job, cut the paragraph to what the figure doesn't show ("is this paragraph even required now?"). Cut meta lines ("re-run on…", "test numbers refer to…").
- **Trim to what the reader acts on.** Prefer one line per item, short phrases over sentences in figures, and no example detail the appendix already holds. Two review rounds once cut the problem and goals sections by about a third with nothing lost.
- **Cut, don't fold.** When the owner calls a section, dialog or screen cluttered or ugly, shorten what it says (one line per item, codes instead of titles, a few words instead of a sentence). Hiding the same text behind Show or Hide isn't a fix: a folded dialog gets rejected as fast as the cluttered one ("trim info out of it, don't just collapse it").
- **Every button or screen named gets its click path** from the left nav (Orders → open the order → …), in a column or a "Where:" line. Otherwise the first question is "how do I get to this button?".
- **Headings say something.** "How each pick on the order affects the date" is a heading; "Actions" is not. A short section title ("The three tags") is fine when its outline line says what the section holds. A table's heading states what the table is for.
- **Define before use.** A table or term that later content depends on comes first. Spell out every abbreviation and domain term at first use, or say it in plain words where it first appears ("past the day its paperwork is due" in section 1, before "paperwork cut-off" anywhere else), and replace internal ticket names a newcomer won't know with plain words.
- **Never use abbreviations.** Not for computed values (say "must finish by" and "can finish by", never LF or EF), teams or bodies (the full committee name, never its initials) or agencies (name the regulator once in full, then "the regulator"). Quoted product text keeps the names the product shows.
- **One word, one meaning.** Never reuse a word for two things. On one page "earliest" meant both a line's earliest dispatch ("earliest Jan 14") and the order's earliest finish ("The earliest is Jul 13"); the product line became "earliest dispatch", then the full sentence "…the earliest possible dispatch is Jan 14". Name each area of the app the same way in every section.
- **Product text reads as professional sentences.** Templates copied from the product are what users see, so informal wording is a product bug: "Can't make Apr 30 · ship by Apr 12" becomes "Needs to ship by Apr 12 to meet the Apr 30 delivery date…". When one phrase changes, change it in every string that shares it, and in every template row that quotes it.
- **Say a rule once.** A constraint is not restated as a goal or in a table's intro. Each step's Today and With lines say what changes; the exact strings live only in that step's table.
- **Stay on the subject.** Cut details of neighbouring features the doc isn't about, and gaps in the product's data from "the problem today", which is about the real-world problem; the vocabulary and logic sections cover missing inputs.
- **Name stages for what is counted, and tie them to the product's labels.** A chain's stage is "Customs clearance" when the clearance window is what's counted, not "Paperwork"; where the product's label for that kind of line appears ("Import line"), keep it and name the stage beside it.
- **Say where each example comes from** when the doc mixes sources: the ticket's own dates against the mockup's own records.
- **Grouped tables don't repeat the group.** When group rows carry a tag, drop the per-row tag column.
- **Paragraphs take the full column width**, the same as the tables. No narrower max-width on prose.
- **Charts and tables over prose lists.** If a list compares things, it's a table. If it's a flow or a decision, it's a diagram. If it varies with an input the reader can move (a date), make it interactive.
- **Real data, or seeded data the code computes.** Examples, dates and numbers come from the source: the code, the mockup or the seed data. To explain a case the seed doesn't have, change the record in a copy and run the real code on it ("if the supplier had no dispatch runs"); never estimate. Seeding your own data is fine when it makes the reader understand the problem better.
- **Build the logic and templates from the code.** Read the evaluator and the sentence builders and copy their rules and strings. If the doc and the code disagree, the code wins: fix the doc, or flag the gap.
- **No invented features.** Build only what the source or the ticket asks for. Anything extra goes in a separate follow-up doc, flagged as an addition, never in the page or its mockup. A wording change the page needs goes into the mockup and the spec in the same pass, or into a pending list when the owner says to edit only the page for now.
- **Product labels are one or two professional words**, never a sentence (Off track, At risk, Needs input). The full sentence lives in the message, not the label.
- **Concise, plain prose.** Do a final pass for AI-sounding prose (the humanizer skill, if installed): no dashes, no not-X-but-Y, no bold labels, no staged openers, no one-line closers.
- **Decided, not open.** State the decision and the reason. Questions only for things truly blocked on someone else, and then name who.

## Building the logic section

1. Find the function that decides the state, and list its inputs (they become appendix B).
2. Draw the picks tree: root = the user's choice, one branch per option, a follow-up question only where an option's effect depends on something, outcomes in plain words. In Mermaid use `flowchart LR` and longer links (`stock ---> none`) for branches without a follow-up, so every outcome lands in the same column; let two options share an outcome node when their effect is the same.
3. Build the slider on one real record:
   - Pick a continuous input the reader can move: the promised date. When the product derives it from something else (a schedule that ends on it), move what derives it and check the record's date equals the slider's.
   - For every position, and for each missing-input setting worth showing (no dispatch calendar; a window not set), run the real engine and keep the state, the two dates per line, both chains (as planned, with one miss) and the exact warning the product shows. Template the sentences on their dates (`{D}`, `{N}`, `{A}`) and dedupe them, but check that no other date equal to the substituted one got templated by mistake (a run on the same day).
   - Rebuild the rows from their pattern if they're too long to copy, and compare a checksum of the rows with one the engine computes; both must match.
   - Draw: the readout (date and tag), a track coloured by the tag at every position, the three-question path, a timeline (fixed dates, can finish by, with one miss, the needed-by and promised guides, late parts in the warning colour) and the product's exact warning. Dim a row the current answer makes irrelevant. Without JavaScript, show one sentence listing the zones.
4. Run the code on real records for every other outcome too; those results go in the appendix's testing matrix, not in a second worked table.

## Building the templates (the step tables in section 5)

1. Collect every user-facing string builder: the message, its variants, the list line, the status line, the header, dialog lines and footers, hovers, confirmations, and the new screen's own lines (a schedule's read-back, a row's menu, a count).
2. Write each as a template with `{placeholders}`. Optional parts and variants go in the special-cases table as the words they add ("…with paperwork in by {date}"), not in brackets inside the main template.
3. Put a filled-in example beside each, copied from what the product actually renders. Quote a title inside a quoted message with single quotes (“‘Quarterly Plan’ has no owner yet.”).
4. Group the lines by the screen that shows them. Capture each screen from the mockup with no pins, record each line's box from the final frame (after any resize), and place the pins as HTML over the image. A line shown on two screens (the message, and the hover beside a line's due date) gets a row on each, the second pointing to the first; a line that only belongs to one screen appears once.
5. When a template is built by script, run a pass that turns quotes nested inside a quoted template into single quotes, and check the page for `““` and `””` before publishing.
6. A hover that covers what a pin points at stays out of the capture; the pin's card and the table carry its text instead.

## A decision doc from a meeting

When the owner hands over a meeting's outcome (often a chat summary) and asks to "formalise" it for someone's review:

1. Read the code before writing. List the facts the decision changes, from the source: what is stored, what reads it, who may change it, what is refused. Use the default branch, not an old checkout.
2. Write it in this order: the problem today (the code's facts, each with a real record); what the meeting decided, as numbered points faithful to the summary; the model (terms first, then numbered decisions D1, D2…, each with its reason); a table of how each kind of item behaves under the change; its effect on the features and views it touches; a walk-through on a real record; a build sketch for sizing; the calls left for the owner, each with a recommendation; and the alternatives rejected, one line each.
3. Prove it on real data in the existing prototype before proposing it (which records change state, which new state each one shows).
4. When asked to make it "precise", check every rule against the code's edge cases: what the user can't set by hand (a status derived from its children), what a merge or removal leaves behind (links that outlive the item), what existing data needs (a one-time default), and whether a state should be stored or computed. Restate the corrected rules in the reply, and say what changed from the first draft.
5. Once the owner answers the calls, mark the doc decided, record who decided and when, and link the prototype that runs it.

## Format

**HTML page or artifact.** If the page is published as a claude.ai artifact, load the `artifact-design` skill first. Keep one reading column with tables that scroll on their own. Use color tokens with dark mode. Show tags as the product's pills and buttons as small button chips. A grouped testing matrix is a list of closed `<details>` groups, each summary showing the group's pill and case count, with no fill. Add `<meta charset="utf-8">` as the first line so a local preview doesn't garble curly quotes.

**Class names.** Prefix every component's classes (`.sim-…`, `.scr-…`, `.src-…`), and search the page for a class before using it. A new chart's generic class once re-styled the testing matrix's container and broke the appendix.

**Step tabs.** A segmented control: one container with equal segments, each a number badge, a title and a one-line hint; the selected segment gets the page's surface colour with an accent ring and a filled badge. One column per tab (seven fit at 1440 px); four columns below 1100 px, two below 560 px. The intro under the journey names every tab that isn't a journey step.

**Spec page.** When the owner wants the spec itself as a page, render the repo spec as an HTML artifact: a sticky contents list with the section in view marked, links to the prototype and the handoff page in the header, and local `.md` links shown as repo paths. Rebuild and republish it after every change to the spec. If you convert the Markdown yourself, a wrapped line that starts with a number and a full stop ("  20. If missed…") continues its paragraph; only "1." opens a nested numbered list.

**Mermaid in an artifact.** The claude.ai viewer renders any `<pre class="mermaid">` by itself, so a page that also renders Mermaid shows the diagram twice:
- Keep the source in `<script type="text/x-mermaid" id="…">`.
- Render it yourself with Mermaid from `cdn.jsdelivr.net/npm/mermaid@10`, after `await document.fonts.ready`.
- Remove any old svg before inserting the new one.
- Color it from the page's tokens.
- Keep a numbered-list or table fallback for when Mermaid can't load, and add `[hidden]{display:none!important}`: a `display` rule on the fallback overrides the `hidden` attribute, so without it the fallback shows under the diagram.
- Use markdown strings for line breaks, never `<br/>`, and rectangles, not diamonds: long text in a diamond explodes in size.
- Journey lanes are subgraphs with no links between them: give each `direction LR`, or Mermaid draws each lane top to bottom. Unlinked lanes stack in reverse order of definition, so define the bottom lane first. A subgraph's own direction is ignored once any of its nodes links outside it.
- Give each diagram a one-line legend under it that says what each node style means, in the section's own vocabulary.

**Markdown copy.** Regenerate it only when the owner says the page is final:
- generate it from the page's HTML (tables, Mermaid sources, lists) rather than retyping, so the text matches;
- tables stay tables, lists stay lists, and each Mermaid source becomes a fenced `mermaid` block;
- an interactive figure becomes a table of its zones, each with the deciding question and the exact sentence for one example position;
- pills become bold, and "no tag" states become italic;
- the copy opens with a line naming the page and version it was made from.

## Review loop

- **Comments:** when the owner leaves comments on the page, read all of them and implement every one. A comment's anchor tells you what "this" means; a drawn region's "[inside region]" rows say which part. When the page has changed since, trust the location line.
- **Threads:** when the owner says to keep them, never resolve them. Reply only in threads that were sent to you, say in the reply what changed and in which version, and keep the session reply to one line.
- **Tag and label changes:** these are product decisions. Carry them into the mockup and the spec in the same pass, and say so; when the owner defers the other files, keep a pending list and do them all when they say "done".

## Coherence pass

Run it before every publish, and whenever the owner asks whether the doc flows or is redundant:

1. Read the whole page top to bottom as someone new to the ticket. Note every term, abbreviation or label used before it is explained, and move the explanation to its first use.
2. List every fact that appears twice. Keep it in the section that owns it and cut or shorten the rest.
3. List everything that isn't about the doc's subject, or that a builder wouldn't act on, and cut it.
4. Check every cross-reference ("the second column", "below", "see section 5") points where it says, after every section move or merge, and rewrite the intro of the section that now follows.
5. Check each section's first line leads on from the one before.
6. After a scope change (the feature becomes information only, a button is cut), check every section and diagram for what assumed the old scope, the journey first.
7. Re-run the code for any example you reworded or moved.
8. Check every "not built yet" or "blocked by" claim against `git log` and the code before trusting it: a spec can go on calling a dependency unbuilt days after it merged.

**Companion spec.** When the page's facts change (a label, a click path, a case, a tag name, a product sentence), update the main spec in the same pass, with the same vocabulary, and add a decision row for any wording the product changes. Then regenerate any rendered copies (the spec page, a shared Markdown copy). After every republish of the prototype or the page, update each version number that names it: the spec's header, the one-pagers, the spec page and this skill's example outline if it cites one.

## Before publishing

- Check the page at 1440 and 1024 wide, in light and dark: no sideways scroll, no console errors, every diagram drawn once with no clipped labels, every tab, pin, card and slider position working.
- Re-run the code for every number on the page.
- Do the final scan for AI-sounding prose.
- When the page is final, regenerate the Markdown copy.

See `example-outline.md` in this folder for the illustrative feature, shown as a filled-in skeleton.

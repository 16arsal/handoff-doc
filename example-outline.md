# Example: a "Delivery date check" page, as a filled-in skeleton

This is an illustrative feature, not a real product: an order system that records the delivery date promised to a customer, and a check that says whether that date can still be met. Each section is cut down to its shape; the notes in brackets say what the full page holds. Every date and tag below comes from running `example/delivery-date-check.js`, a small engine for the feature with today fixed at Oct 13, 2026; change its records to test another case. Swap in your own feature, records and screens.

---

*ORD-123 · Orders · Delivery date check*

# Can the order still arrive by the promised date?

An order promises the customer a delivery date. The system records that date, but it never checks whether the work behind it can still finish in time.

(The lead states the problem only. No tags, no solution.)

**Outline**

1. The problem today: The chain of work behind each date, what can delay it, and what the system misses
2. Goals and constraints: What the check should achieve, and its limits
3. The three tags: Each tag, its term in the ticket, and what clears it
4. The logic behind each tag: How each pick on the order affects the date, and the questions that pick the tag
5. What changes in the product: Each step of the journey, on its screen, with the text it shows
A. Testing matrix: Every case, by the tag it should give
B. The data the check reads: Each input, and where it lives in the product

## 1. The problem today

An order's promised date can be impossible from the day it is typed, and today nobody finds out until a dispatch run has passed. Most of the work behind the date runs on fixed dates that no one on the order controls: the supplier ships only on its dispatch runs, imported lines then sit in a set customs window, and the carrier's route runs on scheduled days.

The date comes from the sales order. When a customer confirms, the order carries one promised delivery date, shown in the product as its due date. The diagram follows order `SO-1042`…

(Mermaid, one row, each stage its name and one value: picking and packing "usually days" ⇢ supplier dispatch "next run Oct 20" → customs window "five working days" → carrier route "Tuesdays and Fridays" → promised date "Nov 7". Legend: "Runs on fixed dates / No fixed dates".)

> `SO-1042` promises Nov 7, which works only if its drop-shipped line goes out on the Oct 20 run. If it misses that run, the next is Nov 3, and the order can't arrive before Nov 10: three days after the date promised to the customer. A cancelled run, paperwork filed after the cut-off, or a longer customs window can do the same. Nothing on the order says so today.

(No separate scenario section: the causes are the example's last sentences.)

## 2. Goals and constraints

The feature adds a check for this.

- **Goals** (three, one line each): the planner knows from day one whether a date can be met and which run it depends on, and the answer stays current; no false alarms and no false all-clears; every doubtful date is fixed before the customer is told, or kept as a deliberate, recorded choice.
- **Constraints** (three, one line each): only fixed dates count, never estimates of effort; the system never changes a date or a calendar on its own; supplier dispatch calendars aren't in the product yet, and most orders don't link their lines in order.

## 3. The three tags

The check looks for the delays in section 1 and puts each order in exactly one of five states. Three show a tag; On track and Not checked show nothing.

| Tag | Means | In the ticket | What clears it |
|---|---|---|---|
| **Off track** | The date can't be met even if everything runs as planned | "Impossible date" | A later promised date, or an earlier run |
| **At risk** | The date holds only if nothing slips: one missed run breaks it | "Tight date" | A later promised date, or the run shipping |
| **Needs input** | The check can't finish: a line has no slot or route, or the lines aren't linked in order | Not in the ticket (an addition to confirm) | The missing pick, or the links |
| *On track (no tag)* | The date holds even with one slip | "Fine" | |
| *Not checked (no tag)* | No promised date, or no lines | Not in the ticket (an addition to confirm) | |

(The no-tag states are italic text. No ladder here: section 4 holds how one tag is chosen.)

## 4. The logic behind each tag

This is how the system picks the tag, step by step, so anyone applying the rules gets the same one. Appendix B lists the data it reads, and where each piece lives in the product.

### How each pick on the order affects the date

How a line affects the date depends on what the planner picks for it in the line editor: its Source (stock, made to order, or drop-shipped) or its Stage (a carrier leg).

(Mermaid `flowchart LR`: "What did the planner pick for the line?" → Stock → "Is it in the warehouse?" → Yes: "Doesn't change the date", No: "Waits for the supplier's next dispatch run, SO-1042: Oct 20"; Made to order → "Is its production slot booked?" → Yes: "Adds the slot, then the run after it", No: "Needs input until a slot is booked"; Drop-shipped ---> "Waits for the supplier's runs, then adds the customs window, five working days"; Carrier leg → "Is its route confirmed?" → Yes: "Adds the route's next days, Tuesdays and Fridays", No: "Needs input, or no tag while the leg has no date"; Anything else ---> "Doesn't change the date". Legend: "Adds fixed time / Needs input / Doesn't change the date". Hidden table fallback.)

The planner's "waits for" links are a pick too. The system follows them to put the lines in order, as in section 1's chain, and if the lines aren't linked in order the order reads **Needs input** (`SO-1077`)…

### Two dates for every line, and the three questions that pick the tag

The system counts back from the promised date to the day each line **must finish by**, and forward from today to the day it **can finish by**, once as planned and once with one thing slipping. Drag `SO-1042`'s promised date to watch three questions compare them; the first "no" decides the tag.

(The slider, Oct 1 to Dec 31, 92 positions × 3 missing-input settings, every one a real engine result checked by checksum: a readout of the date and its tag; a track coloured by tag (nothing missing: Off track to Oct 26, At risk Oct 27 to Nov 9, On track from Nov 10) with "▲ as promised" at Nov 7; a "Missing input" switch (Nothing, No dispatch calendar, Customs window not set; with either missing, Off track to Oct 19 and Needs input from Oct 20); the path "1 Can the date be met? · 2 Even if one thing slips? · 3 Has the system all it needs?", each Yes, No or Skipped; a timeline of the supplier's runs, can finish by, and with one miss, with the moving "Ship by" and promised date guides; and "The product shows" with the exact warning.)

A missing input counts as no wait at all, the kindest case. A date that fails even then is Off track straight away… The spec has the exact counting rules.

## 5. What changes in the product

The tags show where people already work. The diagram follows an order from confirmation to delivery, today and with the change. The planner walks all of it; a line's owner meets steps 3 and 4 on their own line.

(Mermaid flowchart, two lanes: "Today", four steps ending in "Finds out late", and "With the check", five numbered steps, "4 · Works as usual" dashed and looping back to step 1. Clicking a step opens its tab.)

(A six-segment control: 1 The orders list "tags on every row", 2 An order "the warning, and why", 3 A line "its tag beside Due", 4 After a change "the tags update", 5 Confirming "what's in doubt", 6 Dispatch calendar "new in Settings". Each tab: Where, Today and With the check lines; the real screen with HTML pins numbered from 1; the table of its lines.)

**Step 1 · The orders list**

- **Where:** Orders → open the list
- **Today:** Due dates only, and Overdue once a date has passed.
- **With the check:** Each order's row shows its tag, the header counts them, and the line each date depends on gets a line of its own.

| # | Where it shows | Template | Example |
|---|---|---|---|
| 1 | The list header | {n} off track · {n} at risk · {n} need input | 1 off track · 2 at risk · 3 need input |
| 2 | Hovering a row's tag | {The warning for its tag, from step 2} | Can be delivered by Nov 7 only if line 1 ships on the Oct 20 run. Missing it moves delivery to Nov 10. |
| 3 | Under the line the date depends on | Must ship by the {run} run to meet the {promised} delivery date; the earliest possible dispatch is {next run}. | Must ship by the Oct 20 run to meet the Nov 7 delivery date; the earliest possible dispatch is Oct 20. |
| 4 | Under a carrier leg with no route | Needs a confirmed route before the date can be checked. | Needs a confirmed route before the date can be checked. |

(Step 2 holds the warning table by tag, one row each: Off track "Can't be delivered by {promised}. The earliest possible delivery is {as planned}."; At risk "Can be delivered by {promised} only if {line} ships on the {run} run. Missing it moves delivery to {with one miss}."; Needs input "Can't be checked until {line} has {what is missing}."; and a short "When the case is less simple" table. Step 3 holds the hover beside Due and Ships by; step 4 the message after any change; step 5 the confirmation dialog's three groups, one short line per order, its incomplete lines and its footer; the Dispatch calendar tab its summary count, schedule, upcoming runs with their ⋮ menu, and "Add a one-off run".)

*Appendix*

## A. Testing matrix: every case, by the tag it should give

Every case is an order with a drop-shipped, stock or made-to-order line followed by a carrier leg, checked on Oct 13, 2026 against the supplier's fortnightly Tuesday runs, a five-working-day customs window and a Tuesday-and-Friday route. The rows list only what differs.

(Five closed groups, one per result, each opening to its own table; cases with the same cause share a row; every result from the script.)

| ID | Case | Set-up | Result |
|---|---|---|---|
| SO-1060 | Stock line not in the warehouse, promised before the first run can deliver | Promised Oct 16 | **Off track**: earliest delivery Oct 20 |
| SO-1042 · SO-1058 | A line that needs the Oct 20 run, promised before the Nov 3 run can deliver | Promised Nov 7 · Oct 23 | **At risk**: a miss moves delivery to Nov 10 · Nov 3 |
| SO-1063 | Made to order, no production slot | Promised Nov 20 | **Needs input**: no slot |
| SO-1074 | Carrier leg with no confirmed route | Promised Nov 20 | **Needs input**: no route |
| SO-1077 | Lines not linked in order | Promised Nov 20 | **Needs input**: not linked |
| SO-1051 · SO-1069 · SO-1085 | Stock in the warehouse, a booked slot, or a date past the second run | Promised Oct 16 · Nov 20 · Dec 18 | *On track* |
| SO-1080 | No promised date | | *Not checked* |

## B. The data the check reads, and where each piece comes from

(A plain list of six lines: supplier dispatch runs, the customs window, the carrier's route days, each line's pick, date and slot, "waits for" links, and today's date. Each: the name in bold, where it lives in brackets, and what the check uses it for.)

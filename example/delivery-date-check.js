// The illustrative feature behind example-outline.md: an order system that records the
// delivery date promised to a customer, and a check that says whether that date can still
// be met. Every date in example-outline.md comes from this script's output.
//
// Run it with:  node example/delivery-date-check.js   (or: bun example/delivery-date-check.js)
// Change the records at the bottom to test another case.

const TODAY = iso("2026-10-13"); // a Tuesday

const settings = {
  // The supplier ships on these runs (every second Tuesday).
  dispatchRuns: ["2026-10-20", "2026-11-03", "2026-11-17", "2026-12-01", "2026-12-15", "2026-12-29"].map(iso),
  // Working days an imported line sits in customs after its run.
  customsWorkingDays: 5,
  // The carrier's route runs on Tuesdays and Fridays and delivers the same day.
  carrierDays: [2, 5],
};

// ---- date helpers -------------------------------------------------------------------

function iso(s) { return new Date(s + "T00:00:00Z"); }
function fmt(d) { return d ? d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" }) : "none"; }
function addDays(d, n) { const x = new Date(d); x.setUTCDate(x.getUTCDate() + n); return x; }
function isWorkingDay(d) { const w = d.getUTCDay(); return w !== 0 && w !== 6; }
function addWorkingDays(d, n) { let x = d; while (n > 0) { x = addDays(x, 1); if (isWorkingDay(x)) n--; } return x; }
function nextRunOnOrAfter(d, skip = 0) { return settings.dispatchRuns.filter((r) => r >= d)[skip] ?? null; }
function nextCarrierDayOnOrAfter(d, skip = 0) {
  let x = d, seen = 0;
  for (let i = 0; i < 60; i++) { if (settings.carrierDays.includes(x.getUTCDay())) { if (seen === skip) return x; seen++; } x = addDays(x, 1); }
  return null;
}

// ---- the picks tree: what each line does to the date --------------------------------
// Returns { ready, fixed, run?, needsInput?, missing? } for one line, given when the previous line
// is ready. `missOne` makes the first fixed-date wait slip to its next occurrence.

function lineEffect(line, from, missOne, missing) {
  const skip = missOne && !missOne.used ? 1 : 0;
  const take = () => { if (skip) missOne.used = true; };
  switch (line.source) {
    case "stock":
      if (line.inWarehouse) return { ready: from, fixed: false };
      if (missing.has("dispatchRuns")) return { ready: from, fixed: false, missing: "the supplier's dispatch calendar" };
      take(); { const run = nextRunOnOrAfter(from, skip); return { ready: run, fixed: true, run }; }
    case "made-to-order":
      if (!line.slotBooked) return { ready: from, fixed: false, needsInput: "a production slot" };
      take(); { const run = nextRunOnOrAfter(line.slotDate > from ? line.slotDate : from, skip); return { ready: run, fixed: true, run }; }
    case "drop-shipped": {
      if (missing.has("dispatchRuns")) return { ready: addWorkingDays(from, settings.customsWorkingDays), fixed: false, missing: "the supplier's dispatch calendar" };
      take(); const run = nextRunOnOrAfter(from, skip);
      const cleared = missing.has("customsWindow") ? run : addWorkingDays(run, settings.customsWorkingDays);
      return { ready: cleared, fixed: true, run, missing: missing.has("customsWindow") ? "the customs window" : undefined };
    }
    case "carrier-leg":
      if (!line.routeConfirmed) return { ready: from, fixed: false, needsInput: "a confirmed route" };
      take(); return { ready: nextCarrierDayOnOrAfter(from, skip), fixed: true };
    default:
      return { ready: from, fixed: false };
  }
}

// ---- the check: one order, one promised date ----------------------------------------

function check(order, promised = order.promised, missing = new Set()) {
  if (!promised || order.lines.length === 0) return { tag: "Not checked", why: "no promised date or no lines" };
  if (!order.linked) return { tag: "Needs input", why: "lines aren't linked in order", message: `Can't be checked until the lines on ${order.id} are linked in order.` };

  const walk = (missOne) => {
    let ready = TODAY, firstRun = null, needsInput = null, incomplete = null;
    for (const line of order.lines) {
      const e = lineEffect(line, ready, missOne, missing);
      if (e.needsInput && !needsInput) needsInput = { line, what: e.needsInput };
      if (e.missing && !incomplete) incomplete = { line, what: e.missing };
      if (e.run && !firstRun) firstRun = { line, run: e.run };
      ready = e.ready;
    }
    return { delivery: ready, firstRun, needsInput, incomplete };
  };
  const planned = walk(null);
  const slipped = walk({ used: false });
  const base = { promised, asPlanned: planned.delivery, withOneMiss: slipped.delivery, firstRun: planned.firstRun };

  if (planned.delivery > promised)
    return { ...base, tag: "Off track", message: `Can't be delivered by ${fmt(promised)}. The earliest possible delivery is ${fmt(planned.delivery)}.` };
  if (planned.needsInput)
    return { ...base, tag: "Needs input", message: `Can't be checked until ${planned.needsInput.line.id} has ${planned.needsInput.what}.` };
  if (planned.incomplete)
    return { ...base, tag: "Needs input", message: `Can't be checked without ${planned.incomplete.what}; as far as it can see, ${fmt(promised)} can be met.` };
  if (slipped.delivery > promised) {
    const r = planned.firstRun;
    return { ...base, tag: "At risk", message: `Can be delivered by ${fmt(promised)} only if ${r.line.id} ships on the ${fmt(r.run)} run. Missing it moves delivery to ${fmt(slipped.delivery)}.` };
  }
  return { ...base, tag: "On track" };
}

// The line under a drop-shipped line: the latest run that still meets the promised date.
function lineUnder(order, promised) {
  const r = check(order, promised);
  if (!r.firstRun) return null;
  const latest = [...settings.dispatchRuns].reverse().find((run) => {
    const cleared = addWorkingDays(run, settings.customsWorkingDays);
    return nextCarrierDayOnOrAfter(cleared) <= promised;
  });
  return `Must ship by the ${fmt(latest)} run to meet the ${fmt(promised)} delivery date; the earliest possible dispatch is ${fmt(r.firstRun.run)}.`;
}

// ---- the records --------------------------------------------------------------------

const orders = [
  { id: "SO-1042", promised: iso("2026-11-07"), linked: true, lines: [
    { id: "line 1", source: "drop-shipped" },
    { id: "line 2", source: "carrier-leg", routeConfirmed: true } ] },
  { id: "SO-1051", promised: iso("2026-10-16"), linked: true, lines: [
    { id: "line 1", source: "stock", inWarehouse: true },
    { id: "line 2", source: "carrier-leg", routeConfirmed: true } ] },
  { id: "SO-1058", promised: iso("2026-10-23"), linked: true, lines: [
    { id: "line 1", source: "stock", inWarehouse: false },
    { id: "line 2", source: "carrier-leg", routeConfirmed: true } ] },
  { id: "SO-1060", promised: iso("2026-10-16"), linked: true, lines: [
    { id: "line 1", source: "stock", inWarehouse: false },
    { id: "line 2", source: "carrier-leg", routeConfirmed: true } ] },
  { id: "SO-1063", promised: iso("2026-11-20"), linked: true, lines: [
    { id: "line 1", source: "made-to-order", slotBooked: false },
    { id: "line 2", source: "carrier-leg", routeConfirmed: true } ] },
  { id: "SO-1069", promised: iso("2026-11-20"), linked: true, lines: [
    { id: "line 1", source: "made-to-order", slotBooked: true, slotDate: iso("2026-10-28") },
    { id: "line 2", source: "carrier-leg", routeConfirmed: true } ] },
  { id: "SO-1074", promised: iso("2026-11-20"), linked: true, lines: [
    { id: "line 1", source: "drop-shipped" },
    { id: "line 2", source: "carrier-leg", routeConfirmed: false } ] },
  { id: "SO-1077", promised: iso("2026-11-20"), linked: false, lines: [
    { id: "line 1", source: "drop-shipped" },
    { id: "line 2", source: "carrier-leg", routeConfirmed: true } ] },
  { id: "SO-1080", promised: null, linked: true, lines: [
    { id: "line 1", source: "stock", inWarehouse: true } ] },
  { id: "SO-1085", promised: iso("2026-12-18"), linked: true, lines: [
    { id: "line 1", source: "drop-shipped" },
    { id: "line 2", source: "carrier-leg", routeConfirmed: true } ] },
];

// ---- output -------------------------------------------------------------------------

const so1042 = orders[0];
console.log(`Today: ${fmt(TODAY)}, 2026\n`);
console.log("== SO-1042, the record the outline follows ==");
const r = check(so1042);
console.log(`promised ${fmt(r.promised)} · as planned ${fmt(r.asPlanned)} (run ${fmt(r.firstRun.run)}) · with one miss ${fmt(r.withOneMiss)} · ${r.tag}`);
console.log(`warning: ${r.message}`);
console.log(`under line 1: ${lineUnder(so1042, so1042.promised)}\n`);

console.log("== Slider: SO-1042's promised date from Oct 1 to Dec 31 ==");
for (const setting of [new Set(), new Set(["dispatchRuns"]), new Set(["customsWindow"])]) {
  const zones = [];
  for (let d = iso("2026-10-01"); d <= iso("2026-12-31"); d = addDays(d, 1)) {
    const tag = check(so1042, d, setting).tag;
    const last = zones[zones.length - 1];
    if (last && last.tag === tag) last.to = d; else zones.push({ tag, from: d, to: d });
  }
  const label = setting.size ? [...setting].join(", ") : "nothing missing";
  console.log(`${label}: ` + zones.map((z) => `${z.tag} ${fmt(z.from)} to ${fmt(z.to)}`).join(" · "));
}

console.log("\n== Testing matrix: every record, by the tag it gets ==");
console.log("id      | promised | lines                                   | as planned | one miss | tag");
for (const o of orders) {
  const c = check(o);
  const lines = o.lines.map((l) => l.source + (l.inWarehouse === false ? " (not in warehouse)" : "") + (l.slotBooked === false ? " (no slot)" : "") + (l.routeConfirmed === false ? " (no route)" : "")).join(" → ");
  console.log(`${o.id} | ${fmt(o.promised).padEnd(8)} | ${(o.linked ? lines : lines + " (not linked)").padEnd(39)} | ${fmt(c.asPlanned).padEnd(10)} | ${fmt(c.withOneMiss).padEnd(8)} | ${c.tag}${c.message ? " · " + c.message : ""}`);
}

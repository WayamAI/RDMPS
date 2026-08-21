# RDPMS icon sprite — generation prompts

The board uses one sprite, `public/icon-sprite.svg`, holding 21 `<symbol>` elements on a
24×24 grid. Every icon inherits colour from the page via `stroke="currentColor"`, so the
prompts below must never bake in a colour.

---

## 1. House style (prepend this to every icon prompt)

```
Draw a single line icon on a 24×24 viewBox.

Rules:
- Output SVG only, no markdown fence, no commentary.
- Wrap all geometry in:
  <g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
- Strokes only. No fill, no gradients, no filters, no <style>, no hard-coded colours.
- Keep all geometry inside x/y 2–22 (a 2px safe margin on every edge).
- Geometric and schematic, not illustrative: straight lines, right angles, 45° diagonals,
  circles and rounded rects. Think railway signalling schematic, not a friendly app icon.
- 3–8 primitive shapes maximum. Legible at 20px.
- Consistent optical weight with the rest of the set: no dense hatching, no icon that is
  mostly one huge circle, no text or numerals.
- Return it as: <symbol id="{ID}" viewBox="0 0 24 24"> … </symbol>
```

## 2. Per-icon prompts

Substitute `{ID}` with the id in the first column.

| id | Used for | Prompt (append after the house style) |
|---|---|---|
| `i-point` | Point Machines, Point IoT Node | A railway point/switch: two rails running left to right, one branching away at 45° to the upper right, with a small filled-look circle marking the switch blade pivot and a sleeper line beneath. |
| `i-track` | DC Track Circuits, Track Circuit IoT | A section of track seen in plan: two long parallel rails crossed by three evenly spaced sleepers, plus a small bonded-connection stub tapping one rail. |
| `i-signal` | Signals (Main/Call/Shunt), Signal IoT Node | A railway colour-light signal head: a vertical mast on a small base, topped by a rounded rectangle housing three stacked lamp circles. |
| `i-power` | IPS Power Supply, IPS/Room IoT Node, Power & Earthing | A power supply: a lightning bolt inside a rounded rectangle, with two short terminal stubs leaving the right edge. |
| `i-shield-bolt` | ELB / SPD / ELD surge protection | A protective shield outline with a lightning bolt striking down into it, the bolt breaking the shield's top edge. |
| `i-room` | Equipment Rooms | A relay room seen from the front: a simple building outline with a pitched top, one door, and a small equipment rack of two horizontal shelves inside. |
| `i-sensor` | Non-Intrusive Sensors, 4G/5G Backup | A split-core clamp sensor: an open C-shaped ring around a vertical conductor line, with a short lead running off to the lower right. |
| `i-gateway` | MQTT Client | A gateway node: a rounded rectangle with three short lines entering the left edge and one thicker line leaving the right edge. |
| `i-antenna` | Edge-of-Network IoT, RailTel OFC / IP-MPLS | A mast antenna: a vertical pole on a small tripod base, with two nested arcs radiating from its tip to the upper right. |
| `i-broker` | MQTT Broker | A message broker: a central rounded square with three lines fanning in from the left and three fanning out to the right, each outer line ending in a small dot. |
| `i-cloud` | Future CCSP Network, Railway Cloud Copy | A cloud outline drawn as three overlapping arcs on a flat base line, with one short vertical uplink stub descending from its underside. |
| `i-dashboard` | Web Dashboards, JE/SSE Dashboard, Railway Dashboard | A dashboard screen: a rounded rectangle divided into one tall left panel and two stacked right panels, on a short centred stand. |
| `i-phone` | Maintainer App | A handheld device: a tall rounded rectangle with a speaker slot at the top, a small home indicator at the bottom, and a single notification dot near the top right corner. |
| `i-shield` | Per-Vendor PKI | A certificate shield: a plain shield outline with a small keyhole (circle over a short vertical slot) centred inside it. |
| `i-clock` | GPS / IRNSS Clock | A master clock: a circle with hour and minute hands set to roughly 10:10, and two short satellite-signal arcs radiating from the upper right outside the dial. |
| `i-gauge` | Hard-Logic Engine, AI / ML Analytics | A gauge: a semicircular arc dial with three tick marks along it and a needle pointing to the upper right from a small pivot dot. |
| `i-file-json` | Topic AuthZ & ACL, Ingestion Engine | A data document: a page outline with a folded top-right corner, and inside it a pair of facing curly braces with a dot between them. |
| `i-bell` | Alert Engine | An alarm bell: a bell outline with a flat clapper line beneath it, and two short emphasis strokes radiating from its upper left and upper right. |
| `i-merge` | Aggregator | A merge/aggregation node: three lines entering from the left at different heights, converging into a single line that exits right, with a small dot at the convergence point. |
| `i-users` | Feedback Loop, ASTE / DSTE Console | Two people: a larger head circle with shoulders arc in front, and a second smaller head with a partial shoulders arc offset behind it to the right. |
| `i-db` | Store & Forward, Discovery Registry, Cloud Data Lake, SMMS (CRIS) | A database cylinder: an ellipse on top, two vertical side walls, a curved bottom, and one horizontal division ellipse across the middle. |


## 3. Batch prompt (all 21 in one shot)

```
You are generating an icon sprite for a railway signalling telemetry dashboard.

[paste the house style block from §1]

Produce all 21 symbols in one file, in this order, wrapped in:
<svg xmlns="http://www.w3.org/2000/svg" style="display:none"> … </svg>

Then, for each row of the table in §2, emit one <symbol> using the given id and prompt.
Do not restate the prompts in the output. Do not add a legend or preview markup.
```

## 4. If you use an image model instead of an SVG model

Raster output must be vectorised afterwards, so bias the prompt hard toward clean geometry:

```
Minimal monochrome line icon, {subject description from the table}, pure black strokes on a
pure white background, uniform 1.5px stroke weight, rounded caps and joins, flat 2D, front-on
orthographic view, geometric schematic style, centred with generous even margin, no fill,
no shading, no gradient, no perspective, no texture, no text, no drop shadow, no frame,
single icon only.
```

Then trace to SVG, snap to the 24×24 grid, strip every `fill`/`stroke` colour attribute, and
replace with `stroke="currentColor"` before pasting into `public/icon-sprite.svg`.

## 5. Acceptance checks before merging a new icon

- Renders correctly at 20px, 24px and 26px (the sizes used on the board and in the strip).
- Uses `currentColor` only — confirm by toggling the accent colour; the icon must follow it.
- No geometry outside x/y 2–22.
- Optical weight matches its neighbours in the same band (compare side by side in band 01).
- The symbol id matches the `icon:` value in `src/components/home/diagramModel.ts`.

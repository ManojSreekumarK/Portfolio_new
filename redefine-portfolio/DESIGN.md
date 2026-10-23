# Manoj Sreekumar portfolio: design plan

## Brief

- **Subject:** Manoj Sreekumar, web designer and front-end developer in Kerala, India, open to
  freelance work. Facts come from his previous portfolio (manoj-portfolio-swart.vercel.app), his
  GitHub (ManojSreekumarK) and his three live project sites. "Redefine" is only the project folder's
  name; Redefine Labs is a studio whose design he likes, not his own.
- **Audience:** clients looking for someone who can design a site and build it; hiring teams.
- **Job:** get freelance enquiries. Leave with "he thinks clearly and builds precisely" and an email.
- **Assets:** the magenta M logo (solid and outline), near-black ground, Orbitron / Space Grotesk /
  Space Mono, film grain, a hero that layers a blurred copy of the name over a sharp one, a live
  clock, his email, three real concept sites with live links, his skills list, the Tron quote.
- **Constraints:** the existing Angular 21 project (zoneless, standalone, now prerendered with
  `@angular/ssr`).

## Concepts

| | A. The M kit (identity) | B. Definition, as in optics (material) | C. Other side of the screen (his quote) |
|---|---|---|---|
| Idea | Every layout is built from the three pieces of the M logo | The site is a lens: things arrive soft and are pulled into definition as you reach them | The site shows the back of every interface before the front |
| Anchor | his logo | the hero Manoj already drew: a blurred ghost of the name over a sharp one | the Tron line on his old site |
| Motion verb | slot together | pull focus: soft to sharp, with a breath of scale | flip |
| Signature | the logo disassembles into the page grid | headings sharpen as they cross the focal band; a focus scale turns from 0.45 m to ∞ | cards flip to their code |
| O / F / Fe / P | 3 / 3 / 3 / 3 | 4 / 5 / 4 / 2 | 3 / 4 / 3 / 3 |

**Pick B.** It grows out of the hero he already designed, it explains the work in one word (taking a
blurry request to a sharp site) and gives a full rule system: focal band, focus scale, aperture iris,
EXIF clock. From C: the About headline, "Making the other side of the screen look easy".

## Concept card

```
Idea:        The site is a lens. Everything arrives soft and is pulled into definition as you reach it.
Metaphor:    a camera lens: focus ring, depth of field, aperture, the timestamp written into a photo.
Signature:   the focus pull. Display headings carry a blurred magenta ghost; one driver maps each heading's
             distance from the focal band (viewport middle) to sharpness, and a focus scale on the right edge
             turns with scroll, reading out the distance of the page in focus.
Emotion:     the first 3 seconds feel like a camera finding focus on a name.
Motion verb: pull focus. Soft to sharp, with a breath of scale, expo.out.
Screenshot:  MANOJ SREEKUMAR in Orbitron across the screen, the magenta ghost blooming off it, the outline M
             behind, the focus scale at 0.45 m.
```

## Art direction

| Role | Hex | Use |
|---|---|---|
| ground | `#0d0b08` | warm near-black, kept from the original |
| ground-2 | `#17130e` | plates, previews, the figure card |
| ink | `#f2eee8` | text |
| muted | `#9b958b` | secondary text (6.6:1 on ground) |
| line | `rgb(242 238 232 / 0.14)` | hairlines, ticks |
| accent | `#ff2bf6` | his logo magenta: ghosts, focus marks, the CTA fill, the figure's lit part (6.5:1) |

Near-black plus one hot accent is on the avoid list; here it is the owner's logo colour and it has a
job (the out-of-focus bloom), so it stays, used sparingly.

**Type:** Orbitron 900 for names only (hero, case titles, footer sign-off, 404). Space Grotesk 500 for
display headings (tight, negative tracking) and text. Space Mono for the instrument layer (scale,
clock, meta, captions), in sentence case. All self-hosted woff2.

**Grid:** 12 columns, fluid gutter, a right rail reserved for the focus scale on desktop. Text hangs
from columns 1, 5 and 9. Radius 0 except the phone frame.

**Hover treatments:** nav = focus roll (the incoming copy arrives blurred and lands sharp); project
rows = title slides on its column line, a magenta rule draws, a screenshot preview pulls focus beside
the pointer; CTA = magenta floods from the pointer's side; inline links = underline that rises into a
band; utility links = colour.

**Transitions:** an aperture iris (six blades) closes on the click point and reopens on the new page.

**Idle:** the hero name (and each page's h1) breathes slightly and hunts focus with pointer speed,
like contrast-detect autofocus. Off under reduced motion.

## Composition

```
HOME     poster hero (name, outline M, lede, meta) → statement → index list with screenshot preview
         → process: four stages + Fig 1 → about pair → footer finale (email CTA, socials, sign-off)
CASE     crumb, title (Orbitron), summary, meta (type, role, stack, live link) → desktop screenshot plate
         → context, idea → long screenshot scrubbing inside its frame + phone frame → craft → outcome
         → next project (its screenshot pulls focus on hover)
ABOUT    h1 after his Tron quote → bio → toolkit (real skills) → how I work → services
404      "404" pinned soft forever; "No definition found." Back to focus.
```

**Figure (anatomy): Fig 1, the cold stack of a quantum computer.** A dilution refrigerator: a
room-temperature flange with a pulse-tube cooler, four plates at 50 K, 4 K, 100 mK and 10 mK, support
rods, four control lines with an attenuator on every plate, a readout line back up through circulators (10 mK) and a HEMT amplifier (4 K), the dilution unit (still, step heat exchangers, mixing chamber), a still pumping port, a DC wiring loom with its Micro-D feedthrough, and the qubit package under the coldest plate (about 130 parts, camera at 17° so the space between plates reads).
A pulse travels down one line; the readout gives each plate's temperature and the true mean number of
thermal photons at 6 GHz (173, 13, 0.06, 3e-13). The plates map to Listen, Sketch, Design and Build,
and the stage list beside the figure lights up as the pulse passes. The message: each stage strips out
noise until one definite state is left. Built with the anatomy kit (`scripts/figure/cryostat.mjs`,
audit and line check both pass), lazy loaded, driven by gsap.ticker, still under reduced motion.

## Genericness test

- A generic hero is a centered name over a gradient: here the name is a two-layer focus object and
  every display heading shares one focus driver.
- Generic work sections use cards and fake screenshots: here an index list with real screenshots of
  his live sites, pulled into focus beside the pointer.
- A generic transition is a fade: here an aperture iris.
- A generic scroll indicator is a bar: here a focus scale that reads out metres.

## Decisions

- No WebGL: focus is an opacity crossfade between the sharp text and a pre-blurred ghost, so nothing
  re-rasterises a blur and it holds frame rate on phones.
- No loader: the hero name is real HTML text from the first paint (it is the LCP) and the first-load
  intro does the focus pull while the scale racks from ∞ to 0.45 m.
- The engine boots after `ApplicationRef.whenStable()`, once hydration has finished swapping nodes.
- Prerendered with `@angular/ssr` (static output); `scripts/postbuild.mjs` writes `404.html`.

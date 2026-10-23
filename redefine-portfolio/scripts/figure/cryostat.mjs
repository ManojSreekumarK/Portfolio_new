// Fig 1: the cold stack of a quantum computer (a dilution refrigerator), built with the anatomy kit.
//   node scripts/figure/cryostat.mjs           writes src/app/figure/cryostat-art.ts/.css and .figure/cryostat.html
//   node scripts/figure/cryostat.mjs --audit   also runs the geometry audit (non-zero exit on problems)
//
// The object: a room-temperature top flange with a pulse-tube cooler, then four gold plates, each colder
// than the one above (50 K, 4 K, 100 mK, 10 mK), joined by support rods. Four coax lines run down through
// every plate, with an attenuator sitting on each plate, and land on the qubit package hanging under the
// coldest plate. A pulse travels down one line. The readout gives each plate's temperature and the mean
// number of thermal photons at the qubit frequency (6 GHz), n = 1 / (e^(hf/kT) − 1): about 173 at 50 K,
// 13 at 4 K, 0.06 at 100 mK and 3e-13 at 10 mK. The live code (src/app/figure/cryostat.ts) uses the same model.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as k from './kit/iso-kit.mjs';
import * as A from './kit/audit.mjs';
import { kitScript } from './inline-kit.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..');

// ---------- Truth ----------
const FREQ = 6e9; // qubit frequency, Hz
const H_PLANCK = 6.62607015e-34;
const K_B = 1.380649e-23;
const photons = (T) => 1 / Math.expm1((H_PLANCK * FREQ) / (K_B * T));

// ---------- World ----------
const W = 460;
const H = 600;
// Levels from the top: z is the plate's top face, t its thickness, r its radius.
const TOP = { name: 'Room temperature', temp: '300 K', T: 300, z: 262, t: 7, r: 64 };
const PLATES = [
  { stage: 'Listen', temp: '50 K', T: 50, z: 210, t: 4, r: 57 },
  { stage: 'Sketch', temp: '4 K', T: 4, z: 160, t: 4, r: 51 },
  { stage: 'Design', temp: '100 mK', T: 0.1, z: 112, t: 3.5, r: 45 },
  { stage: 'Build', temp: '10 mK', T: 0.01, z: 68, t: 3.5, r: 40 },
];
const LEVELS = [TOP, ...PLATES];
const LINES = [[12, 12], [-12, 12], [12, -12], [-12, -12]]; // coax positions; [12, 12] faces the viewer
const ATT_H = 7; // attenuator height on each plate
const PT = [-36, 18]; // pulse-tube cooler axis
const OUT = [0, -14]; // readout output line: qubit → circulators → HEMT amplifier → room temperature
const STILL = [26, -6]; // still, step heat exchangers and mixing chamber of the dilution unit
const DC = [-24, 0]; // DC wiring loom (flux bias, amplifier bias)
const DC_WIRES = [[0, 0], [2.4, 2.4], [-2.4, -2.4]];
const DC_CLAMP = { x: -29, y: -5, w: 10, d: 10, r: 1.2 };
const PKG = { x: -17, y: -17, w: 34, d: 34, r: 3 };
const PKG_Z0 = 30;
const PKG_Z1 = 44;

const P = k.fitProjection(k.boxCorners({ x: -TOP.r, y: -TOP.r, w: TOP.r * 2, d: TOP.r * 2, r: TOP.r }, PKG_Z0, TOP.z + 26), W, H, {
  pad: 30,
  azimuth: 45,
  elevation: 17,
});

const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const Dt = (points, style) => k.dotsSvg(points, style);
const R = A.recorder(P);
const put = (name, centre, svg, shapes) => R.put({ name, at: centre, svg, shapes: shapes.map((s) => R.solid(s)) });
const ringPoints = (r, n, z, phase = 0) =>
  Array.from({ length: n }, (_, i) => {
    const a = phase + (i / n) * Math.PI * 2;
    return [Math.cos(a) * r, Math.sin(a) * r, z];
  });
// A cylinder or a small box, drawn and recorded in one go.
function cyl(out, shapes, name, x, y, r, z, h, style = {}, steps = 20) {
  out.push(S(k.cylinder(x, y, r, z, h, P, steps), { tone: 'mid', ...style }));
  shapes.push(A.cylinder(x, y, r, z, h, { name }));
}
function box(out, shapes, name, plan, z, h, style = {}) {
  out.push(S(k.slabOf(plan, z, h, P, 2, 0.4), { tone: 'mid', ...style }));
  shapes.push(A.slab(plan, z, h, { name }));
}
const byDepth = (pts) => [...pts].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));

// ---------- Plates ----------
function plate(level, i) {
  const z0 = level.z - level.t;
  const out = [];
  out.push(S(k.cylinder(0, 0, level.r, z0, level.t, P, 96, 0.6), { tone: i === 0 ? 'mid' : 'hi', crease: 'lo' }));
  out.push(L(k.ring(0, 0, level.r - 4, level.z, P, 96), { tone: 'faint' }));
  out.push(Dt(ringPoints(level.r - 7, 16, level.z, Math.PI / 16).map(at), { size: 0.45 }));
  // Clearance holes where the coax lines pass.
  for (const [x, y] of [...LINES, OUT]) out.push(L(k.ring(x, y, 2.6, level.z, P, 20), { tone: 'lo' }));
  const shape = i === 0 ? A.cylinder(0, 0, level.r, z0, level.t, { name: 'stand.top', ground: true }) : A.cylinder(0, 0, level.r, z0, level.t, { name: `plate${i}` });
  return { svg: out.join(''), shapes: [shape] };
}

// Top flange extras: SMA bulkheads where the lines enter, the pulse-tube head, two lifting lugs.
function topExtras() {
  const out = [];
  const shapes = [];
  const [px, py] = PT;
  const parts = [
    ...LINES.map(([x, y]) => ({ x, y, draw: () => {
      out.push(S(k.cylinder(x, y, 3.4, TOP.z, 2.2, P, 6), { tone: 'mid' }));
      out.push(S(k.cylinder(x, y, 2.2, TOP.z + 2.2, 5, P, 20), { tone: 'mid', inner: L(k.sideArc(x, y, 2.2, TOP.z + 4.6, P, 16), { tone: 'faint' }) }));
      shapes.push(A.cylinder(x, y, 3.4, TOP.z, 2.2, { name: 'top.nut' }), A.cylinder(x, y, 2.2, TOP.z + 2.2, 5, { name: 'top.sma' }));
    } })),
    { x: px, y: py, draw: () => {
      out.push(S(k.cylinder(px, py, 11, TOP.z, 4, P, 48), { tone: 'mid' }));
      out.push(Dt(ringPoints(9.4, 8, TOP.z + 4).map(([x, y, z]) => at([x + px, y + py, z])), { size: 0.45 }));
      out.push(S(k.cylinder(px, py, 8.5, TOP.z + 4, 16, P, 48), { tone: 'mid', inner: L(k.sideArc(px, py, 8.5, TOP.z + 14, P, 40), { tone: 'lo' }) }));
      out.push(L(k.knurl(px, py, 8.5, TOP.z + 14, TOP.z + 20, 40, P), { tone: 'lo' }));
      out.push(S(k.cylinder(px, py, 4, TOP.z + 20, 5, P, 24), { tone: 'mid' }));
      shapes.push(A.cylinder(px, py, 11, TOP.z, 4, { name: 'pt.flange' }), A.cylinder(px, py, 8.5, TOP.z + 4, 16, { name: 'pt.head' }), A.cylinder(px, py, 4, TOP.z + 20, 5, { name: 'pt.port' }));
    } },
    { x: OUT[0], y: OUT[1], draw: () => {
      cyl(out, shapes, 'top.out.nut', OUT[0], OUT[1], 3.4, TOP.z, 2.2, {}, 6);
      cyl(out, shapes, 'top.out.sma', OUT[0], OUT[1], 2.2, TOP.z + 2.2, 5, { inner: L(k.sideArc(OUT[0], OUT[1], 2.2, TOP.z + 4.6, P, 16), { tone: 'faint' }) });
    } },
    { x: STILL[0], y: STILL[1], draw: () => {
      // Pumping port of the still line, with its KF flange.
      cyl(out, shapes, 'top.pump.flange', STILL[0], STILL[1], 6.4, TOP.z, 2.4, {}, 32);
      cyl(out, shapes, 'top.pump.port', STILL[0], STILL[1], 4.2, TOP.z + 2.4, 7, { inner: L(k.sideArc(STILL[0], STILL[1], 4.2, TOP.z + 5.5, P, 24), { tone: 'faint' }) }, 28);
      cyl(out, shapes, 'top.pump.kf', STILL[0], STILL[1], 5.6, TOP.z + 9.4, 2, {}, 28);
    } },
    { x: DC[0], y: DC[1], draw: () => {
      // Micro-D feedthrough for the DC loom.
      const plan = { x: DC[0] - 6, y: DC[1] - 4, w: 12, d: 8, r: 1 };
      box(out, shapes, 'top.microd', plan, TOP.z, 5);
      out.push(L(k.planOutline(k.insetPlan(plan, 1.6), TOP.z + 5, P, 2), { tone: 'lo' }));
      out.push(Dt(k.dotGrid(DC[0] - 3, DC[1] - 1, 4, 2, 2, TOP.z + 5, P), { size: 0.4, tone: 'mid' }));
    } },
    ...[Math.PI * 0.15, Math.PI * 1.15].map((a) => {
      const x = Math.cos(a) * (TOP.r - 10);
      const y = Math.sin(a) * (TOP.r - 10);
      return { x, y, draw: () => {
        const lug = { x: x - 4, y: y - 2, w: 8, d: 4, r: 1 };
        out.push(S(k.slabOf(lug, TOP.z, 9, P, 2, 0.4), { tone: 'mid' }));
        out.push(L(k.ring(x, y, 1.4, TOP.z + 9, P, 12), { tone: 'lo' }));
        shapes.push(A.slab(lug, TOP.z, 9, { name: 'top.lug' }));
      } };
    }),
  ];
  parts.sort((a, b) => k.depthOf([a.x, a.y, 0], P) - k.depthOf([b.x, b.y, 0], P)).forEach((p) => p.draw());
  return { svg: out.join(''), shapes };
}

// The span between two levels: support rods, coax segments with an attenuator on the lower plate, and
// (down to 4 K) the pulse-tube stage, all painted far to near. The front line carries an empty pulse
// path so the live code draws the pulse in the right painter's slot.
function span(upper, lower, i) {
  const out = [];
  const shapes = [];
  const zTop = upper.z - upper.t;
  const zLow = lower.z;
  const parts = [];
  const rodR = lower.r - 7;
  for (const a of [Math.PI / 2, Math.PI * (7 / 6), Math.PI * (11 / 6)]) {
    const x = Math.cos(a) * rodR;
    const y = Math.sin(a) * rodR;
    parts.push({ x, y, draw: () => {
      out.push(S(k.cylinder(x, y, 2.6, zLow, zTop - zLow, P, 20), { tone: 'mid', crease: 'none', inner: L(k.sideArc(x, y, 2.6, zLow + (zTop - zLow) / 2, P, 16), { tone: 'faint' }) }));
      shapes.push(A.cylinder(x, y, 2.6, zLow, zTop - zLow, { name: `rod${i}` }));
    } });
  }
  if (i < 2) {
    const [px, py] = PT;
    const r = i === 0 ? 6 : 4.4;
    parts.push({ x: px, y: py, draw: () => {
      out.push(S(k.cylinder(px, py, r + 2.2, zLow, 3, P, 32), { tone: 'mid' }));
      out.push(S(k.cylinder(px, py, r, zLow + 3, zTop - zLow - 3, P, 32), { tone: 'mid', crease: 'none' }));
      shapes.push(A.cylinder(px, py, r + 2.2, zLow, 3, { name: `pt.clamp${i}` }), A.cylinder(px, py, r, zLow + 3, zTop - zLow - 3, { name: `pt.tube${i}` }));
    } });
  }
  // Readout output line, with the part each plate carries: clamps at 50 K and 100 mK, the HEMT
  // amplifier at 4 K, a pair of circulators at 10 mK.
  parts.push({ x: OUT[0], y: OUT[1], draw: () => {
    const [ox, oy] = OUT;
    let h = 4;
    if (i === 1) {
      const hemt = { x: ox - 8, y: oy - 5, w: 16, d: 10, r: 1.2 };
      box(out, shapes, 'hemt', hemt, zLow, 7);
      out.push(L(k.planOutline(k.insetPlan(hemt, 1.5), zLow + 7, P, 2), { tone: 'lo' }));
      out.push(Dt([[ox - 6.5, oy - 3.5], [ox + 6.5, oy - 3.5], [ox - 6.5, oy + 3.5], [ox + 6.5, oy + 3.5]].map(([x, y]) => at([x, y, zLow + 7])), { size: 0.4 }));
      cyl(out, shapes, 'hemt.bias', ox + 5, oy + 2, 1.1, zLow + 7, 3, {}, 12);
      h = 7;
    } else if (i === 3) {
      for (const [j, z0] of [[0, zLow], [1, zLow + 4.5]]) box(out, shapes, 'circ' + j, { x: ox - 5.5, y: oy - 4.5, w: 11, d: 9, r: 1 }, z0, 4.5);
      cyl(out, shapes, 'circ.magnet', ox, oy, 3, zLow + 9, 0.8, { tone: 'hi', crease: 'lo' }, 24);
      h = 9.8;
    } else {
      box(out, shapes, 'out.clamp' + i, { x: ox - 3, y: oy - 3, w: 6, d: 6, r: 1 }, zLow, 4);
    }
    cyl(out, shapes, 'out.coax' + i, ox, oy, 1.25, zLow + h, zTop - zLow - h, { crease: 'none' }, 14);
  } });
  // Dilution unit: the still on the 100 mK plate, pumped from the top, step heat exchangers below it.
  parts.push({ x: STILL[0], y: STILL[1], draw: () => {
    const [sx, sy] = STILL;
    if (i < 2) {
      cyl(out, shapes, 'pump.clamp' + i, sx, sy, 3.8, zLow, 2.5, {}, 24);
      cyl(out, shapes, 'pump.line' + i, sx, sy, 2.2, zLow + 2.5, zTop - zLow - 2.5, { crease: 'none' }, 20);
    } else if (i === 2) {
      cyl(out, shapes, 'still', sx, sy, 7, zLow, 14, { tone: 'hi', crease: 'lo', inner: L(k.sideArc(sx, sy, 7, zLow + 5, P, 32), { tone: 'lo' }) }, 40);
      cyl(out, shapes, 'still.lid', sx, sy, 7.8, zLow + 14, 1.6, {}, 40);
      out.push(Dt(ringPoints(6.6, 8, zLow + 15.6).map(([x, y, z]) => at([x + sx, y + sy, z])), { size: 0.4 }));
      cyl(out, shapes, 'pump.line2', sx, sy, 2.2, zLow + 15.6, zTop - zLow - 15.6, { crease: 'none' }, 20);
    } else {
      let z = zLow;
      [6, 13, 20, 27].forEach((d, j) => {
        cyl(out, shapes, 'hx.tube' + j, sx, sy, 1.8, z, zLow + d - z, { crease: 'none' }, 16);
        cyl(out, shapes, 'hx.step' + j, sx, sy, 5, zLow + d, 2, { tone: 'hi', crease: 'lo' }, 28);
        z = zLow + d + 2;
      });
      cyl(out, shapes, 'hx.tube4', sx, sy, 1.8, z, zTop - z, { crease: 'none' }, 16);
    }
  } });
  // DC loom: three wires held by a clamp on every plate.
  parts.push({ x: DC[0], y: DC[1], draw: () => {
    box(out, shapes, 'dc.clamp' + i, DC_CLAMP, zLow, 3);
    out.push(Dt([[DC_CLAMP.x + 1.6, DC_CLAMP.y + 1.6], [DC_CLAMP.x + DC_CLAMP.w - 1.6, DC_CLAMP.y + DC_CLAMP.d - 1.6]].map(([x, y]) => at([x, y, zLow + 3])), { size: 0.4 }));
    for (const [dx, dy] of byDepth(DC_WIRES)) cyl(out, shapes, 'dc.wire' + i, DC[0] + dx, DC[1] + dy, 0.7, zLow + 3, zTop - zLow - 3, { crease: 'none', tone: 'lo' }, 10);
  } });
  for (const [x, y] of LINES) {
    parts.push({ x, y, draw: () => {
      const att = S(k.cylinder(x, y, 2.7, zLow, ATT_H, P, 20), { tone: 'hi', crease: 'lo', inner: L(k.sideArc(x, y, 2.7, zLow + ATT_H / 2, P, 16), { tone: 'lo' }) });
      out.push(x === 12 && y === 12 ? `<g class="cry-att" data-att="${i}">${att}</g>` : att);
      out.push(S(k.cylinder(x, y, 1.25, zLow + ATT_H, zTop - zLow - ATT_H, P, 14), { tone: 'mid', crease: 'none' }));
      shapes.push(A.cylinder(x, y, 2.7, zLow, ATT_H, { name: `att${i}` }), A.cylinder(x, y, 1.25, zLow + ATT_H, zTop - zLow - ATT_H, { name: `coax${i}` }));
      if (x === 12 && y === 12) out.push(`<path data-pulse="${i}" class="cry-pulse" d=""/>`);
    } });
  }
  parts.sort((a, b) => k.depthOf([a.x, a.y, 0], P) - k.depthOf([b.x, b.y, 0], P)).forEach((p) => p.draw());
  return { svg: out.join(''), shapes };
}

// Under the coldest plate: the qubit package, held by the last coax runs on their connectors.
function qubitPackage() {
  const out = [];
  const shapes = [];
  const zTop = PLATES[3].z - PLATES[3].t;
  out.push(`<path class="iso-halo" d="${k.haloOf(k.insetPlan(PKG, 2), PKG_Z0, 0.1, P)}" style="filter:blur(4px)"/>`);
  out.push(S(k.slabOf(PKG, PKG_Z0, PKG_Z1 - PKG_Z0, P, 4, 0.6), { tone: 'mid', inner: L(k.sideSeam(PKG, PKG_Z0 + 5, P, 4), { tone: 'faint' }) }));
  shapes.push(A.slab(PKG, PKG_Z0, PKG_Z1 - PKG_Z0, { name: 'pkg.box' }));
  out.push(Dt([[-14, -14], [14, -14], [-14, 14], [14, 14]].map(([x, y]) => at([x, y, PKG_Z1])), { size: 0.45 }));
  // The chip in its window, with bond pads round it.
  out.push(L(k.planOutline({ x: -7, y: -7, w: 14, d: 14, r: 1 }, PKG_Z1, P, 2), { tone: 'lo' }));
  const chip = { x: -4.5, y: -4.5, w: 9, d: 9, r: 0.4 };
  out.push(`<g class="cry-chip">${S(k.slabOf(chip, PKG_Z1, 0.8, P, 2), { tone: 'hi', lit: true, crease: 'none' })}</g>`);
  shapes.push(A.slab(chip, PKG_Z1, 0.8, { name: 'pkg.chip' }));
  // The mixing chamber, the coldest step of the dilution, hangs beside the package.
  const [sx, sy] = STILL;
  cyl(out, shapes, 'mxc.can', sx, sy, 8, 50, zTop - 50, { tone: 'hi', crease: 'lo', inner: L(k.sideArc(sx, sy, 8, 56, P, 40), { tone: 'lo' }) }, 48);
  cyl(out, shapes, 'mxc.cap', sx, sy, 8.8, 48.4, 1.6, {}, 48);
  cyl(out, shapes, 'pkg.out.sma', OUT[0], OUT[1], 2.4, PKG_Z1, 3, {}, 6);
  cyl(out, shapes, 'pkg.out.coax', OUT[0], OUT[1], 1.25, PKG_Z1 + 3, zTop - PKG_Z1 - 3, { crease: 'none' }, 14);
  for (const [x, y] of byDepth(LINES)) {
    out.push(S(k.cylinder(x, y, 2.4, PKG_Z1, 3, P, 6), { tone: 'mid' }));
    out.push(S(k.cylinder(x, y, 1.25, PKG_Z1 + 3, zTop - PKG_Z1 - 3, P, 14), { tone: 'mid', crease: 'none' }));
    shapes.push(A.cylinder(x, y, 2.4, PKG_Z1, 3, { name: 'pkg.sma' }), A.cylinder(x, y, 1.25, PKG_Z1 + 3, zTop - PKG_Z1 - 3, { name: 'coax4' }));
    if (x === 12 && y === 12) out.push(`<path data-pulse="4" class="cry-pulse" d=""/>`);
  }
  return { svg: out.join(''), shapes };
}

// ---------- Assemble: a hanging stack paints strictly bottom to top ----------
const pkg = qubitPackage();
put('package', [0, 0, PKG_Z1], pkg.svg, pkg.shapes);
for (let i = PLATES.length - 1; i >= 0; i--) {
  const p = plate(PLATES[i], i + 1);
  put(`plate${i + 1}`, [0, 0, PLATES[i].z], p.svg, p.shapes);
  const s = span(LEVELS[i], PLATES[i], i);
  put(`span${i}`, [0, 0, (PLATES[i].z + LEVELS[i].z) / 2], s.svg, s.shapes);
}
const top = plate(TOP, 0);
put('top', [0, 0, TOP.z], top.svg, top.shapes);
const extras = topExtras();
put('top.extras', [0, 0, TOP.z + 4], extras.svg, extras.shapes);
R.items.forEach((item, index) => (item.key = index));

const label =
  'The cold stack of a quantum computer, a dilution refrigerator. Under a room-temperature top flange with a pulse-tube cooler hang four plates, at 50 kelvin, 4 kelvin, 100 millikelvin and 10 millikelvin, joined by support rods. Four control lines run down with an attenuator on every plate to the qubit chip; a readout line runs back up through circulators at 10 millikelvin and an amplifier at 4 kelvin. The dilution unit (still, step heat exchangers, mixing chamber), a still pumping port and a DC wiring loom with its feedthrough run beside them.';
const svg = k.figureSvg({ width: W, height: H, label, body: R.items.map((item) => item.svg) });

A.auditOrExit(R, P, { crowd: [] });

// The front line's drawable z extents per span, top to bottom, for the live pulse.
const FRONT = LINES[0];
const SPANS = PLATES.map((lower, i) => ({ z0: lower.z + ATT_H, z1: LEVELS[i].z - LEVELS[i].t }));
SPANS.push({ z0: PKG_Z1 + 3, z1: PLATES[3].z - PLATES[3].t });
const model = {
  W,
  H,
  FREQ,
  FRONT,
  TOP: { name: TOP.name, temp: TOP.temp, T: TOP.T, z: TOP.z + 7 },
  PLATES: PLATES.map(({ stage, temp, T, z }) => ({ stage, temp, T, z })),
  SPANS,
  CHIP_Z: PKG_Z1 + 3,
};
mkdirSync(join(ROOT, 'src/app/figure'), { recursive: true });
writeFileSync(
  join(ROOT, 'src/app/figure/cryostat-art.ts'),
  `// Generated by scripts/figure/cryostat.mjs. Do not edit by hand.\nexport const CRYO_SVG = ${JSON.stringify(svg)};\nexport const CRYO_P = ${JSON.stringify(P)};\nexport const CRYO_MODEL = ${JSON.stringify(model)};\n`,
);
const CSS = `.cry-pulse{fill:none;stroke:var(--anatomy-lit);stroke-width:3.6;stroke-linecap:round;filter:drop-shadow(0 0 4px var(--anatomy-lit))}
.cry-att,.cry-chip{transition:filter .5s}.cry-att.is-on{filter:drop-shadow(0 0 2px var(--anatomy-lit)) drop-shadow(0 0 5px var(--anatomy-lit))}.cry-chip.is-hit{filter:drop-shadow(0 0 5px var(--anatomy-lit))}`;
writeFileSync(join(ROOT, 'src/app/figure/cryostat-art.css'), `/* Generated by scripts/figure/cryostat.mjs. */\n${CSS}\n`);

// Standalone page for the anatomy checks, in the site palette, with the pulse frozen in the 4 K span.
const pulseD = k.segment([FRONT[0], FRONT[1], 196], [FRONT[0], FRONT[1], 184], P);
const page = svg.replace('data-pulse="1" class="cry-pulse" d=""', `data-pulse="1" class="cry-pulse" data-free="true" d="${pulseD}"`);
const css = `.iso{--anatomy-page:#0d0b08;--anatomy-card:#17130e;--anatomy-paper:#17130e;--anatomy-text:#9b958b;--anatomy-strong:#f2eee8;--anatomy-lit:#ff2bf6;--anatomy-mono:'Space Mono',ui-monospace,monospace}${CSS}`;
const plateHtml = k.plateHtml({
  fig: 'Fig 1',
  title: 'Quantum computer',
  hint: 'Hover to follow the signal',
  readout: `Sketch, 4 K plate, ${photons(4).toFixed(1)} thermal photons`,
  keys: [],
  caption: '',
  body: `<div class="iso-stage">${page}</div>`,
});
mkdirSync(join(ROOT, '.figure'), { recursive: true });
writeFileSync(join(ROOT, '.figure/cryostat.html'), k.pageHtml({ title: 'Quantum computer', theme: 'dark', body: `<style>${css}</style>${plateHtml}`, script: kitScript() }));
console.log('wrote cryostat-art.ts', LEVELS.map((l) => `${l.temp}: n = ${photons(l.T).toPrecision(3)}`).join(' | '));

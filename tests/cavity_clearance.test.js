// The three cavity clearances are independent of the bed pad and of the
// upstream part-foot gap. Short line feet keep the latter's printed geometry.
import { assert, assertClose, blockTopo, isClosed, fins, prop } from './_util.js';
import { sweepBetween } from '../web/prop/sweep.js';
import { stationIsClear } from '../web/prop/clearance.js';

const { PROP } = prop;

Deno.test('side clearance applies when checking a fin wide face', () => {
  const was = PROP.sideClear;
  const side = blockTopo(1.2, 2.2, -2, 12, 0, 9);
  const line = [[0, 0, 10], [0, 5, 10], [0, 10, 10]];
  const rot = [1, 0, 0, 0, 1, 0, 0, 0, 1];
  try {
    PROP.sideClear = 0.35;
    assert(stationIsClear(line, 1, side, rot, { x: 0, y: 0, z: 0 }), 'baseline wall should fit');
    PROP.sideClear = 0.8;
    assert(!stationIsClear(line, 1, side, rot, { x: 0, y: 0, z: 0 }), 'larger wide-face clearance should reject wall');
    const thin = blockTopo(0.92, 1.06, -2, 12, 1, 9);
    assert(!stationIsClear(line, 1, thin, rot, { x: 0, y: 0, z: 0 }),
      'high side clearance should detect a thin wall between the old probes');
  } finally { PROP.sideClear = was; }
});

Deno.test('bottom relief preserves upstream gap and adds short line feet', () => {
  const before = PROP.bottomGap;
  const top = Array.from({ length: 21 }, (_, x) => [x, 0, 12]);
  const floor = top.map(([x, y]) => [x, y, 2]);
  const lowAt = (tris, x) => Math.min(...tris.filter(v => Math.abs(v[0] - x) < 1e-6).map(v => v[2]));
  try {
    const base = [];
    PROP.bottomGap = 0;
    assert(sweepBetween(top, floor, base), 'upstream foot failed');
    assert(isClosed(base), 'upstream foot is open');
    const lifted = [];
    PROP.bottomGap = 0.2;
    assert(sweepBetween(top, floor, lifted), 'relieved foot failed');
    assert(isClosed(lifted), 'relieved foot is open');
    const footZ = 2 + PROP.footGap;
    assertClose(lowAt(base, 3), footZ, 1e-6, 'baseline must retain printed gap');
    assertClose(lowAt(lifted, 3), footZ + 0.2, 1e-6, 'space between feet must lift');
    // Each 6 mm interval includes at least a 2 mm continuous lower span.
    for (const x of [0, 1, 6, 7, 12, 13, 18, 19, 20])
      assertClose(lowAt(lifted, x), footZ, 1e-6, `missing line foot at ${x} mm`);
  } finally { PROP.bottomGap = before; }
});

Deno.test('top, side, and bottom controls reach the engine independently', () => {
  const before = { gap: PROP.gap, side: PROP.sideClear, bottom: PROP.bottomGap };
  try {
    fins.applyTunables({ propGap: 0.25, sideClear: 0.6, bottomGap: 0.2 });
    assertClose(PROP.gap, 0.25, 1e-9, 'top');
    assertClose(PROP.sideClear, 0.6, 1e-9, 'side');
    assertClose(PROP.bottomGap, 0.2, 1e-9, 'bottom');
  } finally {
    fins.applyTunables({ propGap: before.gap, sideClear: before.side, bottomGap: before.bottom });
  }
});

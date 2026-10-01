// Material profiles: the clearances each filament needs, one table for the website
// (ui/settings.js) and the plugins' engine entry (plugins/shared/engine/fins_entry.js),
// so a plugin's PETG prints the site's PETG numbers.
//
// PETG tends to fuse to supports more than PLA. It uses less tine bite,
// a larger top gap, and a thinner bed pad with a gap instead of a tack.
// Both materials share 0.35 mm side clearance until a different PETG value
// has been tested. PLA keeps the author's other profile values, so switching
// to PLA (or never touching this) leaves existing prints unchanged. density is g/cm^3
// for the grams receipt.
export const MATERIAL = Object.freeze({
  pla:  Object.freeze({ tineBite: 0.30, padH: 0.5, padGrab:  0.05, propGap: 0.2, sideClear: 0.35, density: 1.24 }),
  petg: Object.freeze({ tineBite: 0.15, padH: 0.3, padGrab: -0.10, propGap: 0.3, sideClear: 0.35, density: 1.27 }),
});

const assert = require('assert');
const u = require('../src/app-utils.js');

const migratedLegacy = u.migrateState({ accounts: [{ id: 1 }], prefs: { theme: 'dark' } });
assert.ok(migratedLegacy.profiles.default);
assert.equal(migratedLegacy.profiles.default.accounts.length, 1);
assert.equal(migratedLegacy.profiles.default.prefs.theme, 'dark');

const name = u.normalizeUsername('  Alice  ');
assert.equal(name, 'alice');

assert.ok(u.hexToRgb('#336699'));
assert.equal(u.hexToRgb('bad'), null);

const c = u.contrastRatio('#000000', '#ffffff');
assert.ok(c > 20);

assert.equal(u.isAccessibleAccent('#cccccc'), false);
assert.equal(u.isAccessibleAccent('#767676'), true);

const vars = u.buildAccentVariables('#336699');
assert.equal(vars['--ac'], '#336699');
assert.ok(vars['--ac-bg'].includes('rgba'));

console.log('app-utils tests passed');

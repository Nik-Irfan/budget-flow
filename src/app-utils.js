(function (global) {
  const DEFAULT_PREFS = {
    theme: 'light',
    accent: 'indigo',
    customAccent: null
  };

  function createDefaultProfile(username) {
    return {
      username,
      accounts: [],
      prefs: { ...DEFAULT_PREFS }
    };
  }

  function migrateState(raw) {
    if (!raw || typeof raw !== 'object') {
      const username = 'default';
      return { currentUser: username, profiles: { [username]: createDefaultProfile(username) } };
    }

    if (raw.profiles && typeof raw.profiles === 'object') {
      const profiles = {};
      Object.keys(raw.profiles).forEach((name) => {
        const p = raw.profiles[name] || {};
        profiles[name] = {
          ...createDefaultProfile(name),
          ...p,
          prefs: { ...DEFAULT_PREFS, ...(p.prefs || {}) }
        };
      });
      const keys = Object.keys(profiles);
      const fallback = keys[0] || 'default';
      if (!keys.length) profiles.default = createDefaultProfile('default');
      return {
        currentUser: profiles[raw.currentUser] ? raw.currentUser : fallback,
        profiles
      };
    }

    const username = 'default';
    return {
      currentUser: username,
      profiles: {
        [username]: {
          ...createDefaultProfile(username),
          accounts: Array.isArray(raw.accounts) ? raw.accounts : [],
          prefs: { ...DEFAULT_PREFS, ...(raw.prefs || {}) }
        }
      }
    };
  }

  function normalizeUsername(username) {
    return String(username || '').trim().toLowerCase();
  }

  function hexToRgb(hex) {
    const h = String(hex || '').replace('#', '').trim();
    if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16)
    };
  }

  function luminance(hex) {
    const rgb = hexToRgb(hex);
    if (!rgb) return null;
    const conv = (v) => {
      const c = v / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * conv(rgb.r) + 0.7152 * conv(rgb.g) + 0.0722 * conv(rgb.b);
  }

  function contrastRatio(hexA, hexB) {
    const la = luminance(hexA);
    const lb = luminance(hexB);
    if (la === null || lb === null) return null;
    const lighter = Math.max(la, lb);
    const darker = Math.min(la, lb);
    return (lighter + 0.05) / (darker + 0.05);
  }

  function isAccessibleAccent(accentHex) {
    const withWhiteText = contrastRatio(accentHex, '#ffffff');
    const withBlackText = contrastRatio(accentHex, '#0A0A0A');
    const againstLightBg = contrastRatio(accentHex, '#FFFFFF');
    const againstDarkBg = contrastRatio(accentHex, '#0A0A0A');
    if (withWhiteText === null || withBlackText === null || againstLightBg === null || againstDarkBg === null) return false;
    const textContrastOk = withWhiteText >= 4.5 || withBlackText >= 4.5;
    const bgContrastOk = againstLightBg >= 3 && againstDarkBg >= 3;
    return textContrastOk && bgContrastOk;
  }

  function buildAccentVariables(accentHex) {
    const rgb = hexToRgb(accentHex);
    if (!rgb) return null;
    return {
      '--ac': accentHex,
      '--ac2': accentHex,
      '--ac-bg': `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.16)`,
      '--ac-sh': `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.35)`
    };
  }

  const api = {
    DEFAULT_PREFS,
    createDefaultProfile,
    migrateState,
    normalizeUsername,
    hexToRgb,
    luminance,
    contrastRatio,
    isAccessibleAccent,
    buildAccentVariables
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  global.BFUtils = api;
})(typeof window !== 'undefined' ? window : globalThis);

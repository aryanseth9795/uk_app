// The app is locked to portrait ("orientation": "portrait" in app.json), which
// makes Android and Google Play treat android.hardware.screen.portrait as a
// REQUIRED hardware feature. Play then blocks installs on devices that don't
// report it (some tablets, Chromebooks, Android XR) and flags the release.
// Declaring the feature as optional keeps the portrait lock on phones while
// letting every device install the app.
const { withAndroidManifest } = require('expo/config-plugins');

const FEATURE = 'android.hardware.screen.portrait';

module.exports = function withOptionalPortraitFeature(config) {
  return withAndroidManifest(config, (cfg) => {
    const manifest = cfg.modResults.manifest;
    const features = (manifest['uses-feature'] = manifest['uses-feature'] || []);
    const existing = features.find((f) => f.$['android:name'] === FEATURE);
    if (existing) {
      existing.$['android:required'] = 'false';
    } else {
      features.push({ $: { 'android:name': FEATURE, 'android:required': 'false' } });
    }
    return cfg;
  });
};

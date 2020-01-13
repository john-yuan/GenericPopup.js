var browserify = require('@john-yuan/dev-browserify-builder');

browserify.build('lib/scripts/GenericPopup.js', 'dist/GenericPopup.min.js', {
  standalone: 'GenericPopup',
  debug: false,
  detectGlobals: false,
  plugin: [ 'bundle-collapser/plugin' ]
}, {
  compress: {
    drop_console: true
  }
});

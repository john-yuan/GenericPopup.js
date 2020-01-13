var less = require('@john-yuan/dev-less-watcher');
var browserify = require('@john-yuan/dev-browserify-watcher');

function watch() {
  less.watch({
    paths: 'lib/**/*.less',
    entry: 'lib/styles/GenericPopup.less',
    output: 'dist/GenericPopup.css'
  });

  browserify.watch({
    paths: 'lib/**/*.js',
    entry: 'lib/scripts/GenericPopup.js',
    output: 'dist/GenericPopup.js',
    browserifyOptions: {
      standalone: 'GenericPopup',
      debug: true,
      detectGlobals: false,
      plugin: ['bundle-collapser/plugin']
    }
  });
}

exports.watch = watch;

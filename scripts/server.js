var server = require('@john-yuan/dev-server');

function start(onServerStarted) {
  server.start({
    port: 4003
  }, onServerStarted);
}

exports.start = start;

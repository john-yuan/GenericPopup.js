var server = require('./server');
var watcher = require('./watcher');

server.start(function () {
  watcher.watch();
});

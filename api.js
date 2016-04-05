#!/usr/bin/env /usr/local/bin/node

var Aria2 = require('aria2');

var aria2 = new Aria2({
  host: 'localhost',
  port: 6800,
  secure: false,
  secret: 'secret',
  path: '/jsonrpc'
});

aria2.onDownloadComplete = function(gid) {
  aria2.send('getUris', [gid], function(err, res) {
    notifier.notify({
      'title': '下载完成',
      'message': path.basename(res)
    });
  });
};

aria2.send('tellActive', function (err, res) {
  console.log(err || res);
})


#!/usr/bin/env /usr/local/bin/node

var numeral = require('numeral');
var notifier = require('node-notifier');
var bitbar = require('bitbar');
var Aria2 = require('aria2');
var path = require('path');

var uploadSpeed = 0;
var downloadSpeed = 0;
var numActive = 0;
var numStoppedTotal = 0;
var color = bitbar.darkMode ? 'white' : 'black';

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
  var downloadingTasks = [];
  if (res && res.length > 0) {
    for (var i = res.length - 1; i >= 0; i--) {
      var downloadSpeed = numeral(res[i].downloadSpeed).format("0.00 b");
      var progress = (parseInt(res[i].completedLength) / parseInt(res[i].totalLength) * 100).toFixed(2);
      downloadingTasks.push({
        text: downloadSpeed + "/s - " + (isNaN(progress) ? "" : progress + "%"),
        color: color
      });
    }
  }

  aria2.send('tellWaiting', function (err, res) {
    var waitingTasks = [];
    if (res && res.length > 0) {
      for (var i = res.length - 1; i >= 0; i--) {
        var downloadSpeed = numeral(res[i].downloadSpeed).format("0.00 b");
        var progress = (parseInt(res[i].completedLength) / parseInt(res[i].totalLength) * 100).toFixed(2);
        waitingTasks.push({
          text: downloadSpeed + "/s - " + (isNaN(progress) ? "" : progress + "%"),
          color: color
        });
      }
    }

    aria2.send('getGlobalStat', function (err, res) {
      if (err) return;
      downloadSpeed = numeral(res.downloadSpeed).format("0.00 b");
      uploadSpeed = res.uploadSpeed;
      numActive = res.numActive;
      numStoppedTotal = res.numStoppedTotal;

      var output = [
          {
              text: numActive > 0 ? downloadSpeed : "no downloads",
              color: color,
              dropdown: false
          },
          bitbar.sep,
          {
              text: '⬇ ' + downloadSpeed + ' ⬆ ' + uploadSpeed,
              color: color
          },
          bitbar.sep,
          {
              text: (numActive > 0 ? numActive + ' active ' : "") + numStoppedTotal + " stopped"
          },
      ];

      if (downloadingTasks.length > 0) {
        output = output.concat(bitbar.sep);
        output = output.concat({text: "Downloading:"});
        output = output.concat(downloadingTasks);
      }
      if (waitingTasks.length > 0) {
        output = output.concat(bitbar.sep);
        output = output.concat({text: "Waiting:"});
        output = output.concat(waitingTasks);
      }

      bitbar(output);
    });
  });
});




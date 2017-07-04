var express = require('express')
  , app = exports.app = express()
  , server_port = process.env.PORT || 8000
  , server_ip_address = '127.0.0.1'
  , path = require('path')
  , fs = require('fs');


app.use('/', express.static(__dirname+'/public'));

// landing route
/*app.get('/', function (req, res) {
  res.sendfile(__dirname+'/public/index.html');
});

// admin route
app.get('/admin', function (req, res) {
  console.log("admin route");
  res.sendfile(__dirname+'/admin/index.html');
});*/

var server = app.listen(server_port, server_ip_address);
var io = require('socket.io')(server);

io.on('connection', function (socket) {
  socket.on('requestImages', function () {
    var fileType = ".jpg", i, j;
    var returnObj = {
      files: [],
      thumbs: []
    }
    fs.readdir('public/images/portfolio', function (err, list) {
      for (i=0; i < list.length; i++) {
        if (path.extname(list[i]) === fileType) {
          returnObj.files.push(list[i]);
        }
      }
      fs.readdir('public/images/portfolio/thumbnails', function (err, list) {
        for (j=0; j < list.length; j++) {
          if (path.extname(list[j]) === fileType) {
            returnObj.thumbs.push(list[j]);
          }
        }
        socket.emit('imageResponse', returnObj);
      });
    });
  });
});

var express = require('express')
  , app = exports.app = express()
  , server_port = process.env.PORT || 3001
  , server_ip_address = '127.0.0.1'
  , server = app.listen(server_port, server_ip_address)
  , bodyParser = require('body-parser')
  , rand = require('csprng')
  , path = require('path')
  , sizeOf = require('image-size')
  , io = require('socket.io')(server)
  , fs = require('fs');


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

app.use(express.static(__dirname+'/public'));
app.use(bodyParser.urlencoded({
  extended: true
}));

// Landing route
app.get('/', function (req, res) {
  res.sendFile(__dirname+'/public/index.html');
});

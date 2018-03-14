"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var path = require("path");
var fs = require("fs");
var Iconv = require('iconv').Iconv;
var app = express();
//app.use(express.static('views'));
app.set('port', process.env.PORT || 1339);
app.get('/view/:filename', function (req, res) {
    console.log(req.params.filename);
    if (path.parse(req.params.filename).ext == '.log') {
        var data = fs.readFileSync('views/ipconfig.log');
        var iconv = new Iconv('euc-kr', 'utf-8');
        console.log(data.toString());
        console.log(iconv.convert(data).toString());
        fs.writeFileSync('views/ipconfig2.log', iconv.convert(data), 'utf-8');
        //res.writeHead(200, { 'Content-Type': 'text/plain' });
        //res.send(iconv.convert(data));
        res.redirect('views/ipconfig2.log');
        //  res.end();
    }
    //res.end();
});
app.get('/', function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<head><meta encoding="euc-kr"></head><a href="view/ipconfig.log">ipconfig</a>');
});
var server = app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + server.address().port);
});
//# sourceMappingURL=server.js.map
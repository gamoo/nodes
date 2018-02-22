var express = require('express');
var http = require('http');
var path = require('path');
var fs = require('fs');
var logger = require('morgan');
var methodOverride = require('method-override');
var errorHandler = require('error-handler');
var moment = require('moment');

var app = express();
var router = express.Router();

app.set('port', process.env.PORT || 3000);
app.use(logger);
app.use(methodOverride);
//app.use(router);
app.use(errorHandler);

Date.prototype.yyyymmdd = function() {
    var mm = this.getMonth() + 1;
    var dd = this.getDate();

    return [this.getFullYear(), 
            (mm>9 ? '':'0') + mm,
            (dd>9 ? '':'0') + dd
        ].join('');
}

Date.prototype.yyyymmddhhmmss = function() {

    var hh = this.getHours();
    var mm = this.getMinutes();
    var ss = this.getSeconds();

    return [this.yyyymmdd(), 
            (hh>9 ? '':'0') + hh,
            (mm>9 ? '':'0') + mm,
            (ss>9 ? '':'0') + ss
        ].join('');
}

router.post('/upload/:filename', function(req, res) {

    var filename = path.basename(req.params.filename);

    var name = path.parse(filename).name;
    var ext = path.parse(filename).ext;

    var date = new Date();

    //var newname = name + date.yyyymmddhhmmss() + ext;
    var newname = name + moment(date).format('YYYYMMDD_HHmmSS') + ext;

    filename = path.resolve('E:\\servertemp\\', newname);

    console.log(filename);

    var ws = fs.createWriteStream(filename);

    req.pipe(ws);
    
    ws.on('drain', function() {

        console.log('drain', new Date());

        req.resume();
    });

    req.on('end', function() {

        console.log('finish', new Date());

        //ws.close();
        //res.status(200).json({status:"ok"});
        res.end();
    })
});

http.createServer(router).listen(app.get('port'), function() {

    console.log('==========================================');
    console.log('Express server listening on port ' + app.get('port'));

});
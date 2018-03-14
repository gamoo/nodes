var express = require('express');
var http = require('http');
var path = require('path');
var fs = require('fs');
var logger = require('morgan');
var methodOverride = require('method-override');
var errorHandler = require('error-handler');
var moment = require('moment');

var shell = require('./shell.js');

var fl = require('./fl');

var app = express();
var router = express.Router();
//var router = require('router');

const dumpDir = './dump';

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');

// global definition
app.locals.path = path;
app.locals.fs = fs;

//app.use(logger);
//app.use(methodOverride);
//app.use(router);
//app.use(errorHandler);

console.log('current file list');

var l = [];
require('./fl').walksync(dumpDir,l);

console.log('count = ' + l.length);

l.forEach(function(v) {
    console.log(v);
})

if (fs.existsSync(dumpDir)) {

    console.log('Dump directory is already exist.');

} else {

    if (fs.mkdirSync(dumpDir)) {

        console.log('Dump directory is successfully created.');
    }
}


Date.prototype.yyyymmdd = () => {
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

app.get('/dump/:df', (req, res) => {

    console.log(req.params.df);

    var ext = path.parse(req.params.df).ext;

    ext = ext.toLowerCase();
    if (ext == '.dmp') {

       res.download('./dump/' + req.params.df);
    }

    if (ext == '.txt') {

        fs.readFile('./dump/' + req.params.df, (e, data) => {

            console.log('view text file : ' + req.params.df);
            res.end(data);
        });
    }
});

app.get('/', (req,res) => {

    console.log('get');
    res.setHeader('Content-Type', 'text/html');

    var l = [];
    require('./fl').walksync(dumpDir,l);

    res.render('list', {title:'Crash Dump Logger', totalCount: l.length, fileList: l});

});

// deprecated
app.get('/legacy', (req, res) => {

    console.log('get');

    res.setHeader('Content-Type', 'text/html');

    var l = [];
    require('./fl').walksync(dumpDir,l);

    res.write('<h1>Crash Dump Logger</h1>');
    res.write('<h2>Total Count : ' + l.length + '</h2>');

    l.forEach(function(v) {
        res.write('<p><a href="./dump/' + path.basename(v) +'">' + path.basename(v) +'</a></p>');
        console.log('./dump/' + path.basename(v));

        if (path.parse(v).ext.toLowerCase() == '.txt') {

            var file = './dump/' + path.basename(v);

            console.log('text file : ' + file);

            var content = fs.readFileSync(file);

            var arr = content.toString().split("\n");

            arr.forEach((l) => {

                if (l.indexOf('FAULTING_SOURCE_LINE') > -1) {
                    res.write('<p>' + l + '</p>');
                    console.log(l);
                } else if (l.indexOf('FAULTING_SOURCE_FILE') > -1) {
                    res.write('<p>' + l + '</p>');        
                    console.log(l);
                }
            });
            /*
            var lineReader = require('readline').createInterface({input: fs.createReadStream(file)});

            lineReader.on('line', (line) => {

                if (line.indexOf('FAULTING_SOURCE_LINE') > -1) {
                    //res.write('<p>' + line.trim() + '</p>');
                    res.write('test');
                    console.log(line);
                } else if (line.indexOf('FAULTING_SOURCE_FILE') > -1) {
                    //res.write(line);                    
                    console.log(line);
                } else if (line.indexOf('FAULTING_SOURCE_LINE_NUMBER') > -1) {
                    //res.write(line);
                    console.log(line);
                }
            });
            */
        }


    })

    //res.write('<p>test</p>');
    console.log('response end');
    res.end();


});

/*
router.get('/', function(req, res) {

    //res.send('<p>test</p>');

    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.end('<p>test</p>');
});
*/
app.post('/upload/:filename', (req, res) => {

    console.log('update');

    var filename = path.basename(req.params.filename);

    var name = path.parse(filename).name;
    var ext = path.parse(filename).ext;

    var date = new Date();

    //var newname = name + date.yyyymmddhhmmss() + ext;
    var newname = name + moment(date).format('YYYYMMDD_HHmmss') + ext;
    var newtext = name + moment(date).format('YYYYMMDD_HHmmss') + ".txt";

    filename = path.resolve(dumpDir, newname);
    
    var textpath = path.resolve(dumpDir, newtext);

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

        shell.dumpToText(filename, textpath);
    })
});

http.createServer(app).listen(app.get('port'), function() {

    console.log('==========================================');
    console.log('Express server listening on port ' + app.get('port'));

});
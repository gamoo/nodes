import fs = require('fs');
var Iconv = require('iconv').Iconv;

var fileName = 'ipconfig.log';

/*
var iconv = new Iconv('euc-kr', 'utf-8');
var data3 = fs.readFileSync(fileName);
fs.writeFileSync(fileName, iconv.convert(data3), 'utf-8');
*/
var content = fs.readFileSync(fileName);
var arrip = content.toString().split('\n');
var ip = 'localhost';

arrip.reverse();

arrip.forEach((l) => {

    console.log(l);

    if (l.indexOf('IPv4 Address') > -1) {

        var arr2 = l.split(' ').filter((e) => {
            return e.trim().length > 0;
        });

        ip = arr2[13];
        return true;
    } else if (l.indexOf('IPv4 주소') > -1) {

        var arr2 = l.split(' ').filter((e) => {
            return e.trim().length > 0;
        });

        ip = arr2[12];
        return true;
    }

});

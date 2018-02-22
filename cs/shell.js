var shelljs = require('shelljs');

const cdb = '"C:/Program Files (x86)/Windows Kits/10/Debuggers/x64/cdb.exe" ';

var method = {

    dumpToText : function(dump,text) {

        var params = '-z ' + dump + ' -logo ' + text + ' -c "!analyze -v"';

        console.log(cdb + params);

        if (shelljs.exec(cdb + params, {async:true}).code != 0) {

            console.log('shell execution failed');
        }
    }
};

module.exports = method;
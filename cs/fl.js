
var path = require('path');
var fs = require('fs');

var method = {

    walksync : function(dir, flist) {
 
        var files = fs.readdirSync(dir);
    
        flist = flist || [];
    
        files.forEach(function(file) {
    
            if (fs.statSync(path.join(dir, file)).isDirectory()) {
                // This is not working. walksync doesn't be recognized.
                flist = walksync(path.join(dir, file), flist);
            }
            else {
                flist.push(path.join(dir, file));
            }
        })
        return flist;
    }
};

module.exports = method;
/*
const walkSync = (dir, fl = []) => fs.readdirSync(dir)
                                           .map(file => fs.statSync(path.join(dir, file)).isDirectory()
                                                        ? walkSync(path.join(dir, file), fl)
                                                        : fl.concat(path.join(dir, file))[0]);
*/
                                                        


                                            
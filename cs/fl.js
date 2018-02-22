
var path = require('path');
var fs = require('fs');

var method = {

    walksync : function(dir, fl) {
 
        var files = fs.readdirSync(dir);
    
        fl = fl || [];
    
        files.forEach(function(file) {
    
            if (fs.statSync(path.join(dir, file)).isDirectory()) {
                fl = walksync(path.join(dir, file), fl);
            }
            else {
                fl.push(path.join(dir, file));
            }
        })
        return fl;
    }
};

module.exports = method;

const walkSync = (dir, fl = []) => fs.readdirSync(dir)
                                           .map(file => fs.statSync(path.join(dir, file)).isDirectory()
                                                        ? walkSync(path.join(dir, file), fl)
                                                        : fl.concat(path.join(dir, file))[0]);

                                                        


                                            
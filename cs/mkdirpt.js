var mkdirp = require('mkdirp');

mkdirp('D:/dirp', (err) => {
    if (err) 
        console.error(err);
    else 
        console.log('pow!'); // absolutely
})
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "@ehdskawlq",
    database: "mobigo_secure"
});

con.connect((err) => {

    if (err) throw err;

    console.log("connected!");

    // INSERT TEST
    /*
    var sql = "INSERT INTO crash(system_info_path) VALUES ('D:/out.log')";
    
    con.query(sql, (err, result) => {

        console.log("1 record inserted");
        //process.exit();
    });
    */

    // SELECT TEST
    con.query("SELECT * FROM crash", function (err, result, fields) {
        if (err) throw err;
        console.log(result);

        result.forEach((v) => {
            console.log(v.datetime);
        })

      });
});
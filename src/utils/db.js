const sqlite3 = require('sqlite3').verbose();

function dbConnect() {
    const db = new sqlite3.Database("faucet.db", (err) => {
        if(err) {
            console.log(err.message);
        }
        console.log('connect to database');
    });
    return db
}

function dbDisconnect(db){
    db.close((err) => {
        if(err) {
            console.log(err.message);
        }
    })
    console.log('diconnect to database');
}

function created() {
    const db = dbConnect()
    db.run('CREATE TABLE faucets(id PRIMARY KEY, user_id CHAR(16) NOT NULL, time BIGINT NOT NULL);', function(err){
        if (err) {
            console.log(err.message);
        }
        console.log("Table created");
    })

    dbDisconnect(db);
}

module.exports.insert = function insert(user_id, time) {
    const db = dbConnect();
    db.run('INSERT INTO faucets(user_id, time)values(?, ?)', [user_id, time], function(err){
        if (err) {
            console.log(err.message);
        }
        console.log("Table insert");
    })

    dbDisconnect(db);
}

module.exports.update = function update(user_id, time) {
    const db = dbConnect();
    db.run('UPDATE faucets SET time=? WHERE user_id=?', [time, user_id], function(err){
        if (err) {
            console.log(err.message);
        }
        console.log("Table update");
    })

    dbDisconnect(db);
}

module.exports.query = function query(user_id) {
    const db = dbConnect();
    let time = 0;

    return new Promise((resolve,reject)=>{
        db.get(`SELECT time FROM faucets WHERE user_id=?`,[user_id], (err, row) => {
            if (err) {
                return console.error(err.message);
            }
            if(row==null) {
                time = 0;
            }else {
                time = row.time
            }
            resolve(time);
            dbDisconnect(db);
        })
    })
}

created()

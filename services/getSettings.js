var sqlite3 = require('sqlite3').verbose();

module.exports = function (guildId)
{
    let db = new sqlite3.Database('./settings.sqlite');    
    let sql = `SELECT setting,value FROM guildSettings WHERE guildId = ${guildId}`;
    db.all(sql, function(err, rows) {
        let output = JSON.stringify(rows);
    });
    db.close();
    return output;
};
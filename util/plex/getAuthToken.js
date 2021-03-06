const plexApi = require('plex-api');
const plexPinAuth = require('plex-api-pinauth')();
const getSettings = require('./getPlexSettings');
var sqlite3 = require('sqlite3').verbose();
const coreSettings = require(`${process.cwd()}/settings.json`);
module.exports = (guildId) =>
{
  const p = new Promise((resolve, reject) => 
  {
    let d;
    getSettings(guildId)
      .then((settings) => {
        const opts = {};
        opts.options = {};
        opts.hostname = settings.host;
        opts.https = true;
        opts.authToken = null;
        opts.options.identifier = settings.uuid;
        opts.options.product = 'MediaButler';
        opts.options.version = '0.3';
        opts.options.deviceName = 'MediaButlerBot';
        opts.authenticator = plexPinAuth;
        d = new plexApi(opts);
        if (settings.token != null) reject('Pin token already exists');
        plexPinAuth.checkPinForAuth(settings.pinToken.id, function callback(err, status) {
          if (err) {
            console.log(err);
            reject(`Unable to authenticate token due to ${err}`);
          }
          const db = new sqlite3.Database(`${coreSettings['path']}/settings.sqlite`);    
          const query = 'UPDATE guildSettings SET "value" = ? WHERE "guildId" = ? AND "setting" = ?';
          const queryData = [d.authenticator.token, guildId, 'plex.token'];
          db.run(query, queryData, function(e) {
            if (e) {
              reject('Unable to update: ' + e.message);
              return;
            }
            resolve();                    
          });
          db.close();
        });
      });
  });
  return p;
};
const getSettings = require('../getSettings');
module.exports = (guildId) =>
{
  const p = new Promise((resolve, reject) => 
  {
    getSettings(guildId)
      .then((settings) =>
      {
        settings = JSON.parse(settings);
        const url = settings.find(x => x.setting == 'radarr.url');
        const apikey = settings.find(x => x.setting == 'radarr.apikey');
        const profileid = settings.find(x => x.setting == 'radarr.defaultprofileid');
        const rootpath = settings.find(x => x.setting == 'radarr.defaultrootpath');                
        const regex = /^(http[s]?):\/?\/?([^:\/\s]+):?([0-9]{4})?((\/\w+)*\/)([\w\-\.]+[^#?\s]+)?$/g;
        if (url == undefined || apikey == undefined || profileid == undefined || rootpath == undefined) reject('Radarr not configured');
        if (url.value == null || apikey.value == null || profileid.value == null || rootpath.value == null) reject('Radarr not configured');    
        const details = regex.exec(url.value);                
        const i = {};
        i.protocol = details[1];
        i.host = details[2];
        i.port = 443;
        if (i.protocol == 'http') i.port = 80;
        if (details[3] !== undefined) i.port = details[3];
        i.path = details[6];
        i.apikey = apikey.value;
        i.profileId = profileid.value;
        i.rootPath = rootpath.value;
        resolve(i);
      }).catch((e) => { reject(e); });
  });
  return p;
};
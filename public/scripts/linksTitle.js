const steamLink = document.querySelector(".steam-icon-link");
const steamrepLink = document.querySelector(".steamrep-icon-link");
const faceitLink = document.querySelector(".faceit-icon-link");

const fullRep = dataObj.steamrepReputation.fullReputation;

if(/SCAMMER/.test(fullRep)){
  steamrepLink.setAttribute(`title`,`SteamRep[BANNED] | ${dataObj.steamrepReputation.steamrepurl}`);
}else if(/SteamRep Admin/.test(fullRep)){
  steamrepLink.setAttribute(`title`,`SteamRep[ADMIN] | ${dataObj.steamrepReputation.steamrepurl}`);
}


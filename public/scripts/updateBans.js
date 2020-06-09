const vacBan = document.querySelector("#vac-ban");
const communityBan = document.querySelector("#community-ban");
const gameBan = document.querySelector("#game-ban");

if(vacBan.innerText != "None"){
  sinceBanned(banObj,vacBan,"vac ban");
  addBannedClass(vacBan);
}
if(communityBan.innerText != "None"){
  sinceBanned(banObj,communityBan,"community ban");
  addBannedClass(communityBan);
}
if(gameBan.innerText != "None"){
  sinceBanned(banObj,gameBan,"game ban");
  addBannedClass(gameBan);
}

function sinceBanned(banObj,banElement,tooltipText){
  const sinceBanned = document.createElement("span");
  sinceBanned.classList.add("since-ban");
  const days = banObj.DaysSinceLastBan;
  sinceBanned.innerHTML = 
  `${days} DAYS 
  <span class="info-icon" data-toggle="tooltip" data-placement="right" data-original-title="${days} days since last ${tooltipText}">
  <i class="fas fa-info-circle">
  </i>`;
  banElement.parentNode.appendChild(sinceBanned);
}
function addBannedClass(banElement){
  banElement.classList.add("banned");
}
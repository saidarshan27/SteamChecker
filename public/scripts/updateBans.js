const tradeBan = document.querySelector("#trade-ban");
const vacBan = document.querySelector("#vac-ban");
const communityBan = document.querySelector("#community-ban");
const gameBan = document.querySelector("#game-ban");
if(banObj.tradeBan === "none"){
  tradeBan.classList.add("ban-none");
  tradeBan.innerText = "NONE";
}else{
  tradeBan.classList.add("ban-true");
  tradeBan.innerText = "BANNED";
}
if(banObj.vacBan === false){
  vacBan.classList.add("ban-none");
  vacBan.innerText = "NONE";
}else{
  sinceBanned(banObj,vacBan);
  vacBan.classList.add("ban-true");
  vacBan.innerText = "BANNED";
}
if(banObj.communityBan === false){
  communityBan.classList.add("ban-none");
  communityBan.innerText="NONE";
}else{
  sinceBanned(banObj,communityBan);
  communityBan.classList.add("ban-true");
  communityBan.innerText="BANNED";
}
if(!banObj.gameBan){
  gameBan.classList.add("ban-none");
  gameBan.innerText="NONE";
}else{
  sinceBanned(banObj,gameBan);
  gameBan.classList.add("ban-true");
  gameBan.innerText="BANNED";
}

function sinceBanned(banObj,banElement){
  const sinceBanned = document.createElement("span");
  sinceBanned.classList.add("since-ban");
  const days = banObj.DaysSinceLastBan;
  sinceBanned.innerHTML = 
  `${days} DAYS 
  <span class="info-icon" data-toggle="tooltip" data-placement="right" data-original-title="${days} days since last vac ban">
  <i class="fas fa-info-circle">
  </i>`;
  banElement.parentNode.appendChild(sinceBanned);
}
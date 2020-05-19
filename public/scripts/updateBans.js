const tradeBan = document.querySelector("#trade-ban");
const vacBan = document.querySelector("#vac-ban");
const communityBan = document.querySelector("#community-ban");
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
  const sinceBanned = document.createElement("span");
  sinceBanned.classList.add("since-ban");
  const days = banObj.DaysSinceLastBan;
  sinceBanned.innerHTML = 
  `${days} DAYS 
  <span class="info-icon" data-toggle="tooltip" data-placement="right" data-original-title="${days} days since last ban">
  <i class="fas fa-info-circle">
  </i>`;
  vacBan.parentNode.appendChild(sinceBanned);
  vacBan.classList.add("ban-true");
  vacBan.innerText = "BANNED";
}
if(banObj.communityBan === false){
  communityBan.classList.add("ban-none");
  communityBan.innerText="NONE";
}else{
  communityBan.classList.add("ban-true");
  communityBan.innerText="BANNED";
}
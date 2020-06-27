const ownership = document.querySelector(".friendship .data");
const mobileOwnership = document.querySelector(".mobile-friendship .data");
const loggedUserId = user.loggedUserId;

if(loggedUserId === dataObj.persondata.steamid){
   ownership.classList.remove("mute");
   mobileOwnership.classList.remove("mute");
   ownership.classList.add("public");
   ownership.innerHTML=`YOUR PROFILE`;
   mobileOwnership.classList.add("public");
   mobileOwnership.innerHTML=`YOUR PROFILE`;
}


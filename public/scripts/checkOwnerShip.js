const friendship = document.querySelector(".friendship .data");

if(loggedUserId === dataObj.persondata.steamid){
   friendship.classList.remove("mute");
   friendship.classList.add("public");
   friendship.innerHTML=`YOUR PROFILE`;
}
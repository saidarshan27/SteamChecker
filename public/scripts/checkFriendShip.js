const friendship = document.querySelector(".friendship .data");

if(loggedUserId === dataObj.persondata.steamid){
   friendship.classList.remove("mute");
   friendship.classList.add("green");
   friendship.innerHTML=`YOUR PROFILE`;
}
const friendship = document.querySelector(".friendship .data");
const mobileFriendship = document.querySelector(".mobile-friendship .data");

if(loggedUserId === dataObj.persondata.steamid){
   friendship.classList.remove("mute");
   mobileFriendship.classList.remove("mute");
   friendship.classList.add("public");
   friendship.innerHTML=`YOUR PROFILE`;
   mobileFriendship.classList.add("public");
   mobileFriendship.innerHTML=`YOUR PROFILE`;
}


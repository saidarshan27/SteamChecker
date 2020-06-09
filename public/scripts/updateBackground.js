const background = document.querySelector(".profile-background");
if(dataObj.backgroundFull != undefined && dataObj.backgroundFull && dataObj.backgroundFull != "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/undefined"){
  background.style.backgroundImage = `url(${dataObj.backgroundFull})`
}else{
  background.style.backgroundImage = "url(../images/cover-placeholder.jpg)";
}
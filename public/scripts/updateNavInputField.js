const inputField = document.querySelector(".nav-with-search .url-input");
const clearInputBtn = document.querySelector(".nav-with-search .clear-input-background");

inputField.value = `https://steamcommunity.com/profiles/${dataObj.persondata.steamid}`;


if(inputField.value != ""){
  clearInputBtn.style.visibility = "visible";
}else{
  clearInputBtn.style.visibility = "hidden";
}



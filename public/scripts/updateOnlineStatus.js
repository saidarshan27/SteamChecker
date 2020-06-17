const status = dataObj.persondata.personastate;
const dataSpan = document.getElementById("online-status");
const mobiledataSpan = document.getElementById("mobile-online-status");
switch(status){
  case 0:{
    dataSpan.innerHTML = 
    `Offline`;
    mobiledataSpan.innerHTML = 
    `Offline`;
    dataSpan.classList.add("offline");
    mobiledataSpan.classList.add("offline");
    break;
  }
  case 1:{
    dataSpan.innerHTML = 
    `Online`;
    mobiledataSpan.innerHTML = 
    `Online`;
    dataSpan.classList.add("online");
    mobiledataSpan.classList.add("online");
    break;
  }
  case 2:{
    dataSpan.innerHTML = 
    `Busy`;
    mobiledataSpan.innerHTML = 
    `Busy`;
    dataSpan.classList.add("busy");
    mobiledataSpan.classList.add("busy");
    break;
  }
  case 3:{
   dataSpan.innerHTML = 
   `Away`;
   mobiledataSpan.innerHTML = 
   `Away`;
   dataSpan.classList.add("away");
   mobiledataSpan.classList.add("away");
    break;
  }
  case 4:{
    dataSpan.innerHTML = 
   `Snooze`;
   mobiledataSpan.innerHTML = 
   `Snooze`;
   dataSpan.classList.add("snooze");
   mobiledataSpan.classList.add("snooze");
    break;
  }
  case 5:{
    dataSpan.innerHTML = 
   `Looking to trade`;
   mobiledataSpan.innerHTML = 
   `Looking to trade`;
   dataSpan.classList.add("trade");
   mobiledataSpan.classList.add("trade");
    break;
  }
  case 6:{
    dataSpan.innerHTML = 
   `Looking to play`;
   mobiledataSpan.innerHTML = 
   `Looking to play`;
   dataSpan.classList.add("play");
   mobiledataSpan.classList.add("play");
    break;
  }
}

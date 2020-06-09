const status = dataObj.persondata.personastate;
const dataSpan = document.getElementById("online-status");
switch(status){
  case 0:{
    dataSpan.innerHTML = 
    `Offline`;
    dataSpan.classList.add("offline");
    break;
  }
  case 1:{
    dataSpan.innerHTML = 
    `Online`;
    dataSpan.classList.add("online");
    break;
  }
  case 2:{
    dataSpan.innerHTML = 
    `Busy`;
    dataSpan.classList.add("busy");
    break;
  }
  case 3:{
   dataSpan.innerHTML = 
   `Away`;
   dataSpan.classList.add("away");
    break;
  }
  case 4:{
    dataSpan.innerHTML = 
   `Snooze`;
   dataSpan.classList.add("snooze");
    break;
  }
  case 5:{
    dataSpan.innerHTML = 
   `Looking to trade`;
   dataSpan.classList.add("trade");
    break;
  }
  case 6:{
    dataSpan.innerHTML = 
   `Looking to play`;
   dataSpan.classList.add("play");
    break;
  }
}

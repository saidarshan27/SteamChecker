const status = dataObj.persondata.personastate;
const dataSpan = document.getElementById("online-status");
switch(status){
  case 0:{
    dataSpan.innerHTML = 
    `OFFLINE`;
    dataSpan.classList.add("offline");
    break;
  }
  case 1:{
    dataSpan.innerHTML = 
    `ONLINE`;
    dataSpan.classList.add("online");
    break;
  }
  case 2:{
    dataSpan.innerHTML = 
    `BUSY`;
    dataSpan.classList.add("busy");
    break;
  }
  case 3:{
   dataSpan.innerHTML = 
   `AWAY`;
   dataSpan.classList.add("away");
    break;
  }
  case 4:{
    dataSpan.innerHTML = 
   `SNOOZE`;
   dataSpan.classList.add("snooze");
    break;
  }
  case 5:{
    dataSpan.innerHTML = 
   `LOOKING TO TRADE`;
   dataSpan.classList.add("trade");
    break;
  }
  case 6:{
    dataSpan.innerHTML = 
   `LOOKING TO PLAY`;
   dataSpan.classList.add("play");
    break;
  }
}

const status = dataObj.persondata.personastate;
const dataSpan = document.getElementById("online-status");
switch(status){
  case 0:{
    dataSpan.innerHTML = 
    `<strong>OFFLINE</strong>`;
    dataSpan.classList.add("offline");
    break;
  }
  case 1:{
    dataSpan.innerHTML = 
    `<strong>ONLINE</strong>`;
    dataSpan.classList.add("online");
    break;
  }
  case 2:{
    dataSpan.innerHTML = 
    `<strong>BUSY</strong>`;
    dataSpan.classList.add("busy");
    break;
  }
  case 3:{
   dataSpan.innerHTML = 
   `<strong>AWAY</strong>`;
   dataSpan.classList.add("away");
    break;
  }
  case 4:{
    dataSpan.innerHTML = 
   `<strong>SNOOZE</strong>`;
   dataSpan.classList.add("snooze");
    break;
  }
  case 5:{
    dataSpan.innerHTML = 
   `<strong>LOOKING TO TRADE</strong>`;
   dataSpan.classList.add("trade");
    break;
  }
  case 6:{
    dataSpan.innerHTML = 
   `<strong>LOOKING TO PLAY</strong>`;
   dataSpan.classList.add("trade");
    break;
  }
}

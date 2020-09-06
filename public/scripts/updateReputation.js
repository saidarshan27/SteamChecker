const reputation=document.querySelector(".reputation .data");const svg=$(".reputation .data .parent-svg").children("use");if(reputation.innerText.includes("VALVE EMPLOYEE")){reputation.style.color="var(--valve-employee)";svg.attr("href","#tick-shield")}else if(reputation.innerText.includes("SteamRep Admin")){reputation.innerText="";reputation.innerHTML=`<svg class="parent-svg" width="25" height="20" viewBox="0 0 25 20" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right:.4rem">
   <use href="#tick-shield"></use>
  </svg> 
  <span class="full-steamrep-word">
   <span class="steamrep-steam">Steam</span><span class="steamrep-rep">Rep</span> Admin
   </span>
  `}else if(reputation.innerText.includes("SCAMMER")){reputation.style.color="red";svg.attr("href","#wrong-shield")}
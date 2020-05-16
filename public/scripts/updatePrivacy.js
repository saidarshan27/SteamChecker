  const privacyState = document.querySelector("#privacy-state");

   window.addEventListener("DOMContentLoaded",(event)=>{
    if(visibilityState === 3){
      console.log(true);
        const newspan = document.createElement("span");
        newspan.classList.add("public");
        newspan.innerText="PUBLIC"
        privacyState.appendChild(newspan);
    }
    else if(visibilityState === 2){
        const newspan = document.createElement("span");
        newspan.classList.add("friends-only");
        newspan.innerText="FRIENDS ONLY"
        privacyState.appendChild(newspan);
    }
    else if(visibilityState === 1){
      const newspan = document.createElement("span");
        newspan.classList.add("private");
        newspan.innerText="PRIVATE"
        privacyState.appendChild(newspan);
    }
   })
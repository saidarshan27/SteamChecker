let totalFriends;
let friendsArr;
const friendsDiv = document.querySelector(".friends");
$(function(){
  // show the loading animation
  $(".loading-svg").css("display","block");
  // fetch friends 
  fetch(`/user/getFriends?steam64=${dataObj.persondata.steamid}`,{
    method:"GET",
    mode:"cors",
    credentials:"same-origin",
    headers:{
      credentials:"include"
    }
  })
   .then(res=> res.json())
   .then((data)=>{
    totalFriends = data.length;
    // hiding the loading animation
    $(".loading-svg").css("display","none");
    // if friends list exist
     if(Array.isArray(data)){
       if(!data.length){
          const noFriends = document.createElement("p");
          noFriends.innerText = "No friends to show";
          noFriends.classList.add("no-friends-found");
          friendsDiv.appendChild(noFriends);
       }else{
      //  show total friends capsule
      totalFriends = data.length;
      const defaultLimit = (totalFriends>=10)?10:totalFriends;
      $(".total-friends-capsule").text(totalFriends);
      $(".total-friends-capsule").css("display","flex");
       friendsArr = data;
      //  friends controls(sort,show-entries,search)
       const controlsHTML = 
       `<ul class="friends-controls-list">
         <li>
           <span class="name-label">Sort</span>
           <div class="select-sort" data-content="">
             <select>
               <option selected>Choose...</option>
               <option value="asc">Recent Friends</option>
               <option value="desc">Oldest Friends</option>
             </select>
           </div>
         </li>
         <li>
           <span class="name-label">Show entries</span>
           <div class="select-show-entries" data-content="">
             <select>
               <option selected value="10" class="option-20">10</option>
               <option value="20" class="option-20">20</option>
               <option value="30" class="option-30">30</option>
               <option value="40" class="option-40">40</option>
               <option value="100" class="option-100">100</option>
             </select>
           </div>
         </li>
         <li>
         <div class="friends-search d-flex">
         <input type="text" name="url" class="url-input user-url-input friends-search" placeholder="Search" autocomplete="off" aria-label="search">
         <button class="search-submit mobile-search-toggle" type="submit"><i class="fas fa-search"></i></button>
         </div>
         </li>
       </ul>
       <div class="friends-mobile-search-wrapper">
       <div class="friends-mobile-search">
       <button class="search-submit mobile-search-toggle" type="submit"><i class="fas fa-search"></i></button>
       <input type="text" name="url" class="url-input user-url-input friends-search" placeholder="Search" autocomplete="off">
       </div>
       </div>
       `
      const controls = document.createElement("div");
      controls.classList.add("friends-controls");
      controls.innerHTML = controlsHTML;
      // append controls to friends div
      friendsDiv.appendChild(controls);
      const friendsTableWrapper = document.createElement("div");
      friendsTableWrapper.classList.add("friends-table-wrapper");
      friendsTableWrapper.innerHTML = 
      `<table class="table friends-table">
      <caption class="name-label tabel-caption">
      Showing <span class="showing-friends-lowerbound">1</span> to <span class="showing-friends-upperbound">${defaultLimit}</span> friends of ${totalFriends} friends
      </caption>
      <thead>
        <tr>
          <th scope="col" class="name-label no-border">Name</th>
          <th scope="col" class="name-label no-border">SteamID64</th>
          <th scope="col" class="name-label no-border" style="white-space:nowrap">Friends Since</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>`
    // append friends table to friends div
    friendsDiv.appendChild(friendsTableWrapper);
    disableOptions(totalFriends);
      const tbody = document.querySelector(".friends-table tbody");
      // if there are more than or equal to 10 show 10 or show how many available
      for(let i=0;i<defaultLimit;i++){
        const tr = document.createElement("tr");
        // converting 'friends_since' unix timestamp to humantime.
        const humanDate = new Date(data[i].friend_since*1000).toLocaleDateString("en-IN");
        const name = data[i].personaname;
        const santizedName = htmlEntities(name);
        tr.innerHTML = `
        <td class="friend-avatar-name dont-close-friends-hoverable" data-friend-index=${i}>
        <a class="name-link name-label" href = "/user?url=${encodeURIComponent(data[i].profileurl)}" title = "SteamChecker | ${santizedName}">
        <img class="friend-avatar" src="${data[i].avatar}" onerror=this.src="/images/avatar-placeholder.jpg">
        ${santizedName}
        </a>
        </td>
        <td class="friend-steam64">
        <span class="data-label">${data[i].steamid}</span>
        </td>
        <td class="friend-since">
        <span class="data-label">${humanDate}</span>
        </td>
        `
        tbody.appendChild(tr);
      }
      // creating pagination nav
      const paginationNav = document.createElement("nav"); 
      const paginationNavHTML = 
      `<ul class="pagination justify-content-center">
        <li class="page-item disabled">
          <a class="page-link prev" tabindex="-1" aria-disabled="true">Previous</a>
        </li>
        <div class="page-item page-buttons" style="display:flex">
        </div>
        <li class="page-item">
          <a class="page-link next">Next</a>
        </li>
      </ul>
      `
      paginationNav.innerHTML = paginationNavHTML;
      friendsDiv.appendChild(paginationNav);
      const body = document.querySelector("body");
      const paginationButtonsScript = document.createElement("script");
      // append pagination script(because this script is a dependency for it).
      paginationButtonsScript.setAttribute("src","/scripts/friendsControlsAndPagination.js");
      paginationButtonsScript.setAttribute("type","module");
      body.appendChild(paginationButtonsScript);
    }
     }else{
      //  if friends list private.
       const errorDiv = document.createElement("div");
       errorDiv.innerHTML =  `
       <div class="alert alert-danger friends-private-alert" role="alert">
       <h4 class="alert-heading">${data}</h4>
       <hr>
       <p>Friends list is private by default.You can make it public by changing <a href="https://steamcommunity.com/my/edit/settings" target="_blank">your Steam profile privacy settings</a></p>
       <ul>
       <li>
         1.Going to your steam profile.Click on "Edit Profile".
       </li>
       <li>  
         2.Click on "Privacy Settings",in the left side-bar.
       </li>
       <li>  
         3.Navigate to "Friends List" and make it "Public".
       </li>
       <li>  
         4.Scroll up to "Profile Overview" in SteamChecker.Click on "More" and click "Refresh Information".
       </li>
       <ul>
       </div>`
       friendsDiv.appendChild(errorDiv);
     }
   });
})

function disableOptions(totalFriends){
  if(totalFriends<100) document.querySelector(".option-100").setAttribute("disabled","true");
  if(totalFriends<40)  document.querySelector(".option-40").setAttribute("disabled","true");
  if(totalFriends<30)  document.querySelector(".option-30").setAttribute("disabled","true");
  if(totalFriends<20)  document.querySelector(".option-20").setAttribute("disabled","true");
}

// sanitize the friends name if any friends has a html tag has the personaname.
function htmlEntities(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}


export {totalFriends,friendsArr}
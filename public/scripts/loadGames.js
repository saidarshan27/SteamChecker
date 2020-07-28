const gamesDiv = document.querySelector(".games");
const sectionTitle = document.querySelector(".games-wrapper .section-title");
let totalGames = 0;
let gamesArr = [];
$(function(){
  $(".gamesloading-svg").css("display","block");
  fetch(`/user/getGames?steam64=${dataObj.persondata.steamid}`,{
    method:"GET",
    headers:{
    'Content-Type':"application/json"
    }
  })
   .then(res=> res.json())
   .then((data)=>{
     console.log(data);
    $(".gamesloading-svg").css("display","none");
    if(Array.isArray(data)){
      totalGames = data.length;
      gamesArr = data;
      // if there are more than or equal to 10 show 10 or show how many available
      const defaultLimit = (totalGames>=10)?10:totalGames;
      if(data.length===0){
        const noGames = document.createElement("p");
        noFriends.innerText = "No games to show";
        noFriends.classList.add("no-games-found");
        gamesDiv.appendChild(noGames);
     }
    const gamesControlsHTML = ` 
    <ul class="games-controls-list" style="width:100%">
    <li>
    <span class="name-label">Sort</span>
    <div class="select-sort">
      <select>
        <option selected>Choose...</option>
        <option value="asc">Most Played Games</option>
        <option value="desc">Least Played Games</option>
      </select>
    </div>
    </li>
    <li>
    <span class="name-label">Show entries</span>
      <div class="select-show-entries">
        <select>
          <option selected value="10">10</option>
            <option value="20" class="option-20">20</option>
            <option value="30" class="option-30">30</option>
            <option value="40" class="option-40">40</option>
            <option value="100" class="option-100">100</option>
        </select>
    </div>
    </li>
    </ul>
    `
    const controls = document.createElement("div");
    controls.classList.add("games-controls");
    controls.innerHTML = gamesControlsHTML;
    // append controls to games div
    gamesDiv.appendChild(controls);
    const gamesTableWrapper = document.createElement("div");
      gamesTableWrapper.classList.add("games-table-wrapper");
      gamesTableWrapper.innerHTML = 
      `<table class="table games-table">
      <caption class="name-label tabel-caption">
      Showing <span class="showing-games-lowerbound">1</span> to <span class="showing-games-upperbound">${defaultLimit}</span> games of ${totalGames} games
      </caption>
      <thead>
        <tr>
          <th scope="col" class="name-label no-border">Name</th>
          <th scope="col" class="name-label no-border" style="white-space:nowrap">Hours Played</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>`
    // append games table to friends div
    gamesDiv.appendChild(gamesTableWrapper);
    disableOptions(totalGames);
    const tbody = document.querySelector(".games-table tbody");
      for(let i=0;i<defaultLimit;i++){
        const tr = document.createElement("tr");
        // converting 'played_time' unix timestamp to humantime.
        const humanTime = (Math.round(data[i].playtime_forever/60)<0) ? 0 : Math.round(data[i].playtime_forever/60);
        const gameName = data[i].name;
        tr.innerHTML = `
        <td class="game-icon-name">
        <a class="name-link name-label">
        <img class="game-icon" src="https://steamcdn-a.akamaihd.net/steam/apps/${data[i].appid}/capsule_184x69.jpg" onerror=this.src="/images/games-placeholder.png">
        ${gameName}
        </a>
        </td>
        <td class="hours-played">
        <span class="data-label">${humanTime} hours</span>
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
      gamesDiv.appendChild(paginationNav);
      const body = document.querySelector("body");
      const paginationButtonsScript = document.createElement("script");
      // append pagination script(because this script is a dependency for it).
      paginationButtonsScript.setAttribute("src","/scripts/gamesControlsAndPagination.js");
      paginationButtonsScript.setAttribute("type","module");
      body.appendChild(paginationButtonsScript);
    }else{
      //  if games list private.
       const errorMessage = document.createElement("p");
       errorMessage.innerText = data;
       errorMessage.classList.add("private");
       gamesDiv.appendChild(errorMessage);
     }
   })
})

function disableOptions(totalGames){
  if(totalGames<100) document.querySelector(".games .option-100").setAttribute("disabled","true");
  if(totalGames<40)  document.querySelector(".games .option-40").setAttribute("disabled","true");
  if(totalGames<30)  document.querySelector(".games .option-30").setAttribute("disabled","true");
  if(totalGames<20)  document.querySelector(".games .option-20").setAttribute("disabled","true");
}

export {totalGames,gamesArr}
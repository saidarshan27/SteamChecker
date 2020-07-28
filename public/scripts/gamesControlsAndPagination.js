import {totalGames,gamesArr} from "./loadGames.js";
let gamesTableBody = $(".games-table tbody");
let total = totalGames;
let gamesArray = gamesArr;
let paginatedResults = gamesArray.slice(0,10);
let limit = 10;
let numberOfPages = Math.ceil(total/limit);
let showingFriendsUpperBound = $(".showing-games-upperbound");
let showingFriendsLowerBound = $(".showing-games-lowerbound");



// create pagination buttons
createPageButtons(numberOfPages);
// Event Listeners

// page buttons
$(".games .page-buttons").on("click",".page-button",function(e){
  if($(this).hasClass("disabled")){
    return;
  }
  $(this).addClass("active");
  $(this).siblings(".active").removeClass("active");
  // paginating the array.
  paginate(gamesArray,parseInt($(this).html()),limit);
  kyabre($(this),numberOfPages);
  const upperBoundNumber = (parseInt($(this).html())*limit) > total ? total : parseInt($(this).html())*limit;
  const lowerBoundNumber = upperBoundNumber - paginatedResults.length;
  updateTableCaption(upperBoundNumber,lowerBoundNumber);
  // remove disabled from previous btn if page number is not 1
  if(parseInt($(this).html())>1){
    $(".games .prev").parents(".page-item").removeClass("disabled");
  }else{
    $(".games .prev").parents(".page-item").addClass("disabled");
  }
    // add disabled to next btn if page number is at the max
  if(parseInt($(this).html()) == numberOfPages){
    $(".games .next").parents(".page-item").addClass("disabled");
  }else{
    $(".games .next").parents(".page-item").removeClass("disabled");
  }
})

// next btn
$(".games .next").on("click",function(e){
  nextBtn(numberOfPages);
});
// prev btn
$(".games .prev").on("click",function(e){
  prevBtn(numberOfPages);
})

// show entries
$(".games .select-show-entries select").change(function(e){
  const newLimit = $(this).val();
  limit = newLimit;
  numberOfPages = Math.ceil(total/ limit);
  paginate(gamesArray,1,newLimit);
  createPageButtons(numberOfPages);
  updateTableCaption(limit,0);
  $(".games .next").parent().removeClass("disabled");
  $(".games .prev").parent().addClass("disabled");
})
// sort(recent or oldest).
$(".games .select-sort select").change(function(e){
  const sortType = $(this).val(); // recent or oldest frnz
  const sortedArray = gamesArray.sort(sortGames(sortType));
  gamesArray = sortedArray;
  const slicedSortedArray = sortedArray.slice(0,limit);
  $(".page-button").removeClass("active");
  $(".page-button").first().addClass("active");
  appendGamesToTable(slicedSortedArray);
  createPageButtons(numberOfPages);
  updateTableCaption(limit,0);
  $(".games .next").parent().removeClass("disabled");
  $(".games .prev").parent().addClass("disabled");
})

// functions
function createPageButtons(numberOfPages){
  const pageButtonWrapper = document.querySelector(".games .page-buttons");
  pageButtonWrapper.innerHTML = " ";
  if(numberOfPages>=8){
    for(let i=1;i<=7;i++){
      // ellipsis button
      if(i == 6){
      const pageButton = document.createElement("li");
      pageButton.classList.add('page-link',"disabled","page-button");
      pageButton.innerHTML = '...';
      pageButton.setAttribute("data-index",i);
      pageButtonWrapper.appendChild(pageButton);
      continue;
      }else if(i == 7){
      // max page button
      const pageButton = document.createElement("li");
      pageButton.classList.add('page-link',"page-button");
      pageButton.innerHTML = numberOfPages;
      pageButton.setAttribute("data-index",i);
      pageButtonWrapper.appendChild(pageButton);
      continue;
      }
      const pageButton = document.createElement("li");
      if(i == 1){
        pageButton.classList.add('active');
      }
      pageButton.classList.add('page-link',"page-button");
      pageButton.innerHTML = i;
      pageButton.setAttribute("data-index",i);
      pageButtonWrapper.appendChild(pageButton);
    }
  }else{
    // if number of pages less than 8(create how much ever present).
    for(let i=1;i<=numberOfPages;i++){
      const pageButton = document.createElement("li");
      if(i == 1){
        pageButton.classList.add('active');
      }
      pageButton.classList.add('page-link',"page-button");
      pageButton.innerHTML = i;
      pageButton.setAttribute("data-index",i);
      pageButtonWrapper.appendChild(pageButton);
    }
  }
}

// next button functionality
function nextBtn(numberOfPages){
const paginationNav = document.querySelector(".games .pagination");
console.log(paginationNav);
// enable previous button
paginationNav.children[0].classList.remove("disabled");
// adding active to next page number
 $(".games .page-buttons").children(".active").next().addClass("active");
 // removing active to prev page number
 $(".games .page-buttons").children(".active").prev().removeClass("active");
 const activeBtnNumber = $(".games .page-buttons").children(".active").html();
 if(activeBtnNumber == numberOfPages){
   $(".games .next").parents(".page-item").addClass("disabled");
 }
 const element = $(".games .page-buttons").children(".active");
 kyabre(element,numberOfPages);
 paginate(gamesArray,activeBtnNumber,limit);
 const upperBoundNumber = (parseInt(activeBtnNumber)*limit) > total ? total : parseInt(activeBtnNumber)*limit;
 const lowerBoundNumber = upperBoundNumber - paginatedResults.length;
 updateTableCaption(upperBoundNumber,lowerBoundNumber);
}

function prevBtn(numberOfPages){
 $(".page-buttons").children(".active").prev().addClass("active");
 $(".page-buttons").children(".active").next().removeClass("active");
 const activeBtnNumber = $(".games .page-buttons").children(".active").html();
 if(activeBtnNumber == 1){
   $(".games .prev").parents(".page-item").addClass("disabled");
 }else{
   $(".games .next").parents(".page-item").removeClass("disabled");
 }
 const element = $(".games .page-buttons").children(".active");
 kyabre(element,numberOfPages);
 paginate(gamesArray,activeBtnNumber,limit);
 const upperBoundNumber = (parseInt(activeBtnNumber)*limit) > total ? total : parseInt(activeBtnNumber)*limit;
 const lowerBoundNumber = upperBoundNumber - paginatedResults.length;
 updateTableCaption(upperBoundNumber,lowerBoundNumber);
}

function kyabre(element,numberOfPages){
    if(element.attr("data-index")==7 && element.siblings("[data-index=6]").html()=="..."){
      element.siblings("[data-index=2]").html("...");
      element.siblings("[data-index=3]").html(parseInt(element.html())-4);
      element.siblings("[data-index=4]").html(parseInt(element.html())-3);
      element.siblings("[data-index=5]").html(parseInt(element.html())-2);
      element.siblings("[data-index=6]").html(parseInt(element.html())-1);
      element.siblings("[data-index=2]").addClass("disabled");
      element.siblings("[data-index=6]").removeClass("disabled");
    }
    if(element.attr("data-index")==1 && element.siblings("[data-index=2]").html()=="..."){
        element.siblings("[data-index=2]").html(2);
        element.siblings("[data-index=3]").html(3);
        element.siblings("[data-index=4]").html(4);
        element.siblings("[data-index=5]").html(5);
        element.siblings("[data-index=6]").html("...");
        element.siblings("[data-index=2]").removeClass("disabled");
        element.siblings("[data-index=6]").addClass("disabled");
    }
      if(element.attr("data-index") == 3 && element.siblings("[data-index=2]").html() == "..."){
      if(parseInt(element.html())-2 == 2){
        element.siblings("[data-index=2]").html(parseInt(element.html()-2));
        element.siblings("[data-index=2]").removeClass("disabled");
      }
      if(element.siblings("[data-index=6]").html()!="..."){
        element.siblings("[data-index=6]").html("...");
        element.siblings("[data-index=6]").addClass("disabled");
      }
      element.siblings("[data-index=4]").html(element.html());
      element.siblings("[data-index=5]").html(parseInt(element.html())+1)
      element.html(parseInt(element.html()-1));
      element.next().addClass("active");
      element.removeClass("active");
      }
      if(element.attr("data-index") == 5 && element.siblings("[data-index=6]").html() == "..."){
      element.siblings("[data-index=2]").html(`...`);
      element.siblings("[data-index=2]").addClass("disabled");
      element.siblings("[data-index=3]").html(parseInt(element.html()-1));
      element.siblings("[data-index=4]").html(parseInt(element.html()));
      const difference  = numberOfPages-parseInt(element.html());
      if(difference == 3){
         element.siblings("[data-index=6]").html(numberOfPages-1);
         element.siblings("[data-index=6]").removeClass("disabled");
      }  
      element.html(parseInt(element.html())+1);
      element.prev().addClass("active");
      element.removeClass("active");
    };
}

function paginate(array,pageNumber,limit){
  const start = (pageNumber - 1)*limit;
  const end = pageNumber * limit;
  paginatedResults = array.slice(start,end);
 appendGamesToTable(paginatedResults);
}

function sortGames(sortType){
  return function compare(a, b) {
    const game1 = a.playtime_forever;
    const game2 = b.playtime_forever;

   if(sortType == "asc"){
    let comparison = 0;
    if (game1 < game2) {
      comparison = 1;
    } else if (game1 > game2) {
      comparison = -1;
    }
    return comparison;
  }else{
    let comparison = 0;
    if (game1 > game2) {
      comparison = 1;
    } else if (game1 < game2) {
      comparison = -1;
    }
    return comparison;
  }
  }
}


function appendGamesToTable(array){
  gamesTableBody.html(" ");
  array.forEach((game)=>{
    const tr = document.createElement("tr");
    // converting 'played_time' unix timestamp to humantime.
    const humanTime = (Math.round(game.playtime_forever/60)<0) ? 0 : Math.round(game.playtime_forever/60);
    const gameName = game.name;
    tr.innerHTML = `
    <td class="game-icon-name">
    <span class="name-link name-label" href = "">
    <img class="game-icon" src="https://steamcdn-a.akamaihd.net/steam/apps/${game.appid}/capsule_184x69.jpg" onerror=this.src="/images/games-placeholder.png">
    ${gameName}
    </span>
    </td>
    <td class="hours-played">
    <span class="data-label">${humanTime} hours</span>
    </td>
    `
    gamesTableBody.append(tr);
})
}

function updateTableCaption(upperBoundNumber,lowerBoundNumber){
  showingFriendsLowerBound.html(lowerBoundNumber+1);
  showingFriendsUpperBound.html(upperBoundNumber);
}



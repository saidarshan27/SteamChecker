import {totalFriends,friendsArr} from "./loadFriends.js";
let friendsTableBody = $(".friends-table tbody");
let total = totalFriends;
let friendsArray = friendsArr;
let paginatedResults;
let limit = 10;
let numberOfPages = Math.ceil(total/limit);



// create pagination buttons
createPageButtons(numberOfPages);
// Event Listeners

// page buttons
$(".page-buttons").on("click",".page-button",function(e){
  if($(this).hasClass("disabled")){
    return;
  }
  $(this).addClass("active");
  $(this).siblings(".active").removeClass("active");
  // paginating the array.
  paginate(friendsArray,parseInt($(this).html()),limit);
  kyabre($(this),numberOfPages);
  // remove disabled from previous btn if page number is not 1
  if(parseInt($(this).html())>1){
    $(".prev").parents(".page-item").removeClass("disabled");
  }else{
    $(".prev").parents(".page-item").addClass("disabled");
  }
    // add disabled to next btn if page number is at the max
  if(parseInt($(this).html()) == numberOfPages){
    $(".next").parents(".page-item").addClass("disabled");
  }else{
    $(".next").parents(".page-item").removeClass("disabled");
  }
})

// next btn
$(".next").on("click",function(e){
  nextBtn(numberOfPages);
});
// prev btn
$(".prev").on("click",function(e){
  prevBtn(numberOfPages);
})

// show entries
$(".select-show-entries select").change(function(e){
  const newLimit = $(this).val();
  limit = newLimit;
  numberOfPages = Math.ceil(total/ limit);
  paginate(friendsArray,1,newLimit);
  createPageButtons(numberOfPages);
})
// sort(recent or oldest).
$(".select-sort select").change(function(e){
  const sortType = $(this).val(); // recent or oldest frnz
  const sortedArray = friendsArray.sort(sortFriends(sortType));
  friendsArray = sortedArray;
  const slicedSortedArray = sortedArray.slice(0,limit);
  $(".page-button").removeClass("active");
  $(".page-button").first().addClass("active");
  appendFriendsToTable(slicedSortedArray);
})

// search friends
document.addEventListener("keyup",function(e){
  let friendsSearchValue
	if(e.target.classList.contains("friends-search")){
      friendsSearchValue = e.target.value;
  }
  const regex = new RegExp(friendsSearchValue,"gi");
  const searchResults = friendsArray.filter((x)=>{
    const personaname = x.personaname;
    if(regex.test(personaname)){
      return x;
    }
  })
  if(searchResults.length>=1){
    const total = searchResults.length;
    const newNumberOfPages = Math.ceil(total / limit);
    paginate(searchResults,1,limit);
    createPageButtons(newNumberOfPages);
  }else{
    friendsTableBody.html(" ");
    const noFriendsFound = document.createElement("p");
    noFriendsFound.classList.add("no-friends-found");
    noFriendsFound.innerText = "No Friends Found";
    friendsTableBody.append(noFriendsFound);
  }
})

// functions
function createPageButtons(numberOfPages){
  const pageButtonWrapper = document.querySelector(".page-buttons");
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
const paginationNav = document.querySelector(".pagination");
// enable previous button
paginationNav.children[0].classList.remove("disabled");
// adding active to next page number
 $(".page-buttons").children(".active").next().addClass("active");
 // removing active to prev page number
 $(".page-buttons").children(".active").prev().removeClass("active");
 const activeBtnNumber = $(".page-buttons").children(".active").html();
 if(activeBtnNumber == numberOfPages){
   $(".next").parents(".page-item").addClass("disabled");
 }
 const element = $(".page-buttons").children(".active");
 kyabre(element,numberOfPages);
 paginate(friendsArray,activeBtnNumber,limit);
}

function prevBtn(numberOfPages){
 $(".page-buttons").children(".active").prev().addClass("active");
 $(".page-buttons").children(".active").next().removeClass("active");
 const activeBtnNumber = $(".page-buttons").children(".active").html();
 if(activeBtnNumber == 1){
   $(".prev").parents(".page-item").addClass("disabled");
 }else{
   $(".next").parents(".page-item").removeClass("disabled");
 }
 const element = $(".page-buttons").children(".active");
 kyabre(element,numberOfPages);
 paginate(friendsArray,activeBtnNumber,limit);
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
  appendFriendsToTable(paginatedResults);
}

function sortFriends(sortType){
  return function compare(a, b) {
    const friend1 = a.friend_since;
    const friend2 = b.friend_since;

   if(sortType == "asc"){
    let comparison = 0;
    if (friend1 < friend2) {
      comparison = 1;
    } else if (friend1 > friend2) {
      comparison = -1;
    }
    return comparison;
  }else{
    let comparison = 0;
    if (friend1 > friend2) {
      comparison = 1;
    } else if (friend1 < friend2) {
      comparison = -1;
    }
    return comparison;
  }
  }
}


function appendFriendsToTable(array){
  friendsTableBody.html(" ");
  array.forEach((friend)=>{
     const tr = document.createElement("tr");
     const humanDate = new Date(friend.friend_since*1000).toLocaleDateString("en-IN");
     const name = friend.personaname;
     const santizedName = htmlEntities(name);
     tr.innerHTML = `
     <td class="friend-avatar-name dont-close-friends-hoverable">
     <a class="name-link name-label" href = "/user?url=${encodeURIComponent(friend.profileurl)}" title = "SteamChecker | ${santizedName}">
     <img class="friend-avatar" src="${friend.avatar}">
     ${santizedName}
     </a>
     </td>
     <td class="friend-steam64">
     <span class="data-label">${friend.steamid}</span>
     </td>
     <td class="friend-since">
     <span class="data-label">${humanDate}</span>
     </td>
     `
     friendsTableBody.append(tr);
})
}

function htmlEntities(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
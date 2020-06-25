$(function(){
  fetch(`/user/getFriends?steam64=${dataObj.persondata.steamid}`,{
    method:"GET",
    headers:{
    'Content-Type':"application/json"
    }
  })
   .then(res=> res.json())
   .then((data)=>{
     console.log(data.friendslist.friends);
   });
})

$(function(){
  $(".loading-svg").css("display","block");
  fetch(`/user/getFriends?steam64=${dataObj.persondata.steamid}`,{
    method:"GET",
    headers:{
    'Content-Type':"application/json"
    }
  })
   .then(res=> res.json())
   .then((data)=>{
    $(".loading-svg").css("display","none");
     console.log(data);
   });
})

document.querySelectorAll('a[href^="#"]').forEach(elem => {
  elem.addEventListener('click', e => {
      e.preventDefault();
      let block = document.querySelector(elem.getAttribute('href')),
          offset = elem.dataset.offset ? parseInt(elem.dataset.offset) : 0,
          bodyOffset = document.body.getBoundingClientRect().top;
      window.scrollTo({
          top: block.getBoundingClientRect().top - bodyOffset + offset,
          behavior: "smooth"
      }); 
  });
});

  // init controller
  // scene.duration("100%");
var controller = new ScrollMagic.Controller();

// build scenes
const userpageScene = new ScrollMagic.Scene({
  triggerElement:".userpage-container",
  triggerHook:"0.15"
})
// .addIndicators({colorStart:"black",colorTrigger:"black"})
.setClassToggle(".profile-nav-item","active")
.addTo(controller);
const friendsScene=new ScrollMagic.Scene({
    triggerElement:".friends-wrapper",
    triggerHook:"0.15"
  })
  // .addIndicators({colorStart:"black",colorTrigger:"black"})
  .setClassToggle(".friends-nav-item","active")
  .addTo(controller);

  friendsScene.on("enter",function(event){
    $(".profile-nav-item").removeClass("active");
  })
  friendsScene.on("leave",function(event){
    $(".profile-nav-item").addClass("active");
  })
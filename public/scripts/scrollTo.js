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
var controller = new ScrollMagic.Controller();

// build scenes
new ScrollMagic.Scene({
  triggerElement:".userpage-container",
  triggerHook:"0.15"
})
.addIndicators({colorStart:"black",colorTrigger:"black"})
.setClassToggle(".profile-nav-item","active")
.addTo(controller);
new ScrollMagic.Scene({
    triggerElement:".friends-wrapper",
    triggerHook:"0.15"
  })
  .addIndicators({colorStart:"black",colorTrigger:"black"})
  .setClassToggle(".friends-nav-item","active")
  .addTo(controller);

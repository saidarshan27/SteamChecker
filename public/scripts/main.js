//Ready
$(function () {
	$('[data-toggle="tooltip"]').tooltip();
}) 

 
 // Event Listeners

$(".copy").click(function(event){
	const data = event.target.parentElement.closest(".data-label").childNodes[3];
	const copyBtn = $(this).parents(".data-label").children(".copy");
  copyToClipboard(data);
  $(this).attr('data-original-title', 'Copied!').tooltip('show');
	$(this).delay(800).attr("data-original-title","Copy to Clipboard");
	copyBtn.addClass("copy-animation");
	setTimeout(function(){
		copyBtn.removeClass("copy-animation");
		$(this).tooltip("hide");
	},150)
})

$(".view-more").click(function(event){
	$(this).siblings(".view-more-links").slideToggle("slow");
})

$(document).click(function(event){
	const objEvent = $(event.target);
	if(objEvent.hasClass("view-more-btn")){
		return;
	}else{
		const dropDown = $(".view-more-links");
		if(dropDown.is(":visible")){
			dropDown.slideUp("slow");
		}
	}
})



function copyToClipboard(data) {
	const el = document.createElement('textarea');
	el.value = data.innerText;
	document.body.appendChild(el);
	el.select();
	document.execCommand('copy');
	document.body.removeChild(el);
}
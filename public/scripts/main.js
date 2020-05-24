//Ready
$(function () {
	$('[data-toggle="tooltip"]').tooltip();
	if(localStorageAvailable()){
		if(localStorage.DoNotShowMessageAgain && localStorage.DoNotShowMessageAgain === "true"){
			$(".send-message").html(`
			<a href="steam://friends/message/${dataObj.persondata.steamid}" rel="no-follow">
			<button class="send-message-btn">
			<i class="far fa-comment-dots mr-1" style="font-size:15.5px;"></i>
			SEND A MESSAGE
		  </button>
			</a>
			`)
		}
	}
}) 


// Event Listeners

$(".copy").click(function(event){
	const data = event.target.parentElement.closest(".data-label").childNodes[3];
	console.log(data);
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
	const viewMoreBtn = $(this);
  viewMoreBtn.siblings(".view-more-links").toggle();
})


if(localStorageAvailable() && localStorage.DoNotShowMessageAgain != "true"){
	$(".send-message-btn").click(function(){
		$("#send-message-modal").modal("show");
	})
}

$(".dont-show-again-checkbox").change(function(event){
	if($(this).is(":checked")){
		$(".send-message").html(`
		<a href="steam://friends/message/${dataObj.persondata.steamid}" rel="no-follow">
		<button class="send-message-btn">
		<i class="far fa-comment-dots mr-1" style="font-size:15.5px;"></i>
		SEND A MESSAGE
		</button>
		</a>
		`)
		if(localStorageAvailable()){
			localStorage.DoNotShowMessageAgain = "true";
		}
	}
})

$(".send-message-ok").click(function(){
	$('#send-message-modal').modal('hide');
})

$(".add-friend").click(function(){
	$("#add-friend-modal").modal("show");
	setTimeout(function(){
		$('#add-friend-modal').modal('hide');
	},1000)
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
	el.value = data.getAttribute("data-full-url");
	document.body.appendChild(el);
	el.select();
	document.execCommand('copy');
	document.body.removeChild(el);
}
function localStorageAvailable(){
	if(typeof(Storage) !== "undefined"){
		return true
	}else{
		return false;
	}
}
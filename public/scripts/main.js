//Ready
 $(function () {
  $('[data-toggle="tooltip"]').tooltip()
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
	},150)
})

function copyToClipboard(data) {
	const el = document.createElement('textarea');
	el.value = data.innerText;
	document.body.appendChild(el);
	el.select();
	document.execCommand('copy');
	document.body.removeChild(el);
}
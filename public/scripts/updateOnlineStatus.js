const status=dataObj.persondata.personastate;const dataSpan=document.getElementById("online-status");const mobiledataSpan=document.getElementById("mobile-online-status");switch(status){case 0:{innerhtml([dataSpan,mobiledataSpan],`Offline`);addClass([dataSpan,mobiledataSpan],`offline`);break}
case 1:{innerhtml([dataSpan,mobiledataSpan],`Online`);addClass([dataSpan,mobiledataSpan],`online`);break}
case 2:{innerhtml([dataSpan,mobiledataSpan],`Busy`);addClass([dataSpan,mobiledataSpan],`busy`);break}
case 3:{innerhtml([dataSpan,mobiledataSpan],`Away`);addClass([dataSpan,mobiledataSpan],`away`);break}
case 4:{innerhtml([dataSpan,mobiledataSpan],`Snooze`);addClass([dataSpan,mobiledataSpan],`snooze`);break}
case 5:{innerhtml([dataSpan,mobiledataSpan],`Looking to Trade`);addClass([dataSpan,mobiledataSpan],`trade`);break}
case 6:{innerhtml([dataSpan,mobiledataSpan],`Looking to Play`);addClass([dataSpan,mobiledataSpan],`play`);break}}
function addClass(elementsArr,className){elementsArr.forEach((element)=>{element.classList.add(className)})}
function innerhtml(elementsArr,html){elementsArr.forEach((element)=>{element.innerHTML=html})}
const color = document.querySelector(".steam-level");
console.log("from script",steamLevelColor);

if(steamLevelColor != null){
  color.style.borderColor = steamLevelColor;
}else{
  color.style.borderColor = "#9b9b9b";
}



var lvl = document.getElementsByClassName('friendPlayerLevelNum')[0].innerHTML;
  if (lvl.length == 1) {
      document.getElementsByClassName('friendPlayerLevel')[0].classList.add("lvl_0");
  } else if (lvl.length == 2) {
      document.getElementsByClassName('friendPlayerLevel')[0].classList.add("lvl_" + lvl[0] + "0");
      document.getElementsByClassName('friendPlayerLevel')[0].children[0].classList.add("number-color-black");
  } else if (lvl.length == 3) {
      document.getElementsByClassName('friendPlayerLevel')[0].classList.add("lvl_" + lvl[0] + "00");
      document.getElementsByClassName('friendPlayerLevel')[0].classList.add("lvl_plus_" + lvl[1] + "0");
  } else if (lvl.length == 4) {
      document.getElementsByClassName('friendPlayerLevel')[0].classList.add("lvl_" + lvl[0] + lvl[1] + "00");
      document.getElementsByClassName('friendPlayerLevel')[0].classList.add("lvl_plus_" + lvl[2] + "0");
  }




const navIcon = document.querySelector(".top-bar"),
  clickIcon = navIcon.querySelectorAll("a");

console.log(clickIcon);

function moveWindow(event) {
  var destId = clickIcon.id;
  console.log(destId);
  if (destId === "js-scroll-portfolio") {
    window.scrollTo({
      top: 900,
      behavior: "smooth"
    });
  } else if (destId === "js-scroll-about") {
    window.scrollTo({
      top: 1000,
      behavior: "smooth"
    });
  }
}

function init() {
  for (var i = 0; i < 3; i++) {
    destId = clickIcon[i].id;
    console.log(destId);
    clickIcon[i].onclick = moveWindow();
  }
}

init();

const navIcon = document.querySelector(".top-bar ul"),
  clickIcon = navIcon.querySelectorAll("a");
const title = document.querySelector(".top-bar-title");

function moveWindow(event) {
  event.preventDefault();
  const targetId = event.currentTarget.getAttribute("href");
  window.scrollTo({
    top: targetId === "#" ? 0 : document.querySelector(targetId).offsetTop,
    behavior: "smooth"
  });
}

function navbarIconClick(event) {
  moveWindow(event);
}

function toTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function init() {
  for (var i = 0; i < 3; i++) {
    clickIcon[i].addEventListener("click", navbarIconClick);
  }
  title.addEventListener("click", toTop);
  if (performance.navigation.type === 1) {
    toTop();
  }
}

init();

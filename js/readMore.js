const Btn = document.querySelectorAll(".preview button");

console.log(Btn);

function viewPost() {
  document.getElementById(postArea).innerHTML =
    '<object type="text/html" data="test.html"></object>';
}

function init() {
  for (var i = 0; i < 3; i++) {
    Btn[i].addEventListener("click", viewPost);
  }
}

init();

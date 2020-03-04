const item = document.querySelectorAll(".portfolio-item");
const modal = document.querySelectorAll(".portfolio-modal");
const dialog = document.querySelectorAll(".modal-dialog");
const modalBtn = document.querySelectorAll(".btn-modal");

function modalPopup() {
  var target = item[i].getAttribute("id");
  console.log(target);
  modal[target].classList.remove("hidden");
}

/*
function closeModal() {
  for (var i = 0; i < 6; i++) {
    modal[i].classList.add("hidden");
  }
}
*/

function init() {
  for (var i = 0; i < 6; i++) {
    item[i].addEventListener("click", modalPopup);
  }

  /*
  modalBtn[i].addEventListener("click", closeModal);
  dialog[i].addEventListener("click", closeModal);
  */
}

init();

const form = document.getElementById("contactForm");
const sendBtn = document.querySelector(".form-group button");

function sendMail(event) {
  event.preventDefault();
  const name = form[0].value;
  const email = form[1].value;
  const subject = form[2].value;
  const message = form[3].value;

  const mailto_link =
    "mailto:louise.blackolive@gmail.com" +
    "?subject=[portfolio:" +
    name +
    "] " +
    subject +
    "&body=" +
    message;
  /*
  win = window.open(mailto_link, "emailwindow");
  if (win && win.open && !win.closed) win.close();
  */
  window.location.href = mailto_link;
}

function init() {
  sendBtn.addEventListener("click", sendMail);
}

init();

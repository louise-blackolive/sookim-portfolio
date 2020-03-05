const form = document.getElementById("contactForm");
const sendBtn = document.querySelector(".form-group button");
const mailModal = document.querySelector(".mail-modal");
const mailBtn = document.querySelector(".mail-close-btn");

/*
function sendMail(event) {
  event.preventDefault();
  const name = form[0].value;
  const email = form[1].value;
  const subject = form[2].value;
  const message = form[3].value;

  this.contact_number.value = (Math.random() * 100000) | 0;
  emailjs.sendForm("gmail", "template_e7f4jm6J", this);

  const mailto_link =
    "mailto:louise.blackolive@gmail.com" +
    "?subject=[portfolio:" +
    name +
    "] " +
    subject +
    "&body=" +
    message;
  window.location.href = mailto_link;

}
*/

function init() {
  window.onload = function() {
    document
      .getElementById("contactForm")
      .addEventListener("submit", function(event) {
        event.preventDefault();
        // generate the contact number value
        this.contact_number.value = (Math.random() * 100000) | 0;
        emailjs.sendForm("gmail", "template_e7f4jm6J", this);
        mailModal.classList.remove("hidden");
      });
  };

  mailBtn.addEventListener("click", function() {
    mailModal.classList.add("hidden");
    location.reload();
  });
}

init();

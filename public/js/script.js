const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
  const time = parseInt(showAlert.getAttribute("data-time"));
  const closeAlert = document.querySelector("[close-alert]")

  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, 3000);

  closeAlert.addEventListener("click", () => {
    showAlert.classList.add("alert-hidden");
  })
}
var investAmountWrapper = document.querySelector(".invest-amount-wrapper");
var investAmountInput = document.querySelector(".invest-amount");

function focusClassToggle() {
  investAmountWrapper.classList.toggle("invest-amount-wrapper--focus");
}

investAmountInput.addEventListener("focus", focusClassToggle);
investAmountInput.addEventListener("blur", focusClassToggle);

/* Use commas in currency */
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

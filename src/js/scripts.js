var investAmountWrapper = document.querySelector('.invest-amount-wrapper');
var investAmountInput  = document.querySelector('.invest-amount');

function focusClassToggle() {
  investAmountWrapper.classList.toggle('invest-amount-wrapper--focus');
}

investAmountInput.addEventListener('focus', focusClassToggle);
investAmountInput.addEventListener('blur', focusClassToggle);
var investAmountWrapper = document.querySelector('.invest-amount-wrapper');
var investAmountInput = document.querySelector('.invest-amount');
var investAmountCalc = document.querySelector('.invest-amount-calc');
var bondsContainer = document.querySelector('.bonds-container');
var bondItem = document.querySelector('.bond');

investAmountCalc.addEventListener('click', function(e) {
  e.preventDefault ? e.preventDefault() : (e.returnValue = false);

  if (!investAmountInput.value) {
    alert('Please specify an investment amount.');
  } else {
    bondsContainer.style = 'margin-top: 5rem;';
    loader();
    getBonds();
  }
});

function loader() {
  investAmountCalc.textContent = 'Finding available bonds...';
  bondsContainer.innerHTML = `<div class="loader">Loading</div><div class="loader-wrapper"><div class="loader">Loading</div>`;
}

function focusClassToggle() {
  investAmountWrapper.classList.toggle('invest-amount-wrapper--focus');
}

investAmountInput.addEventListener('focus', focusClassToggle);
investAmountInput.addEventListener('blur', focusClassToggle);

/* Use commas in currency */
function currencyFormat(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function getBonds() {
  var xhr = new XMLHttpRequest(),
    method = 'GET',
    url = 'http://165.227.229.49:8000/bonds?api_key=vNtV4nZsuMRL01sXVPzUtRnzf7L08B9O';

  xhr.open(method, url, true);

  xhr.onload = function() {
    if (xhr.status == 200) {
      var response = JSON.parse(xhr.responseText);
      var bonds = response.data;
      var investAmountPence = Number(investAmountInput.value) * 100;
      investAmountCalc.textContent = 'Re-calculate?';
      bondsContainer.innerHTML = '';

      for (var i = 0; i < bonds.length; i++) {
        var maturityInterest = Number(bonds[i].maturity_interest * 100).toFixed(2);
        var quarterlyInterest = Number(bonds[i].quarterly_interest * 100).toFixed(2);
        var maturityReturnPence =
          investAmountPence +
          ((investAmountPence * bonds[i].maturity_interest) / 12) * bonds[i].duration_months;
        var maturityReturnPounds = maturityReturnPence / 100;
        var maturityReturnTotal = currencyFormat(Number(maturityReturnPounds).toFixed(2));

        var quarterlyReturnPence =
          investAmountPence +
          ((investAmountPence * bonds[i].quarterly_interest) / 12) * bonds[i].duration_months;
        var quarterlyReturnPounds = quarterlyReturnPence / 100;
        var quarterlyReturnTotal = currencyFormat(Number(quarterlyReturnPounds).toFixed(2));

        bondsContainer.innerHTML += `<div class="bond">
          <header class="bond-header">
            <h2 class="bond__heading">${bonds[i].name}</h2>
            <p class="bond__duration">Duration | <span>${bonds[i].duration_months} Months</span></p>
          </header>
          <div class="bond-type-container">
            <div class="bond-type bond-type--maturity">
              <div class="bond-type__interest">
                <p class="bond-type__interest-percent">${maturityInterest}%<span class="bond-type__pa"> P.A</span></p>
                <p class="bond-type__interest-paid">Interest paid <strong>on maturity</strong></p>
              </div>
              <div class="bond-type__return">
                <p class="bond-type__return-amount">£${maturityReturnTotal}</p>
                <p class="bond-type__return-text">Expected gross return<br><i>(based on a £${currencyFormat(
                  investAmountInput.value
                )} investment)</i></p>
              </div>
              <div class="bond-type__invest-btn-wrapper">
                <button class="btn bond-type__invest-btn">Invest<span class="u-screen-reader-text"> in ${
                  bonds[i].name
                } over ${
          bonds[i].duration_months
        } months, interest paid on maturity.</span></button>
              </div>
            </div>
            <div class="bond-type bond-type--quarterly">
              <div class="bond-type__interest">
                <p class="bond-type__interest-percent">${quarterlyInterest}%<span class="bond-type__pa"> P.A</span></p>
                <p class="bond-type__interest-paid">Interest paid <strong>quarterly</strong></p>
              </div>
              <div class="bond-type__return">
                <p class="bond-type__return-amount">£${quarterlyReturnTotal}</p>
                <p class="bond-type__return-text">Expected gross return<br><i>(based on a £${currencyFormat(
                  investAmountInput.value
                )} investment)</i></p>
              </div>
              <div class="bond-type__invest-btn-wrapper">
                <button class="btn bond-type__invest-btn">Invest<span class="u-screen-reader-text"> in ${
                  bonds[i].name
                } over ${bonds[i].duration_months} months, interest paid quarterly.</span></button>
              </div>
            </div>
          </div>
        </div>
        <!-- END .bond -->`;
      }

      // Fade in bonds once they have loaded
      setTimeout(function() {
        var bondsList = document.querySelectorAll('.bond');
        var bondsListArr = Array.prototype.slice.call(bondsList);
        bondsListArr.forEach(function(val) {
          val.classList.add('is-loaded');
        });
      }, 100);
    }
  };

  xhr.send();
}

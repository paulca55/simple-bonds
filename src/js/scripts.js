var investAmountWrapper = document.querySelector('.invest-amount-wrapper');
var investAmountInput = document.querySelector('.invest-amount');
var bondsContainer = document.querySelector('.bonds-container');
var investAmountCalc = document.querySelector('.invest-amount-calc');

investAmountCalc.addEventListener('click', function(e) {
  e.preventDefault();
  getBonds();
  bondsContainer.style = 'margin-top: 5rem;';
});

function focusClassToggle() {
  investAmountWrapper.classList.toggle('invest-amount-wrapper--focus');
}

investAmountInput.addEventListener('focus', focusClassToggle);
investAmountInput.addEventListener('blur', focusClassToggle);

/* Use commas in currency */
function currencyWithCommas(x) {
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
      console.log(response.data);
      // var bondsContainer = document.querySelector('.bonds-container');
      var investAmountPence = Number(investAmountInput.value) * 100;

      for (var i = 0; i < bonds.length; i++) {
        var maturityInterest = Number(bonds[i].maturity_interest * 100).toFixed(2);
        var quarterlyInterest = Number(bonds[i].quarterly_interest * 100).toFixed(2);
        var maturityReturnPence =
          investAmountPence +
          ((investAmountPence * bonds[i].maturity_interest) / 12) * bonds[i].duration_months;
        var maturityReturnPounds = maturityReturnPence / 100;
        var maturityReturnTotal = Number(maturityReturnPounds).toFixed(2);

        var quarterlyReturnPence =
          investAmountPence +
          ((investAmountPence * bonds[i].quarterly_interest) / 12) * bonds[i].duration_months;
        var quarterlyReturnPounds = quarterlyReturnPence / 100;
        var quarterlyReturnTotal = Number(quarterlyReturnPounds).toFixed(2);

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
                <p class="bond-type__return-text">Expected gross return</p>
              </div>
              <button class="btn bond-type__invest-btn">Invest<span class="u-screen-reader-text"> in ${bonds[i].name} over ${bonds[i].duration_months} months, interest paid on maturity.</span></button>
            </div>
            <div class="bond-type bond-type--quarterly">
              <div class="bond-type__interest">
                <p class="bond-type__interest-percent">${quarterlyInterest}%<span class="bond-type__pa"> P.A</span></p>
                <p class="bond-type__interest-paid">Interest paid <strong>quarterly</strong></p>
              </div>
              <div class="bond-type__return">
                <p class="bond-type__return-amount">£${quarterlyReturnTotal}</p>
                <p class="bond-type__return-text">Expected gross return</p>
              </div>
              <button class="btn bond-type__invest-btn">Invest<span class="u-screen-reader-text"> in ${bonds[i].name} over ${bonds[i].duration_months} months, interest paid quarterly.</span></button>
            </div>
          </div>
        </div>
        <!-- END .bond -->`;
      }
    }
  };

  xhr.onerror = function() {
    console.log('Request error!');
  };

  xhr.send();
}

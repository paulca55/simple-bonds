// Global DOM elements
var investorNameSelect = document.querySelector('.investor-name');
var investAmountWrapper = document.querySelector('.invest-amount-wrapper');
var investAmountInput = document.querySelector('.invest-amount');
var showBondsBtn = document.querySelector('.show-bonds-btn');
var bondsContainer = document.querySelector('.bonds-container');
var bondItem = document.querySelector('.bond');
var investorsContainer = document.querySelector('.investors-container');
var modalOverlay = document.querySelector('.modal-overlay');
var modal = document.querySelector('.modal');
var modalHeader = document.querySelector('.modal__header');
var modalCloseBtn = document.querySelector('.modal__close-btn');
var modalBodyInner = document.querySelector('.modal__body-inner');

// Bonds loader
function bondsLoader() {
  showBondsBtn.textContent = 'Finding available bonds...';
  bondsContainer.innerHTML = `<div class="loader">Loading</div><div class="loader">Loading</div>`;
}

// Investors/Investments loader
function investorsLoader(elem) {
  elem.innerHTML = `<div class="loader">Loading</div>`;
}

// Toggle focus class on .invest-amount-wrapper
function focusClassToggle() {
  investAmountWrapper.classList.toggle('invest-amount-wrapper--focus');
}
if (investAmountInput) {
  investAmountInput.addEventListener('focus', focusClassToggle);
  investAmountInput.addEventListener('blur', focusClassToggle);
}

// Use commas in currency
function currencyFormat(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Capitalise first letter of a string
function capitaliseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Get bonds from the API for the list of available bonds
function getBonds() {
  var xhr = new XMLHttpRequest(),
    method = 'GET',
    url = 'http://165.227.229.49:8000/bonds?api_key=vNtV4nZsuMRL01sXVPzUtRnzf7L08B9O';

  xhr.open(method, url, true);
  xhr.setRequestHeader('Accept', 'application/json');

  xhr.onload = function() {
    if (xhr.status == 200) {
      var response = JSON.parse(xhr.responseText);
      var bonds = response.data;

      var investAmountPence = Number(investAmountInput.value) * 100;
      showBondsBtn.textContent = 'Show available bonds';
      bondsContainer.innerHTML = '';

      // Loop through and display all bonds
      for (var i = 0; i < bonds.length; i++) {
        // Maturity interest calculations
        var maturityInterest = Number(bonds[i].maturity_interest * 100).toFixed(2);
        var maturityReturnPence =
          investAmountPence +
          ((investAmountPence * bonds[i].maturity_interest) / 12) * bonds[i].duration_months;
        var maturityReturnPounds = maturityReturnPence / 100;
        var maturityReturnTotal = currencyFormat(Number(maturityReturnPounds).toFixed(2));

        // Quarterly interest calculations
        var quarterlyInterest = Number(bonds[i].quarterly_interest * 100).toFixed(2);
        var quarterlyReturnPence =
          investAmountPence +
          ((investAmountPence * bonds[i].quarterly_interest) / 12) * bonds[i].duration_months;
        var quarterlyReturnPounds = quarterlyReturnPence / 100;
        var quarterlyReturnTotal = currencyFormat(Number(quarterlyReturnPounds).toFixed(2));

        // Bond template
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
                <p class="bond-type__return-text"><strong>Expected gross return</strong><br><i>(based on a £${currencyFormat(
                  investAmountInput.value
                )} investment)</i></p>
              </div>
              <div class="bond-type__invest-btn-wrapper">
                <button class="btn bond-type__invest-btn" data-investor-name="${
                  investorNameSelect.options[[investorNameSelect.selectedIndex]].text
                }" data-bond-name="${bonds[i].name}" data-bond-id="${
          bonds[i].id
        }" data-bond-type="quarterly" data-invest-amount="${investAmountPence}">Invest<span class="u-screen-reader-text"> in ${
          bonds[i].name
        } over ${bonds[i].duration_months} months, interest paid on maturity.</span></button>
              </div>
            </div>
            <div class="bond-type bond-type--quarterly">
              <div class="bond-type__interest">
                <p class="bond-type__interest-percent">${quarterlyInterest}%<span class="bond-type__pa"> P.A</span></p>
                <p class="bond-type__interest-paid">Interest paid <strong>quarterly</strong></p>
              </div>
              <div class="bond-type__return">
                <p class="bond-type__return-amount">£${quarterlyReturnTotal}</p>
                <p class="bond-type__return-text"><strong>Expected gross return</strong><br><i>(based on a £${currencyFormat(
                  investAmountInput.value
                )} investment)</i></p>
              </div>
              <div class="bond-type__invest-btn-wrapper">
                <button class="btn bond-type__invest-btn" data-investor-name="${
                  investorNameSelect.options[[investorNameSelect.selectedIndex]].text
                }" data-bond-name="${bonds[i].name}" data-bond-id="${
          bonds[i].id
        }" data-bond-type="quarterly" data-invest-amount="${investAmountPence}">Invest<span class="u-screen-reader-text"> in ${
          bonds[i].name
        } over ${bonds[i].duration_months} months, interest paid quarterly.</span></button>
              </div>
            </div>
          </div>
        </div>
        <!-- END .bond -->`;
      }

      // Add event listener to all invest buttons
      var investBtns = document.querySelectorAll('.bond-type__invest-btn');
      var investBtnsArr = Array.prototype.slice.call(investBtns);
      investBtnsArr.forEach(function(investBtn) {
        investBtn.addEventListener('click', function(e) {
          e.preventDefault ? e.preventDefault() : (e.returnValue = false);
          var investorId = investorNameSelect.value;
          var investorName = this.getAttribute('data-investor-name');
          var bondName = this.getAttribute('data-bond-name');
          var bondId = this.getAttribute('data-bond-id');
          var bondType = this.getAttribute('data-bond-type');
          var investAmount = this.getAttribute('data-invest-amount');

          if (
            confirm(
              `Are you sure you want to make the following investment?\nName: ${investorName}\nInvestment Amount: £${currencyFormat(
                Number(investAmount / 100).toFixed(2)
              )}\nBond Name: ${bondName}`
            )
          ) {
            makeInvestment(investorId, bondId, bondType, investAmount);
          } else {
            return false;
          }
        });
      });

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

// Get investor names from the API for the form select field
function getInvestorsName() {
  var xhr = new XMLHttpRequest(),
    method = 'GET',
    url =
      'http://165.227.229.49:8000/investors?&per_page=50&api_key=vNtV4nZsuMRL01sXVPzUtRnzf7L08B9O';

  xhr.open(method, url, true);
  xhr.setRequestHeader('Accept', 'application/json');

  xhr.onload = function() {
    if (xhr.status == 200) {
      var response = JSON.parse(xhr.responseText);
      var investorName = response.data;
      investorNameSelect.innerHTML = "<option value='0'>Select investor</option>";

      // Loop through and display all investors
      for (var i = 0; i < investorName.length; i++) {
        var newOption = document.createElement('option');
        newOption.setAttribute('value', investorName[i].id);
        newOption.textContent = `${investorName[i].first_name} ${investorName[i].last_name}`;
        investorNameSelect.appendChild(newOption);
      }
    }
  };

  xhr.send();
}

// Get investors from the API for the investor list
function getInvestors() {
  investorsLoader(investorsContainer);

  var xhr = new XMLHttpRequest(),
    method = 'GET',
    url =
      'http://165.227.229.49:8000/investors?&per_page=50&api_key=vNtV4nZsuMRL01sXVPzUtRnzf7L08B9O';

  xhr.open(method, url, true);
  xhr.setRequestHeader('Accept', 'application/json');

  xhr.onload = function() {
    if (xhr.status == 200) {
      var response = JSON.parse(xhr.responseText);
      var investors = response.data;
      investorsContainer.innerHTML = '';

      // Loop through and display all investors
      for (var i = 0; i < investors.length; i++) {
        // Investor template
        investorsContainer.innerHTML += `
          <div class="investor">
            <div class="investor__avatar">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>Avatar image for ${investors[i].first_name} ${investors[i].last_name}</title>
                <path d="M12,0A12,12,0,1,1,0,12,12,12,0,0,1,12,0Zm8.13,19.41a2.6,2.6,0,0,0-1.63-.85c-3.85-.91-4.09-1.5-4.35-2.06a2.18,2.18,0,0,1,.21-2c1.72-3.25,2.09-6,1-7.79A3.74,3.74,0,0,0,12,5,3.79,3.79,0,0,0,8.59,6.76c-1.07,1.79-.69,4.55,1.05,7.76a2.16,2.16,0,0,1,.22,2c-.27.59-.61,1.19-4.37,2.07a2.54,2.54,0,0,0-1.62.85,11,11,0,0,0,16.26,0Zm.65-.78a11,11,0,1,0-17.56,0,3.82,3.82,0,0,1,2-1.05c2-.46,3.38-.83,3.68-1.5A1.24,1.24,0,0,0,8.76,15c-1.92-3.54-2.28-6.65-1-8.75A4.79,4.79,0,0,1,12,4a4.79,4.79,0,0,1,4.24,2.22c1.25,2.08.9,5.19-1,8.77a1.27,1.27,0,0,0-.18,1.1c.31.66,1.64,1,3.67,1.49A3.76,3.76,0,0,1,20.78,18.63Z" fill="#63a1d4"/>
              </svg>
            </div>
            <h2 class="investor__name">${investors[i].first_name} ${investors[i].last_name}</h2>
              <button class="investor__investments" data-investor-id="${investors[i].id}" data-investor-name="${investors[i].first_name} ${investors[i].last_name}">View Investments<span class="u-screen-reader-text"> for ${investors[i].first_name} ${investors[i].last_name}</span></button>
          </div>`;
      }

      // Add event listener to all investments buttons
      var investmentsBtns = document.querySelectorAll('.investor__investments');
      var investmentsBtnsArr = Array.prototype.slice.call(investmentsBtns);
      investmentsBtnsArr.forEach(function(investmentsBtn) {
        investmentsBtn.addEventListener('click', function(e) {
          e.preventDefault ? e.preventDefault() : (e.returnValue = false);
          var investorId = this.getAttribute('data-investor-id');
          var investorName = this.getAttribute('data-investor-name');
          openModal();
          getInvestments(investorId, investorName);
        });
      });

      // Fade in bonds once they have loaded
      setTimeout(function() {
        var investorsList = document.querySelectorAll('.investor');
        var investorsListArr = Array.prototype.slice.call(investorsList);
        investorsListArr.forEach(function(val) {
          val.classList.add('is-loaded');
        });
      }, 100);
    }
  };

  xhr.send();
}

// Get investments from the API
function getInvestments(investorId, investorName) {
  investorsLoader(modalBodyInner);

  var xhr = new XMLHttpRequest(),
    method = 'GET',
    url = `http://165.227.229.49:8000/investors/${investorId}/investments?api_key=vNtV4nZsuMRL01sXVPzUtRnzf7L08B9O`;

  xhr.open(method, url, true);
  xhr.setRequestHeader('Accept', 'application/json');

  xhr.onload = function() {
    if (xhr.status == 200) {
      var response = JSON.parse(xhr.responseText);
      var investments = response.data;
      var investmentsTotal = response.total;
      if (investmentsTotal > 0) {
        modalHeader.innerHTML = `
        <div class="investments">
          <div class="investments__avatar">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <title>Avatar image for ${investments[0].investor.first_name} ${
          investments[0].investor.last_name
        }</title>
              <path d="M12,0A12,12,0,1,1,0,12,12,12,0,0,1,12,0Zm8.13,19.41a2.6,2.6,0,0,0-1.63-.85c-3.85-.91-4.09-1.5-4.35-2.06a2.18,2.18,0,0,1,.21-2c1.72-3.25,2.09-6,1-7.79A3.74,3.74,0,0,0,12,5,3.79,3.79,0,0,0,8.59,6.76c-1.07,1.79-.69,4.55,1.05,7.76a2.16,2.16,0,0,1,.22,2c-.27.59-.61,1.19-4.37,2.07a2.54,2.54,0,0,0-1.62.85,11,11,0,0,0,16.26,0Zm.65-.78a11,11,0,1,0-17.56,0,3.82,3.82,0,0,1,2-1.05c2-.46,3.38-.83,3.68-1.5A1.24,1.24,0,0,0,8.76,15c-1.92-3.54-2.28-6.65-1-8.75A4.79,4.79,0,0,1,12,4a4.79,4.79,0,0,1,4.24,2.22c1.25,2.08.9,5.19-1,8.77a1.27,1.27,0,0,0-.18,1.1c.31.66,1.64,1,3.67,1.49A3.76,3.76,0,0,1,20.78,18.63Z" fill="#63a1d4"/>
            </svg>
          </div>
          <div class="investments-wrapper">
            <h3 class="investments__name">${investments[0].investor.first_name} ${
          investments[0].investor.last_name
        }

            </h3>
            <div class="investments__total">${
              investmentsTotal > 1
                ? investmentsTotal + ' investments'
                : investmentsTotal + ' investment'
            }</div>
          </div>

        </div>`;

        modalBodyInner.innerHTML = '';

        // Loop through and display all investments
        for (var i = 0; i < investments.length; i++) {
          // Investments template
          if (investments[i].status === 'committed' || investments[i].status === 'cancelled') {
            modalBodyInner.innerHTML += `
            <div class="investment">
              <h4 class="investment__bond-name">${investments[i].bond.name}</h4>
              <p><b>Duration:</b> ${investments[i].bond.duration_months} months</p>
              <p><b>Interest Paid:</b> ${capitaliseFirst(investments[i].type)}</p>
              <p><b>Amount Invested:</b> £${currencyFormat(
                Number(investments[i].amount / 100).toFixed(2)
              )}</p>
              <p><b>Expected Return:</b> £${currencyFormat(
                Number(investments[i].expected_return / 100).toFixed(2)
              )}</p>
              <p><b>Status:</b> ${capitaliseFirst(investments[i].status)} </p>
            </div>`;
          } else {
            modalBodyInner.innerHTML += `
            <div class="investment">
              <h4 class="investment__bond-name">${investments[i].bond.name}</h4>
              <p><b>Duration:</b> ${investments[i].bond.duration_months} months</p>
              <p><b>Interest Paid:</b> ${capitaliseFirst(investments[i].type)}</p>
              <p><b>Amount Invested:</b> £${currencyFormat(
                Number(investments[i].amount / 100).toFixed(2)
              )}</p>
              <p><b>Expected Return:</b> £${currencyFormat(
                Number(investments[i].expected_return / 100).toFixed(2)
              )}</p>
              <p><b>Status:</b> ${capitaliseFirst(investments[i].status)}</p>
              <button class="investment__cancel-btn" data-bond-name="${
                investments[i].bond.name
              }" data-investor-name="${investments[i].investor.first_name} ${
              investments[i].investor.last_name
            }" data-investor-id="${investments[i].investor_id}" data-investment-id="${
              investments[i].id
            }">Cancel investment</button>
            </div>`;
          }
        }
      } else {
        modalHeader.innerHTML = `
        <div class="investments">
          <div class="investments__avatar">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <title>Avatar image for ${investorName}</title>
              <path d="M12,0A12,12,0,1,1,0,12,12,12,0,0,1,12,0Zm8.13,19.41a2.6,2.6,0,0,0-1.63-.85c-3.85-.91-4.09-1.5-4.35-2.06a2.18,2.18,0,0,1,.21-2c1.72-3.25,2.09-6,1-7.79A3.74,3.74,0,0,0,12,5,3.79,3.79,0,0,0,8.59,6.76c-1.07,1.79-.69,4.55,1.05,7.76a2.16,2.16,0,0,1,.22,2c-.27.59-.61,1.19-4.37,2.07a2.54,2.54,0,0,0-1.62.85,11,11,0,0,0,16.26,0Zm.65-.78a11,11,0,1,0-17.56,0,3.82,3.82,0,0,1,2-1.05c2-.46,3.38-.83,3.68-1.5A1.24,1.24,0,0,0,8.76,15c-1.92-3.54-2.28-6.65-1-8.75A4.79,4.79,0,0,1,12,4a4.79,4.79,0,0,1,4.24,2.22c1.25,2.08.9,5.19-1,8.77a1.27,1.27,0,0,0-.18,1.1c.31.66,1.64,1,3.67,1.49A3.76,3.76,0,0,1,20.78,18.63Z" fill="#63a1d4"/>
            </svg>
          </div>
          <h3 class="investments__name">${investorName}</h3>
        </div>`;

        modalBodyInner.innerHTML = `
          <div class="investment investment--none">
            <p>No investments have been made yet</p>
          </div>`;
      }

      // Add event listener to all cancel investment buttons
      var cancelInvestmentsBtns = document.querySelectorAll('.investment__cancel-btn');
      var cancelInvestmentsBtnsArr = Array.prototype.slice.call(cancelInvestmentsBtns);

      cancelInvestmentsBtnsArr.forEach(function(cancelBtn) {
        cancelBtn.addEventListener('click', function(e) {
          e.preventDefault ? e.preventDefault() : (e.returnValue = false);
          var bondName = this.getAttribute('data-bond-name');
          var investorId = this.getAttribute('data-investor-id');
          var investorName = this.getAttribute('data-investor-name');
          var investmentId = this.getAttribute('data-investment-id');

          if (confirm(`Are you sure you want to cancel your investment with ${bondName}?`)) {
            cancelInvestment(investorId, investmentId);
          } else {
            return false;
          }
        });
      });
    }
  };

  xhr.send();
}

// Make investment to the API
function makeInvestment(investorId, bondId, bondType, investAmount) {
  var xhr = new XMLHttpRequest(),
    method = 'POST',
    url =
      'http://165.227.229.49:8000/investors/' +
      investorId +
      '/investments?api_key=vNtV4nZsuMRL01sXVPzUtRnzf7L08B9O';

  var investmentData = JSON.stringify({
    bond_id: Number(bondId),
    type: bondType,
    amount: Number(investAmount),
  });

  xhr.open(method, url, true);
  xhr.setRequestHeader('Accept', 'application/json');
  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.onload = function() {
    if (xhr.status >= 400) {
      alert('Sorry your investment was not successful, please try again later.');
      console.log(`Response from the server: ${xhr.responseText}`);
      console.log(`Data sent to server: ${investmentData}`);
    } else {
      alert('Your investment was made successfully!');
      console.log(`Response from the server: ${xhr.responseText}`);
      console.log(`Data sent to server: ${investmentData}`);
    }
  };

  xhr.send(investmentData);
}

function cancelInvestment(investorId, investmentId) {
  var xhr = new XMLHttpRequest(),
    method = 'DELETE',
    url = `http://165.227.229.49:8000/investors/${investorId}/investments/${investmentId}?api_key=vNtV4nZsuMRL01sXVPzUtRnzf7L08B9O`;

  xhr.open(method, url, true);
  xhr.setRequestHeader('Accept', 'application/json');

  xhr.onload = function() {
    if (xhr.status == 200) {
      var response = JSON.parse(xhr.responseText);
      console.log(response);
      closeModal();
      alert('Your investment has been successfully cancelled.');
    } else {
      var response = JSON.parse(xhr.responseText);
      console.log(response);
    }
  };

  xhr.send();
}

// Event listeners
if (investorNameSelect) {
  investorNameSelect.addEventListener('change', function() {
    if (!investAmountInput.value) {
      return;
    } else if (bondsContainer.innerHTML == '') {
      return;
    } else {
      bondsContainer.style = 'margin-top: 5rem;';
      bondsLoader();
      getBonds();
    }
  });
}

if (investAmountInput) {
  investAmountInput.addEventListener('change', function() {
    if (bondsContainer.innerHTML == '') {
      return;
    } else {
      showBondsBtn.click();
    }
  });
}

if (showBondsBtn) {
  showBondsBtn.addEventListener('click', function(e) {
    e.preventDefault ? e.preventDefault() : (e.returnValue = false);

    if (investorNameSelect.value == 0) {
      alert('Please choose an investor.');
    } else if (!investAmountInput.value) {
      alert('Please specify an investment amount.');
    } else {
      bondsContainer.style = 'margin-top: 5rem;';
      bondsLoader();
      getBonds();
    }
  });
}

if (modalOverlay && modalCloseBtn) {
  function openModal() {
    modalOverlay.style.opacity = '1';
    modalOverlay.style.visibility = 'visible';
    modal.setAttribute('tabindex', '0');

    setTimeout(() => {
      modal.focus();
    }, 100);
  }

  function closeModal() {
    modalOverlay.style.opacity = '0';
    modalOverlay.style.visibility = 'hidden';

    setTimeout(() => {
      modalHeader.innerHTML = '';
      modalBodyInner.innerHTML = '';
    }, 300);
  }

  function modalClose(e) {
    if (!e.keyCode || e.keyCode === 27) {
      closeModal();
    }
  }
  document.addEventListener('keydown', modalClose);

  modalOverlay.addEventListener('click', function(e) {
    e.preventDefault ? e.preventDefault() : (e.returnValue = false);
    closeModal();
  });

  modal.addEventListener('click', function(e) {
    e.preventDefault ? e.preventDefault() : (e.returnValue = false);
    e.stopPropagation();
  });

  modalCloseBtn.addEventListener('click', function(e) {
    e.preventDefault ? e.preventDefault() : (e.returnValue = false);
    closeModal();
  });
}
// If investor name field exists, run function to populate the select field
if (investorNameSelect) {
  getInvestorsName();
}
// If investor container exists, run function to populate the investors container
if (investorsContainer) {
  getInvestors();
}

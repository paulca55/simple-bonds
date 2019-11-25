var investorNameSelect=document.querySelector(".investor-name"),investAmountWrapper=document.querySelector(".invest-amount-wrapper"),investAmountInput=document.querySelector(".invest-amount"),showBondsBtn=document.querySelector(".show-bonds-btn"),bondsContainer=document.querySelector(".bonds-container"),bondItem=document.querySelector(".bond"),investorsContainer=document.querySelector(".investors-container");function bondsLoader(){showBondsBtn.textContent="Finding available bonds...",bondsContainer.innerHTML='<div class="loader">Loading</div><div class="loader">Loading</div>'}function investorsLoader(){investorsContainer.innerHTML='<div class="loader">Loading</div>'}function focusClassToggle(){investAmountWrapper.classList.toggle("invest-amount-wrapper--focus")}function currencyFormat(n){return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")}function getBonds(){var n=new XMLHttpRequest;n.open("GET","http://165.227.229.49:8000/bonds?api_key=vNtV4nZsuMRL01sXVPzUtRnzf7L08B9O",!0),n.onload=function(){if(200==n.status){var t=JSON.parse(n.responseText).data,e=100*Number(investAmountInput.value);showBondsBtn.textContent="Show available bonds",bondsContainer.innerHTML="";for(var s=0;s<t.length;s++){var o=Number(100*t[s].maturity_interest).toFixed(2),r=e+e*t[s].maturity_interest/12*t[s].duration_months,a=currencyFormat(Number(r/100).toFixed(2)),i=Number(100*t[s].quarterly_interest).toFixed(2),d=e+e*t[s].quarterly_interest/12*t[s].duration_months,p=currencyFormat(Number(d/100).toFixed(2));bondsContainer.innerHTML+=`<div class="bond">\n          <header class="bond-header">\n            <h2 class="bond__heading">${t[s].name}</h2>\n            <p class="bond__duration">Duration | <span>${t[s].duration_months} Months</span></p>\n          </header>\n          <div class="bond-type-container">\n            <div class="bond-type bond-type--maturity">\n              <div class="bond-type__interest">\n                <p class="bond-type__interest-percent">${o}%<span class="bond-type__pa"> P.A</span></p>\n                <p class="bond-type__interest-paid">Interest paid <strong>on maturity</strong></p>\n              </div>\n              <div class="bond-type__return">\n                <p class="bond-type__return-amount">£${a}</p>\n                <p class="bond-type__return-text">Expected gross return<br><i>(based on a £${currencyFormat(investAmountInput.value)} investment)</i></p>\n              </div>\n              <div class="bond-type__invest-btn-wrapper">\n                <button class="btn bond-type__invest-btn">Invest<span class="u-screen-reader-text"> in ${t[s].name} over ${t[s].duration_months} months, interest paid on maturity.</span></button>\n              </div>\n            </div>\n            <div class="bond-type bond-type--quarterly">\n              <div class="bond-type__interest">\n                <p class="bond-type__interest-percent">${i}%<span class="bond-type__pa"> P.A</span></p>\n                <p class="bond-type__interest-paid">Interest paid <strong>quarterly</strong></p>\n              </div>\n              <div class="bond-type__return">\n                <p class="bond-type__return-amount">£${p}</p>\n                <p class="bond-type__return-text">Expected gross return<br><i>(based on a £${currencyFormat(investAmountInput.value)} investment)</i></p>\n              </div>\n              <div class="bond-type__invest-btn-wrapper">\n                <button class="btn bond-type__invest-btn">Invest<span class="u-screen-reader-text"> in ${t[s].name} over ${t[s].duration_months} months, interest paid quarterly.</span></button>\n              </div>\n            </div>\n          </div>\n        </div>\n        \x3c!-- END .bond --\x3e`}setTimeout((function(){var n=document.querySelectorAll(".bond");Array.prototype.slice.call(n).forEach((function(n){n.classList.add("is-loaded")}))}),100)}},n.send()}function getInvestorsName(){var n=new XMLHttpRequest;n.open("GET","http://165.227.229.49:8000/investors?&per_page=50&api_key=vNtV4nZsuMRL01sXVPzUtRnzf7L08B9O",!0),n.onload=function(){if(200==n.status)for(var t=JSON.parse(n.responseText).data,e=0;e<t.length;e++){var s=document.createElement("option");s.textContent=`${t[e].first_name}  ${t[e].last_name}`,investorNameSelect.appendChild(s)}},n.send()}function getInvestors(){investorsLoader();var n=new XMLHttpRequest;n.open("GET","http://165.227.229.49:8000/investors?&per_page=50&api_key=vNtV4nZsuMRL01sXVPzUtRnzf7L08B9O",!0),n.onload=function(){if(200==n.status){var t=JSON.parse(n.responseText).data;investorsContainer.innerHTML="";for(var e=0;e<t.length;e++)investorsContainer.innerHTML+=`\n          <div class="investor">\n            <div class="investor__avatar">\n              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">\n                <title>Avatar image for ${t[e].first_name} ${t[e].last_name}</title>\n                <path d="M12,0A12,12,0,1,1,0,12,12,12,0,0,1,12,0Zm8.13,19.41a2.6,2.6,0,0,0-1.63-.85c-3.85-.91-4.09-1.5-4.35-2.06a2.18,2.18,0,0,1,.21-2c1.72-3.25,2.09-6,1-7.79A3.74,3.74,0,0,0,12,5,3.79,3.79,0,0,0,8.59,6.76c-1.07,1.79-.69,4.55,1.05,7.76a2.16,2.16,0,0,1,.22,2c-.27.59-.61,1.19-4.37,2.07a2.54,2.54,0,0,0-1.62.85,11,11,0,0,0,16.26,0Zm.65-.78a11,11,0,1,0-17.56,0,3.82,3.82,0,0,1,2-1.05c2-.46,3.38-.83,3.68-1.5A1.24,1.24,0,0,0,8.76,15c-1.92-3.54-2.28-6.65-1-8.75A4.79,4.79,0,0,1,12,4a4.79,4.79,0,0,1,4.24,2.22c1.25,2.08.9,5.19-1,8.77a1.27,1.27,0,0,0-.18,1.1c.31.66,1.64,1,3.67,1.49A3.76,3.76,0,0,1,20.78,18.63Z" fill="#63a1d4"/>\n              </svg>\n            </div>\n            <h2 class="investor__name">${t[e].first_name} ${t[e].last_name}</h2>\n            <div class="investor__investments">\n              <button>View Investments<span class="u-screen-reader-text"> for ${t[e].first_name} ${t[e].last_name}</span></button>\n            </div>\n          </div>`;setTimeout((function(){var n=document.querySelectorAll(".investor");Array.prototype.slice.call(n).forEach((function(n){n.classList.add("is-loaded")}))}),100)}},n.send()}showBondsBtn&&showBondsBtn.addEventListener("click",(function(n){n.preventDefault?n.preventDefault():n.returnValue=!1,investAmountInput.value?(bondsContainer.style="margin-top: 5rem;",bondsLoader(),getBonds()):alert("Please specify an investment amount.")})),investorNameSelect&&getInvestorsName(),investorsContainer&&getInvestors();
var investorNameSelect=document.querySelector(".investor-name"),investAmountWrapper=document.querySelector(".invest-amount-wrapper"),investAmountInput=document.querySelector(".invest-amount"),showBondsBtn=document.querySelector(".show-bonds-btn"),bondsContainer=document.querySelector(".bonds-container"),bondItem=document.querySelector(".bond"),investorsContainer=document.querySelector(".investors-container"),modalOverlay=document.querySelector(".modal-overlay"),modal=document.querySelector(".modal"),modalCloseBtn=document.querySelector(".modal__close-btn"),modalBody=document.querySelector(".modal__body");function bondsLoader(){showBondsBtn.textContent="Finding available bonds...",bondsContainer.innerHTML='<div class="loader">Loading</div><div class="loader">Loading</div>'}function investorsLoader(){investorsContainer.innerHTML='<div class="loader">Loading</div>'}function focusClassToggle(){investAmountWrapper.classList.toggle("invest-amount-wrapper--focus")}function currencyFormat(e){return e.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")}function getBonds(){var e=new XMLHttpRequest;e.open("GET","http://165.227.229.49:8000/bonds?api_key=vNtV4nZsuMRL01sXVPzUtRnzf7L08B9O",!0),e.setRequestHeader("Accept","application/json"),e.onload=function(){if(200==e.status){var n=JSON.parse(e.responseText).data,t=100*Number(investAmountInput.value);showBondsBtn.textContent="Show available bonds",bondsContainer.innerHTML="";for(var o=0;o<n.length;o++){var s=Number(100*n[o].maturity_interest).toFixed(2),a=t+t*n[o].maturity_interest/12*n[o].duration_months,r=currencyFormat(Number(a/100).toFixed(2)),i=Number(100*n[o].quarterly_interest).toFixed(2),d=t+t*n[o].quarterly_interest/12*n[o].duration_months,u=currencyFormat(Number(d/100).toFixed(2));bondsContainer.innerHTML+=`<div class="bond">\n          <header class="bond-header">\n            <h2 class="bond__heading">${n[o].name}</h2>\n            <p class="bond__duration">Duration | <span>${n[o].duration_months} Months</span></p>\n          </header>\n          <div class="bond-type-container">\n            <div class="bond-type bond-type--maturity">\n              <div class="bond-type__interest">\n                <p class="bond-type__interest-percent">${s}%<span class="bond-type__pa"> P.A</span></p>\n                <p class="bond-type__interest-paid">Interest paid <strong>on maturity</strong></p>\n              </div>\n              <div class="bond-type__return">\n                <p class="bond-type__return-amount">£${r}</p>\n                <p class="bond-type__return-text">Expected gross return<br><i>(based on a £${currencyFormat(investAmountInput.value)} investment)</i></p>\n              </div>\n              <div class="bond-type__invest-btn-wrapper">\n                <button class="btn bond-type__invest-btn" data-bond-id="${n[o].id}" data-bond-type="maturity" data-invest-amount="${t}">Invest<span class="u-screen-reader-text"> in ${n[o].name} over ${n[o].duration_months} months, interest paid on maturity.</span></button>\n              </div>\n            </div>\n            <div class="bond-type bond-type--quarterly">\n              <div class="bond-type__interest">\n                <p class="bond-type__interest-percent">${i}%<span class="bond-type__pa"> P.A</span></p>\n                <p class="bond-type__interest-paid">Interest paid <strong>quarterly</strong></p>\n              </div>\n              <div class="bond-type__return">\n                <p class="bond-type__return-amount">£${u}</p>\n                <p class="bond-type__return-text">Expected gross return<br><i>(based on a £${currencyFormat(investAmountInput.value)} investment)</i></p>\n              </div>\n              <div class="bond-type__invest-btn-wrapper">\n                <button class="btn bond-type__invest-btn" data-bond-id="${n[o].id}" data-bond-type="quarterly" data-invest-amount="${t}">Invest<span class="u-screen-reader-text"> in ${n[o].name} over ${n[o].duration_months} months, interest paid quarterly.</span></button>\n              </div>\n            </div>\n          </div>\n        </div>\n        \x3c!-- END .bond --\x3e`}document.querySelectorAll(".bond-type__invest-btn").forEach((function(e){e.addEventListener("click",(function(){makeInvestment(investorNameSelect.value,this.getAttribute("data-bond-id"),this.getAttribute("data-bond-type"),this.getAttribute("data-invest-amount"))}))})),setTimeout((function(){var e=document.querySelectorAll(".bond");Array.prototype.slice.call(e).forEach((function(e){e.classList.add("is-loaded")}))}),100)}},e.send()}function getInvestorsName(){var e=new XMLHttpRequest;e.open("GET","http://165.227.229.49:8000/investors?&per_page=50&api_key=vNtV4nZsuMRL01sXVPzUtRnzf7L08B9O",!0),e.setRequestHeader("Accept","application/json"),e.onload=function(){if(200==e.status){var n=JSON.parse(e.responseText).data;investorNameSelect.innerHTML="<option value='0'>Select investor</option>";for(var t=0;t<n.length;t++){var o=document.createElement("option");o.setAttribute("value",Number([t])+1),o.textContent=`${n[t].first_name} ${n[t].last_name}`,investorNameSelect.appendChild(o)}}},e.send()}function getInvestors(){investorsLoader();var e=new XMLHttpRequest;e.open("GET","http://165.227.229.49:8000/investors?&per_page=50&api_key=vNtV4nZsuMRL01sXVPzUtRnzf7L08B9O",!0),e.setRequestHeader("Accept","application/json"),e.onload=function(){if(200==e.status){var n=JSON.parse(e.responseText).data;investorsContainer.innerHTML="";for(var t=0;t<n.length;t++)investorsContainer.innerHTML+=`\n          <div class="investor">\n            <div class="investor__avatar">\n              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">\n                <title>Avatar image for ${n[t].first_name} ${n[t].last_name}</title>\n                <path d="M12,0A12,12,0,1,1,0,12,12,12,0,0,1,12,0Zm8.13,19.41a2.6,2.6,0,0,0-1.63-.85c-3.85-.91-4.09-1.5-4.35-2.06a2.18,2.18,0,0,1,.21-2c1.72-3.25,2.09-6,1-7.79A3.74,3.74,0,0,0,12,5,3.79,3.79,0,0,0,8.59,6.76c-1.07,1.79-.69,4.55,1.05,7.76a2.16,2.16,0,0,1,.22,2c-.27.59-.61,1.19-4.37,2.07a2.54,2.54,0,0,0-1.62.85,11,11,0,0,0,16.26,0Zm.65-.78a11,11,0,1,0-17.56,0,3.82,3.82,0,0,1,2-1.05c2-.46,3.38-.83,3.68-1.5A1.24,1.24,0,0,0,8.76,15c-1.92-3.54-2.28-6.65-1-8.75A4.79,4.79,0,0,1,12,4a4.79,4.79,0,0,1,4.24,2.22c1.25,2.08.9,5.19-1,8.77a1.27,1.27,0,0,0-.18,1.1c.31.66,1.64,1,3.67,1.49A3.76,3.76,0,0,1,20.78,18.63Z" fill="#63a1d4"/>\n              </svg>\n            </div>\n            <h2 class="investor__name">${n[t].first_name} ${n[t].last_name}</h2>\n              <button class="investor__investments" data-bond-id="${n[t].id}">View Investments<span class="u-screen-reader-text"> for ${n[t].first_name} ${n[t].last_name}</span></button>\n          </div>`;setTimeout((function(){var e=document.querySelectorAll(".investor");Array.prototype.slice.call(e).forEach((function(e){e.classList.add("is-loaded")}))}),100)}},e.send()}function makeInvestment(e,n,t,o){var s=new XMLHttpRequest,a="http://165.227.229.49:8000/investors/"+e+"/investments?api_key=vNtV4nZsuMRL01sXVPzUtRnzf7L08B9O",r=JSON.stringify({bond_id:Number(n),type:t,amount:Number(o)});s.open("POST",a,!0),s.setRequestHeader("Accept","application/json"),s.setRequestHeader("Content-Type","application/json"),s.onload=function(){s.status>=400?(alert("Sorry your investment was not successful, please try again later."),console.log(s.responseText),console.log(r)):(prom("Your investment was made successfully!"),console.log(s.responseText),console.log(r))},s.send(r)}investorNameSelect&&investorNameSelect.addEventListener("change",(function(){investAmountInput.value&&""!=bondsContainer.innerHTML&&(bondsContainer.style="margin-top: 5rem;",bondsLoader(),getBonds())})),investAmountInput&&investAmountInput.addEventListener("change",(function(){""!=bondsContainer.innerHTML&&showBondsBtn.click()})),showBondsBtn&&showBondsBtn.addEventListener("click",(function(e){e.preventDefault?e.preventDefault():e.returnValue=!1,0==investorNameSelect.value?alert("Please choose an investor."):investAmountInput.value?(bondsContainer.style="margin-top: 5rem;",bondsLoader(),getBonds()):alert("Please specify an investment amount.")})),modalOverlay&&modalCloseBtn&&(modalCloseBtn.addEventListener("click",(function(e){e.preventDefault?e.preventDefault():e.returnValue=!1,modalBody.innerHTML=""})),modalOverlay.addEventListener("click",(function(e){e.preventDefault?e.preventDefault():e.returnValue=!1,modalBody.innerHTML=""}))),investorNameSelect&&getInvestorsName(),investorsContainer&&getInvestors();
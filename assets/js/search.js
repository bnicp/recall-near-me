//https://open.fda.gov/apis/advanced-syntax/
var eleContainer = document.getElementById("displayResults");
var fdaContainer = document.getElementById("fdaResults");
var nytContainer = document.getElementById("nytResults");
var fetchButton = document.getElementById("search");
var topicChoice = document.getElementById("displayNYT");
var lastUserSearch = JSON.parse(localStorage.getItem("lastUserSearch"));
var contactModal = document.getElementById("contactModal");
var searchModal = document.getElementById("searchModal");
var supportModal = document.getElementById("supportModal");

function init() {
  getApi();
}

function getApi() {
  //var requestUrl = 'https://api.github.com/repos/IBM/clai/issues?per_page=5';
  //alert("fetch");
  //construct url
  eleContainer.innerHTML = "";
  eleContainer.innerHTML = `<h3>Active Recall Results</h3>`;
  var url_1 = "https://api.fda.gov/food/enforcement.json?search=";
  var paramState = lastUserSearch.state;
  var paramCity = lastUserSearch.city;
  var paramProd = lastUserSearch.product;
  var paramFrmDt = lastUserSearch.fromDate;
  var paramToDt = lastUserSearch.toDate;
  var urlArray = [];
  if (paramState != "") {
    paramState = paramState.split(" ").join("+");
    var url_2 = "state:" + paramState;
    urlArray.push(url_2);
  }
  if (paramCity != "") {
    paramCity = paramCity.split(" ").join("+");
    var url_3 = "+city:" + paramCity;
    urlArray.push(url_3);
  }
  if (paramFrmDt != "" || paramToDt != "") {
    paramFrmDt = paramFrmDt.split("-").join("");
    paramToDt = paramToDt.split("-").join("");
    //alert(paramFrmDt);
    if (paramFrmDt != "" && paramToDt != "") {
      var url_5 = "report_date:" + "[" + paramFrmDt + "+TO+" + paramToDt + "]";
      urlArray.push(url_5);
    } /*else if(paramFrmDt != ''  && paramToDt ==''){
    var url_5 = 'report_date:'+'['+paramFrmDt+']';
}*/ else {
      // var url_5 = 'report_date:'+'['+paramToDt+']';
    }
  }
  if (paramProd != "") {
    paramProd = paramProd.split(" ").join("+");
    var url_6 = "+product_description:" + paramProd;
    urlArray.push(url_6);
  }
  for (var i = 0; i < urlArray.length; i++) {
    if (i == 0) {
      url_1 = url_1 + urlArray[i];
    } else {
      url_1 = url_1 + "+AND+" + urlArray[i];
    }
    //alert(url_1);
  }
  var requestUrl = url_1 + "&sort=report_date:desc&limit=5"; //+'report_date:[20220101+TO+20221231]&limit=5'
  // 'https://api.fda.gov/food/enforcement.json';
  //https://api.fda.gov/food/enforcement.json?search=reason_for_recall:peanut;
  //alert(requestUrl);
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var results = data.results;
      //console.log(results[0]['city']);
      var htmlCreate = "";
      if (results.length > 0) {
        // pulled this line out to test for NYT clickable entity
        // <h4>${results[i].product_type} - ${results[i].recalling_firm}</h4>
        for (var i = 0; i < results.length; i++) {
          htmlCreate = ` <div class="w3-hover-shadow w3-center w3-round w3-margin w3-border w3-theme w3-padding">
          <h4 class="recallFirm w3-hover-opacity w3-bar-block w3-xlarge w3-text-white" style="background-color: #2E5987">${
            results[i].recalling_firm
          }</h4>
          <p class="w3-medium w3-left-align w3-padding"><span class="w3-large">State:</span>  ${
            results[i].state
          }</p>
          <p class="w3-medium w3-left-align w3-padding"><span class="w3-large">City:</span> ${
            results[i].city
          }</p>
          <p class="w3-medium w3-left-align w3-padding"><span class="w3-large">Description:</span> ${
            results[i].product_description
          }</p>
          <p class="w3-medium w3-left-align w3-padding"><span class="w3-large">Recall Reason:</span> ${
            results[i].reason_for_recall
          }</p>
          <p class="w3-medium w3-left-align w3-padding"><span class="w3-large">Report Date:</span> ${moment(
            results[i].report_date
          ).format("MM/DD/YYYY")}</span></p></div>`; //+ htmlCreate;
          eleContainer.innerHTML += htmlCreate;
        }
      } else {
        eleContainer.innerHTML = "No Results Found";
      }
    });
}

function getNYTArticles(event) {
  topicChoice.innerHTML = "";

  var splitSearchCriteria = event.target.textContent.split(" ");
  var nytSearchCriteriaHeader = "";

  splitSearchCriteria.forEach(function (criteria, i) {
    if (i === splitSearchCriteria.length - 1) {
      nytSearchCriteriaHeader += '"' + criteria + '"';
    } else {
      nytSearchCriteriaHeader += '"' + criteria + '", ';
    }
  });

  topicChoice.innerHTML = `<h3>New York Times Relevant Articles for: <br>${nytSearchCriteriaHeader}</h3>`;
  var queryParam = event.target.textContent;
  queryParam = queryParam.replace(/\s/g, "%20");
  var nytAPIKey = "IpBihDlOE1r2nQVdTm0GsZyMB2Ba0BGQ";
  var nytRequestUrl = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${queryParam}&sort=newest&api-key=${nytAPIKey}`;
  var nytArticle = "";
  fetch(nytRequestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (results) {
      if (results.response.docs.length > 0) {
        var articleArray = results.response.docs;
        for (var i = 0; i < articleArray.length; i++) {
          var title = articleArray[i].headline.main;
          if (!title) {
            title = articleArray[i].headline.kicker;
          }
          if (articleArray[i].abstract) {
            var abstract = `<p class="w3-medium w3-left-align w3-padding"><span class="w3-large">Abstract:</span> ${articleArray[i].abstract}</p>`;
          } else {
            var abstract = ``;
          }
          nytArticle = `<div class="w3-hover-shadow w3-center w3-round w3-margin w3-border w3-theme w3-padding">
          <h4 class="recallFirm w3-hover-opacity w3-bar-block w3-xlarge w3-text-white" style="background-color: #2E5987">
          <a href="${
            articleArray[i].web_url
          }" target="popup" class="w3-medium w3-left-align w3-padding w3-xlarge">${title}</a></h4>
          <p class="w3-medium w3-left-align w3-padding"><span class="w3-large">Published:</span> ${moment(
            articleArray[i].pub_date
          ).format("MM/DD/YYYY")}</p> 
                ${abstract}
          </div>`;
          topicChoice.innerHTML += nytArticle;
        }
      } else {
        topicChoice.innerHTML += "<p>No Results Found</p>";
      }
    });
}

// Event listener for whole page
document.addEventListener("click", function (event) {
  // When the search button is clicked from the home page the index.html
  // is displayed and the search criteria is searched
  if (event.target.id === "searchModalBtn") {
    lastUserSearch.state = document.getElementById("srchState").value.trim();
    lastUserSearch.city = document.getElementById("srchCity").value.trim();
    lastUserSearch.product = document.getElementById("srchProd").value.trim();
    lastUserSearch.fromDate = document.getElementById("srchFrmDt").value.trim();
    lastUserSearch.toDate = document.getElementById("srchToDt").value.trim();
    localStorage.setItem("lastUserSearch", JSON.stringify(lastUserSearch));
    nytContainer.classList.add("hide");
    fdaContainer.classList.remove("w3-half");
    searchModal.style.display = "none";
    getApi();
  }

  // When the website title screen is clicked on then it will take you
  // back to the home page
  if (event.target.id === "websiteTitle") {
    window.location.replace("index.html");
  }

  // When the recalling firm is clicked on then the NYT API is called
  if (event.target.classList.contains("recallFirm")) {
    topicChoice.classList.remove("hide");
    fdaContainer.classList.add("w3-half");
    nytContainer.classList.remove("hide");
    getNYTArticles(event);
  }
});

window.onclick = function (event) {
  if (
    event.target === contactModal ||
    event.target === searchModal ||
    event.target === supportModal
  ) {
    contactModal.style.display = "none";
    searchModal.style.display = "none";
    supportModal.style.display = "none";
  }
};

/* This function is called on page load*/
init();

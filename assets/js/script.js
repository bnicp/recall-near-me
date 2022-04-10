//https://open.fda.gov/apis/advanced-syntax/

var eleContainer = document.getElementById("displayResults");
var fetchButton = document.getElementById("search");
var topicChoice = document.getElementById("displayNYT");

function getApi() {
  //var requestUrl = 'https://api.github.com/repos/IBM/clai/issues?per_page=5';
  //alert("fetch");

  //construct url
  eleContainer.innerHTML = "";

  var url_1 = "https://api.fda.gov/food/enforcement.json?search=";

  var paramState = document.getElementById("srchState").value.trim();
  var paramCity = document.getElementById("srchCity").value.trim();
  var paramFood = document.getElementById("srchFood").value.trim();
  var paramProd = document.getElementById("srchProd").value.trim();
  var paramFrmDt = document.getElementById("srchFrmDt").value.trim();
  var paramToDt = document.getElementById("srchToDt").value.trim();
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

  if (paramFood != "") {
    paramFood = paramFood.split(" ").join("+");
    var url_4 = "+reason_for_recall:" + paramFood;
    urlArray.push(url_4);
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

  var requestUrl = url_1 + "&limit=5"; //+'report_date:[20220101+TO+20221231]&limit=5'
  // 'https://api.fda.gov/food/enforcement.json';
  //https://api.fda.gov/food/enforcement.json?search=reason_for_recall:peanut;

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
          htmlCreate = ` <div class="resultsCard">
          <h4 class="recallFirm">${results[i].recalling_firm}</h4>
          <p>State:  ${results[i].state}</p>
          <p>City:${results[i].city}</p>
          <p>Description:${results[i].product_description}</p>
          <p>Reason for recall:${results[i].reason_for_recall}</p>
          <p>Report Date:${results[i].report_date}</p></div>`; //+ htmlCreate;

          eleContainer.innerHTML += htmlCreate;
        }
      } else {
        eleContainer.innerHTML = "No Results Found";
      }
    });
}

function getNYTArticles(event) {
  topicChoice.innerHTML = "";
  var queryParam = event.target.textContent;
  queryParam = queryParam.replace(/\s/g, "%20");
  var nytAPIKey = "IpBihDlOE1r2nQVdTm0GsZyMB2Ba0BGQ";
  var nytRequestUrl = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${queryParam}&api-key=${nytAPIKey}`;
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
            var abstract = `<p>Abstract: ${articleArray[i].abstract}</p>`;
          } else {
            var abstract = ``;
          }
          nytArticle = ` <div class="resultsCard"> 
                <h4>${title}</h4>
                <p>Published: ${moment(articleArray[i].pub_date).format(
                  "MM/DD/YYYY"
                )}</p> 
                ${abstract}
                <a href="${
                  articleArray[i].web_url
                }" target="popup">Article Link</a>
                </div>`;
          topicChoice.innerHTML += nytArticle;
        }
      } else {
        topicChoice.innerHTML = "No Results Found";
      }
    });
}

// Event listener for only the recall firm getting clicked on to search NYT articles
$("#displayResults").on("click", ".recallFirm", getNYTArticles);

fetchButton.addEventListener("click", getApi);

//var foodFirm = document.createElement('h3');
//var cityName= document.createElement('p');
// alert(results[i].product_type+"-"+results[i].recalling_firm);
//alert(results[i].city);

//foodFirm.textContent = results[i].product_type+"-"+results[i].recalling_firm;
//cityName.textContent ="City:"+results[i].city;
//  issueContainer.appendChild(foodFirm);
// issueContainer.appendChild(cityName);
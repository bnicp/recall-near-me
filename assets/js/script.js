//https://open.fda.gov/apis/advanced-syntax/
var eleContainer = document.getElementById("displayResults");
var fdaContainer = document.getElementById("fdaResults");
var nytContainer = document.getElementById("nytResults");
var fetchButton = document.getElementById("search");
var topicChoice = document.getElementById("displayNYT");

function getApi() {
  //var requestUrl = 'https://api.github.com/repos/IBM/clai/issues?per_page=5';
  //alert("fetch");
  //construct url
  eleContainer.innerHTML = "";
  eleContainer.innerHTML = `<h3>Active Recall Results</h3>`;
  var url_1 = "https://api.fda.gov/food/enforcement.json?search=";
  var paramState = document.getElementById("srchState").value.trim();
  var paramCity = document.getElementById("srchCity").value.trim();
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
          <h4 class="recallFirm w3-hover-opacity w3-bar-block w3-xlarge w3-light-grey w3-text-black">${
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

  var requestUrl1 =
    "https://api.fda.gov/food/enforcement.json?search=reason_for_recall:milk&count=report_date&sort=report_date:desc&limit=10";
  var xValues = [];
  var yValues = [];
  fetch(requestUrl1)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var results = data.results;
      for (var i = 0; i < 5; i++) {
        xValues.push(results[i].time);
        yValues.push(results[i].count);
      }

      ctx.innerHTML = "";
      var barColors = ["red", "green", "blue", "orange", "brown"];
      const myChart = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: xValues,
          datasets: [
            {
              data: yValues,
              backgroundColor: barColors,
              borderColor: [
                "rgba(255, 99, 132, 1,0.3)",
                "rgba(54, 162, 235, 1,0.3)",
                "rgba(255, 206, 86, 1,0.3)",
                "rgba(75, 192, 192, 1,0.3)",
                "rgba(153, 102, 255, 1,0.3)",
                "rgba(255, 159, 64, 1,0.3)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    });

  var ctx = document.getElementById("myChart").getContext("2d");
  //var xValues = ["Italy", "France", "Spain", "USA", "Argentina"];
  //var yValues = [55, 49, 44, 24, 15];
  //console.log(xValues);
  //console.log(yValues);

  getMap();
}
function getNYTArticles(event) {
  topicChoice.innerHTML = "";
  topicChoice.innerHTML = `<h3>New York Times Relevant Articles</h3>`;
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
            var abstract = `<p class="w3-medium w3-left-align w3-padding"><span class="w3-large">Abstract:</span> ${articleArray[i].abstract}</p>`;
          } else {
            var abstract = ``;
          }
          nytArticle = ` <div class="w3-hover-shadow w3-center w3-round w3-margin w3-border w3-theme w3-padding">
          <h4 class="w3-hover-opacity w3-bar-block w3-xlarge w3-light-grey w3-text-black">
          <a class="w3-hover-opacity w3-bar-block w3-xlarge w3-light-grey w3-text-black" href="${
            articleArray[i].web_url
          }" target="popup" class="w3-medium w3-left-align w3-padding"><span class="w3-large">${title}</span></a></h4>
          <p class="w3-medium w3-left-align w3-padding"><span class="w3-large">Published:</span> ${moment(
            articleArray[i].pub_date
          ).format("MM/DD/YYYY")}</p> 
                ${abstract}
                </div>`;
          topicChoice.innerHTML += nytArticle;
        }
      } else {
        topicChoice.innerHTML = "No Results Found";
      }
    });
}

function getMap() {
  var requestUrl1 =
    "https://api.fda.gov/food/enforcement.json?count=state.exact";
  //https://api.fda.gov/food/enforcement.json?search=+product_description:whey&count=state.exact&limit=10
  //product_desc and limit 10
  var xValues = [];
  var yValues = [];

  fetch(requestUrl1)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var results = data.results;
      //alert(results.length);
      for (var i = 0; i < 25 /*results.length-1*/; i++) {
        xValues.push(results[i].term);
        yValues.push(results[i].count);
      }

      //var mapStates = 'AL,AK,AZ,AR,CA,CO,CT,DE,FL,GA,HI,ID,IL,IN,IA,KS,KY,LA,ME,MD,MA,MI,MN,MS,MO,MT,NE,NV,NH,NJ,NM,NY,NC,ND,OH,OK,OR,PA,RI,SC,SD,TN,TX,UT,VT,VA,WA,WV,WI,WY'.split(  ',');
      var chartConfig = {
        debug: true,
        type: "map",
        palette: {
          pointValue: "{%zValue}",
          colors: [
            "#f7fcfd",
            "#e5f5f9",
            "#ccece6",
            "#99d8c9",
            "#66c2a4",
            "#41ae76",
            "#238b45",
            "#006d2c",
            "#00441b",
          ],
          //ranges: { min: 0, max: 1000, interval: 200 },
          //  defaultRange_legendEntry_value: '$%min - $%max'
        },
        legend: {
          //  title_label_text: 'Sales',
          //  template: '%value %icon',
          position: "top",
        },

        defaultPoint: {
          label_text: "%stateCode",
          tooltip: "<b>%name</b> <br/>Count: {%zValue}",
        },
        //defaultSeries_shape_padding: 0.02,
        series: [{ id: "usMap", map: "us" }],
      };

      chartConfig.series[0].points = getRandomPoints();
      var chart = JSC.chart("chartDiv", chartConfig);
      var xNew = "";
      var yNew = "";
      function getRandomPoints() {
        for (i = 0; i < xValues.length - 1; i++) {
          xNew = xNew + "," + xValues[i];
          yNew = yNew + "," + yValues[i];
        }

        xNew = xNew.split(",");
        yNew = yNew.split(",");

        return xNew.map(function (arrItem, index) {
          return { map: "US." + arrItem, z: yNew[index] };
        });
      }
    });
}

function w3_open() {
  document.getElementById("mySidebar").style.display = "block";
  document.getElementById("myOverlay").style.display = "block";
}

function w3_close() {
  document.getElementById("mySidebar").style.display = "none";
  document.getElementById("myOverlay").style.display = "none";
}

// Event listener for whole page
document.addEventListener("click", function (event) {
  if (event.target.classList.contains("recallFirm")) {
    topicChoice.classList.remove("hide");
    fdaContainer.classList.remove("w3-twothird");
    fdaContainer.classList.add("w3-third");
    nytContainer.classList.remove("hide");
    getNYTArticles(event);
  }

  if (event.target.id === "search") {
    event.preventDefault();
    if (!topicChoice.classList.contains("hide")) {
      topicChoice.classList.add("hide");
    }
    if (fdaContainer.classList.contains("w3-third")) {
      fdaContainer.classList.remove("w3-third");
      fdaContainer.classList.add("w3-twothird");
    }

    fdaContainer.classList.remove("hide");
    getApi();
  }
});

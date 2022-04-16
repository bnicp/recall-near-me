Chart.defaults.global.legend.display = false;
var contactModal = document.getElementById("contactModal");
var searchModal = document.getElementById("searchModal");
var supportModal = document.getElementById("supportModal");

var lastUserSearch = {
  state: "",
  city: "",
  product: "",
  fromDate: "",
  toDate: "",
};

function init() {
  getMap();
}

function getMap() {
  var requestUrl1 =
    "https://api.fda.gov/food/enforcement.json?count=state.exact";
  var xValues = [];
  var yValues = [];

  fetch(requestUrl1)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var results = data.results;
      for (var i = 0; i < 25; i++) {
        xValues.push(results[i].term);
        yValues.push(results[i].count);
      }

      var chartConfig = {
        debug: true,
        type: "map",
        defaultPoint: {
          label_text: "%stateCode",
          tooltip: "<b>%name</b> <br/>Total Recalls: {%zValue}",
        },
        //defaultSeries_shape_padding: 0.02,
        series: [{ color: "#D0CE7D", points: getRandomPoints() }],
      };

      var chart = JSC.chart("chartDiv", chartConfig);
      var xNew = "";
      var yNew = "";
      function getRandomPoints() {
        for (i = 0; i < xValues.length - 2; i++) {
          xNew = xNew + "," + xValues[i];
          yNew = yNew + "," + yValues[i];
        }

        xNew = xNew.split(",");
        yNew = yNew.split(",");

        return xNew.map(function (arrItem, index) {
          if (arrItem === "undefined") {
            arrItem = "M";
          }
          if (yNew[index] === "undefined") {
            yNew[index] = 0;
          }
          return { map: "US." + arrItem, z: yNew[index] };
        });
      }
    });
}

document.addEventListener("click", function (event) {
  if (event.target.id === "searchModalBtn") {
    lastUserSearch.state = document.getElementById("srchState").value.trim();
    lastUserSearch.city = document.getElementById("srchCity").value.trim();
    lastUserSearch.product = document.getElementById("srchProd").value.trim();
    lastUserSearch.fromDate = document.getElementById("srchFrmDt").value.trim();
    lastUserSearch.toDate = document.getElementById("srchToDt").value.trim();
    localStorage.setItem("lastUserSearch", JSON.stringify(lastUserSearch));
    window.location.replace("search.html");
  }

  if (event.target.id === "contactBtn") {
    // document.getElementById("contactModal").classList.remove("hide");
  }

  // if (event.target.id !== "contactModal") {
  //   document.getElementById("contactModal").classList.add("hide");
  // }
});

window.onclick = function (event) {
  if (
    event.target == contactModal ||
    event.target == searchModal ||
    event.target === supportModal
  ) {
    contactModal.style.display = "none";
    searchModal.style.display = "none";
    supportModal.style.display = "none";
  }
};

var varModal = "";

document.addEventListener("mouseover", function (e) {
  e.stopPropagation();
  if (e.target.innerHTML === "defective") {
    varModal = "defective";
    // alert(varModal);
    getChart(varModal);
  } else if (e.target.innerHTML === "adulterated") {
    varModal = "adulterated";
    getChart(varModal);
  } else if (e.target.innerHTML === "contaminated") {
    varModal = "contaminated";
    getChart(varModal);
  } else if (e.target.innerHTML === "misbranded") {
    varModal = "misbranded";
    getChart(varModal);
  } else if (e.target.innerHTML === "mislabeled") {
    varModal = "mislabeled";
    getChart(varModal);
  } else {
  }
});

function getChart(varModal) {
  var requestUrl1 =
    //"https://api.fda.gov/food/enforcement.json?search=reason_for_recall:milk&count=report_date&sort=report_date:desc&limit=10";
    "https://api.fda.gov/food/enforcement.json?search=reason_for_recall:" +
    varModal +
    "&count=city.exact&sort=report_date:desc&limit=5";

  var xValues = [];
  var yValues = [];
  fetch(requestUrl1)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var results = data.results;
      for (var i = 0; i < 3; i++) {
        xValues.push(results[i].term);
        //alert(xValues);
        yValues.push(results[i].count);
      }

      new Chart("chartModal", {
        type: "bar",
        data: {
          labels: xValues,
          datasets: [
            {
              backgroundColor: [
                "rgba(255, 99, 132, 0.3)",
                "rgba(54, 162, 235, 0.3)",
                "rgba(255, 206, 86, 0.3)",
                "rgba(75, 192, 192, 0.3)",
                "rgba(153, 102, 255, 0.3)",
                "rgba(255, 159, 64, 0.3)",
              ],
              data: yValues,
            },
          ],
        },

        options: {
          legend: { display: false },
          title: {
            display: true,
            text: varModal,
            responsive: true,
          },
          scales: {
            xAxes: [
              {
                gridLines: {
                  color: "rgba(0, 0, 0, 0)",
                },
              },
            ],
            yAxes: [
              {
                gridLines: {
                  color: "rgba(0, 0, 0, 0)",
                },
              },
            ],
            yAxes: [
              {
                display: false,
              },
            ],
          },
          plugins: {
            datalabels: {
              display: true,
              align: "center",
              anchor: "center",
            },
          },
        },
      });
    });
}

init();

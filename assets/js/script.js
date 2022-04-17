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

/*Vizs - map and bar chart are loaded on window load */

function init() {
  getMap();
  getChart("recalling_firm");
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
        debug: false,
        type: "map",
        defaultPoint: {
          label_text: "%stateCode",
          tooltip:
            '<span style="color:#000937;font-weight:bolder;height:50%;font-size:1rem">{%name}:  {%zValue}</span>',
        },
        //defaultSeries_shape_padding: 0.02,
        series: [{ color: "#009688", points: getRandomPoints() }],
        /* Map annotation is added here and <p> describing map details is taken out from index.html*/
        annotations: [
          {
            id: "annt",
            label: {
              text: "Above map displays top 25 states by total recalls. Hover over map to get info on total recalls till date",
              style_fontSize: 14,
            },
            position: "bottom left",
          },
        ],
      };

   

    
    
      JSC.chart("chartDiv", chartConfig);

      var xNew = "";
      var yNew = "";
      function getRandomPoints() {
        for (i = 0; i < xValues.length - 2; i++) {
          xNew = xNew + "," + xValues[i];
          yNew = yNew + "," + yValues[i];
        }

        xNew = xNew.split(",");
        yNew = yNew.split(",");

        /*Below  condition checks help to avoid undefined as a state value passed to the map */

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

/* This section is for the bar chart data values*/
/* event listeners are added for button click event, if  happens, inner html of the element is checked to pick up right request for fetching data */

var varModal = "";

function getChart(varModal) {
  var requestUrl1 =
    "https://api.fda.gov/food/enforcement.json?count=" +
    varModal +
    ".exact&sort=report_date:desc&limit=6";

    var searchName = 'By Recalling Firm';

  if (varModal === "name_brand") {

    requestUrl1 =
      "https://api.fda.gov/food/event.json?count=products." +
      varModal +
      ".exact&limit=5";
      searchName = 'By Brand Name';
  }

  if (varModal === "reactions") {
    searchName = 'By Reactions';
    requestUrl1 =
      "https://api.fda.gov/food/event.json?count=" +
      varModal +
      ".exact&limit=5";
  }

  var xValues = [];
  var yValues = [];
  fetch(requestUrl1)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var results = data.results;
      for (var i = 0; i <= 3; i++) {
        xValues.push(results[i].term);
        //alert(xValues);
        yValues.push(results[i].count);
      }
      /*** canvas element removed from index.html. canvas element is added dynamically on page load and on button click events on categories. 
       * This change prevents chart js data change on that is seen when hovered on bars
       * 
      */
     document.getElementById("chartContainer").innerHTML='';
      chartHTMLTemplate  = `<canvas id="chartModal" style="height: 100%"></canvas>`;
      document.getElementById("chartContainer").innerHTML = chartHTMLTemplate;


     
      var chartBar = new Chart("chartModal", {
        type: "bar",
        data: {
          labels: xValues,
          datasets: [
            {
              backgroundColor: [
                "rgba(0,128,128, 0.5)",
                "rgba(0,128,128, 0.5)",
                "rgba(0,128,128, 0.5)",
                "rgba(0,128,128, 0.5)",
                "rgba(0,128,128, 0.5)",
                "rgba(0,128,128, 0.5)",
              ],
              data: yValues,
            },
          ],
        },

        /* chart configurations are defined to reflect wrapped labels, matching palette color, removing gridlines, and making the bar chart responsive*/
        options: {
          legend: { display: false },
          title: {
            display: true,
            text: "Click above buttons to view top 4 recalls for selected category. Current selection: "+searchName,
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

            xAxes: [
              {
                ticks: {
                  maxRotation: 90,
                  minRotation: 0,
                  callback: function (label, index, labels) {
                    if (/\s/.test(label)) {
                      return label.split(" ");
                    } else {
                      return label;
                    }
                  },
                },
              },
            ],
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                  },
                },
              ],
            },
          },
        },
      });
     
   

    });
}

document.addEventListener("click", function (event) {
 // event.stopPropagation();
  if (event.target.id === "searchModalBtn") {
    lastUserSearch.state = document.getElementById("srchState").value.trim();
    lastUserSearch.city = document.getElementById("srchCity").value.trim();
    lastUserSearch.product = document.getElementById("srchProd").value.trim();
    lastUserSearch.fromDate = document.getElementById("srchFrmDt").value.trim();
    lastUserSearch.toDate = document.getElementById("srchToDt").value.trim();
    localStorage.setItem("lastUserSearch", JSON.stringify(lastUserSearch));
    window.location.replace("search.html");
  } else if (event.target.id === "searchModalOpenBtn") {
    event.preventDefault();
    lastUserSearch = JSON.parse(localStorage.getItem("lastUserSearch"));
    if (lastUserSearch) {
      console.log("HIIIII");
      document.getElementById("srchState").value = lastUserSearch.state;
      document.getElementById("srchCity").value = lastUserSearch.city;
      document.getElementById("srchProd").value = lastUserSearch.product;
      document.getElementById("srchFrmDt").value = lastUserSearch.fromDate;
      document.getElementById("srchToDt").value = lastUserSearch.toDate;
    }
  } else if (event.target.id=== "catFirm") {
    
    varModal = "recalling_firm";
    getChart(varModal);
  } else if (event.target.id === "catBrnd") {
    varModal = "name_brand";
    getChart(varModal);
  } else if (event.target.id === "catRctn") {
    varModal = "reactions";
    getChart(varModal);
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

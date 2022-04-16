Chart.defaults.global.legend.display = false;

var lastUserSearch = {
  state: "",
  city: "",
  product: "",
  fromDate: "",
  toDate: "",
};

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
          position: "bottom",
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

document.addEventListener("click", function (event) {
  if (event.target.id === "searchModalBtn") {
    lastUserSearch.state = document.getElementById("srchState").value.trim();
    lastUserSearch.city = document.getElementById("srchCity").value.trim();
    lastUserSearch.product = document.getElementById("srchProd").value.trim();
    lastUserSearch.fromDate = document.getElementById("srchFrmDt").value.trim();
    lastUserSearch.toDate = document.getElementById("srchToDt").value.trim();
    localStorage.setItem("lastUserSearch", JSON.stringify(lastUserSearch));
    window.location.replace("index.html");
  }
});

window.onload = getMap();

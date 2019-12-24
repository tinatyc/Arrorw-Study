const hatePage = 'posts?type=hate';
const limit = '';
const dataDate = '';
let dayArray = [];
let updTimesArr = [];

new Vue({
  el: "#replyWhat",
  data: {
    items: [],
    cardClass: "card",
    lastUpdate: "",
  },
  mounted() {
    this.date();
  },
  methods: {
    date() {
      // console.log(hatePosts);
      axios.get(hatePosts).then(res => {
        this.items = res.data;
        getData = res.data;
        // console.log(getData);
        getData.forEach((v, i) => {
          jsonDate = v.date;

          selectDate = jsonDate.replace(/(-)|(T)|(:)|(\.)[0-9]{3}(Z)/g, "");
          outputDate = jsonDate.replace(/T/, " ").replace(/(\.)[0-9]{3}(Z)/g, "");
          // console.log(selectDate);
          // console.log(outputDate);
          this.items[i].date = outputDate;
          // console.log(v.shareCount);
          // console.log(selectDate[0]);

        });
        this.lastUpdate = res.data[0].date;
      });
    }
  },
});

new Vue({
  el: '#chartArea',
  data: {
    dataArr: [],
    newsDate: '',
    dataLen: 0,
    newsCount: 0,
    loading: true,
  },
  mounted() {
    this.apiData();

  },
  methods: {
    apiData() {
      axios.get(`${api}${hatePage}&limit=0`).then(res => {
        getData = res.data;
        this.dataArr = res.data;
        this.dataLen = getData.length;
        dataLength = getData.length;
        // console.log(dataLength);
        // console.log(getData);
        // let dateCount = 0;
        let prevDate = null;
        let dateCount = 0;
        for (let i = 0; i < dataLength; i++) {
          const currDate = getData[i].date.replace(/T.*/, '');
          // console.log(currDate);

          if (i > 0 && currDate !== prevDate) {
            // console.log(prevDate + ' stop');
            this.dataArr[i].newsDate = prevDate;
            dayArray.push(prevDate);
            updTimesArr.push(dateCount);
            // console.log(dateCount);
            this.dataArr[i].newsCount = dateCount;
            dateCount = 0;
          }
          prevDate = currDate;
          dateCount++;
        }
        // dayArray;
        dayArray.reverse().shift();
        updTimesArr.reverse().shift();
        // console.log(updTimesArr);
        // console.log(dayArray.length);
        new Promise(() => {
          chart(updTimesArr, dayArray);
        });
      });


    },
  },
});

function chart(updTimesArr, dayArray) {
  Highcharts.chart('chartContainer', {
    chart: {
      height: 400,
      type: 'line'
    },
    title: {
      text: '每日人工回覆新聞發布次數'
    },

    subtitle: {
      text: 'Source: 一支穿雲箭APP「黑韓退散」專區'
    },
    xAxis: {
      type: 'datetime',
      categories: dayArray
    },
    yAxis: {
      title: {
        text: '次數'
      },
      tickInterval: 5
    },
    tooltip: {
      headerFormat: '日期: {point.x}<br>',
      pointFormat: '含粉這天回覆{point.y}筆新聞',
      shared: true
    },
    plotOptions: {
      series: {
        label: {
          connectorAllowed: false
        },
        // pointStart: "2019-10-07"
      }
    },

    series: [{
      name: '一天的發布量',
      data: updTimesArr,
      // dateNumArr
    }],
    responsive: {
      rules: [{
        condition: {
          maxWidth: 500
        },
        chartOptions: {
          legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom'
          }
        }
      }]
    }
  });
}

// ---- It’s not a bug – it’s an undocumented feature. ----
// this.items[i].voynichScore = v.voynichScore;
// voynichScore = v.voynichScore;
// console.log(voynichScore > 500);
// if (voynichScore > 500) {
//   this.cardClass = "card border-success";
//   console.log(1);
// } else {
//   this.cardClass = "card";
//   console.log(2);
// }
//-----------------

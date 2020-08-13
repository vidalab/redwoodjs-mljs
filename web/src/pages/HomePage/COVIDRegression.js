import React from 'react'
import Vida from 'vidajs'
import { timeFormat, timeParse } from 'd3-time-format'

class COVIDRegression extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      covidData: null
    }
  }

  dlLinearRegression(data) {
    var mapData = data;
    // perform linear regression analysis
    // variable lin contains the model
    var lin = dl.linearRegression(mapData,
      function(d) {
        return d.date;
      },
      function(d) {
        return d.positiveIncrease;
      }
    );
    console.log(lin)
    // use equation to calculate result data points
    // y = slope * x + intercept
    mapData.forEach(function(d) {
      d.predictPositiveIncrease = lin.slope * d.date + lin.intercept;
    })

    return mapData;
  }

  calculateRegression(json) {
    let tf = timeFormat("%s")
    let tp = timeParse("%Y%m%d")
    let x = json.map(d => +tf(tp(d.date)))
    let y = json.map(d => d.positiveIncrease)

    let regression = new ML.SimpleLinearRegression(x, y)
    let predictY = json.map(d => regression.predict(+tf(tp(d.date))))
    json.map((d, i) => {
      d.predictPositiveIncrease = predictY[i]
    })
    console.log(json)
  }

  componentDidMount() {
    fetch('https://covidtracking.com/api/v1/us/daily.json')
      .then(async (response) => {
        let json = await response.json()
        json = json.reverse()
        json = json.filter(d => d.date > 20200301)
        this.calculateRegression(json)
        this.setState({
          covidData: json
        })
      })
  }

  render() {
    let vizJson = {
      "name": "Redwood Viz",
      "description": "Example Viz",
      "columns": 2,
      "rows": 1,
      "data": [
        {
          "name": "covid-data",
          "values": this.state.covidData
        }
      ],
      "charts": [
        {
          "type": "line", "data": "covid-data",
          "title": "US COVID-19 Positive Increase",
          "position": {
            "columns": 2,
            "rows": 1,
            "x": 0,
            "y": 0
          },
          "axes": {
            "x": {
              "label": "date",
              "dataColumn": "date",
              "dataType": "time",
              "dataFormat": "%Y%m%d",
              "displayFormat": "%b %d",
              "timePrecision": "day"
            },
            "y": {
              "label": "count",
              "dataColumns": [
                {"name": "positiveIncrease", "color": "#8884d8"},
                {"name": "predictPositiveIncrease", "color": "#bb84d8"}
              ]
            }
          }
        }
      ]
    }
    return (
      <>
        <div style={{width: "100%", height: "500px"}}>
          {this.state.covidData ? <Vida vizData={vizJson} /> : 'Loading...'}
        </div>
      </>
    )
  }
}

export default COVIDRegression
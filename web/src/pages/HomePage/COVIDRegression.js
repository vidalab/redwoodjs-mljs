import React from 'react'
import Vida from 'vidajs'
import { timeFormat, timeParse } from 'd3-time-format'

class COVIDRegression extends React.Component {
  // initialize state in constructor
  // we'll update this state when we finish loading data
  constructor(props) {
    super(props)
    this.state = {
      covidData: null
    }
  }

  calculateRegression(json) {
    // we'll format time into UNIX timestamp
    let tf = timeFormat("%s")
    // this is the input time format
    let tp = timeParse("%Y%m%d")
    let x = json.map(d => +tf(tp(d.date)))
    let y = json.map(d => d.positiveIncrease)

    let regression = new ML.SimpleLinearRegression(x, y)
    let predictY = json.map(d => regression.predict(+tf(tp(d.date))))
    json.map((d, i) => {
      d.predictPositiveIncrease = predictY[i]
    })
  }

  componentDidMount() {
    // fetch data from the COVID Tracking Project
    fetch('https://api.covidtracking.com/api/v1/us/daily.json')
      .then(async (response) => {
        let json = await response.json()
        json = json.reverse()
        // filter out data prior to March 01, 2020
        // COVID testing did not start before,
        // so the numbers are very low
        json = json.filter(d => d.date > 20200301)
        this.calculateRegression(json)
        this.setState({
          covidData: json
        })
      })
  }

  render() {
    let vizJson = {
      "name": "US COVID-19 Positive Increase with ml.js Linear Regression",
      "description": "Data from @COVIDTracking Project",
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
          "title": "US COVID-19 Positive Increase with ml.js Linear Regression",
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
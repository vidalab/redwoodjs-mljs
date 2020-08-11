import React from 'react'

class COVIDRegression extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      covidData: null
    }
  }

  componentDidMount() {
    fetch('https://covidtracking.com/api/v1/us/daily.json')
      .then(async (response) => {
        let json = await response.json()
        this.setState({
          covidData: json
        })
      })
  }

  render() {
    return (
      <>
        {this.state.covidData ? JSON.stringify(this.state.covidData) : 'Loading...'}
      </>
    )
  }
}

export default COVIDRegression
import React, { Component } from "react";
import "./App.css";

class App extends Component {
  render() {
    return <div className="App">
        <div className="Grid">
          <TestPanel name="Low Power" subName=".getCurrentPosition" description="One time ping to get your geolocation. The results will be displayed below."/>
          <TestPanel name="High Power" subName=".watchPosition" description="Watching for device changes in position, updates accordingly below."/>
        </div>
      </div>
  }
}

class TestPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: 38.9102178,
      longitude: -77.0100024,
      time: 3.15,
      accuracy: 21
    }
  }

  render() {
    const {
      name,
      subName,
      description
    } = this.props

    const {
      latitude,
      longitude,
      time,
      accuracy
    } = this.state

    return (
    <div className="Grid-cell">
      <PanelTitle name={name} subName={subName} description={description}/>
      <PanelData latitude={latitude} longitude={longitude} time={time} accuracy={accuracy}/>
    </div> )
  }
}

function PanelTitle(props) {
  const {
    name,
    subName,
    description
  } = props
  return (
    <div>
      <h2>{name} <span>{subName}</span></h2>
      <h3>{description}</h3>
    </div>
  )
}

function PanelData(props) {
  const {
    latitude,
    longitude,
    time,
    accuracy
  } = props
  return (
    <div className="panelContainer">
      <div className="panelColumn">
        <div className="valuePair">
          <p className="label">Latitude</p>
          <p>{latitude}</p>
        </div>
        <div className="valuePair">
          <p className="label">Time</p>
          <p>{time} <span className="miniText">seconds</span></p>
        </div>
      </div>

      <div className="panelColumn">
        <div className="valuePair">
          <p className="label">Longitude</p>
          <p>{longitude}</p>
        </div>
        <div className="valuePair">
          <p className="label">Accuracy</p>
          <p>{accuracy} <span className="miniText">meters</span></p>
        </div>
      </div>
  </div>
  )
}

export default App;

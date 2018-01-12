import React, { Component } from "react";
import "./App.css";

class App extends Component {
  render() {
    return <div className="App">
        <div className="Grid">
          <TestPanel />
          <TestPanel />
        </div>
      </div>
  }
}

class TestPanel extends Component {
  render() {
    return (
    <div className="Grid-cell">
      <PanelTitle/>
      <PanelData/>
    </div> )
  }
}

class PanelTitle extends Component {
  render() {
    return (
      <div>
        <h2>Low Power <span>.getCurrentPosition</span></h2>
        <h3>One time ping to get your geolocation. The results will be displayed below.</h3>
      </div>
    )
  }
}

class PanelData extends Component {
  render() {
    return (
      <div className="panelContainer">
        <div className="panelColumn">
          <div className="valuePair">
            <p className="label">Latitude</p>
            <p>38.9102177</p>
          </div>
          <div className="valuePair">
            <p className="label">Time</p>
            <p>3.13 <span className="miniText">seconds</span></p>
          </div>
        </div>

        <div className="panelColumn">
          <div className="valuePair">
            <p className="label">Longitude</p>
            <p>-77.0100023</p>
          </div>
          <div className="valuePair">
            <p className="label">Accuracy</p>
            <p>20 <span className="miniText">meters</span></p>
          </div>
        </div>
    </div>
    )
  }
}

export default App;

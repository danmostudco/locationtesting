import React, { Component } from "react";
import "./App.css";

class App extends Component {
  render() {
    return <div className="App">
        <div className="Grid">
          <div className="Grid-cell">
            <h2>
              Low Power <span>.getCurrentPosition</span>
            </h2>
            <h3>
              One time ping to get your geolocation. The results will be
              displayed below.
            </h3>
            <p className="label">Latitude</p>
            <p>38.9102177</p>

            <p className="label">Longitude</p>
            <p>-77.0100023</p>

            <p className="label">Accuracy</p>
            <p>20 meters</p>

            <p className="label">Time</p>
            <p>3.13 seconds</p>
          </div>

          <div className="Grid-cell">
            <h2>Low Power <span>.getCurrentPosition</span></h2>
            <h3>One time ping to get your geolocation. The results will be displayed below.</h3>
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
          </div>
        </div>
      </div>;
  }
}

export default App;

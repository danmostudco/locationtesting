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
  render() {
    const {
      name,
      subName,
      description
    } = this.props
    return (
    <div className="Grid-cell">
      <PanelTitle name={name} subName={subName} description={description}/>
      <PanelData/>
    </div> )
  }
}

function PanelTitle(props) {
  return (
    <div>
      <h2>{props.name} <span>{props.subName}</span></h2>
      <h3>{props.description}</h3>
    </div>
  )
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

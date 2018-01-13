import React, { Component } from "react";
import "./App.css";

const LOW_OPTIONS = {
  enableHighAccuracy: false,
  timeout: 27000,
  maximumAge: 30000    
}

const HIGH_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 27000,
  maximumAge: 30000    
}


class App extends Component {

  getLocation(success, error, options) {
    // const dispatchTime = new Date().getTime(); HOW DO I GET DISPATCH TIME DOWN INTO THE COMPONENT AT TIME OF INSTANTIATION?
    navigator.geolocation.getCurrentPosition(success, error, options)
  }

  watchLocation(success, error, options) {
    // const dispatchTime = new Date().getTime(); HOW DO I GET DISPATCH TIME DOWN INTO THE COMPONENT AT TIME OF INSTANTIATION?
    navigator.geolocation.watchPosition(success, error, options)
  }

  render() {
    return <div className="App">
        <div className="Grid">
          <TestPanel
            name="Low Power"
            subName=".getCurrentPosition"
            description="One time ping to get your geolocation. The results will be displayed below."
            testingFunction={this.getLocation}
            optionsObject= {LOW_OPTIONS}
          />
          <TestPanel 
            name="High Power" 
            subName=".watchPosition" 
            description="Watching for device changes in position, updates accordingly below." 
            testingFunction={this.watchLocation}
            optionsObject= {HIGH_OPTIONS}
          />
        </div>
      </div>
  }
}

class TestPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: 0,
      longitude: 0,
      time: 0,
      accuracy: 0,
      loading: true,
    }
    this.successFunction = this.successFunction.bind(this);
    this.dispatchTimeStamp;
  }

  successFunction(position) {
    const {
      longitude,
      latitude,
      accuracy
    } = position.coords;

    const APItimeStamp = position.timestamp;
    const timeWindowMil = APItimeStamp - this.dispatchTimeStamp;
    const timeWindowSec = (timeWindowMil / 1000).toFixed(2);
    
    this.setState({
      longitude: longitude.toFixed(7),
      latitude: latitude.toFixed(7),
      accuracy: accuracy,
      time: timeWindowSec,
      loading: false,
    })

    console.log(position.coords) // for console sign of success
  }

  componentDidMount() {
    console.log(this.props.optionsObject)
    this.dispatchTimeStamp = new Date().getTime()
    this.props.testingFunction(this.successFunction, ()=>{alert("geolocation did not fire")}, this.props.optionsObject); // still need to add in error function
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

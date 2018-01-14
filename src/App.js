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
            description="One time ping to get your geolocation; only a single success function fires."
            testingFunction={this.getLocation}
            optionsObject= {LOW_OPTIONS}
            cycles={false}
          />
          <TestPanel 
            name="High Power" 
            subName=".watchPosition" 
            description="Watching for device changes in position; fires a success each update." 
            testingFunction={this.watchLocation}
            optionsObject= {HIGH_OPTIONS}
            cycles={true}
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
      cycleCount: 0
    }
    this.successFunction = this.successFunction.bind(this);
    this.getTimeAndGeolocation = this.getTimeAndGeolocation.bind(this);
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

    const updatedCycleCount = this.state.cycleCount + 1;
    
    this.setState({
      longitude: longitude.toFixed(7),
      latitude: latitude.toFixed(7),
      accuracy: accuracy.toFixed(0),
      time: timeWindowSec,
      loading: false,
      cycleCount: updatedCycleCount
    })

    console.log(position.coords) // for console sign of success
  }

  getTimeAndGeolocation() { // wraps getting time stamp, running testingFunction, and success callback
    if(this.state.loading === false) {
      this.setState({
        loading: true
      })
      console.log("loading now")
    }
    this.dispatchTimeStamp = new Date().getTime()
    // TODO: need more elegant error handling here in an error function
    // likely need to update state for error = true / false
    // if true, show some sort of conditional visual flag AND retry
    // in success function, ensure error set to false
    this.props.testingFunction(this.successFunction, ()=>{alert("geolocation did not fire")}, this.props.optionsObject); // still need to add in error function
  }

  componentDidMount() {
    this.getTimeAndGeolocation()
  }

  render() {
    const {
      name,
      subName,
      description,
      cycles
    } = this.props

    const {
      latitude,
      longitude,
      time,
      accuracy,
      loading,
      cycleCount
    } = this.state

    return (
    <div className="Grid-cell">
      <PanelTitle 
        name={name}
        subName={subName}
        description={description}
      />
      <PanelContent
        latitude={latitude}
        longitude={longitude}
        time={time}
        accuracy={accuracy}
        cycles={cycles}
        cycleCount={cycleCount}
        loading={loading}
        name={name}
        getTimeandGeo={this.getTimeAndGeolocation}
      />
    </div> )
  }
}

function PanelTitle(props) {
  const {
    name,
    subName,
    description,
  } = props
  return (
    <div>
      <h2>{name} <span>{subName}</span></h2>
      <h3>{description}</h3>
    </div>
  )
}

function PanelContent(props) {
  const {
    latitude,
    longitude,
    time,
    accuracy,
    cycles,
    cycleCount,
    loading,
    name,
    getTimeandGeo
  } = props
  
  return (
    (loading)
    ? 
    <Loader/>
    :
    <PanelData
      latitude={latitude}
      longitude={longitude}
      time={time}
      accuracy={accuracy}
      cycles={cycles}
      cycleCount={cycleCount}
      name={name}
      getTimeandGeo={getTimeandGeo}
    />
  )
}

function PanelData(props) {
  const {
    latitude,
    longitude,
    time,
    accuracy,
    cycles,
    cycleCount,
    name,
    getTimeandGeo
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
          { (time < 0)
          ? <p><span className="miniText">Loaded from Cache</span></p>
          : <p>{time} <span className="miniText">seconds</span></p>
          }
        </div>
        {
        (cycles) 
        ? (<div className="valuePair">
          <p className="label">Cycles</p>
          <p>{cycleCount} <span className="miniText">times</span></p>
        </div>)
        : null
        }
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
      <ReloadButton
        name={name}
        getTimeandGeo={getTimeandGeo}
      />
    </div>
  )
}

function ReloadButton(props) {
  const {
    name,
    getTimeandGeo
  } = props
  return (
    <div className="panelColumnFull">
      <div className="buttonHolder">
        <button 
          type="button"
          onClick={()=> getTimeandGeo()}
          >
          Rerun {name
        }</button>
      </div>
    </div>
  )
}

function Loader() {
  return (
  <div className="panelContainer">
    <div className="spinner">
      <div className="rect1"></div>
      <div className="rect2"></div>
      <div className="rect3"></div>
      <div className="rect4"></div>
      <div className="rect5"></div>
    </div>
  </div>
  )
}

export default App;

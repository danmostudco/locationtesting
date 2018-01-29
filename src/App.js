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
  constructor(props) {
    super(props);
    this.state = {
      lowLat: null,
      lowLong: null,
      lowTime: null,
      lowAccuracy: null,
      highLat: null,
      highLong: null,
      highTime: null,
      highAccuracy: null,
      highCycles: null,
      submitStatus: false,
      currentAddress: null,
      howClose: null,
      finalThoughts: null
    }
    this.updateLowVars = this.updateLowVars.bind(this);
    this.updateHighVars = this.updateHighVars.bind(this);
    this.sendVarsToSheets = this.sendVarsToSheets.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
  }

  getLocation(success, error, options) {
    // const dispatchTime = new Date().getTime(); HOW DO I GET DISPATCH TIME DOWN INTO THE COMPONENT AT TIME OF INSTANTIATION?
    navigator.geolocation.getCurrentPosition(success, error, options)
  }

  watchLocation(success, error, options) {
    // const dispatchTime = new Date().getTime(); HOW DO I GET DISPATCH TIME DOWN INTO THE COMPONENT AT TIME OF INSTANTIATION?
    navigator.geolocation.watchPosition(success, error, options)
  }

  updateLowVars(lat, long, time, accuracy) {
    this.setState({
      lowLat: lat,
      lowLong: long,
      lowTime: time,
      lowAccuracy: accuracy,
      submitStatus: true
    })
  }

  updateHighVars(lat, long, time, accuracy, cycles) {
    this.setState({
      highLat: lat,
      highLong: long,
      highTime: time,
      highAccuracy: accuracy,
      highCycles: cycles,
      submitStatus: true
    })
  }

  handleFormChange(keyName, event) {
    this.setState({[keyName]: event.target.value});
  }

  sendVarsToSheets() {
    console.log("attempting to send")
    var url = new URL('https://script.google.com/a/livesafemobile.com/macros/s/AKfycbxQ83aev7rxDFRCnELQJ-dlfZazPbF-8hTIN5a7-35lwbeXCkE/exec')
    Object.keys(this.state).forEach(key => url.searchParams.append(key, this.state[key]))
    fetch(url)
      .then(()=>{
        console.log("sending success")
        this.setState({submitAvailable: false})
      })
      .catch(function(err){
        console.log(err + " oopsie something went wrong");
      })
  }

  render() {
    return <div className="App">
        <div className="titleContainer">
          <h1 className="title">Location Checker</h1>
        </div>
        <div className="Grid">
          <TestPanel
            name="Low Power"
            subName=".getCurrentPosition"
            description="One time ping to get your geolocation; only a single success function fires."
            testingFunction={this.getLocation}
            passBackFunction={this.updateLowVars}
            optionsObject= {LOW_OPTIONS}
            cycles={false}
          />
          <TestPanel 
            name="High Power" 
            subName=".watchPosition" 
            description="Watching for device changes in position; fires a success each update." 
            testingFunction={this.watchLocation}
            passBackFunction={this.updateHighVars}
            optionsObject= {HIGH_OPTIONS}
            cycles={true}
          />
          <SubmitPanel
            handleChange={this.handleFormChange}
            currentAddress={this.state.currentAddress}
            howClose={this.state.howClose}
            finalThoughts={this.state.finalThoughts}
            submitFunction={this.sendVarsToSheets}
            submitStatus={this.submitStatus}
          />
        </div>
        {/* <div className="Grid">
          <SubmitButton
            submitFunction={this.sendVarsToSheets}
            submitAvailable={this.state.submitAvailable}
          />
        </div> */}
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
      cycleCount: 0,
      error: false
    }
    this.successFunction = this.successFunction.bind(this);
    this.errorFunction = this.errorFunction.bind(this);
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
      cycleCount: updatedCycleCount,
      error: false
    })

    this.props.passBackFunction(latitude, longitude, timeWindowSec, accuracy, updatedCycleCount)
    console.log(position.coords) // for console sign of success
  }

  errorFunction() {
    this.setState({
      loading: false,
      error: true
    })
    console.log("Error in getting geolocation")
  }

  getTimeAndGeolocation() { // wraps getting time stamp, running testingFunction, and success callback
    if(this.state.loading === false) {
      this.setState({
        loading: true,
        error: false
      })
    }
    this.dispatchTimeStamp = new Date().getTime()
    this.props.testingFunction(this.successFunction, this.errorFunction, this.props.optionsObject);
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
      cycleCount,
      error
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
        error={error}
      />
    </div> )
  }
}

class SubmitPanel extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const {
      handleChange,
      currentAddress,
      howClose,
      finalThoughts,
      submitFunction,
      submitStatus
    } = this.props;

    return (
    <div className="Grid-cell">
      <div>
        <h2>Final Assessment</h2>
        <h3>We need a few final pieces of information for testing purposes.</h3>
      </div>
      <div className="panelContainer">
        <form>
            <div className="valuePair">
              <label className="label fullLabel">Current Address</label>
              <textarea 
                className="fullInput"
                type="text"
                placeholder="Ex) 1400 Key Blvd, Arlington VA 20009"
                onChange={(event) => {handleChange("currentAddress", event)}}
                value={currentAddress}/>
            </div>

            <div className="valuePair">
            <label className="label">How Accurate is the Location?</label>
              <div>
                <input 
                  className="radioInput"
                  type="radio"
                  id="contactChoice1"
                  name="contact"
                  value="Right On"
                  checked={howClose === "Right On"}
                  onChange={(event) => {handleChange("howClose", event)}}
                />
                <label className="radioLabel">Right On</label>
                
                <input
                  className="radioInput"
                  type="radio"
                  id="contactChoice2"
                  name="contact"
                  value="So-So"
                  checked={howClose === "So-So"}
                  onChange={(event) => {handleChange("howClose", event)}}
                />
                <label className="radioLabel">So-So</label>
                
                <input
                  className="radioInput"
                  type="radio"
                  id="contactChoice3"
                  name="contact"
                  value="Way Off"
                  checked={howClose === "Way Off"}
                  onChange={(event) => {handleChange("howClose", event)}}
                />
                <label className="radioLabel">Way Off</label>
              </div>
            </div>

            <div className="valuePair">
              <label className="label fullLabel">Final Thoughts?</label>
              <textarea
                className="fullInput"
                type="text"
                placeholder="Ex) Just turned on my phone"
                onChange={(event) => {handleChange("finalThoughts", event)}}
                value={finalThoughts}
              />
            </div>
        </form>
        <SubmitButton 
          submitFunction={submitFunction}
          submitStatus={submitStatus}
        />
      </div>
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
    getTimeandGeo,
    error
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
      error={error}
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
    getTimeandGeo,
    error
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
        error={error}
      />
    </div>
  )
}

function ReloadButton(props) {
  const {
    name,
    getTimeandGeo,
    error
  } = props

  return (
    <div className="panelColumnFull">
      <div className="buttonHolder">
      {
      (error)
      ?  <button className="error"
          type="button"
          onClick={()=> getTimeandGeo()}
          >
          Error Rerun
        </button>
      : <button className="normal"
          type="button"
          onClick={()=> getTimeandGeo()}
          >
          Rerun {name}
        </button>
      }
      </div>
    </div>
  )
}

function SubmitButton(props) {
  // TODO: need to create multiple statuses for button
  const {
    submitFunction,
    submitStatus
  } = props

  return(
    <div className="panelColumnFull">
      <div className="buttonHolder">
        <button 
          className="normal"
          onClick={()=>{submitFunction()}}
        >
        Submit results
        </button>
      </div>
    </div>
  )
}

// function SubmitButton(props) {
//   const {
//     submitFunction,
//     submitAvailable
//   } = props

//   return (
//     (submitAvailable)
//     ? 
//     <div className="submitContainer">
//       <div className="submitRow">
//         <button className="ready submitButton"
//         type="button"
//         onClick={() => submitFunction()}
//         >
//         </button>
//       </div>
//       <div className="submitRow">
//         <p className="submitLabel">Submit Results</p>
//       </div>
//     </div>
//     :
//     <div className="submitContainer">
//       <div className="submitRow">
//         <button className="notReady submitButton"
//         type="button"
//         >
//         </button>
//       </div>
//       <div className="submitRow">
//         <p className="submitLabelDisabled">Can't Submit</p>
//       </div>
//     </div>
//   )
// }

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

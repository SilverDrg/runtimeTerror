import React from "react"
import { MapContainer, TileLayer } from 'react-leaflet'
import { MarkerTrafficSign } from '../../components'

const center = [46.5575, 15.645556]

/* <CircleMarker center={center} pathOptions={fillBlueOptions} radius={10}>
            <Popup><img src={stopsign} alt="Stop sign" style={{height: "48px", width: "48px"}}></img></Popup>
          </CircleMarker>
          <CircleMarker center={sign90location} pathOptions={fillBlueOptions} radius={10}>
            <Popup><img src={sign90} alt="Stop sign" style={{height: "48px", width: "48px"}}></img></Popup>
          </CircleMarker> */

class Map extends React.Component { 
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      trafficsigns: [],
    };
  }
  async componentDidMount() {
    const data = await fetch('http://localhost:3001/trafficsign').then((response) => response.json()).then((data) => {
      let tmpArray = []
      for (var i = 0; i < data.length; i++) {
        tmpArray.push(data[i])
      };
      this.setState({ trafficsigns: tmpArray, loading: false });
      console.log("tmp array: " + tmpArray);
    })
  }
  /*
  getMarkerTrafficSigns() {
    const getTrafficSigns = async function() {
      const res = await fetch('http://localhost:3001/trafficsign');
      const data = await res.json();
      //console.log("TrafficSigns from api: \n" + data);
      this.setState({trafficsigns: data})
    };

    getTrafficSigns();
  }
  */
  render() {
    console.log(this.state.trafficsigns);

    return (
      <div>
        <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/leaflet.css'></link>
        <MapContainer style={{ height: "720px" }}  center={center} zoom={15} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          { 
            this.state.trafficsigns.map((trafficSign) => (
            <MarkerTrafficSign key={trafficSign._id} trafficSign={trafficSign}/>))
          }
        </MapContainer>
      </div>
    ) 
  }
}

export default Map;